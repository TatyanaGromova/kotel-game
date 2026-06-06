import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import type { CellPosition, PipeCellState } from '../../data/pipeLogic'
import { PipeCell } from './PipeCell'

interface PipeBoardProps {
  cells: PipeCellState[][]
  source: CellPosition
  target: CellPosition
  pathKeys: Set<string>
  flowIndex: Map<string, number>
  solved: boolean
  radiatorLit: boolean
  hintKey: string | null
  shakeKey: string | null
  showBlockLegend?: boolean
  onRotate: (row: number, col: number) => void
}

function TerminalConnector({ active }: { active: boolean }) {
  return (
    <div
      className={`h-2 w-10 rounded-full sm:w-12 ${active ? 'bg-warm-500 shadow-[0_0_12px_rgba(255,140,26,0.6)]' : 'bg-steel-600/40'}`}
    />
  )
}

export function PipeBoard({
  cells,
  source,
  target,
  pathKeys,
  flowIndex,
  solved,
  radiatorLit,
  hintKey,
  shakeKey,
  showBlockLegend = false,
  onRotate,
}: PipeBoardProps) {
  const rows = cells.length
  const cols = cells[0].length
  const maxWidth = cols >= 6 ? '420px' : cols >= 5 ? '360px' : '300px'

  return (
    <div className="flex flex-col items-center gap-2">
      {showBlockLegend && (
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-steel-500">
          <span className="inline-block h-3 w-3 rounded border border-steel-600/50 bg-graphite-950" />
          Засор — обходите
        </div>
      )}
    <div className="flex w-full items-stretch justify-center gap-2 sm:gap-3">
      <div
        className="flex w-16 shrink-0 flex-col items-center justify-center sm:w-[4.5rem]"
        style={{ paddingTop: `${(source.row / rows) * 40}%`, paddingBottom: `${((rows - 1 - source.row) / rows) * 40}%` }}
      >
        <motion.div
          className={`pipe-terminal flex w-full flex-col items-center gap-2 rounded-xl border px-2 py-3 ${
            solved ? 'pipe-terminal-active' : ''
          }`}
          animate={solved ? { boxShadow: '0 0 28px rgba(255,140,26,0.4)' } : {}}
        >
          <div className={`rounded-lg p-2 ${solved ? 'bg-warm-600/20' : 'bg-graphite-800/80'}`}>
            <Flame className={`h-7 w-7 sm:h-8 sm:w-8 ${solved ? 'text-warm-400' : 'text-steel-400'}`} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-steel-400">Котёл</span>
          <TerminalConnector active={solved} />
        </motion.div>
      </div>

      <div
        className="pipe-grid flex-1 rounded-xl border border-steel-500/25 bg-graphite-950/90 p-1.5 sm:p-2"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '5px',
          maxWidth,
        }}
      >
        {cells.map((row, r) =>
          row.map((cell, c) => {
            const k = `${r},${c}`
            const onPath = solved && pathKeys.has(k)
            const flow = solved && flowIndex.has(k)
            const hinted = hintKey === k
            const shaking = shakeKey === k
            return (
              <PipeCell
                key={k}
                type={cell.type}
                rotation={cell.rotation}
                onPath={onPath}
                hinted={hinted}
                flowing={!!flow}
                flowDelay={(flowIndex.get(k) ?? 0) * 0.14}
                clickable={!solved}
                shaking={shaking}
                onClick={() => onRotate(r, c)}
              />
            )
          })
        )}
      </div>

      <div
        className="flex w-16 shrink-0 flex-col items-center justify-center sm:w-[4.5rem]"
        style={{ paddingTop: `${(target.row / rows) * 40}%`, paddingBottom: `${((rows - 1 - target.row) / rows) * 40}%` }}
      >
        <motion.div
          className={`pipe-terminal flex w-full flex-col items-center gap-2 rounded-xl border px-2 py-3 ${
            radiatorLit ? 'pipe-terminal-active' : ''
          }`}
          animate={radiatorLit ? { boxShadow: '0 0 28px rgba(255,140,26,0.45)' } : {}}
        >
          <div className={`rounded-lg p-2 ${radiatorLit ? 'bg-warm-600/20' : 'bg-graphite-800/80'}`}>
            <svg
              viewBox="0 0 24 28"
              className={`h-7 w-7 sm:h-8 sm:w-8 ${radiatorLit ? 'text-warm-400' : 'text-steel-400'}`}
              aria-hidden
            >
              {[5, 9, 13, 17, 21].map((y) => (
                <line key={y} x1="4" y1={y} x2="20" y2={y} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ))}
            </svg>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-steel-400">Радиатор</span>
          <TerminalConnector active={radiatorLit} />
        </motion.div>
      </div>
    </div>
    </div>
  )
}
