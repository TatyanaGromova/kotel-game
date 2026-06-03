import { useCallback, useEffect, useState } from 'react'
import { calcWinterBonus, getPromoCode } from '../data/rewards'

const STORAGE_KEY = 'kotel-warm-winter-v1'

export type GameScreen =
  | 'start'
  | 'levels'
  | 'level'
  | 'reward'
  | 'final'
  | 'form'

export interface GameState {
  screen: GameScreen
  completedLevels: number[]
  heatScore: number
  winterBonus: number
  promoCode: string
  currentLevel: number | null
  lastRewardLevel: number | null
  readiness: number
}

const defaultState: GameState = {
  screen: 'start',
  completedLevels: [],
  heatScore: 0,
  winterBonus: 0,
  promoCode: 'ТЕПЛО0',
  currentLevel: null,
  lastRewardLevel: null,
  readiness: 0,
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState }
    const parsed = JSON.parse(raw) as Partial<GameState>
    const completed = parsed.completedLevels ?? []
    const bonus = calcWinterBonus(completed)
    return {
      ...defaultState,
      ...parsed,
      winterBonus: bonus,
      promoCode: getPromoCode(bonus),
      readiness: Math.min(100, 40 + completed.length * 10 + (parsed.heatScore ?? 0) / 15),
    }
  } catch {
    return { ...defaultState }
  }
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useGameStorage() {
  const [state, setState] = useState<GameState>(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const update = useCallback((patch: Partial<GameState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch }
      if (patch.completedLevels !== undefined) {
        next.winterBonus = calcWinterBonus(next.completedLevels)
        next.promoCode = getPromoCode(next.winterBonus)
        next.readiness = Math.min(
          100,
          Math.round(40 + next.completedLevels.length * 10 + next.heatScore / 15)
        )
      }
      if (patch.heatScore !== undefined && patch.completedLevels === undefined) {
        next.readiness = Math.min(
          100,
          Math.round(40 + next.completedLevels.length * 10 + next.heatScore / 15)
        )
      }
      return next
    })
  }, [])

  const addHeat = useCallback((delta: number) => {
    setState((prev) => {
      const heatScore = Math.max(0, prev.heatScore + delta)
      const next = {
        ...prev,
        heatScore,
        readiness: Math.min(
          100,
          Math.round(40 + prev.completedLevels.length * 10 + heatScore / 15)
        ),
      }
      return next
    })
  }, [])

  const completeLevel = useCallback((levelId: number) => {
    setState((prev) => {
      if (prev.completedLevels.includes(levelId)) return prev
      const completedLevels = [...prev.completedLevels, levelId].sort((a, b) => a - b)
      const winterBonus = calcWinterBonus(completedLevels)
      const heatScore = prev.heatScore + 20
      return {
        ...prev,
        completedLevels,
        winterBonus,
        promoCode: getPromoCode(winterBonus),
        heatScore,
        lastRewardLevel: levelId,
        screen: 'reward' as GameScreen,
        currentLevel: null,
        readiness: Math.min(100, Math.round(40 + completedLevels.length * 10 + heatScore / 15)),
      }
    })
  }, [])

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({ ...defaultState })
  }, [])

  return { state, update, addHeat, completeLevel, resetProgress }
}
