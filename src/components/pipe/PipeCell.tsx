import { motion } from 'framer-motion'
import type { PipeType } from '../../data/pipeLogic'

interface PipeCellProps {
  type: PipeType
  rotation: number
  onPath: boolean
  hinted: boolean
  flowing: boolean
  flowDelay: number
  clickable: boolean
  onClick: () => void
}

const PIPE_SHADOW = '#3d4f63'
const PIPE_BODY = '#8aa4be'
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
  const sw = 6
  const cap = 'round'
  const center = 50

  if (type === 'empty') {
    return (
      <rect
        x="18"
        y="18"
        width="64"
        height="64"
        rx="6"
        fill="rgba(255,255,255,0.02)"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />
    )
  }

  if (type === 'block') {
    return (
      <>
        <rect
          x="14"
          y="14"
          width="72"
          height="72"
          rx="8"
          fill="rgba(12,14,18,0.95)"
          stroke="rgba(90,70,60,0.5)"
          strokeWidth="1.5"
        />
        <line x1="28" y1="28" x2="72" y2="72" stroke="rgba(140,90,70,0.55)" strokeWidth="3.5" strokeLinecap={cap} />
        <line x1="72" y1="28" x2="28" y2="72" stroke="rgba(140,90,70,0.55)" strokeWidth="3.5" strokeLinecap={cap} />
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
          key={`sh-${i}`}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={PIPE_SHADOW}
          strokeWidth={sw + 3}
          strokeLinecap={cap}
        />
      ))}
      {segments.map((s, i) => (
        <line
          key={`fg-${i}`}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={PIPE_BODY}
          strokeWidth={sw}
          strokeLinecap={cap}
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
          transition={{ delay: flowDelay, duration: 0.3 }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,140,26,0.9))' }}
        />
      ))}
    </>
  )
}

export function PipeCell({
  type,
  rotation,
  onPath,
  hinted,
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
      className={`pipe-cell relative aspect-square w-full rounded-lg border transition-all duration-200 ${
        isInteractive ? 'cursor-pointer hover:border-steel-400/60 active:scale-[0.96]' : 'cursor-default'
      } ${onPath ? 'pipe-cell-path' : 'border-steel-700/30 bg-graphite-900/70'} ${
        hinted ? 'pipe-cell-hint' : ''
      }`}
      aria-label={isInteractive ? 'Повернуть трубу' : undefined}
    >
      <motion.div
        className="absolute inset-0.5 flex items-center justify-center"
        animate={{ rotate: rotation * 90 }}
        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
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
          style={{ boxShadow: 'inset 0 0 24px rgba(255,140,26,0.4)' }}
        />
      )}
    </button>
  )
}
