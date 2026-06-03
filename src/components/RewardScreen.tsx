import { motion } from 'framer-motion'
import { Award, ArrowRight } from 'lucide-react'
import { LEVEL_REWARDS, MAX_WINTER_BONUS } from '../data/rewards'
import { LEVELS } from '../data/levels'

interface RewardScreenProps {
  levelId: number
  winterBonus: number
  onContinue: () => void
}

export function RewardScreen({ levelId, winterBonus, onContinue }: RewardScreenProps) {
  const reward = LEVEL_REWARDS[levelId] ?? 0
  const level = LEVELS.find((l) => l.id === levelId)

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="card-panel flex flex-col items-center gap-6 p-6 text-center sm:p-8"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warm-600/20">
        <Award className="h-8 w-8 text-warm-400" />
      </div>

      <div>
        <h2 className="text-2xl font-bold">Уровень пройден</h2>
        {level && <p className="mt-1 text-gray-400">{level.title}</p>}
      </div>

      <p className="text-lg">
        Вы получили <span className="font-bold text-warm-400">+{reward} ₽</span> к зимнему бонусу
      </p>

      <p className="text-xl font-semibold text-warm-400">
        Текущий бонус: {winterBonus} ₽ из {MAX_WINTER_BONUS} ₽
      </p>

      <p className="text-sm text-gray-500">
        +20 тепло-баллов за прохождение уровня
      </p>

      <button type="button" onClick={onContinue} className="btn-primary flex items-center justify-center gap-2">
        Продолжить
        <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>
  )
}
