import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin } from 'lucide-react'
import { LEVEL_TWO_TICKETS } from '../data/questions'
import { SETTLEMENT_COORDS, type Settlement } from '../data/settlements'
import { HEAT_CORRECT, HEAT_WRONG } from '../data/rewards'
import { HeatGlowEffect } from '../components/Effects/HeatGlowEffect'
import { ProgressBar } from '../components/ProgressBar'

interface Props {
  onComplete: () => void
  onBack: () => void
  onHeat: (delta: number) => void
}

export function LevelTwoMasterKotel({ onComplete, onBack, onHeat }: Props) {
  const [step, setStep] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [warmGlow, setWarmGlow] = useState(false)
  const [donePoints, setDonePoints] = useState<string[]>([])

  const ticket = LEVEL_TWO_TICKETS[step]
  const coords = SETTLEMENT_COORDS[ticket.settlement as Settlement]

  const handleAnswer = (index: number) => {
    if (answered) return
    setAnswered(true)
    if (index === ticket.correctIndex) {
      onHeat(HEAT_CORRECT)
      setWarmGlow(true)
      setFeedback(ticket.comment)
      setDonePoints((p) => [...p, ticket.settlement])
    } else {
      onHeat(HEAT_WRONG)
      setFeedback('Стоит уточнить детали и провести диагностику, а не спешить с заменой.')
    }
  }

  const next = () => {
    if (step + 1 >= LEVEL_TWO_TICKETS.length) {
      onComplete()
      return
    }
    setStep((s) => s + 1)
    setFeedback(null)
    setAnswered(false)
    setWarmGlow(false)
  }

  return (
    <div>
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-warm-400">
        <ArrowLeft className="h-4 w-4" /> К уровням
      </button>

      <h2 className="text-xl font-bold">Мастер КотёлЪ</h2>
      <p className="mb-4 text-sm text-gray-400">Заявки Саткинского района</p>

      <ProgressBar value={((step + 1) / LEVEL_TWO_TICKETS.length) * 100} label="Заявки" variant="heat" />

      {/* Карта района */}
      <div className="relative mt-4 h-40 overflow-hidden rounded-xl border border-graphite-700 bg-graphite-900/80 sm:h-48">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(90deg, #323c48 1px, transparent 1px), linear-gradient(#323c48 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        {(Object.keys(SETTLEMENT_COORDS) as Settlement[]).map((name) => {
          const c = SETTLEMENT_COORDS[name]
          const active = name === ticket.settlement
          const done = donePoints.includes(name)
          return (
            <div
              key={name}
              className="absolute"
              style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span
                className={`flex h-3 w-3 rounded-full ${
                  done
                    ? 'bg-green-500'
                    : active
                      ? 'indicator-blink bg-warm-500 shadow-warm'
                      : 'bg-graphite-600'
                }`}
              />
              {active && (
                <span className="absolute left-4 top-0 whitespace-nowrap text-[10px] text-warm-400">
                  {name}
                </span>
              )}
            </div>
          )
        })}
        <p className="absolute bottom-2 left-3 text-[10px] text-gray-500">Саткинский район</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-panel relative mt-4 p-4"
        >
          <HeatGlowEffect active={warmGlow} />
          <div className="mb-3 flex items-center gap-2 text-warm-400">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Клиент из {ticket.settlement}</span>
          </div>
          <p className="mb-4 text-gray-200">«{ticket.message}»</p>

          <div className="flex flex-col gap-2">
            {ticket.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => handleAnswer(i)}
                className={`option-btn ${answered && i === ticket.correctIndex ? 'option-btn-selected' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <p className={`mt-4 rounded-lg p-3 text-sm ${warmGlow ? 'bg-green-900/30 text-green-200' : 'bg-red-900/20'}`}>
              {feedback}
            </p>
          )}

          {answered && (
            <button type="button" onClick={next} className="btn-primary mt-4 w-full">
              {step + 1 >= LEVEL_TWO_TICKETS.length ? 'Завершить уровень' : 'Следующая заявка'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
