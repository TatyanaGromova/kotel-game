import { motion } from 'framer-motion'
import { Home, Gift, RotateCcw, Calculator, Flame, Trophy } from 'lucide-react'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="glass-panel-strong relative overflow-hidden p-6 text-center sm:p-10">
        <div className="celebration-glow pointer-events-none absolute inset-0 bg-gradient-to-b from-warm-600/15 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-warm-500/10 blur-3xl" />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-warm-500/40 bg-warm-600/20 shadow-warm"
        >
          <Trophy className="h-8 w-8 text-warm-400" />
        </motion.div>

        <h2 className="heading-display relative text-3xl sm:text-4xl">Маршрут тепла собран</h2>
        <p className="relative mt-3 text-steel-400">
          Все пять этапов трассы пройдены — дом готов к зиме.
        </p>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
          <div className="glass-panel p-4 text-left">
            <div className="mb-2 flex items-center gap-2 text-steel-500">
              <Home className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wider">Готовность дома</p>
            </div>
            <p className="text-3xl font-bold text-warm-400">{readiness}%</p>
            <div className="progress-track mt-2">
              <div className="progress-fill-heat" style={{ width: `${readiness}%` }} />
            </div>
          </div>
          <div className="glass-panel p-4 text-left">
            <div className="mb-2 flex items-center gap-2 text-steel-500">
              <Flame className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wider">Тепло-баллы</p>
            </div>
            <p className="text-3xl font-bold text-warm-400">{heatScore}</p>
          </div>
        </div>

        <div className="promo-block relative mx-auto mt-8 max-w-md">
          <p className="text-xs uppercase tracking-[0.2em] text-steel-400">Ваш зимний бонус</p>
          <p className="mt-2 text-4xl font-black text-warm-300 sm:text-5xl">{winterBonus} ₽</p>
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-warm-500/40 to-transparent" />
          <p className="text-sm text-steel-400">Промокод</p>
          <p className="promo-shine mt-1 text-3xl font-black tracking-[0.15em] sm:text-4xl">{promoCode}</p>
        </div>

        <p className="relative mt-6 text-xs leading-relaxed text-steel-500">
          Зимний бонус действует только на покупку котла, монтаж котла и монтаж системы отопления.
        </p>
        <p className="relative mt-2 text-xs leading-relaxed text-steel-600">{BONUS_DISCLAIMER}</p>
      </div>

      <div className="flex flex-col gap-3">
        <button type="button" onClick={onGetBonus} className="btn-primary flex w-full items-center justify-center gap-2">
          <Gift className="h-5 w-5" />
          Получить бонус
        </button>
        <div className="grid gap-3 sm:grid-cols-3">
          <a href="https://kotel.ru" target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center justify-center gap-2">
            <Calculator className="h-4 w-4" />
            Рассчитать монтаж
          </a>
          <a href="https://kotel.ru" target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center justify-center gap-2">
            <Flame className="h-4 w-4" />
            Подобрать котёл
          </a>
          <button type="button" onClick={onRestart} className="btn-secondary flex items-center justify-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Пройти заново
          </button>
        </div>
      </div>
    </motion.div>
  )
}
