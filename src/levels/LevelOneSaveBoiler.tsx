import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LEVEL_ONE_QUESTIONS, type ProblemZone } from '../data/questions'
import { HEAT_CORRECT, HEAT_WRONG } from '../data/rewards'
import { HUMOR, pickZoneWrongHumor } from '../data/humor'
import { BoilerRoomScene } from '../components/BoilerRoomScene'
import { BoilerDiagnosticOverlay } from '../components/BoilerDiagnosticOverlay'
import { ExplosionEffect } from '../components/Effects/ExplosionEffect'
import { HeatGlowEffect } from '../components/Effects/HeatGlowEffect'
import { ProgressBar } from '../components/ProgressBar'
import { LevelHeader } from '../components/LevelHeader'
import { HumorBubble } from '../components/HumorBubble'

interface Props {
  onComplete: () => void
  onBack: () => void
  onHeat: (delta: number) => void
}

export function LevelOneSaveBoiler({ onComplete, onBack, onHeat }: Props) {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<'zone' | 'action'>('zone')
  const [zoneOk, setZoneOk] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [humor, setHumor] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [explosion, setExplosion] = useState(false)
  const [warmGlow, setWarmGlow] = useState(false)
  const [showError, setShowError] = useState(false)
  const [alert, setAlert] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [pickedZone, setPickedZone] = useState<ProblemZone | null>(null)

  const q = LEVEL_ONE_QUESTIONS[step]
  const progress = ((step + (phase === 'action' && answered ? 1 : phase === 'action' ? 0.5 : 0)) / LEVEL_ONE_QUESTIONS.length) * 100

  const pickZone = (zone: ProblemZone) => {
    if (phase !== 'zone') return
    setPickedZone(zone)
    if (zone === q.problemZone) {
      setZoneOk(true)
      setHumor(HUMOR.boiler.zoneOk)
      onHeat(HEAT_CORRECT)
      setTimeout(() => {
        setPhase('action')
        setHumor(null)
      }, 700)
    } else {
      setZoneOk(false)
      setHumor(pickZoneWrongHumor())
      onHeat(HEAT_WRONG)
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  const handleAnswer = (index: number) => {
    if (answered || phase !== 'action') return
    setAnswered(true)
    setSelectedIdx(index)
    const correct = index === q.correctIndex
    const critical = q.criticalWrong?.includes(index)

    if (correct) {
      onHeat(HEAT_CORRECT)
      setWarmGlow(true)
      setAlert(false)
      setFeedback(q.comment)
      setHumor(HUMOR.boiler.correct)
      setShowError(false)
    } else {
      onHeat(HEAT_WRONG)
      setFeedback(q.comment)
      setHumor(critical ? HUMOR.boiler.critical : HUMOR.boiler.wrong)
      if (q.effect === 'error') setShowError(true)
      setAlert(true)
      if (critical) {
        setShake(true)
        setExplosion(true)
        setTimeout(() => { setShake(false); setExplosion(false) }, 900)
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 450)
      }
    }
  }

  const next = () => {
    if (step + 1 >= LEVEL_ONE_QUESTIONS.length) {
      onComplete()
      return
    }
    const nextQ = LEVEL_ONE_QUESTIONS[step + 1]
    setStep((s) => s + 1)
    setPhase('zone')
    setZoneOk(false)
    setPickedZone(null)
    setFeedback(null)
    setHumor(null)
    setAnswered(false)
    setWarmGlow(false)
    setAlert(false)
    setSelectedIdx(null)
    setShowError(nextQ?.effect === 'error')
  }

  return (
    <div className={shake ? 'screen-shake' : ''}>
      <LevelHeader
        title="Спаси котёл до зимы"
        subtitle={phase === 'zone' ? 'Нажмите на проблемную зону котла' : 'Выберите правильное действие'}
        badge="Уровень 1"
        onBack={onBack}
      />

      <ProgressBar value={progress} label="Диагностика" variant="heat" />

      <div className="relative mt-5">
        <ExplosionEffect active={explosion} />
        <HeatGlowEffect active={warmGlow} className="rounded-2xl" />
        <BoilerRoomScene
          showError={showError || q.effect === 'error'}
          alert={alert && answered && !warmGlow}
          warm={warmGlow}
        />
        <BoilerDiagnosticOverlay
          activeZone={pickedZone}
          targetZone={q.problemZone}
          onSelect={pickZone}
          disabled={phase !== 'zone'}
        />
      </div>

      {humor && phase === 'zone' && <HumorBubble text={humor} variant={zoneOk ? 'success' : 'danger'} />}

      <AnimatePresence mode="wait">
        {phase === 'action' && (
          <motion.div
            key={`${step}-action`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel-strong relative mt-5 p-5 sm:p-6"
          >
            <p className="text-sm text-warm-400/90">{q.symptom}</p>
            <p className="mt-2 text-lg font-semibold text-gray-50 sm:text-xl">{q.situation}</p>
            <div className="mt-5 flex flex-col gap-3">
              {q.options.map((opt, i) => {
                let cls = 'option-btn'
                if (answered && i === selectedIdx) {
                  cls += i === q.correctIndex ? ' option-btn-correct' : ' option-btn-wrong'
                } else if (answered && i === q.correctIndex) cls += ' option-btn-correct'
                return (
                  <motion.button
                    key={opt}
                    type="button"
                    disabled={answered}
                    onClick={() => handleAnswer(i)}
                    whileTap={answered ? {} : { scale: 0.98 }}
                    className={cls}
                  >
                    {opt}
                  </motion.button>
                )
              })}
            </div>
            {feedback && (
              <div className={`mt-5 ${warmGlow ? 'feedback-success' : 'feedback-danger'}`}>{feedback}</div>
            )}
            {humor && answered && <HumorBubble text={humor} variant={warmGlow ? 'success' : 'danger'} />}
            {answered && (
              <button type="button" onClick={next} className="btn-primary mt-5 w-full">
                {step + 1 >= LEVEL_ONE_QUESTIONS.length ? 'Завершить уровень' : 'Далее'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
