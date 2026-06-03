import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { LEVEL_ONE_QUESTIONS } from '../data/questions'
import { HEAT_CORRECT, HEAT_WRONG } from '../data/rewards'
import { BoilerScene } from '../components/BoilerScene'
import { ExplosionEffect } from '../components/Effects/ExplosionEffect'
import { HeatGlowEffect } from '../components/Effects/HeatGlowEffect'
import { ProgressBar } from '../components/ProgressBar'

interface Props {
  onComplete: () => void
  onBack: () => void
  onHeat: (delta: number) => void
}

export function LevelOneSaveBoiler({ onComplete, onBack, onHeat }: Props) {
  const [step, setStep] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [explosion, setExplosion] = useState(false)
  const [warmGlow, setWarmGlow] = useState(false)
  const [showError, setShowError] = useState(false)
  const [answered, setAnswered] = useState(false)

  const q = LEVEL_ONE_QUESTIONS[step]
  const progress = ((step + (answered ? 1 : 0)) / LEVEL_ONE_QUESTIONS.length) * 100

  const handleAnswer = (index: number) => {
    if (answered) return
    setAnswered(true)
    const correct = index === q.correctIndex
    const critical = q.criticalWrong?.includes(index)

    if (correct) {
      onHeat(HEAT_CORRECT)
      setWarmGlow(true)
      setFeedback(q.comment)
      setShowError(false)
    } else {
      onHeat(HEAT_WRONG)
      setFeedback(
        critical
          ? `Опасный выбор. ${q.comment}`
          : `Котёл подаёт сигнал. ${q.comment}`
      )
      if (q.effect === 'error' || q.situation.includes('ошибк')) setShowError(true)
      if (critical) {
        setShake(true)
        setExplosion(true)
        setTimeout(() => {
          setShake(false)
          setExplosion(false)
        }, 800)
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 400)
      }
    }
  }

  const next = () => {
    if (step + 1 >= LEVEL_ONE_QUESTIONS.length) {
      onComplete()
      return
    }
    setStep((s) => s + 1)
    setFeedback(null)
    setAnswered(false)
    setWarmGlow(false)
    setShowError(q.effect === 'error')
  }

  return (
    <div className={shake ? 'screen-shake' : ''}>
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-warm-400">
        <ArrowLeft className="h-4 w-4" /> К уровням
      </button>

      <h2 className="mb-1 text-xl font-bold">Спаси котёл до зимы</h2>
      <p className="mb-4 text-sm text-gray-400">Интерактивная диагностика</p>

      <ProgressBar value={progress} label="Прогресс уровня" variant="heat" />

      <div className="relative mt-4">
        <ExplosionEffect active={explosion} />
        <HeatGlowEffect active={warmGlow} />
        <BoilerScene showError={showError || q.effect === 'error'} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card-panel relative mt-4 p-4 sm:p-5"
        >
          <p className="mb-4 font-medium text-gray-100">{q.situation}</p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => handleAnswer(i)}
                className={`option-btn ${
                  answered
                    ? i === q.correctIndex
                      ? 'option-btn-selected border-green-600/50'
                      : 'opacity-60'
                    : ''
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 rounded-lg p-3 text-sm ${
                warmGlow ? 'bg-green-900/30 text-green-200' : 'bg-red-900/20 text-red-200'
              }`}
            >
              {feedback}
            </motion.p>
          )}

          {answered && (
            <button type="button" onClick={next} className="btn-primary mt-4 w-full">
              {step + 1 >= LEVEL_ONE_QUESTIONS.length ? 'Завершить уровень' : 'Далее'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
