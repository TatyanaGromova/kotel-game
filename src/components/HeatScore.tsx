import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeatScore({ score }: { score: number }) {
  return (
    <motion.div layout className="hud-capsule">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warm-600/20 ring-1 ring-warm-500/30">
        <Flame className="h-3.5 w-3.5 text-warm-500" />
      </div>
      <div className="text-right sm:text-left">
        <p className="text-[9px] uppercase tracking-wider text-steel-500">Тепло</p>
        <p className="font-bold leading-none text-warm-400">{score}</p>
      </div>
    </motion.div>
  )
}
