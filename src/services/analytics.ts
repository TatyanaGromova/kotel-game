const SESSION_KEY = 'kotel-session-id'
const EVENTS_KEY = 'analyticsEvents'

export type AnalyticsEventName =
  | 'game_opened'
  | 'game_started'
  | 'level_started'
  | 'level_completed'
  | 'bonus_claim_clicked'
  | 'lead_form_opened'
  | 'lead_form_submitted'
  | 'game_finished'

export interface AnalyticsEvent {
  sessionId: string
  eventName: AnalyticsEventName
  timestamp: string
  currentLevel: number | null
  completedLevels: number[]
  currentBonus: number
  promoCode: string | null
  source: string | null
  userAgent: string
}

export interface TrackEventPayload {
  currentLevel?: number | null
  completedLevels?: number[]
  currentBonus?: number
  promoCode?: string | null
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function createSessionId(): string {
  const id = generateId()
  localStorage.setItem(SESSION_KEY, id)
  return id
}

export function getSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing
  return createSessionId()
}

function getUtmSource(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return (
    params.get('utm_source') ??
    params.get('source') ??
    params.get('utm_campaign') ??
    null
  )
}

export function trackEvent(eventName: AnalyticsEventName, payload: TrackEventPayload = {}): void {
  const event: AnalyticsEvent = {
    sessionId: getSessionId(),
    eventName,
    timestamp: new Date().toISOString(),
    currentLevel: payload.currentLevel ?? null,
    completedLevels: payload.completedLevels ?? [],
    currentBonus: payload.currentBonus ?? 0,
    promoCode: payload.promoCode ?? null,
    source: getUtmSource(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  }

  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : []
    events.push(event)
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  } catch {
    localStorage.setItem(EVENTS_KEY, JSON.stringify([event]))
  }
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : []
  } catch {
    return []
  }
}

export function clearAnalyticsEvents(): void {
  localStorage.removeItem(EVENTS_KEY)
}
