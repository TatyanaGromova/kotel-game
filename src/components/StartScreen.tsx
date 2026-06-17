import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, HelpCircle, X, MousePointerClick } from 'lucide-react'
import { KotelLogo } from './KotelLogo'
import { PipePreview } from './pipe/PipePreview'

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-panel relative overflow-hidden p-6 text-center sm:p-10"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-warm-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-steel-600/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-4">
          <KotelLogo size="hero" showText={false} />
          <div>
            <h2 className="heading-hero text-3xl sm:text-4xl">Трубный маршрут</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-steel-400 sm:text-base">
              Проведите тепло от котла к радиатору и получите{' '}
              <span className="font-semibold text-warm-400">зимний бонус до 2000 ₽</span>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
      >
        <PipePreview />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-3"
      >
        <button
          type="button"
          onClick={onStart}
          className="btn-primary group flex w-full max-w-sm items-center justify-center gap-3 sm:w-auto"
        >
          <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
          Начать игру
        </button>
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="btn-secondary flex w-full max-w-sm items-center justify-center gap-2 sm:w-auto"
        >
          <HelpCircle className="h-4 w-4" />
          Как играть
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="pb-2 text-center text-xs text-steel-500"
      >
        Разработка игры —{' '}
        <a
          href="https://vk.com/tavi_grom"
          target="_blank"
          rel="noopener noreferrer"
          className="author-credit-link font-medium text-warm-400 transition-all hover:text-warm-300"
        >
          Татьяна Громова
        </a>
      </motion.p>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel-strong max-w-md p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="heading-display text-xl">Как играть</h3>
                <button type="button" onClick={() => setShowHelp(false)} className="btn-ghost p-2">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ul className="space-y-3 text-sm text-steel-300">
                <li className="flex gap-3">
                  <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0 text-warm-500" />
                  <span>Нажмите на кусочек трубы — он повернётся на 90°.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-warm-500">→</span>
                  <span>Соедините котёл слева с радиатором справа непрерывным маршрутом.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-warm-500">!</span>
                  <span>Засоры и пустые клетки не проводят тепло. Лишние трубы могут отвлекать.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-warm-500">₽</span>
                  <span>Пройдите 5 этапов и получите зимний бонус до 2000 ₽.</span>
                </li>
              </ul>
              <button type="button" onClick={() => setShowHelp(false)} className="btn-primary mt-6 w-full">
                Понятно
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
