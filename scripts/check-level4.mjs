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

const P = (type, r, isPath = false) => ({ type, rotation: r, correctRotation: r, isPath })
const X = () => ({ type: 'empty', rotation: 0, correctRotation: 0 })

const LEVEL_4_SOLVED = [
  [X(), P('tee', 2), P('corner', 0), X(), X()],
  [P('corner', 2), X(), P('straight', 0), P('corner', 1), X()],
  [P('straight', 1, true), P('straight', 1, true), P('cross', 0, true), P('straight', 1, true), P('straight', 1, true)],
  [P('corner', 0), X(), P('tee', 3), X(), P('corner', 3)],
  [X(), P('straight', 2), P('corner', 1), X(), X()],
]

const offsets = [
  [0, 0, 1, 0, 0],
  [1, 0, 2, 0, 0],
  [0, 2, 1, 0, 2],
  [2, 0, 0, 0, 1],
  [0, 0, 2, 0, 0],
]

function scramble(solved, offsets) {
  let i = 0
  const flat = offsets.flat()
  return solved.map((row) =>
    row.map((cell) => {
      if (cell.type === 'empty') return { type: cell.type, rotation: cell.rotation }
      const rotation = (cell.correctRotation + flat[i++]) % 4
      return { type: cell.type, rotation }
    })
  )
}

const source = { row: 2, col: 0 }
const target = { row: 2, col: 4 }

const solvedState = LEVEL_4_SOLVED.map((row) =>
  row.map((c) => ({ type: c.type, rotation: c.correctRotation }))
)
const initial = scramble(LEVEL_4_SOLVED, offsets)

console.log('=== Level 4 analysis ===')
const solvedPath = getConnectedPath(solvedState, source, target)
console.log('Solved path:', solvedPath?.map((p) => `${p.row},${p.col}`).join(' -> '))
console.log('Solved path length:', solvedPath?.length)
console.log('Initial has path:', !!getConnectedPath(initial, source, target))
console.log('Initial fully solved:', checkFullySolved(initial, LEVEL_4_SOLVED, source, target))
console.log('Solved state fully solved:', checkFullySolved(solvedState, LEVEL_4_SOLVED, source, target))

// Path cells and required rotations
console.log('\nPath cells (from solved BFS):')
solvedPath?.forEach((p) => {
  const def = LEVEL_4_SOLVED[p.row][p.col]
  const init = initial[p.row][p.col]
  console.log(
    `  (${p.row},${p.col}) ${def.type} correct=${def.correctRotation} initial=${init.rotation} needRotations=${(def.correctRotation - init.rotation + 4) % 4}`
  )
})

// Brute force: can we reach fully solved from initial by only rotating?
const rotatable = []
for (let r = 0; r < 5; r++)
  for (let c = 0; c < 5; c++)
    if (LEVEL_4_SOLVED[r][c].type !== 'empty') rotatable.push([r, c])

const work = initial.map((row) => row.map((c) => ({ ...c })))
let found = 0
let example = null

function dfs(i) {
  if (i === rotatable.length) {
    if (checkFullySolved(work, LEVEL_4_SOLVED, source, target)) {
      found++
      if (!example) example = work.map((row) => row.map((c) => ({ ...c })))
    }
    return
  }
  const [r, c] = rotatable[i]
  const start = work[r][c].rotation
  for (let extra = 0; extra < 4; extra++) {
    work[r][c].rotation = (start + extra) % 4
    dfs(i + 1)
  }
}

dfs(0)
console.log('\nBrute force solutions from INITIAL:', found)
if (found === 0) console.log('PROBLEM: Level 4 initial cannot be fully solved!')

// Also brute force: is solved layout the ONLY way? Count solutions from initial
if (example) {
  console.log('\nExample solution path cells:')
  const exPath = getConnectedPath(example, source, target)
  exPath?.forEach((p) => {
    console.log(`  (${p.row},${p.col}) rot=${example[p.row][p.col].rotation}`)
  })
}
