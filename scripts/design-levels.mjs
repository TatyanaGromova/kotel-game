const BASE_MASKS = { straight: 5, corner: 3, tee: 7, cross: 15, empty: 0, block: 0 }
const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1], OPP = [2, 3, 0, 1]

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

const P = (t, r) => ({ type: t, rotation: r })
const X = () => ({ type: 'empty', rotation: 0 })
const B = () => ({ type: 'block', rotation: 0 })

function test(name, solved, source, target) {
  const path = getPath(solved, source, target)
  const pipes = solved.flat().filter((c) => c.type !== 'empty' && c.type !== 'block').length
  console.log(`${name}: path=${path?.length ?? 'FAIL'} pipes=${pipes} ${path ? path.map((p) => `${p.row},${p.col}`).join('->') : ''}`)
  return path
}

// L1: 5 cells + 2 decoys
test('L1', [
  [X(), P('corner', 2), X(), X()],
  [P('straight', 1), P('straight', 1), P('corner', 1), X()],
  [X(), X(), P('corner', 0), P('straight', 1)],
  [P('straight', 0), X(), X(), X()],
], { row: 1, col: 0 }, { row: 2, col: 3 })

// L2: 8 cells
test('L2', [
  [X(), P('tee', 0), P('straight', 2), P('corner', 0)],
  [P('straight', 1), P('corner', 2), P('straight', 1), P('corner', 0)],
  [P('corner', 0), P('corner', 0), P('corner', 1), X()],
  [X(), P('straight', 0), P('corner', 0), P('straight', 1)],
], { row: 1, col: 0 }, { row: 3, col: 3 })

// L2b longer 8 path via top
test('L2b', [
  [X(), P('corner', 1), P('straight', 1), X()],
  [P('straight', 1), P('corner', 0), P('straight', 1), P('corner', 1)],
  [P('corner', 0), P('straight', 0), P('corner', 1), X()],
  [X(), P('straight', 0), P('corner', 0), P('straight', 1)],
], { row: 1, col: 0 }, { row: 3, col: 3 })

// L3: 2 blocks, path around
test('L3', [
  [X(), X(), X(), X(), X()],
  [X(), P('corner', 1), P('straight', 1), P('tee', 1), X()],
  [P('straight', 1), P('corner', 3), B(), B(), P('straight', 1)],
  [X(), P('straight', 0), P('corner', 0), P('straight', 1), P('corner', 0)],
  [X(), X(), P('corner', 2), X(), X()],
], { row: 2, col: 0 }, { row: 2, col: 4 })

// L3b blocks at 2,2 and 3,2 - path goes top
test('L3b', [
  [X(), X(), X(), X(), X()],
  [X(), P('corner', 1), P('straight', 1), P('corner', 1), X()],
  [P('straight', 1), P('corner', 3), B(), P('corner', 0), P('straight', 1)],
  [X(), P('straight', 0), B(), P('straight', 1), P('corner', 0)],
  [X(), X(), P('corner', 2), X(), X()],
], { row: 2, col: 0 }, { row: 2, col: 4 })

// L4 winding 12 cells
test('L4', [
  [X(), P('tee', 2), P('corner', 0), X(), X()],
  [P('corner', 2), X(), P('straight', 0), P('corner', 1), X()],
  [P('straight', 1), P('corner', 3), P('tee', 1), P('corner', 0), P('straight', 0)],
  [X(), P('straight', 0), P('corner', 2), X(), P('corner', 1)],
  [X(), P('straight', 0), P('corner', 0), P('straight', 0), P('straight', 1)],
], { row: 2, col: 0 }, { row: 4, col: 4 })

// L5 6x6
test('L5', [
  [X(), X(), X(), X(), X(), X()],
  [X(), P('corner', 1), P('straight', 1), P('corner', 1), X(), X()],
  [P('straight', 1), P('corner', 3), P('straight', 1), P('tee', 1), B(), P('corner', 0)],
  [X(), P('straight', 0), B(), P('corner', 2), P('straight', 0), P('corner', 1)],
  [X(), P('corner', 0), P('straight', 1), P('corner', 1), P('tee', 2), P('straight', 0)],
  [X(), X(), P('corner', 2), P('straight', 1), P('corner', 0), P('straight', 1)],
], { row: 2, col: 0 }, { row: 5, col: 5 })
