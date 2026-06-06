import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import type { GridCell, Point } from '../../data/pipePuzzles'
import { PipeCell } from './PipeCell'

interface PipeBoardProps {
  cells: GridCell[][]
  entry: Point
  reachable: Set<string>
  pathKeys: Set<string>
  flowIndex: Map<string, number>
  solved: boolean
  radiatorLit: boolean
  onRotate: (row: number, col: number) => void
}

export function PipeBoard({
  cells,
  entry,
  reachable,
  pathKeys,
  flowIndex,
  solved,
  radiatorLit,
  onRotate,
}: PipeBoardProps) {
  const rows = cells.length
  const entryRow = entry.row

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <motion.div
        className={`pipe-terminal flex shrink-0 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 sm:px-3 ${
          solved ? 'pipe-terminal-active' : ''
        }`}
        animate={solved ? { boxShadow: '0 0 24px rgba(255,140,26,0.35)' } : {}}
      >
        <Flame className={`h-6 w-6 sm:h-8 sm:w-8 ${solved ? 'text-warm-400' : 'text-steel-500'}`} />
        <span className="text-[9px] font-semibold uppercase tracking-wider text-steel-500 sm:text-[10px]">
          Котёл
        </span>
        <div
          className={`h-1 w-8 rounded-full sm:w-10 ${solved ? 'bg-warm-500' : 'bg-steel-600/50'}`}
          style={{ marginTop: entryRow === 0 ? 0 : entryRow === rows - 1 ? 'auto' : `${entryRow * 12}%` }}
        />
      </motion.div>

      <div
        className="pipe-grid flex-1 rounded-xl border border-steel-600/30 bg-graphite-950/80 p-1.5 sm:p-2"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cells[0].length}, 1fr)`,
          gap: '4px',
          maxWidth: rows === 5 ? '340px' : '280px',
        }}
      >
        {cells.map((row, r) =>
          row.map((cell, c) => {
            const k = `${r},${c}`
            const connected = reachable.has(k)
            const onPath = pathKeys.has(k)
            const flow = solved && flowIndex.has(k)
            return (
              <PipeCell
                key={k}
                type={cell.type}
                rotation={cell.rotation}
                connected={connected}
                onPath={onPath}
                flowing={!!flow}
                flowDelay={(flowIndex.get(k) ?? 0) * 0.12}
                clickable={!solved}
                onClick={() => onRotate(r, c)}
              />
            )
          })
        )}
      </div>

      <motion.div
        className={`pipe-terminal flex shrink-0 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 sm:px-3 ${
          radiatorLit ? 'pipe-terminal-active' : ''
        }`}
        animate={radiatorLit ? { boxShadow: '0 0 24px rgba(255,140,26,0.4)' } : {}}
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-6 w-6 sm:h-8 sm:w-8 ${radiatorLit ? 'text-warm-400' : 'text-steel-500'}`}
          aria-hidden
        >
          {[4, 8, 12, 16, 20].map((y) => (
            <line key={y} x1="5" y1={y} x2="19" y2={y} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          ))}
        </svg>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-steel-500 sm:text-[10px]">
          Радиатор
        </span>
      </motion.div>
    </div>
  )
}
