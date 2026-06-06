export type PipeType = 'straight' | 'corner' | 'tee' | 'cross' | 'empty' | 'block'

export interface GridCell {
  type: PipeType
  rotation: number
}

export interface PipeLevelDef {
  id: number
  gridSize: 4 | 5
  cells: GridCell[][]
  entry: { row: number; col: number }
  exit: { row: number; col: number }
  timerSec?: number
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

export function canRotate(type: PipeType): boolean {
  return type !== 'empty' && type !== 'block'
}

export function cloneGrid(cells: GridCell[][]): GridCell[][] {
  return cells.map((row) => row.map((c) => ({ ...c })))
}

export interface Point {
  row: number
  col: number
}

function key(r: number, c: number) {
  return `${r},${c}`
}

export function findHeatPath(cells: GridCell[][], entry: Point, exit: Point): Point[] | null {
  const rows = cells.length
  const cols = cells[0].length
  const maskAt = (r: number, c: number) => getMask(cells[r][c].type, cells[r][c].rotation)

  if (!(maskAt(entry.row, entry.col) & 8)) return null
  if (!(maskAt(exit.row, exit.col) & 2)) return null

  const queue: Point[] = [{ row: entry.row, col: entry.col }]
  const parent = new Map<string, string | null>()
  parent.set(key(entry.row, entry.col), null)

  while (queue.length > 0) {
    const cur = queue.shift()!
    if (cur.row === exit.row && cur.col === exit.col) {
      const path: Point[] = []
      let k: string | null = key(cur.row, cur.col)
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
      const nk = key(nr, nc)
      if (!parent.has(nk)) {
        parent.set(nk, key(cur.row, cur.col))
        queue.push({ row: nr, col: nc })
      }
    }
  }
  return null
}

export function findReachable(cells: GridCell[][], entry: Point): Set<string> {
  const rows = cells.length
  const cols = cells[0].length
  const maskAt = (r: number, c: number) => getMask(cells[r][c].type, cells[r][c].rotation)
  const reached = new Set<string>()
  const queue: Point[] = []

  if (!(maskAt(entry.row, entry.col) & 8)) return reached

  queue.push({ row: entry.row, col: entry.col })
  reached.add(key(entry.row, entry.col))

  while (queue.length > 0) {
    const cur = queue.shift()!
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
      const nk = key(nr, nc)
      if (!reached.has(nk)) {
        reached.add(nk)
        queue.push({ row: nr, col: nc })
      }
    }
  }
  return reached
}

const E = (t: PipeType, r: number): GridCell => ({ type: t, rotation: r })
const X = (): GridCell => ({ type: 'empty', rotation: 0 })
const B = (): GridCell => ({ type: 'block', rotation: 0 })

export const PIPE_LEVELS: PipeLevelDef[] = [
  {
    id: 1,
    gridSize: 4,
    entry: { row: 1, col: 0 },
    exit: { row: 1, col: 3 },
    cells: [
      [X(), X(), X(), X()],
      [E('straight', 2), E('straight', 0), E('straight', 3), E('straight', 1)],
      [E('corner', 0), E('corner', 2), E('straight', 2), E('corner', 1)],
      [X(), X(), X(), X()],
    ],
  },
  {
    id: 2,
    gridSize: 4,
    entry: { row: 1, col: 0 },
    exit: { row: 3, col: 3 },
    cells: [
      [X(), E('tee', 2), E('straight', 2), X()],
      [E('straight', 0), E('straight', 2), E('corner', 2), E('corner', 0)],
      [X(), E('corner', 0), E('straight', 0), E('straight', 0)],
      [X(), X(), E('corner', 2), E('straight', 0)],
    ],
  },
  {
    id: 3,
    gridSize: 5,
    entry: { row: 2, col: 0 },
    exit: { row: 2, col: 4 },
    cells: [
      [X(), X(), X(), X(), X()],
      [X(), E('corner', 0), E('straight', 0), E('corner', 1), X()],
      [E('straight', 0), E('corner', 2), B(), E('corner', 1), E('straight', 0)],
      [X(), X(), X(), X(), X()],
      [X(), X(), X(), X(), X()],
    ],
  },
  {
    id: 4,
    gridSize: 5,
    entry: { row: 2, col: 0 },
    exit: { row: 2, col: 4 },
    cells: [
      [X(), E('straight', 2), E('tee', 0), E('straight', 0), X()],
      [X(), E('corner', 1), X(), E('corner', 2), X()],
      [E('straight', 0), E('tee', 1), E('cross', 0), E('tee', 2), E('straight', 1)],
      [X(), E('corner', 0), X(), E('corner', 3), X()],
      [X(), E('straight', 2), E('tee', 3), E('straight', 0), X()],
    ],
  },
  {
    id: 5,
    gridSize: 5,
    entry: { row: 2, col: 0 },
    exit: { row: 2, col: 4 },
    timerSec: 60,
    cells: [
      [X(), E('corner', 1), E('straight', 2), E('corner', 0), X()],
      [E('corner', 2), E('tee', 0), E('straight', 0), E('corner', 1), X()],
      [E('straight', 0), E('corner', 3), E('cross', 1), E('tee', 1), E('straight', 1)],
      [X(), E('corner', 0), E('straight', 2), E('corner', 2), E('corner', 1)],
      [X(), X(), E('straight', 0), E('straight', 2), X()],
    ],
  },
]

export function getPipeLevel(id: number): PipeLevelDef {
  const level = PIPE_LEVELS.find((l) => l.id === id)
  if (!level) throw new Error(`Unknown pipe level ${id}`)
  return level
}
