import type { AnalyticsEvent, AnalyticsEventName } from './analytics'
import { persistLead, type LeadRecord } from './leads'

export const GOOGLE_SCRIPT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwymaZTHUjLnHRVmCM4AXFBzd60sO53oxye53II7OwOOUmQIDhxxTZi_LFAnPa44SgqHg/exec'

const PENDING_EVENTS_KEY = 'pendingEvents'
const PENDING_LEADS_KEY = 'pendingLeads'

export interface GameEventPayload {
  type: 'event'
  eventName: AnalyticsEventName
  sessionId: string
  timestamp: string
  currentLevel: number | null
  completedLevels: number[]
  currentBonus: number
  promoCode: string | null
  source: string | null
  userAgent: string
}

export interface LeadPayload {
  type: 'lead'
  leadId: string
  sessionId: string
  createdAt: string
  name: string
  phone: string
  settlement: string
  interest: string
  comment: string
  completedLevels: number[]
  bonusAmount: number
  promoCode: string
  promoExpiresAt: string
  source: string | null
  userAgent: string
}

function readJson<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function writeJson<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items))
}

export function eventToPayload(event: AnalyticsEvent): GameEventPayload {
  return {
    type: 'event',
    eventName: event.eventName,
    sessionId: event.sessionId,
    timestamp: event.timestamp,
    currentLevel: event.currentLevel,
    completedLevels: event.completedLevels,
    currentBonus: event.currentBonus,
    promoCode: event.promoCode,
    source: event.source,
    userAgent: event.userAgent,
  }
}

export function leadToPayload(lead: LeadRecord): LeadPayload {
  return {
    type: 'lead',
    leadId: lead.leadId,
    sessionId: lead.sessionId,
    createdAt: lead.createdAt,
    name: lead.name,
    phone: lead.phone,
    settlement: lead.settlement,
    interest: lead.interest,
    comment: lead.comment,
    completedLevels: lead.completedLevels,
    bonusAmount: lead.bonusAmount,
    promoCode: lead.promoCode,
    promoExpiresAt: lead.promoExpiresAt,
    source: lead.source,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  }
}

async function postToGoogleScript(payload: GameEventPayload | LeadPayload): Promise<boolean> {
  try {
    const response = await fetch(GOOGLE_SCRIPT_ENDPOINT, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) return false

    const text = await response.text()
    if (!text) return true

    try {
      const data = JSON.parse(text) as { ok?: boolean; success?: boolean; error?: string }
      if (data.ok === false || data.success === false) return false
    } catch {
      // Apps Script может вернуть не-JSON — считаем успехом при HTTP 200
    }

    return true
  } catch {
    return false
  }
}

export function queuePendingEvent(event: AnalyticsEvent): void {
  const pending = readJson<AnalyticsEvent>(PENDING_EVENTS_KEY)
  pending.push(event)
  writeJson(PENDING_EVENTS_KEY, pending)
}

export function queuePendingLead(lead: LeadRecord): void {
  const pending = readJson<LeadRecord>(PENDING_LEADS_KEY)
  const exists = pending.some((item) => item.leadId === lead.leadId)
  if (!exists) {
    pending.push(lead)
    writeJson(PENDING_LEADS_KEY, pending)
  }
}

export function getPendingEvents(): AnalyticsEvent[] {
  return readJson<AnalyticsEvent>(PENDING_EVENTS_KEY)
}

export function getPendingLeads(): LeadRecord[] {
  return readJson<LeadRecord>(PENDING_LEADS_KEY)
}

export async function sendGameEvent(event: AnalyticsEvent): Promise<boolean> {
  return postToGoogleScript(eventToPayload(event))
}

export async function sendLeadPayload(lead: LeadRecord): Promise<boolean> {
  return postToGoogleScript(leadToPayload(lead))
}

export async function flushPendingQueue(): Promise<void> {
  const pendingEvents = getPendingEvents()
  const remainingEvents: AnalyticsEvent[] = []

  for (const event of pendingEvents) {
    const sent = await sendGameEvent(event)
    if (!sent) remainingEvents.push(event)
  }
  writeJson(PENDING_EVENTS_KEY, remainingEvents)

  const pendingLeads = getPendingLeads()
  const remainingLeads: LeadRecord[] = []

  for (const lead of pendingLeads) {
    const sent = await sendLeadPayload(lead)
    if (sent) {
      persistLead(lead)
    } else {
      remainingLeads.push(lead)
    }
  }
  writeJson(PENDING_LEADS_KEY, remainingLeads)
}
