import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock } from 'lucide-react'
import { LEVEL_THREE_QUESTIONS, type RiskAnswer } from '../data/questions'
import { HEAT_CORRECT, HEAT_WRONG } from '../data/rewards'
import { ProgressBar } from '../components/ProgressBar'

interface Props {
  onComplete: () => void
  onBack: () => void
  onHeat: (delta: number) => void
}

const RISK_COLORS: Record<RiskAnswer, string> = {
  Опасно: 'border-red-500/50 bg-red-900/20 text-red-200',
  Рискованно: 'border-orange-500/50 bg-orange-900/20',
  'Нужна проверка': 'border-yellow-500/50 bg-yellow-900/20',
  Нормально: 'border-green-500/50 bg-green-900/20 text-green-200',
}

export function LevelThreeNoSurprises({ onComplete, onBack, onHeat }: Props) {
  const [step, setStep] = useState(0)
  const [timer, setTimer] = useState(100)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  const q = LEVEL_THREE_QUESTIONS[step]

  useEffect(() => {
    if (answered) return
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 0) return 0
        return t - 2
      })
    }, 200)
    return () => clearInterval(id)
  }, [step, answered])

  useEffect(() => {
    setTimer(100)
  }, [step])

  const pick = (answer: RiskAnswer) => {
    if (answered) return
    setAnswered(true)
    const ok = answer === q.correct
    onHeat(ok ? HEAT_CORRECT : HEAT_WRONG)
    setFeedback(ok ? 'Верная оценка.' : `Правильно: «${q.correct}».`)
  }

  const next = () => {
    if (step + 1 >= LEVEL_THREE_QUESTIONS.length) {
      onComplete()
      return
    }
    setStep((s) => s + 1)
    setFeedback(null)
    setAnswered(false)
    setTimer(100)
  }

  return (
    <div>
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-warm-400">
        <ArrowLeft className="h-4 w-4" /> К уровням
      </button>

      <h2 className="text-xl font-bold">Котёл не любит сюрпризы</h2>
      <p className="mb-4 text-sm text-gray-400">Оцените ситуацию</p>

      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
        <Clock className="h-3 w-3" />
        <ProgressBar value={timer} label="Время на ответ" variant={timer < 30 ? 'cold' : 'default'} />
      </div>

      <ProgressBar value={((step + 1) / LEVEL_THREE_QUESTIONS.length) * 100} label="Ситуации" variant="heat" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className={`card-panel mt-4 p-5 ${
            q.correct === 'Опасно' ? 'ring-1 ring-red-500/20' : q.correct === 'Нормально' ? 'ring-1 ring-green-500/20' : ''
          }`}
        >
          <p className="text-lg font-medium">{q.situation}</p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {q.options.map((opt) => (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => pick(opt)}
                className={`option-btn text-center text-sm !px-2 ${
                  answered && opt === q.correct ? RISK_COLORS[opt] : ''
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-gray-300">
              {feedback}
            </motion.p>
          )}

          {answered && (
            <button type="button" onClick={next} className="btn-primary mt-4 w-full">
              {step + 1 >= LEVEL_THREE_QUESTIONS.length ? 'Завершить' : 'Далее'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
