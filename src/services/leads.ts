import { getSessionId } from './analytics'

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

export function submitLead(leadData: LeadData): LeadRecord {
  const record: LeadRecord = {
    leadId: generateLeadId(),
    sessionId: getSessionId(),
    createdAt: new Date().toISOString(),
    source: getUtmSource(),
    ...leadData,
  }

  const leads = getLeads()
  leads.push(record)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))

  console.log('[Kotel Lead]', record)

  return record
}

export function clearLeads(): void {
  localStorage.removeItem(LEADS_KEY)
}

/**
 * TODO: отправка заявки в личные сообщения ВК.
 * Для отправки заявок в личные сообщения ВК нужен backend/serverless function,
 * где безопасно хранится VK group token.
 */
export async function sendLeadToVk(_leadData: LeadRecord): Promise<void> {
  // TODO: реализовать через backend API
  throw new Error(
    'sendLeadToVk: для отправки заявок в личные сообщения ВК нужен backend/serverless function, где безопасно хранится VK group token.'
  )
}
