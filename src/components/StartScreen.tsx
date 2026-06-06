import { motion } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'
import { PipePreview } from './pipe/PipePreview'

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-steel-600/40 bg-graphite-900/60 px-4 py-1 text-xs font-medium uppercase tracking-widest text-steel-400 backdrop-blur-sm"
        >
          <Sparkles className="h-3 w-3 text-warm-500" />
          Сервисный центр «КотёлЪ»
        </motion.p>
        <h2 className="heading-hero mx-auto max-w-2xl">КотёлЪ: Трубный маршрут</h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-steel-400 sm:text-lg">
          Поворачивайте трубы, проведите тепло от котла к радиатору и получите{' '}
          <span className="text-accent-warm font-semibold">зимний бонус до 2000 ₽</span> на покупку
          котла, монтаж котла или монтаж системы отопления.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <PipePreview />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex flex-col items-center gap-4"
      >
        <button
          type="button"
          onClick={onStart}
          className="btn-primary group flex w-full max-w-sm items-center justify-center gap-3 sm:w-auto"
        >
          <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
          Начать игру
        </button>
        <p className="max-w-xs text-center text-xs leading-relaxed text-gray-500">
          Кликните по трубе — она повернётся на 90°. Соберите путь — и тепло пойдёт.
        </p>
      </motion.div>
    </div>
  )
}
