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
  const maxWidth = cols >= 6 ? 'min(100%, 420px)' : cols >= 5 ? 'min(100%, 360px)' : 'min(100%, 300px)'
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
    <div className="flex flex-col items-center gap-2">
      {showBlockLegend && (
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-steel-500">
          <span className="inline-block h-3 w-3 rounded border border-steel-600/50 bg-graphite-950" />
          Засор — обходите
        </div>
      )}

      <div
        className="pipe-board-assembly w-full overflow-x-auto pb-1"
        style={{ maxWidth: `calc(${maxWidth} + 11rem)` }}
      >
        <div className="flex w-full items-stretch justify-center gap-0 sm:gap-0.5">
          {/* Котёл — вне сетки */}
          <div className="relative flex w-[4.25rem] shrink-0 flex-col sm:w-[5rem]">
            <div
              className="absolute left-0 right-0 flex -translate-y-1/2 justify-center"
              style={{ top: terminalTop(sourceTerminal.row, rows) }}
            >
              <PipeBoiler active={solved} flowDelay={0} />
            </div>
          </div>

          {/* Патрубок котла */}
          <div className="relative flex w-5 shrink-0 flex-col sm:w-6">
            <div
              className="absolute inset-x-0 flex -translate-y-1/2 items-center"
              style={{ top: terminalTop(sourceTerminal.row, rows) }}
            >
              <PipeStub direction="right" flowing={solved} flowDelay={sourceStubDelay} />
            </div>
          </div>

          {/* Только игровая сетка */}
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

          {/* Патрубок радиатора */}
          <div className="relative flex w-5 shrink-0 flex-col sm:w-6">
            <div
              className="absolute inset-x-0 flex -translate-y-1/2 items-center"
              style={{ top: terminalTop(targetTerminal.row, rows) }}
            >
              <PipeStub direction="left" flowing={radiatorLit} flowDelay={targetStubDelay} />
            </div>
          </div>

          {/* Радиатор — вне сетки */}
          <div className="relative flex w-[4.25rem] shrink-0 flex-col sm:w-[5rem]">
            <div
              className="absolute left-0 right-0 flex -translate-y-1/2 justify-center"
              style={{ top: terminalTop(targetTerminal.row, rows) }}
            >
              <PipeRadiator active={radiatorLit} flowDelay={radiatorDelay} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
