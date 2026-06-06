const BASE_MASKS = { straight: 5, corner: 3, tee: 7, cross: 15, empty: 0, block: 0 }
const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1], OPP = [2, 3, 0, 1]
const DNAME = ['N', 'E', 'S', 'W']

function getMask(type, rotation) {
  if (type === 'empty' || type === 'block') return 0
  let mask = 0
  const base = BASE_MASKS[type]
  for (let i = 0; i < 4; i++) if (base & (1 << i)) mask |= 1 << ((i + rotation) % 4)
  return mask
}

function getPath(cells, source, target) {
  const rows = cells.length, cols = cells[0].length
  const maskAt = (r, c) => getMask(cells[r][c].type, cells[r][c].rotation)
  if (!(maskAt(source.row, source.col) & 8)) return null
  if (!(maskAt(target.row, target.col) & 2)) return null
  const key = (r, c) => `${r},${c}`
  const q = [{ row: source.row, col: source.col }]
  const parent = new Map([[key(source.row, source.col), null]])
  while (q.length) {
    const cur = q.shift()
    if (cur.row === target.row && cur.col === target.col) {
      const path = []
      let k = key(cur.row, cur.col)
      while (k) { const [r, c] = k.split(',').map(Number); path.unshift({ row: r, col: c }); k = parent.get(k) }
      return path
    }
    const mask = maskAt(cur.row, cur.col)
    for (let d = 0; d < 4; d++) {
      if (!(mask & (1 << d))) continue
      const nr = cur.row + DR[d], nc = cur.col + DC[d]
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      const n = cells[nr][nc]
      if (n.type === 'empty' || n.type === 'block') continue
      if (!(maskAt(nr, nc) & (1 << OPP[d]))) continue
      const nk = key(nr, nc)
      if (!parent.has(nk)) { parent.set(nk, key(cur.row, cur.col)); q.push({ row: nr, col: nc }) }
    }
  }
  return null
}

function dirFromTo(a, b) {
  if (b.row < a.row) return 0
  if (b.col > a.col) return 1
  if (b.row > a.row) return 2
  return 3
}

const CORNER_ROT = { '0,1': 0, '1,2': 1, '2,3': 2, '0,3': 3 }
const STRAIGHT_ROT = { '0,2': 0, '1,3': 1 }

function pipeForConnections(connSet) {
  const key = [...connSet].sort().join(',')
  const count = connSet.size
  if (count === 2) {
    if (CORNER_ROT[key] !== undefined) return { type: 'corner', rotation: CORNER_ROT[key] }
    if (STRAIGHT_ROT[key] !== undefined) return { type: 'straight', rotation: STRAIGHT_ROT[key] }
  }
  if (count === 3) {
    for (let rot = 0; rot < 4; rot++) {
      let mask = 0
      const base = BASE_MASKS.tee
      for (let i = 0; i < 4; i++) if (base & (1 << i)) mask |= 1 << ((i + rot) % 4)
      const bits = []
      for (let i = 0; i < 4; i++) if (mask & (1 << i)) bits.push(i)
      if (bits.sort().join(',') === key) return { type: 'tee', rotation: rot }
    }
  }
  if (count === 4) return { type: 'cross', rotation: 0 }
  return null
}

function buildFromPath(rows, cols, pathCoords, decoys = [], blocks = []) {
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ type: 'empty', rotation: 0, correctRotation: 0, isPath: false }))
  )

  for (const { row, col } of blocks) {
    grid[row][col] = { type: 'block', rotation: 0, correctRotation: 0, locked: true }
  }

  const pathSet = new Set(pathCoords.map((p) => `${p.row},${p.col}`))

  for (let i = 0; i < pathCoords.length; i++) {
    const { row, col } = pathCoords[i]
    const conn = new Set()
    if (i === 0) conn.add(3)
    if (i === pathCoords.length - 1) conn.add(1)
    if (i > 0) conn.add(dirFromTo(pathCoords[i], pathCoords[i - 1]))
    if (i < pathCoords.length - 1) conn.add(dirFromTo(pathCoords[i], pathCoords[i + 1]))
    const pipe = pipeForConnections(conn)
    if (!pipe) throw new Error(`Cannot build pipe at ${row},${col} conn=${[...conn]}`)
    grid[row][col] = { ...pipe, correctRotation: pipe.rotation, isPath: true }
  }

  for (const d of decoys) {
    if (!grid[d.row][d.col] || grid[d.row][d.col].type === 'empty') {
      grid[d.row][d.col] = { type: d.type, rotation: d.rotation, correctRotation: d.rotation, isPath: false }
    }
  }

  return grid
}

