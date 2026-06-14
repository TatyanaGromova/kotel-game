import { motion } from 'framer-motion'
import { Home, Gift, RotateCcw, Calculator, Flame, Trophy, Calendar, AlertCircle } from 'lucide-react'
import { BONUS_DISCLAIMER } from '../data/rewards'
import { formatDate, getPromoClaim, isPromoExpired } from '../services/promo'
import { KotelLogo } from './KotelLogo'

interface FinalScreenProps {
  readiness: number
  heatScore: number
  winterBonus: number
  onGetBonus: () => void
  onRestart: () => void
  onRenewBonus: () => void
}

export function FinalScreen({
  readiness,
  heatScore,
  winterBonus,
  onGetBonus,
  onRestart,
  onRenewBonus,
}: FinalScreenProps) {
  const claim = getPromoClaim()
  const promoExpired = claim ? isPromoExpired(claim.expiresAt) : false
  const promoCode = claim && !promoExpired ? claim.promoCode : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="glass-panel-strong relative overflow-hidden p-6 text-center sm:p-10">
        <div className="celebration-glow pointer-events-none absolute inset-0 bg-gradient-to-b from-warm-600/15 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-warm-500/10 blur-3xl" />

        <div className="relative mx-auto mb-5 flex justify-center">
          <KotelLogo size="lg" showText={false} />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.15 }}
          className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-warm-500/40 bg-warm-600/20"
        >
          <Trophy className="h-6 w-6 text-warm-400" />
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

          {promoExpired && claim && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-left">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div>
                  <p className="text-sm text-red-200">
                    Срок действия промокода истёк. Пройдите игру заново, чтобы получить новый бонус.
                  </p>
                  <p className="mt-1 text-xs text-steel-500">
                    Истёк: {formatDate(claim.expiresAt)} · {claim.promoCode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {promoCode && (
            <>
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-warm-500/40 to-transparent" />
              <p className="text-sm text-steel-400">Персональный промокод</p>
              <p className="promo-shine mt-1 text-2xl font-black tracking-[0.1em] sm:text-3xl">{promoCode}</p>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-steel-500">
                <Calendar className="h-3.5 w-3.5" />
                Промокод действует до: {formatDate(claim!.expiresAt)}
              </p>
            </>
          )}
        </div>

        <p className="relative mt-6 text-xs leading-relaxed text-steel-600">{BONUS_DISCLAIMER}</p>
      </div>

      <div className="flex flex-col gap-3">
        {promoExpired ? (
          <button type="button" onClick={onRenewBonus} className="btn-primary flex w-full items-center justify-center gap-2">
            <Gift className="h-5 w-5" />
            Получить новый бонус
          </button>
        ) : (
          <button type="button" onClick={onGetBonus} className="btn-primary flex w-full items-center justify-center gap-2">
            <Gift className="h-5 w-5" />
            {promoCode ? 'Оформить заявку' : `Забрать ${winterBonus} ₽`}
          </button>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <a
            href="https://kotel.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            Рассчитать монтаж
          </a>
          <a
            href="https://kotel.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center justify-center gap-2"
          >
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
