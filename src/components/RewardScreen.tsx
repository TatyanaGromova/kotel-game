import { motion } from 'framer-motion'
import { Award, ArrowRight, Sparkles } from 'lucide-react'
import { LEVEL_REWARDS, MAX_WINTER_BONUS } from '../data/rewards'
import { LEVELS } from '../data/levels'
import { pickRewardHumor } from '../data/humor'
import { HumorBubble } from './HumorBubble'

interface RewardScreenProps {
  levelId: number
  winterBonus: number
  onContinue: () => void
}

export function RewardScreen({ levelId, winterBonus, onContinue }: RewardScreenProps) {
  const reward = LEVEL_REWARDS[levelId] ?? 0
  const level = LEVELS.find((l) => l.id === levelId)
  const pct = (winterBonus / MAX_WINTER_BONUS) * 100

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="glass-panel-strong relative overflow-hidden p-8 text-center sm:p-10"
    >
      <div className="celebration-glow pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-warm-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-warm-600/10 via-transparent to-transparent" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring' }}
        className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-warm-500/40 bg-warm-600/20 shadow-warm"
      >
        <Award className="h-10 w-10 text-warm-400" />
        <Sparkles className="absolute -right-1 -top-1 h-5 w-5 text-warm-300" />
      </motion.div>

      <h2 className="heading-display relative text-3xl">Уровень пройден</h2>
      {level && <p className="relative mt-2 text-steel-400">{level.title}</p>}

      <p className="relative mt-6 text-lg text-gray-300">
        Вы получили{' '}
        <span className="text-accent-warm text-2xl font-bold">+{reward} ₽</span>
        <br />
        <span className="text-sm">к зимнему бонусу</span>
      </p>

      <div className="promo-block relative mx-auto mt-8 max-w-sm">
        <p className="text-xs uppercase tracking-widest text-steel-400">Текущий бонус</p>
        <p className="mt-1 text-3xl font-bold text-warm-300">
          {winterBonus} ₽
          <span className="text-lg font-normal text-steel-500"> / {MAX_WINTER_BONUS} ₽</span>
        </p>
        <div className="progress-track mx-auto mt-4 max-w-xs">
          <motion.div className="progress-fill-heat" initial={{ width: 0 }} animate={{ width: `${pct}%` }} />
        </div>
      </div>

      <p className="relative mt-4 text-sm text-steel-500">+20 тепло-баллов за прохождение уровня</p>

      <HumorBubble text={pickRewardHumor(levelId)} variant="boiler" />

      <button type="button" onClick={onContinue} className="btn-primary relative mt-8 flex w-full items-center justify-center gap-2 sm:mx-auto sm:w-auto">
        Продолжить
        <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>
  )
}
