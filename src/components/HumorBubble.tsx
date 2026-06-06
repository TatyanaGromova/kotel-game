import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface HumorBubbleProps {
  text: string
  variant?: 'boiler' | 'neutral' | 'success' | 'danger'
  compact?: boolean
}

export function HumorBubble({ text, variant = 'boiler', compact = false }: HumorBubbleProps) {
  const styles = {
    boiler: 'border-warm-500/30 bg-warm-600/10 text-warm-200/90',
    neutral: 'border-steel-600/40 bg-graphite-800/60 text-steel-300',
    success: 'border-green-500/30 bg-green-950/30 text-green-200/90',
    danger: 'border-red-500/30 bg-red-950/30 text-red-200/90',
  }

  const displayText = compact && text.length > 72 ? `${text.slice(0, 70)}…` : text

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex shrink-0 gap-1.5 rounded-lg border italic ${
        compact ? 'px-2 py-1' : 'mt-3 px-3 py-2 text-sm'
      } ${styles[variant]}`}
    >
      <MessageCircle className={`shrink-0 opacity-70 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
      <span className={compact ? 'humor-bubble-compact' : ''}>«{displayText}»</span>
    </motion.div>
  )
}
