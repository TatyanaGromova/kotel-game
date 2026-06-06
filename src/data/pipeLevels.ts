import {
  type CellPosition,
  type PipeCellState,
  type SolvedCellDef,
  scrambleSolvedLevel,
  validateLevelDefinition,
} from './pipeLogic'

export interface PipeLevelConfig {
  id: number
  title: string
  description: string
  reward: number
  gridSize: 4 | 5 | 6
  timeLimit?: number
  maxMoves?: number
  source: CellPosition
  target: CellPosition
  solvedCells: SolvedCellDef[][]
  initialCells: PipeCellState[][]
}

const X = (): SolvedCellDef => ({ type: 'empty', rotation: 0, correctRotation: 0 })
const B = (): SolvedCellDef => ({ type: 'block', rotation: 0, correctRotation: 0, locked: true })
const P = (type: SolvedCellDef['type'], correctRotation: number, isPath = false): SolvedCellDef => ({
  type,
  rotation: correctRotation,
  correctRotation,
  isPath,
})

const LEVEL_1_SOLVED: SolvedCellDef[][] = [
  [X(), P('corner', 2), X(), X()],
  [P('straight', 1, true), P('corner', 2, true), P('straight', 0), X()],
  [X(), P('corner', 0, true), P('straight', 1, true), P('straight', 1, true)],
  [P('straight', 2), X(), X(), X()],
]

const LEVEL_2_SOLVED: SolvedCellDef[][] = [
  [X(), P('corner', 1, true), P('corner', 2, true), P('corner', 1)],
  [P('straight', 1, true), P('corner', 3, true), P('straight', 0, true), P('corner', 3)],
  [P('tee', 0), P('straight', 1), P('straight', 0, true), X()],
  [X(), X(), P('corner', 0, true), P('straight', 1, true)],
]

const LEVEL_3_SOLVED: SolvedCellDef[][] = [
  [X(), P('corner', 1, true), P('corner', 2, true), X(), X()],
  [X(), P('straight', 0, true), P('corner', 0, true), P('straight', 1, true), P('corner', 2, true)],
  [P('straight', 1, true), P('corner', 3, true), B(), P('tee', 2), P('corner', 0, true)],
  [X(), P('corner', 1), B(), X(), X()],
  [X(), X(), X(), X(), X()],
]

const LEVEL_4_SOLVED: SolvedCellDef[][] = [
  [X(), P('corner', 3), P('corner', 1, true), P('corner', 2, true), X()],
  [P('straight', 1), P('corner', 1, true), P('corner', 3, true), P('straight', 0, true), X()],
  [P('straight', 1, true), P('corner', 3, true), P('tee', 1), P('straight', 0, true), X()],
  [X(), P('corner', 2), X(), P('corner', 0, true), P('corner', 2, true)],
  [X(), P('straight', 0), X(), X(), P('corner', 0, true)],
]

const LEVEL_5_SOLVED: SolvedCellDef[][] = [
  [X(), X(), P('tee', 2), X(), P('straight', 2), X()],
  [X(), P('corner', 1, true), P('straight', 1, true), P('straight', 1, true), P('corner', 2, true), X()],
  [P('straight', 1, true), P('corner', 3, true), P('corner', 1), B(), P('straight', 0, true), X()],
  [P('straight', 0), P('corner', 1, true), P('corner', 2, true), X(), P('straight', 0, true), X()],
  [B(), P('straight', 0, true), P('corner', 0, true), P('straight', 1, true), P('corner', 3, true), X()],
  [P('corner', 0), P('corner', 0, true), P('straight', 1, true), P('straight', 1, true), P('straight', 1, true), P('straight', 1, true)],
]

