import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Thermometer, Gauge, Flame, Clock } from 'lucide-react'
import { WINTER_ACTIONS, WINTER_GOAL_HEAT, WINTER_GOAL_GOOD_ACTIONS } from '../data/questions'
import { HEAT_CORRECT, HEAT_WRONG } from '../data/rewards'
import { FrostEffect } from '../components/Effects/FrostEffect'
import { SteamEffect } from '../components/Effects/SteamEffect'
import { ProgressBar } from '../components/ProgressBar'

interface Props {
  onComplete: () => void
  onBack: () => void
  onHeat: (delta: number) => void
}

export function LevelFiveWinterMode({ onComplete, onBack, onHeat }: Props) {
  const [homeHeat, setHomeHeat] = useState(45)
  const [temp, setTemp] = useState(18)
  const [pressure, setPressure] = useState(1.2)
  const [goodCount, setGoodCount] = useState(0)
  const [usedActions, setUsedActions] = useState<Set<string>>(new Set())
  const [feedback, setFeedback] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [warmHouse, setWarmHouse] = useState(false)

  useEffect(() => {
    if (finished) return
    const id = setInterval(() => {
      setTemp((t) => Math.max(8, t - 0.15))
    }, 2000)
    return () => clearInterval(id)
  }, [finished])

  const frostIntensity = Math.min(1, (22 - temp) / 14)

  const doAction = (actionId: string) => {
    if (finished || usedActions.has(actionId)) return
    const action = WINTER_ACTIONS.find((a) => a.id === actionId)
    if (!action) return

    setUsedActions((u) => new Set(u).add(actionId))
    setFeedback(action.comment)

    if (action.type === 'good') {
      onHeat(HEAT_CORRECT)
      setHomeHeat((h) => Math.min(100, h + action.heatDelta))
      setTemp((t) => Math.min(22, t + 1.2))
      setPressure((p) => Math.min(1.6, p + 0.05))
      setGoodCount((c) => c + 1)
    } else {
      onHeat(HEAT_WRONG)
      setHomeHeat((h) => Math.max(0, h + action.heatDelta))
      setTemp((t) => Math.max(8, t - 2))
      setPressure((p) => Math.max(0.8, p - 0.1))
    }
  }

  useEffect(() => {
    if (goodCount >= WINTER_GOAL_GOOD_ACTIONS && homeHeat >= WINTER_GOAL_HEAT) {
      setFinished(true)
      setWarmHouse(true)
    }
  }, [goodCount, homeHeat])

  const availableGood = WINTER_ACTIONS.filter((a) => a.type === 'good' && !usedActions.has(a.id))
  const availableBad = WINTER_ACTIONS.filter((a) => a.type === 'bad' && !usedActions.has(a.id))

  return (
    <div className={frostIntensity > 0.3 ? 'transition-colors duration-500' : ''}>
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-warm-400">
        <ArrowLeft className="h-4 w-4" /> К уровням
      </button>

      <h2 className="text-xl font-bold">Зимний режим</h2>
      <p className="mb-2 text-sm text-gray-400">
        Миссия почти выполнена. Подготовьте дом к морозам ({goodCount}/{WINTER_GOAL_GOOD_ACTIONS} действий).
      </p>

      <div className="relative overflow-hidden rounded-xl border border-graphite-700">
        <FrostEffect intensity={frostIntensity} />
        {warmHouse && <SteamEffect />}

        {/* Дом */}
        <div className="relative flex justify-center bg-gradient-to-b from-graphite-800 to-graphite-900 py-8">
          <div className="relative">
            <div className="h-24 w-32 border-2 border-graphite-600 bg-graphite-800 sm:h-28 sm:w-40">
              <div className="flex justify-around gap-2 p-4 pt-6">
                {[0, 1, 2, 3].map((w) => (
                  <div
                    key={w}
                    className={`h-8 w-6 rounded-sm border border-graphite-600 ${
                      warmHouse ? 'window-lit' : 'bg-graphite-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -top-6 left-1/2 h-8 w-16 -translate-x-1/2 border-l-2 border-r-2 border-t-2 border-graphite-600" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-graphite-700 p-3 text-xs sm:grid-cols-4 sm:text-sm">
          <Stat icon={Thermometer} label="Температура" value={`${temp.toFixed(1)}°C`} cold={temp < 14} />
          <Stat icon={Gauge} label="Давление" value={`${pressure.toFixed(1)} bar`} />
          <Stat icon={Flame} label="Котёл" value={finished ? 'Готов' : goodCount > 2 ? 'Стабильно' : 'Проверка'} />
          <Stat icon={Clock} label="До морозов" value="3 дня" />
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={homeHeat} label="Тепло дома" variant="heat" />
      </div>

      {!finished && (
        <div className="mt-4 flex flex-col gap-2">
          {[...availableGood, ...availableBad].slice(0, 6).map((a) => (
            <button key={a.id} type="button" onClick={() => doAction(a.id)} className="option-btn text-sm">
              {a.label}
            </button>
          ))}
        </div>
      )}

      {feedback && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 rounded-lg bg-graphite-800 p-3 text-sm text-gray-300"
        >
          {feedback}
        </motion.p>
      )}

      {finished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
          <p className="text-lg font-bold text-warm-400">Дом готов к зиме</p>
          <button type="button" onClick={onComplete} className="btn-primary mt-4 w-full">
            Завершить миссию
          </button>
        </motion.div>
      )}
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  cold,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  cold?: boolean
}) {
  return (
    <div className={`flex items-center gap-2 rounded-lg bg-graphite-800/80 p-2 ${cold ? 'text-frost-300' : ''}`}>
      <Icon className="h-4 w-4 shrink-0 text-warm-500/80" />
      <div>
        <p className="text-[10px] text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}
