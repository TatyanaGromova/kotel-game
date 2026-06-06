import { motion } from 'framer-motion'
import type { PipeType } from '../../data/pipePuzzles'

interface PipeCellProps {
  type: PipeType
  rotation: number
  connected: boolean
  onPath: boolean
  flowing: boolean
  flowDelay: number
  clickable: boolean
  onClick: () => void
}

const PIPE_STROKE = '#5a6d82'
const PIPE_ACTIVE = '#7a9ab8'
const FLOW_COLOR = '#ff8c1a'

function PipeShape({
  type,
  flowing,
  flowDelay,
}: {
  type: PipeType
  flowing: boolean
  flowDelay: number
}) {
  const sw = 5
  const cap = 'round'
  const center = 50

  if (type === 'empty') {
    return (
      <rect x="20" y="20" width="60" height="60" rx="4" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    )
  }

  if (type === 'block') {
    return (
      <>
        <rect x="18" y="18" width="64" height="64" rx="6" fill="rgba(20,24,30,0.9)" stroke="rgba(80,90,100,0.5)" strokeWidth="1.5" />
        <line x1="30" y1="30" x2="70" y2="70" stroke="rgba(120,80,70,0.6)" strokeWidth="3" strokeLinecap={cap} />
        <line x1="70" y1="30" x2="30" y2="70" stroke="rgba(120,80,70,0.6)" strokeWidth="3" strokeLinecap={cap} />
      </>
    )
  }

  const segments: { x1: number; y1: number; x2: number; y2: number }[] = []

  if (type === 'straight') {
    segments.push({ x1: center, y1: 0, x2: center, y2: 100 })
  } else if (type === 'corner') {
    segments.push({ x1: center, y1: 0, x2: center, y2: center })
    segments.push({ x1: center, y1: center, x2: 100, y2: center })
  } else if (type === 'tee') {
    segments.push({ x1: center, y1: 0, x2: center, y2: 100 })
    segments.push({ x1: center, y1: center, x2: 100, y2: center })
  } else if (type === 'cross') {
    segments.push({ x1: center, y1: 0, x2: center, y2: 100 })
    segments.push({ x1: 0, y1: center, x2: 100, y2: center })
  }

  return (
    <>
      {segments.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={PIPE_STROKE}
          strokeWidth={sw + 2}
          strokeLinecap={cap}
          opacity={0.35}
        />
      ))}
      {segments.map((s, i) => (
        <line
          key={`fg-${i}`}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={PIPE_ACTIVE}
          strokeWidth={sw}
          strokeLinecap={cap}
          className="pipe-segment"
        />
      ))}
      {segments.map((s, i) => (
        <motion.line
          key={`flow-${i}`}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={FLOW_COLOR}
          strokeWidth={sw - 1}
          strokeLinecap={cap}
          initial={{ opacity: 0 }}
          animate={{ opacity: flowing ? 1 : 0 }}
          transition={{ delay: flowDelay, duration: 0.25 }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(255,140,26,0.8))' }}
        />
      ))}
    </>
  )
}

export function PipeCell({
  type,
  rotation,
  connected,
  onPath,
  flowing,
  flowDelay,
  clickable,
  onClick,
}: PipeCellProps) {
  const isInteractive = clickable && type !== 'empty' && type !== 'block'

  return (
    <button
      type="button"
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      className={`pipe-cell relative aspect-square w-full rounded-lg border transition-colors ${
        isInteractive ? 'cursor-pointer hover:border-steel-500/50 active:scale-[0.97]' : 'cursor-default'
      } ${connected ? 'pipe-cell-connected' : 'border-steel-700/25 bg-graphite-900/50'} ${
        onPath ? 'pipe-cell-path' : ''
      }`}
      aria-label={isInteractive ? 'Повернуть трубу' : undefined}
    >
      <motion.div
        className="absolute inset-1 flex items-center justify-center"
        animate={{ rotate: rotation * 90 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
          <PipeShape type={type} flowing={flowing} flowDelay={flowDelay} />
        </svg>
      </motion.div>
      {flowing && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: flowDelay }}
          style={{ boxShadow: 'inset 0 0 20px rgba(255,140,26,0.35)' }}
        />
      )}
    </button>
  )
}
