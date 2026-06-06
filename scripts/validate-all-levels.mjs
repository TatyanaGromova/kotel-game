const BASE_MASKS = { straight: 5, corner: 3, tee: 7, cross: 15, empty: 0, block: 0 }
const DR = [-1, 0, 1, 0]
const DC = [0, 1, 0, -1]
const OPP = [2, 3, 0, 1]

function getMask(type, rotation) {
  if (type === 'empty' || type === 'block') return 0
  let mask = 0
  const base = BASE_MASKS[type]
  for (let i = 0; i < 4; i++) if (base & (1 << i)) mask |= 1 << ((i + rotation) % 4)
  return mask
}

function isRotationCorrect(type, current, correct) {
  if (type === 'straight') return current % 2 === correct % 2
  return current === correct
}

function getConnectedPath(cells, source, target) {
  const rows = cells.length
  const cols = cells[0].length
  const maskAt = (r, c) => getMask(cells[r][c].type, cells[r][c].rotation)
  if (!(maskAt(source.row, source.col) & 8)) return null
  if (!(maskAt(target.row, target.col) & 2)) return null
  const key = (r, c) => `${r},${c}`
  const queue = [{ row: source.row, col: source.col }]
  const parent = new Map([[key(source.row, source.col), null]])
  while (queue.length) {
    const cur = queue.shift()
    if (cur.row === target.row && cur.col === target.col) {
      const path = []
      let k = key(cur.row, cur.col)
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
      const n = cells[nr][nc]
      if (n.type === 'empty' || n.type === 'block') continue
      if (!(maskAt(nr, nc) & (1 << OPP[d]))) continue
      const nk = key(nr, nc)
      if (!parent.has(nk)) {
        parent.set(nk, key(cur.row, cur.col))
        queue.push({ row: nr, col: nc })
      }
    }
  }
  return null
}

function checkFullySolved(cells, solved, source, target) {
  const solutionPath = getConnectedPath(
    solved.map((row) => row.map((c) => ({ type: c.type, rotation: c.correctRotation }))),
    source,
    target
  )
  if (!solutionPath) return false
  if (!getConnectedPath(cells, source, target)) return false
  for (const pos of solutionPath) {
    const cell = cells[pos.row][pos.col]
    const def = solved[pos.row][pos.col]
    if (!isRotationCorrect(cell.type, cell.rotation, def.correctRotation)) return false
  }
  return true
}

function scramble(solved, offsets) {
  return solved.map((row, ri) =>
    row.map((cell, ci) => {
      if (cell.type === 'empty' || cell.type === 'block') {
        return { type: cell.type, rotation: cell.rotation }
      }
      const offset = offsets?.[ri]?.[ci] ?? 1
      return { type: cell.type, rotation: (cell.correctRotation + offset) % 4 }
    })
  )
}

const P = (type, r, isPath = false) => ({ type, rotation: r, correctRotation: r, isPath })
const X = () => ({ type: 'empty', rotation: 0, correctRotation: 0 })
const B = () => ({ type: 'block', rotation: 0, correctRotation: 0 })

const levels = [
  {
    id: 1,
    source: { row: 1, col: 0 },
    target: { row: 1, col: 3 },
    solved: [
      [X(), X(), X(), X()],
      [P('straight', 1, true), P('straight', 1, true), P('straight', 1, true), P('straight', 1, true)],
      [X(), X(), X(), X()],
      [X(), X(), X(), X()],
    ],
    offsets: [[0, 0, 0, 0], [0, 2, 3, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  },
  {
    id: 2,
    source: { row: 1, col: 0 },
    target: { row: 3, col: 3 },
    solved: [
      [X(), P('tee', 0), P('straight', 2), X()],
      [P('straight', 1, true), P('corner', 2, true), X(), P('corner', 0)],
      [X(), P('corner', 0, true), P('corner', 2, true), X()],
      [X(), X(), P('corner', 0, true), P('straight', 1, true)],
    ],
    offsets: [
      [0, 0, 0, 0],
      [0, 1, 0, 2],
      [0, 0, 2, 0],
      [0, 0, 0, 1],
    ],
  },
  {
    id: 3,
    source: { row: 2, col: 0 },
    target: { row: 2, col: 4 },
    solved: [
      [X(), X(), X(), X(), X()],
      [X(), P('corner', 1, true), P('straight', 1, true), P('tee', 1, true), X()],
      [P('straight', 1, true), P('corner', 3, true), B(), P('corner', 0, true), P('straight', 1, true)],
      [X(), X(), X(), X(), X()],
      [X(), X(), X(), X(), X()],
    ],
    offsets: [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: 4,
    source: { row: 2, col: 0 },
    target: { row: 2, col: 4 },
    solved: [
      [X(), P('tee', 2), P('corner', 0), X(), X()],
      [P('corner', 2), X(), P('straight', 0), P('corner', 1), X()],
      [P('straight', 1, true), P('straight', 1, true), P('cross', 0, true), P('straight', 1, true), P('straight', 1, true)],
      [P('corner', 0), X(), P('tee', 3), X(), P('corner', 3)],
      [X(), P('straight', 2), P('corner', 1), X(), X()],
    ],
    offsets: [
      [0, 0, 1, 0, 0],
      [1, 0, 2, 0, 0],
      [1, 2, 2, 1, 1],
      [2, 0, 0, 0, 1],
      [0, 0, 2, 0, 0],
    ],
  },
  {
    id: 5,
    source: { row: 2, col: 0 },
    target: { row: 2, col: 4 },
    solved: [
      [X(), P('corner', 1), P('tee', 0), P('straight', 2), X()],
      [P('corner', 2), P('corner', 1, true), P('straight', 1, true), P('tee', 1, true), P('corner', 0)],
      [P('straight', 1, true), P('corner', 3, true), B(), P('corner', 0, true), P('straight', 1, true)],
      [X(), P('corner', 0), P('straight', 2), P('corner', 2), P('tee', 1)],
      [X(), X(), P('straight', 0), X(), X()],
    ],
    offsets: [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 2],
      [1, 1, 0, 1, 1],
      [0, 2, 0, 1, 2],
      [0, 0, 1, 0, 0],
    ],
  },
]

for (const lvl of levels) {
  const solvedState = lvl.solved.map((row) => row.map((c) => ({ type: c.type, rotation: c.correctRotation })))
  const initial = scramble(lvl.solved, lvl.offsets)
  const solvedPath = getConnectedPath(solvedState, lvl.source, lvl.target)
  const initialFull = checkFullySolved(initial, lvl.solved, lvl.source, lvl.target)

  // Smart solve: only rotate path cells to correct rotation
  const path = getConnectedPath(solvedState, lvl.source, lvl.target)
  const testCells = initial.map((row) => row.map((c) => ({ ...c })))
  if (path) {
    for (const pos of path) {
      testCells[pos.row][pos.col].rotation = lvl.solved[pos.row][pos.col].correctRotation
    }
  }
  const pathOnlyFix = checkFullySolved(testCells, lvl.solved, lvl.source, lvl.target)

  console.log(
    `Level ${lvl.id}: solved=${!!solvedPath} initialFull=${initialFull} pathFixWorks=${pathOnlyFix}`
  )
  if (path) {
    const wrong = path.filter((p) => {
      const init = initial[p.row][p.col]
      const cor = lvl.solved[p.row][p.col].correctRotation
      return !isRotationCorrect(init.type, init.rotation, cor)
    })
    console.log(`  path cells to fix: ${wrong.length}/${path.length}`)
  }
}
