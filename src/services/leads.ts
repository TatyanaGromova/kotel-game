import { getSessionId } from './analytics'
import { queuePendingLead, sendLeadPayload } from './googleScript'

const LEADS_KEY = 'leads'

export interface LeadData {
  name: string
  phone: string
  settlement: string
  interest: string
  comment: string
  completedLevels: number[]
  bonusAmount: number
  promoCode: string
  promoExpiresAt: string
}

export interface LeadRecord extends LeadData {
  leadId: string
  sessionId: string
  createdAt: string
  source: string | null
}

export interface SubmitLeadResult {
  record: LeadRecord
  sent: boolean
}

function getUtmSource(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get('utm_source') ?? params.get('source') ?? null
}

function generateLeadId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `lead-${Date.now()}`
}

export function getLeads(): LeadRecord[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY)
    return raw ? (JSON.parse(raw) as LeadRecord[]) : []
  } catch {
    return []
  }
}

function saveLeadLocally(record: LeadRecord): void {
  const leads = getLeads()
  if (leads.some((item) => item.leadId === record.leadId)) return
  leads.push(record)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export function persistLead(record: LeadRecord): void {
  saveLeadLocally(record)
}

export async function submitLead(leadData: LeadData): Promise<SubmitLeadResult> {
  const record: LeadRecord = {
    leadId: generateLeadId(),
    sessionId: getSessionId(),
    createdAt: new Date().toISOString(),
    source: getUtmSource(),
    ...leadData,
  }

  const sent = await sendLeadPayload(record)

  if (sent) {
    saveLeadLocally(record)
    console.log('[Kotel Lead] sent', record)
  } else {
    queuePendingLead(record)
    console.warn('[Kotel Lead] queued for retry', record)
  }

  return { record, sent }
}

export function clearLeads(): void {
  localStorage.removeItem(LEADS_KEY)
}

/**
 * Отправка заявки во ВК выполняется на стороне Google Apps Script.
 * Для отправки заявок в личные сообщения ВК нужен backend/serverless function
 * (или Apps Script), где безопасно хранится VK group token.
 */
export async function sendLeadToVk(_leadData: LeadRecord): Promise<void> {
  throw new Error(
    'sendLeadToVk: отправка во ВК выполняется через Google Apps Script, VK token не хранится во frontend.'
  )
}
