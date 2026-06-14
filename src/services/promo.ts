const PROMO_STORAGE_KEY = 'kotel-promo-claim-v1'
const PROMO_VALID_DAYS = 10

export interface PromoClaim {
  promoCode: string
  bonusAmount: number
  claimDate: string
  expiresAt: string
}

function randomSuffix(length = 4): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function generatePromoCode(bonus: number): string {
  return `KOTEL-${bonus}-${randomSuffix()}`
}

export function getPromoExpirationDate(claimDate: Date): Date {
  const expires = new Date(claimDate)
  expires.setDate(expires.getDate() + PROMO_VALID_DAYS)
  return expires
}

export function isPromoExpired(expiresAt: string | Date): boolean {
  const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  return Date.now() > expiry.getTime()
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

export function getPromoClaim(): PromoClaim | null {
  try {
    const raw = localStorage.getItem(PROMO_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PromoClaim
  } catch {
    return null
  }
}

export function savePromoClaim(claim: PromoClaim): void {
  localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(claim))
}

export function claimPromo(bonusAmount: number): PromoClaim {
  const claimDate = new Date()
  const expiresAt = getPromoExpirationDate(claimDate)
  const claim: PromoClaim = {
    promoCode: generatePromoCode(bonusAmount),
    bonusAmount,
    claimDate: claimDate.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }
  savePromoClaim(claim)
  return claim
}

/** Создаёт новый промокод, если бонус вырос или старый истёк. Иначе возвращает текущий. */
export function ensurePromoClaim(bonusAmount: number): PromoClaim {
  const existing = getPromoClaim()

  if (
    existing &&
    !isPromoExpired(existing.expiresAt) &&
    existing.bonusAmount >= bonusAmount
  ) {
    return existing
  }

  return claimPromo(bonusAmount)
}

export function clearPromoClaim(): void {
  localStorage.removeItem(PROMO_STORAGE_KEY)
}

export function getActivePromoCode(): string | null {
  const claim = getPromoClaim()
  if (!claim || isPromoExpired(claim.expiresAt)) return null
  return claim.promoCode
}