const LEVEL_PATHS = {
  1: {
    rows: 4, cols: 4,
    source: { row: 1, col: 0 }, target: { row: 2, col: 3 },
    path: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }],
    decoys: [
      { row: 0, col: 1, type: 'corner', rotation: 2 },
      { row: 1, col: 2, type: 'straight', rotation: 0 },
      { row: 3, col: 0, type: 'straight', rotation: 2 },
    ],
    blocks: [],
  },
  2: {
    rows: 4, cols: 4,
    source: { row: 1, col: 0 }, target: { row: 3, col: 3 },
    path: [
      { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 0, col: 1 }, { row: 0, col: 2 },
      { row: 1, col: 2 }, { row: 2, col: 2 }, { row: 3, col: 2 }, { row: 3, col: 3 },
    ],
    decoys: [
      { row: 0, col: 3, type: 'corner', rotation: 1 },
      { row: 2, col: 0, type: 'tee', rotation: 0 },
      { row: 2, col: 1, type: 'straight', rotation: 1 },
      { row: 1, col: 3, type: 'corner', rotation: 3 },
    ],
    blocks: [],
  },
  3: {
    rows: 5, cols: 5,
    source: { row: 2, col: 0 }, target: { row: 2, col: 4 },
    path: [
      { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 1, col: 1 }, { row: 0, col: 1 },
      { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 2, col: 4 },
    ],
    decoys: [
      { row: 2, col: 2, type: 'straight', rotation: 0 },
      { row: 3, col: 1, type: 'corner', rotation: 1 },
      { row: 2, col: 3, type: 'tee', rotation: 2 },
    ],
    blocks: [{ row: 2, col: 2 }, { row: 3, col: 2 }],
  },
  4: {
    rows: 5, cols: 5,
    source: { row: 2, col: 0 }, target: { row: 4, col: 4 },
    path: [
      { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 1, col: 1 }, { row: 1, col: 2 },
      { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 1, col: 3 }, { row: 2, col: 3 },
      { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 4, col: 4 },
    ],
    decoys: [
      { row: 2, col: 2, type: 'tee', rotation: 1 },
      { row: 3, col: 1, type: 'corner', rotation: 2 },
      { row: 4, col: 1, type: 'straight', rotation: 0 },
      { row: 0, col: 1, type: 'corner', rotation: 3 },
      { row: 1, col: 0, type: 'straight', rotation: 1 },
    ],
    blocks: [],
  },
  5: {
    rows: 6, cols: 6,
    source: { row: 2, col: 0 }, target: { row: 5, col: 5 },
    path: [
      { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 1, col: 1 }, { row: 1, col: 2 },
      { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 2, col: 4 }, { row: 3, col: 4 },
      { row: 4, col: 4 }, { row: 4, col: 3 }, { row: 4, col: 2 }, { row: 3, col: 2 },
      { row: 3, col: 1 }, { row: 4, col: 1 }, { row: 5, col: 1 }, { row: 5, col: 2 },
      { row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 },
    ],
    decoys: [
      { row: 0, col: 2, type: 'tee', rotation: 2 },
      { row: 2, col: 2, type: 'corner', rotation: 1 },
      { row: 3, col: 0, type: 'straight', rotation: 0 },
      { row: 5, col: 0, type: 'corner', rotation: 0 },
      { row: 0, col: 4, type: 'straight', rotation: 2 },
    ],
    blocks: [{ row: 2, col: 3 }, { row: 4, col: 0 }],
  },
}

