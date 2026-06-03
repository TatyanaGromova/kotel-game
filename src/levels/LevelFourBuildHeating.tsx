import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import {
  HEATING_SEQUENCE,
  HEATING_ELEMENTS,
  HEATING_HINTS,
} from '../data/questions'
import { HEAT_CORRECT, HEAT_WRONG } from '../data/rewards'
import { ExplosionEffect } from '../components/Effects/ExplosionEffect'
import { SteamEffect } from '../components/Effects/SteamEffect'
import { ProgressBar } from '../components/ProgressBar'

interface Props {
  onComplete: () => void
  onBack: () => void
  onHeat: (delta: number) => void
}

export function LevelFourBuildHeating({ onComplete, onBack, onHeat }: Props) {
  const [built, setBuilt] = useState<string[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [explosion, setExplosion] = useState(false)
  const [finished, setFinished] = useState(false)

  const nextExpected = HEATING_SEQUENCE[built.length]

  const pick = (el: string) => {
    if (finished) return
    if (el === nextExpected) {
      onHeat(HEAT_CORRECT)
      const next = [...built, el]
      setBuilt(next)
      setFeedback(null)
      if (next.length >= HEATING_SEQUENCE.length) {
        setFinished(true)
      }
    } else {
      onHeat(HEAT_WRONG)
      const hint = HEATING_HINTS[el] ?? `Сейчас нужен элемент: «${nextExpected}».`
      setFeedback(hint)
      setExplosion(true)
      setTimeout(() => setExplosion(false), 700)
    }
  }

  const progress = (built.length / HEATING_SEQUENCE.length) * 100

  return (
    <div>
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-warm-400">
        <ArrowLeft className="h-4 w-4" /> К уровням
      </button>

      <h2 className="text-xl font-bold">Собери отопление</h2>
      <p className="mb-2 text-sm text-gray-400">
        Выберите элементы в правильной последовательности ({built.length + 1} из {HEATING_SEQUENCE.length})
      </p>

      <ProgressBar value={progress} label="Сборка системы" variant="heat" />

      <div className="relative mt-4 overflow-hidden rounded-xl border border-graphite-700 bg-graphite-900/60 p-4">
        <ExplosionEffect active={explosion} />
        {finished && <SteamEffect />}

        {/* Схема */}
        <div className="flex min-h-[120px] flex-wrap items-center justify-center gap-2">
          {HEATING_SEQUENCE.map((el, i) => {
            const done = built.includes(el)
            return (
              <div key={el} className="flex items-center gap-1">
                <motion.div
                  animate={done ? { boxShadow: '0 0 20px rgba(234,88,12,0.4)' } : {}}
                  className={`rounded-lg border px-2 py-1 text-xs sm:text-sm ${
                    done
                      ? 'border-warm-500 bg-warm-600/20 text-warm-300'
                      : i === built.length
                        ? 'border-warm-500/50 border-dashed text-warm-400'
                        : 'border-graphite-600 text-gray-600'
                  }`}
                >
                  {done && <Check className="mr-1 inline h-3 w-3" />}
                  {el}
                </motion.div>
                {i < HEATING_SEQUENCE.length - 1 && (
                  <div className="hidden h-0.5 w-4 overflow-hidden rounded bg-graphite-700 sm:block">
                    {done && <div className="pipe-warm-fill h-full bg-warm-500" />}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <div className="mx-auto mb-2 flex h-16 w-24 gap-1 justify-center">
              {[0, 1, 2].map((w) => (
                <div key={w} className="window-lit h-full w-5 rounded-sm" />
              ))}
            </div>
            <p className="text-sm text-green-200">
              Система собрана. В реальной жизни монтаж и запуск лучше доверить специалистам.
            </p>
          </motion.div>
        )}
      </div>

      {!finished && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {HEATING_ELEMENTS.map((el) => {
            const used = built.includes(el)
            return (
              <button
                key={el}
                type="button"
                disabled={used}
                onClick={() => pick(el)}
                className={`option-btn text-sm ${used ? 'opacity-40' : ''}`}
              >
                {el}
              </button>
            )
          })}
        </div>
      )}

      {feedback && (
        <p className="mt-3 rounded-lg bg-red-900/20 p-3 text-sm text-red-200">{feedback}</p>
      )}

      {finished && (
        <button type="button" onClick={onComplete} className="btn-primary mt-4 w-full">
          Завершить уровень
        </button>
      )}
    </div>
  )
}
