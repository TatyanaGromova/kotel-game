const BASE_MASKS = { straight: 5, corner: 3, tee: 7, cross: 15, empty: 0, block: 0 }
const DR = [-1, 0, 1, 0]
const DC = [0, 1, 0, -1]
const OPP = [2, 3, 0, 1]

function getMask(type, rotation) {
  if (type === 'empty' || type === 'block') return 0
  const base = BASE_MASKS[type]
  let mask = 0
  for (let i = 0; i < 4; i++) if (base & (1 << i)) mask |= 1 << ((i + rotation) % 4)
  return mask
}

function findHeatPath(cells, entry, exit) {
  const rows = cells.length
  const cols = cells[0].length
  const maskAt = (r, c) => getMask(cells[r][c].type, cells[r][c].rotation)
  if (!(maskAt(entry.row, entry.col) & 8)) return null
  if (!(maskAt(exit.row, exit.col) & 2)) return null
  const key = (r, c) => `${r},${c}`
  const queue = [{ row: entry.row, col: entry.col }]
  const parent = new Map([[key(entry.row, entry.col), null]])
  while (queue.length) {
    const cur = queue.shift()
    if (cur.row === exit.row && cur.col === exit.col) {
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
      const neighbor = cells[nr][nc]
      if (neighbor.type === 'empty' || neighbor.type === 'block') continue
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

function solveLevel(cells, entry, exit) {
  const work = cells.map((row) => row.map((c) => ({ ...c })))
  const rotatable = []
  for (let r = 0; r < work.length; r++)
    for (let c = 0; c < work[0].length; c++)
      if (work[r][c].type !== 'empty' && work[r][c].type !== 'block') rotatable.push([r, c])

  function dfs(i) {
    if (i === rotatable.length) return findHeatPath(work, entry, exit)
    const [r, c] = rotatable[i]
    for (let rot = 0; rot < 4; rot++) {
      work[r][c].rotation = rot
      const path = dfs(i + 1)
      if (path) return path
    }
    return null
  }
  return dfs(0)
}

const levels = [
  { id: 1, entry: { row: 1, col: 0 }, exit: { row: 1, col: 3 }, cells: [
    [['empty',0],['empty',0],['empty',0],['empty',0]],
    [['straight',2],['straight',0],['straight',3],['straight',1]],
    [['corner',0],['corner',2],['straight',2],['corner',1]],
    [['empty',0],['empty',0],['empty',0],['empty',0]],
  ]},
  { id: 2, entry: { row: 1, col: 0 }, exit: { row: 3, col: 3 }, cells: [
    [['empty',0],['tee',2],['straight',2],['empty',0]],
    [['straight',0],['straight',2],['corner',2],['corner',0]],
    [['empty',0],['corner',0],['straight',0],['straight',0]],
    [['empty',0],['empty',0],['corner',2],['straight',0]],
  ]},
  { id: 3, entry: { row: 2, col: 0 }, exit: { row: 2, col: 4 }, cells: [
    [['empty',0],['empty',0],['empty',0],['empty',0],['empty',0]],
    [['empty',0],['corner',0],['straight',0],['corner',1],['empty',0]],
    [['straight',0],['corner',2],['block',0],['corner',1],['straight',0]],
    [['empty',0],['empty',0],['empty',0],['empty',0],['empty',0]],
    [['empty',0],['empty',0],['empty',0],['empty',0],['empty',0]],
  ]},
  { id: 4, entry: { row: 2, col: 0 }, exit: { row: 2, col: 4 }, cells: [
    [['empty',0],['straight',2],['tee',0],['straight',0],['empty',0]],
    [['empty',0],['corner',1],['empty',0],['corner',2],['empty',0]],
    [['straight',0],['tee',1],['cross',0],['tee',2],['straight',1]],
    [['empty',0],['corner',0],['empty',0],['corner',3],['empty',0]],
    [['empty',0],['straight',2],['tee',3],['straight',0],['empty',0]],
  ]},
  { id: 5, entry: { row: 2, col: 0 }, exit: { row: 2, col: 4 }, cells: [
    [['empty',0],['corner',1],['straight',2],['corner',0],['empty',0]],
    [['corner',2],['tee',0],['straight',0],['corner',1],['empty',0]],
    [['straight',0],['corner',3],['cross',1],['tee',1],['straight',1]],
    [['empty',0],['corner',0],['straight',2],['corner',2],['corner',1]],
    [['empty',0],['empty',0],['straight',0],['straight',2],['empty',0]],
  ]},
]

for (const lvl of levels) {
  const grid = lvl.cells.map((row) => row.map(([type, rotation]) => ({ type, rotation })))
  const initial = findHeatPath(grid, lvl.entry, lvl.exit)
  const solution = solveLevel(grid, lvl.entry, lvl.exit)
  console.log(`Level ${lvl.id}: initialSolved=${!!initial} solvable=${!!solution} pathLen=${solution?.length ?? 0}`)
}
