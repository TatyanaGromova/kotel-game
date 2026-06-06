import type { ConnectionPoint, PipeCellState, PipeSide, TerminalLayout } from '../../data/pipeLogic'
import { PipeBoiler } from './PipeBoiler'
import { PipeCell } from './PipeCell'
import { PipeRadiator } from './PipeRadiator'
import { PipeStub } from './PipeStub'

interface PipeBoardProps {
  cells: PipeCellState[][]
  sourceConnection: ConnectionPoint
  targetConnection: ConnectionPoint
  sourceTerminal: TerminalLayout
  targetTerminal: TerminalLayout
  pathKeys: Set<string>
  flowIndex: Map<string, number>
  solved: boolean
  radiatorLit: boolean
  hintKey: string | null
  shakeKey: string | null
  showBlockLegend?: boolean
  onRotate: (row: number, col: number) => void
}

function terminalTop(row: number, rows: number): string {
  return `${((row + 0.5) / rows) * 100}%`
}

function gridColsClass(cols: number): string {
  if (cols >= 6) return 'pipe-grid-cols-6'
  if (cols >= 5) return 'pipe-grid-cols-5'
  return ''
}

export function PipeBoard({
  cells,
  sourceConnection,
  targetConnection,
  sourceTerminal,
  targetTerminal,
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
  const pathLen = flowIndex.size
  const sourceStubDelay = 0.1
  const gridFlowStart = 0.22
  const targetStubDelay = gridFlowStart + pathLen * 0.14 + 0.08
  const radiatorDelay = targetStubDelay + 0.14

  const isEntry = (r: number, c: number) =>
    r === sourceConnection.cell.row && c === sourceConnection.cell.col
  const isExit = (r: number, c: number) =>
    r === targetConnection.cell.row && c === targetConnection.cell.col

  return (
    <div className="flex w-full flex-col items-center gap-1">
      {showBlockLegend && (
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-steel-500 sm:text-[10px]">
          <span className="inline-block h-2.5 w-2.5 rounded border border-steel-600/50 bg-graphite-950 sm:h-3 sm:w-3" />
          Засор
        </div>
      )}

      <div className="pipe-board-assembly mx-auto w-full max-w-full">
        <div className="flex w-full max-w-full items-stretch justify-center gap-0">
          <div className="pipe-terminal-col relative shrink-0">
            <div
              className="absolute left-0 right-0 flex -translate-y-1/2 justify-center"
              style={{ top: terminalTop(sourceTerminal.row, rows) }}
            >
              <PipeBoiler active={solved} flowDelay={0} mini />
            </div>
          </div>

          <div className="pipe-stub-col relative shrink-0">
            <div
              className="absolute inset-x-0 flex -translate-y-1/2 items-center"
              style={{ top: terminalTop(sourceTerminal.row, rows) }}
            >
              <PipeStub direction="right" flowing={solved} flowDelay={sourceStubDelay} narrow />
            </div>
          </div>

          <div
            className={`pipe-grid shrink-0 rounded-lg border border-steel-500/25 bg-graphite-950/90 p-1 sm:rounded-xl sm:p-1.5 ${gridColsClass(cols)}`}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, var(--pipe-cell-size))`,
              gap: 'var(--pipe-gap)',
            }}
          >
            {cells.map((row, r) =>
              row.map((cell, c) => {
                const k = `${r},${c}`
                const onPath = solved && pathKeys.has(k)
                const flow = solved && flowIndex.has(k)
                const hinted = hintKey === k
                const shaking = shakeKey === k
                let portSide: PipeSide | undefined
                if (isEntry(r, c)) portSide = sourceConnection.side
                if (isExit(r, c)) portSide = targetConnection.side

                return (
                  <PipeCell
                    key={k}
                    type={cell.type}
                    rotation={cell.rotation}
                    onPath={onPath}
                    hinted={hinted}
                    flowing={!!flow}
                    flowDelay={gridFlowStart + (flowIndex.get(k) ?? 0) * 0.14}
                    clickable={!solved}
                    shaking={shaking}
                    portSide={portSide}
                    onClick={() => onRotate(r, c)}
                  />
                )
              })
            )}
          </div>

          <div className="pipe-stub-col relative shrink-0">
            <div
              className="absolute inset-x-0 flex -translate-y-1/2 items-center"
              style={{ top: terminalTop(targetTerminal.row, rows) }}
            >
              <PipeStub direction="left" flowing={radiatorLit} flowDelay={targetStubDelay} narrow />
            </div>
          </div>

          <div className="pipe-terminal-col relative shrink-0">
            <div
              className="absolute left-0 right-0 flex -translate-y-1/2 justify-center"
              style={{ top: terminalTop(targetTerminal.row, rows) }}
            >
              <PipeRadiator active={radiatorLit} flowDelay={radiatorDelay} mini />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
