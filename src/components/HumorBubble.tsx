import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface HumorBubbleProps {
  text: string
  variant?: 'boiler' | 'neutral' | 'success' | 'danger'
}

export function HumorBubble({ text, variant = 'boiler' }: HumorBubbleProps) {
  const styles = {
    boiler: 'border-warm-500/30 bg-warm-600/10 text-warm-200/90',
    neutral: 'border-steel-600/40 bg-graphite-800/60 text-steel-300',
    success: 'border-green-500/30 bg-green-950/30 text-green-200/90',
    danger: 'border-red-500/30 bg-red-950/30 text-red-200/90',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-3 flex gap-2 rounded-xl border px-3 py-2 text-sm italic ${styles[variant]}`}
    >
      <MessageCircle className="h-4 w-4 shrink-0 opacity-70" />
      <span>«{text}»</span>
    </motion.div>
  )
}
