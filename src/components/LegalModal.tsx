import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface LegalModalProps {
  open: boolean
  title: string
  paragraphs: string[]
  onClose: () => void
}

export function LegalModal({ open, title, paragraphs, onClose }: LegalModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-strong flex max-h-[min(85dvh,640px)] w-full max-w-lg flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-6">
              <h3 id="legal-modal-title" className="heading-display pr-2 text-lg sm:text-xl">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost shrink-0 p-2"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              <div className="space-y-3 text-sm leading-relaxed text-steel-300">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="shrink-0 border-t border-white/[0.06] px-4 py-3 sm:px-6">
              <button type="button" onClick={onClose} className="btn-primary w-full">
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
