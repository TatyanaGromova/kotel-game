import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeatScore({ score }: { score: number }) {
  return (
    <motion.div
      layout
      className="inline-flex items-center gap-2 rounded-full border border-warm-500/30 bg-warm-600/10 px-3 py-1.5 text-sm"
    >
      <Flame className="h-4 w-4 text-warm-500" />
      <span className="text-gray-300">Тепло-баллы:</span>
      <span className="font-bold text-warm-400">{score}</span>
    </motion.div>
  )
}
