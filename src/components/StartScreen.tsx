import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { BoilerScene } from './BoilerScene'

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="mb-2 text-sm font-medium text-warm-500">Сервисный центр «КотёлЪ»</p>
        <h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          КотёлЪ: миссия «Тёплая зима»
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-gray-400 sm:text-base">
          Пройдите 5 уровней, подготовьте дом к зиме и получите зимний бонус до 2000 ₽ на покупку
          котла, монтаж котла или монтаж системы отопления.
        </p>
      </motion.div>

      <BoilerScene />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-3"
      >
        <button type="button" onClick={onStart} className="btn-primary flex items-center justify-center gap-2">
          <Play className="h-5 w-5" />
          Начать игру
        </button>
        <p className="text-center text-xs text-gray-500">
          Котёл подаёт сигнал. Лучше разобраться сейчас, чем ждать морозов.
        </p>
      </motion.div>
    </div>
  )
}
