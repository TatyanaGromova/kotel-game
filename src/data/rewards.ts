export const MAX_WINTER_BONUS = 2000

export const LEVEL_REWARDS: Record<number, number> = {
  1: 300,
  2: 300,
  3: 300,
  4: 500,
  5: 600,
}

export const HEAT_CORRECT = 10
export const HEAT_WRONG = -5
export const HEAT_LEVEL_COMPLETE = 20

export function getPromoCode(bonus: number): string {
  const capped = Math.min(bonus, MAX_WINTER_BONUS)
  if (capped >= 2000) return 'ТЕПЛО2000'
  if (capped >= 1400) return 'ТЕПЛО1400'
  if (capped >= 900) return 'ТЕПЛО900'
  if (capped >= 600) return 'ТЕПЛО600'
  if (capped >= 300) return 'ТЕПЛО300'
  return 'ТЕПЛО0'
}

export function calcWinterBonus(completedLevels: number[]): number {
  return Math.min(
    completedLevels.reduce((sum, id) => sum + (LEVEL_REWARDS[id] ?? 0), 0),
    MAX_WINTER_BONUS
  )
}

export const BONUS_DISCLAIMER =
  'Зимний бонус действует только на покупку котла, монтаж котла и монтаж системы отопления. Не суммируется с другими акциями и не распространяется на диагностику, ремонт, обслуживание, выезд мастера, запчасти и расходные материалы.'
