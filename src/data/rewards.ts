export const MAX_WINTER_BONUS = 2000

export const LEVEL_REWARDS: Record<number, number> = {
  1: 300,
  2: 300,
  3: 300,
  4: 500,
  5: 600,
}

/** Накопленный бонус по количеству пройденных уровней: 300 / 600 / 900 / 1400 / 2000 */
export const BONUS_BY_LEVEL_COUNT: Record<number, number> = {
  1: 300,
  2: 600,
  3: 900,
  4: 1400,
  5: 2000,
}

export const HEAT_CORRECT = 10
export const HEAT_WRONG = -5
export const HEAT_LEVEL_COMPLETE = 20

export function calcWinterBonus(completedLevels: number[]): number {
  return Math.min(
    completedLevels.reduce((sum, id) => sum + (LEVEL_REWARDS[id] ?? 0), 0),
    MAX_WINTER_BONUS
  )
}

export const BONUS_DISCLAIMER =
  'Зимний бонус действует только на покупку котла, монтаж котла и монтаж системы отопления. Не суммируется с другими акциями и не распространяется на диагностику, ремонт, обслуживание, выезд мастера, запчасти и расходные материалы.'