function scrambleGrid(grid, seed = 1) {
  return grid.map((row, ri) =>
    row.map((cell, ci) => {
      if (cell.type === 'empty' || cell.type === 'block') return { type: cell.type, rotation: cell.rotation }
      const offset = ((ri * 3 + ci * 2 + seed) % 3) + 1
      return { type: cell.type, rotation: (cell.correctRotation + offset) % 4 }
    })
  )
}

function gridToTs(grid) {
  return grid
    .map((row) => {
      const cells = row.map((c) => {
        if (c.type === 'empty') return 'X()'
        if (c.type === 'block') return 'B()'
        const path = c.isPath ? ', true' : ''
        return `P('${c.type}', ${c.correctRotation}${path})`
      })
      return `      [${cells.join(', ')}]`
    })
    .join(',\n')
}

const built = {}

for (const [id, spec] of Object.entries(LEVEL_PATHS)) {
  try {
    const grid = buildFromPath(spec.rows, spec.cols, spec.path, spec.decoys, spec.blocks)
    const playable = grid.map((row) => row.map((c) => ({ type: c.type, rotation: c.correctRotation })))
    const path = getPath(playable, spec.source, spec.target)
    const pipes = grid.flat().filter((c) => c.type !== 'empty' && c.type !== 'block').length
    console.log(`L${id}: path=${path?.length} expected=${spec.path.length} pipes=${pipes} blocks=${spec.blocks.length} ${path ? 'OK' : 'FAIL'}`)
    if (path) {
      built[id] = { grid, spec, playable }
      grid.forEach((row, ri) => {
        const line = row.map((c) => {
          if (c.type === 'empty') return '..'
          if (c.type === 'block') return '##'
          const ch = { straight: 'I', corner: 'L', tee: 'T', cross: '+' }[c.type]
          return c.isPath ? ch : ch.toLowerCase()
        }).join(' ')
        console.log(' ', line)
      })
    }
  } catch (e) {
    console.log(`L${id}: ERROR`, e.message)
  }
}

function isRotationCorrect(type, current, correct) {
  if (type === 'straight') return current % 2 === correct % 2
  return current === correct
}

function checkFullySolved(cells, solved, source, target) {
  const solutionPath = getPath(
    solved.map((row) => row.map((c) => ({ type: c.type, rotation: c.correctRotation }))),
    source,
    target
  )
  if (!solutionPath) return false
  if (!getPath(cells, source, target)) return false
  for (const pos of solutionPath) {
    const cell = cells[pos.row][pos.col]
    const def = solved[pos.row][pos.col]
    if (!isRotationCorrect(cell.type, cell.rotation, def.correctRotation)) return false
  }
  return true
}

function makeOffsets(grid, id) {
  return grid.map((row, ri) =>
    row.map((cell, ci) => {
      if (cell.type === 'empty' || cell.type === 'block') return 0
      return ((ri * 2 + ci * 3 + id * 5) % 3) + 1
    })
  )
}

function applyOffsets(grid, offsets) {
  return grid.map((row, ri) =>
    row.map((cell, ci) => {
      if (cell.type === 'empty' || cell.type === 'block') return { type: cell.type, rotation: cell.rotation }
      return { type: cell.type, rotation: (cell.correctRotation + offsets[ri][ci]) % 4 }
    })
  )
}

console.log('\n--- OFFSETS ---')
for (const [id, { grid, spec }] of Object.entries(built)) {
  const offsets = makeOffsets(grid, Number(id))
  const initial = applyOffsets(grid, offsets)
  const ok = !checkFullySolved(initial, grid, spec.source, spec.target)
  console.log(`L${id} initialNotSolved=${ok}`)
  console.log(JSON.stringify(offsets))
}
