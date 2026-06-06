export type PipeType = 'straight' | 'corner' | 'tee' | 'cross' | 'empty' | 'block'

export interface CellPosition {
  row: number
  col: number
}

export interface PipeCellState {
  type: PipeType
  rotation: number
}

export interface SolvedCellDef extends PipeCellState {
  correctRotation: number
  locked?: boolean
  isPath?: boolean
}

const BASE_MASKS: Record<PipeType, number> = {
  straight: 0b0101,
  corner: 0b0011,
  tee: 0b0111,
  cross: 0b1111,
  empty: 0,
  block: 0,
}

const DR = [-1, 0, 1, 0]
const DC = [0, 1, 0, -1]
const OPP = [2, 3, 0, 1]

export function getMask(type: PipeType, rotation: number): number {
  if (type === 'empty' || type === 'block') return 0
  const base = BASE_MASKS[type]
  let mask = 0
  for (let i = 0; i < 4; i++) {
    if (base & (1 << i)) mask |= 1 << ((i + rotation) % 4)
  }
  return mask
}

export function canRotate(type: PipeType, locked?: boolean): boolean {
  return !locked && type !== 'empty' && type !== 'block'
}

export function isRotationCorrect(
  type: PipeType,
  current: number,
  correct: number
): boolean {
  if (type === 'straight') return current % 2 === correct % 2
  return current === correct
}

export function cloneCells(cells: PipeCellState[][]): PipeCellState[][] {
  return cells.map((row) => row.map((c) => ({ ...c })))
}

function cellKey(r: number, c: number) {
  return `${r},${c}`
}

export function getConnectedPath(
  cells: PipeCellState[][],
  source: CellPosition,
  target: CellPosition
): CellPosition[] | null {
  const rows = cells.length
  const cols = cells[0].length
  const maskAt = (r: number, c: number) => getMask(cells[r][c].type, cells[r][c].rotation)

  if (!(maskAt(source.row, source.col) & 8)) return null
  if (!(maskAt(target.row, target.col) & 2)) return null

  const queue: CellPosition[] = [{ row: source.row, col: source.col }]
  const parent = new Map<string, string | null>()
  parent.set(cellKey(source.row, source.col), null)

  while (queue.length > 0) {
    const cur = queue.shift()!
    if (cur.row === target.row && cur.col === target.col) {
      const path: CellPosition[] = []
      let k: string | null = cellKey(cur.row, cur.col)
      while (k) {
        const [r, c] = k.split(',').map(Number)
        path.unshift({ row: r, col: c })
        k = parent.get(k) ?? null
      }
      return path
    }

    const mask = maskAt(cur.row, cur.col)
    for (let d = 0; d < 4; d++) {
      if (!(mask & (1 << d))) continue
      const nr = cur.row + DR[d]
      const nc = cur.col + DC[d]
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      const neighbor = cells[nr][nc]
      if (neighbor.type === 'empty' || neighbor.type === 'block') continue
      const nMask = maskAt(nr, nc)
      if (!(nMask & (1 << OPP[d]))) continue
      const nk = cellKey(nr, nc)
      if (!parent.has(nk)) {
        parent.set(nk, cellKey(cur.row, cur.col))
        queue.push({ row: nr, col: nc })
      }
    }
  }
  return null
}

export function checkSolved(
  cells: PipeCellState[][],
  source: CellPosition,
  target: CellPosition
): boolean {
  return getConnectedPath(cells, source, target) !== null
}

export function checkFullySolved(
  cells: PipeCellState[][],
  solved: SolvedCellDef[][],
  source: CellPosition,
  target: CellPosition
): boolean {
  const solutionPath = getConnectedPath(
    solved.map((row) => row.map((c) => ({ type: c.type, rotation: c.correctRotation }))),
    source,
    target
  )
  if (!solutionPath) return false
  if (!checkSolved(cells, source, target)) return false

  for (const pos of solutionPath) {
    const cell = cells[pos.row][pos.col]
    const def = solved[pos.row][pos.col]
    if (!isRotationCorrect(cell.type, cell.rotation, def.correctRotation)) {
      return false
    }
  }
  return true
}

export function scrambleSolvedLevel(
  solved: SolvedCellDef[][],
  offsets?: number[][]
): PipeCellState[][] {
  return solved.map((row, ri) =>
    row.map((cell, ci) => {
      if (cell.type === 'empty' || cell.type === 'block' || cell.locked) {
        return { type: cell.type, rotation: cell.rotation }
      }

      const offset = offsets?.[ri]?.[ci] ?? pickScrambleOffset(cell)
      const rotation = (cell.correctRotation + offset) % 4

      return { type: cell.type, rotation }
    })
  )
}

function pickScrambleOffset(cell: SolvedCellDef): number {
  const options = [1, 2, 3]
  for (const offset of options) {
    const rotation = (cell.correctRotation + offset) % 4
    if (!isRotationCorrect(cell.type, rotation, cell.correctRotation)) {
      return offset
    }
  }
  return 1
}

export function validateLevelDefinition(
  solved: SolvedCellDef[][],
  initial: PipeCellState[][],
  source: CellPosition,
  target: CellPosition
): { ok: boolean; errors: string[] } {
  const errors: string[] = []
  const solvedState = solved.map((row) =>
    row.map((c) => ({ type: c.type, rotation: c.correctRotation }))
  )

  if (!checkSolved(solvedState, source, target)) {
    errors.push('Solved layout has no valid path from source to target')
  }

  if (checkFullySolved(initial, solved, source, target)) {
    errors.push('Initial layout is already solved')
  }

  if (!getConnectedPath(solvedState, source, target)) {
    errors.push('Solved path reconstruction failed')
  }

  return { ok: errors.length === 0, errors }
}

export function findHintCell(
  cells: PipeCellState[][],
  solved: SolvedCellDef[][],
  source: CellPosition,
  target: CellPosition
): CellPosition | null {
  const path = getConnectedPath(
    solved.map((row) => row.map((c) => ({ type: c.type, rotation: c.correctRotation }))),
    source,
    target
  )
  if (!path) return null

  for (const pos of path) {
    const cell = cells[pos.row][pos.col]
    const def = solved[pos.row][pos.col]
    if (def.locked || def.type === 'empty' || def.type === 'block') continue
    if (!isRotationCorrect(cell.type, cell.rotation, def.correctRotation)) {
      return pos
    }
  }

  return null
}
