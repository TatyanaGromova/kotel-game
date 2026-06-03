import { motion } from 'framer-motion'
import { Home, Gift, RotateCcw, Calculator, Flame } from 'lucide-react'
import { BONUS_DISCLAIMER } from '../data/rewards'

interface FinalScreenProps {
  readiness: number
  heatScore: number
  winterBonus: number
  promoCode: string
  onGetBonus: () => void
  onRestart: () => void
}

export function FinalScreen({
  readiness,
  heatScore,
  winterBonus,
  promoCode,
  onGetBonus,
  onRestart,
}: FinalScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="card-panel p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warm-600/20">
          <Home className="h-7 w-7 text-warm-400" />
        </div>
        <h2 className="text-2xl font-bold sm:text-3xl">Миссия выполнена</h2>
        <p className="mt-2 text-gray-400">
          Вы прошли все уровни и подготовили дом к зиме.
        </p>

        <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
          <div className="rounded-xl bg-graphite-800/80 p-4">
            <p className="text-xs text-gray-500">Готовность дома</p>
            <p className="text-2xl font-bold text-warm-400">{readiness}%</p>
          </div>
          <div className="rounded-xl bg-graphite-800/80 p-4">
            <p className="text-xs text-gray-500">Тепло-баллы</p>
            <p className="text-2xl font-bold text-warm-400">{heatScore}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-warm-500/30 bg-warm-600/10 p-4">
          <p className="text-sm text-gray-400">Ваш зимний бонус</p>
          <p className="text-3xl font-bold text-warm-400">{winterBonus} ₽</p>
          <p className="mt-2 text-sm text-gray-400">Промокод:</p>
          <p className="promo-shine text-2xl font-black tracking-wider sm:text-3xl">{promoCode}</p>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Зимний бонус действует только на покупку котла, монтаж котла и монтаж системы отопления.
        </p>
        <p className="mt-2 text-xs text-gray-500">{BONUS_DISCLAIMER}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={onGetBonus} className="btn-primary flex items-center justify-center gap-2">
          <Gift className="h-5 w-5" />
          Получить бонус
        </button>
        <a
          href="https://kotel.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Calculator className="h-5 w-5" />
          Рассчитать монтаж
        </a>
        <a
          href="https://kotel.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Flame className="h-5 w-5" />
          Подобрать котёл
        </a>
        <button type="button" onClick={onRestart} className="btn-secondary flex items-center justify-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Пройти заново
        </button>
      </div>
    </motion.div>
  )
}
