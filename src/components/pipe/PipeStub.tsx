import { motion } from 'framer-motion'

interface PipeStubProps {
  direction: 'left' | 'right'
  flowing: boolean
  flowDelay?: number
}

export function PipeStub({ direction, flowing, flowDelay = 0 }: PipeStubProps) {
  return (
    <div className="pipe-stub relative flex h-3 w-full min-w-[1.25rem] items-center sm:min-w-[1.5rem]">
      <div className="absolute inset-y-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-steel-700/50" />
      <motion.div
        className={`absolute inset-y-1/2 h-1.5 -translate-y-1/2 rounded-full bg-warm-500 ${
          direction === 'right' ? 'left-0 origin-left' : 'right-0 origin-right'
        }`}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: flowing ? 1 : 0, opacity: flowing ? 1 : 0 }}
        transition={{ delay: flowDelay, duration: 0.35 }}
        style={{
          width: '100%',
          boxShadow: flowing ? '0 0 10px rgba(255,140,26,0.65)' : undefined,
        }}
      />
    </div>
  )
}