const LEVEL_1_INITIAL = scrambleSolvedLevel(LEVEL_1_SOLVED, [
  [0, 3, 0, 0],
  [2, 2, 2, 0],
  [0, 1, 1, 1],
  [3, 0, 0, 0],
])
const LEVEL_2_INITIAL = scrambleSolvedLevel(LEVEL_2_SOLVED, [
  [0, 2, 2, 2],
  [1, 1, 1, 1],
  [3, 3, 3, 0],
  [0, 0, 2, 2],
])
const LEVEL_3_INITIAL = scrambleSolvedLevel(LEVEL_3_SOLVED, [
  [0, 1, 1, 0, 0],
  [0, 3, 3, 3, 3],
  [2, 2, 0, 2, 2],
  [0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0],
])
const LEVEL_4_INITIAL = scrambleSolvedLevel(LEVEL_4_SOLVED, [
  [0, 3, 3, 3, 0],
  [2, 2, 2, 2, 0],
  [1, 1, 1, 1, 0],
  [0, 3, 0, 3, 3],
  [0, 2, 0, 0, 2],
])
const LEVEL_5_INITIAL = scrambleSolvedLevel(LEVEL_5_SOLVED, [
  [0, 0, 2, 0, 2, 0],
  [0, 1, 1, 1, 1, 0],
  [3, 3, 3, 0, 3, 0],
  [2, 2, 2, 0, 2, 0],
  [0, 1, 1, 1, 1, 0],
  [3, 3, 3, 3, 3, 3],
])

export const PIPE_LEVELS: PipeLevelConfig[] = [
  {
    id: 1,
    title: 'Первый контур',
    description: 'Первый изгиб — поверните трубы и найдите маршрут.',
    reward: 300,
    gridSize: 4,
    source: { row: 1, col: 0 },
    target: { row: 2, col: 3 },
    solvedCells: LEVEL_1_SOLVED,
    initialCells: LEVEL_1_INITIAL,
  },
  {
    id: 2,
    title: 'Повороты тепла',
    description: 'Длинный маршрут с углами и ложными направлениями.',
    reward: 300,
    gridSize: 4,
    source: { row: 1, col: 0 },
    target: { row: 3, col: 3 },
    solvedCells: LEVEL_2_SOLVED,
    initialCells: LEVEL_2_INITIAL,
  },
  {
    id: 3,
    title: 'Засор на линии',
    description: 'Два засора и обход сверху — ложная ветка в тупик.',
    reward: 300,
    gridSize: 5,
    source: { row: 2, col: 0 },
    target: { row: 2, col: 4 },
    solvedCells: LEVEL_3_SOLVED,
    initialCells: LEVEL_3_INITIAL,
  },
  {
    id: 4,
    title: 'Ложный маршрут',
    description: 'Длинный обход и лишние трубы — не больше 28 ходов.',
    reward: 500,
    gridSize: 5,
    maxMoves: 28,
    source: { row: 2, col: 0 },
    target: { row: 4, col: 4 },
    solvedCells: LEVEL_4_SOLVED,
    initialCells: LEVEL_4_INITIAL,
  },
  {
    id: 5,
    title: 'Финальный запуск',
    description: 'Большое поле, засоры и таймер 60 секунд — до 42 ходов.',
    reward: 600,
    gridSize: 6,
    timeLimit: 60,
    maxMoves: 42,
    source: { row: 2, col: 0 },
    target: { row: 5, col: 5 },
    solvedCells: LEVEL_5_SOLVED,
    initialCells: LEVEL_5_INITIAL,
  },
]

if (import.meta.env.DEV) {
  for (const level of PIPE_LEVELS) {
    const result = validateLevelDefinition(
      level.solvedCells,
      level.initialCells,
      level.source,
      level.target
    )
    if (!result.ok) {
      console.error(`Pipe level ${level.id} validation failed:`, result.errors)
    }
  }
}

export function getPipeLevel(id: number): PipeLevelConfig {
  const level = PIPE_LEVELS.find((l) => l.id === id)
  if (!level) throw new Error(`Unknown pipe level ${id}`)
  return level
}
