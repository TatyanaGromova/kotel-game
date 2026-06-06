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
  gridSize: 4 | 5
  timeLimit?: number
  source: CellPosition
  target: CellPosition
  solvedCells: SolvedCellDef[][]
  initialCells: PipeCellState[][]
}

const X = (): SolvedCellDef => ({
  type: 'empty',
  rotation: 0,
  correctRotation: 0,
})

const B = (): SolvedCellDef => ({
  type: 'block',
  rotation: 0,
  correctRotation: 0,
  locked: true,
})

const P = (
  type: SolvedCellDef['type'],
  correctRotation: number,
  isPath = false,
  locked = false
): SolvedCellDef => ({
  type,
  rotation: correctRotation,
  correctRotation,
  isPath,
  locked,
})

/** Уровень 1: одна горизонтальная линия — механика за 10–20 секунд */
const LEVEL_1_SOLVED: SolvedCellDef[][] = [
  [X(), X(), X(), X()],
  [P('straight', 1, true), P('straight', 1, true), P('straight', 1, true), P('straight', 1, true)],
  [X(), X(), X(), X()],
  [X(), X(), X(), X()],
]

/** Уровень 2: маршрут с поворотами вниз и вправо */
const LEVEL_2_SOLVED: SolvedCellDef[][] = [
  [X(), P('tee', 0), P('straight', 2), X()],
  [P('straight', 1, true), P('corner', 2, true), X(), P('corner', 0)],
  [X(), P('corner', 0, true), P('corner', 2, true), X()],
  [X(), X(), P('corner', 0, true), P('straight', 1, true)],
]

/** Уровень 3: обход засора в центре */
const LEVEL_3_SOLVED: SolvedCellDef[][] = [
  [X(), X(), X(), X(), X()],
  [X(), P('corner', 1, true), P('straight', 1, true), P('tee', 1, true), X()],
  [P('straight', 1, true), P('corner', 3, true), B(), P('corner', 0, true), P('straight', 1, true)],
  [X(), X(), X(), X(), X()],
  [X(), X(), X(), X(), X()],
]

/** Уровень 4: прямой путь через перекрёсток + лишние ветки */
const LEVEL_4_SOLVED: SolvedCellDef[][] = [
  [X(), P('tee', 2), P('corner', 0), X(), X()],
  [P('corner', 2), X(), P('straight', 0), P('corner', 1), X()],
  [P('straight', 1, true), P('straight', 1, true), P('cross', 0, true), P('straight', 1, true), P('straight', 1, true)],
  [P('corner', 0), X(), P('tee', 3), X(), P('corner', 3)],
  [X(), P('straight', 2), P('corner', 1), X(), X()],
]

/** Уровень 5: тот же честный обход + больше отвлекающих труб */
const LEVEL_5_SOLVED: SolvedCellDef[][] = [
  [X(), P('corner', 1), P('tee', 0), P('straight', 2), X()],
  [P('corner', 2), P('corner', 1, true), P('straight', 1, true), P('tee', 1, true), P('corner', 0)],
  [P('straight', 1, true), P('corner', 3, true), B(), P('corner', 0, true), P('straight', 1, true)],
  [X(), P('corner', 0), P('straight', 2), P('corner', 2), P('tee', 1)],
  [X(), X(), P('straight', 0), X(), X()],
]

const LEVEL_1_INITIAL = scrambleSolvedLevel(LEVEL_1_SOLVED, [[0, 2, 3, 0]])
const LEVEL_2_INITIAL = scrambleSolvedLevel(LEVEL_2_SOLVED, [
  [0, 0, 0, 0],
  [0, 1, 0, 2],
  [0, 2, 1, 0],
  [0, 0, 2, 1],
])
const LEVEL_3_INITIAL = scrambleSolvedLevel(LEVEL_3_SOLVED, [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [1, 1, 0, 1, 1],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
])
const LEVEL_4_INITIAL = scrambleSolvedLevel(LEVEL_4_SOLVED, [
  [0, 0, 1, 0, 0],
  [1, 0, 2, 0, 0],
  [0, 2, 1, 0, 2],
  [2, 0, 0, 0, 1],
  [0, 0, 2, 0, 0],
])
const LEVEL_5_INITIAL = scrambleSolvedLevel(LEVEL_5_SOLVED, [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 2],
  [1, 1, 0, 1, 1],
  [0, 2, 0, 1, 2],
  [0, 0, 1, 0, 0],
])

export const PIPE_LEVELS: PipeLevelConfig[] = [
  {
    id: 1,
    title: 'Первый контур',
    description: 'Простой маршрут — поверните трубы и проведите тепло.',
    reward: 300,
    gridSize: 4,
    source: { row: 1, col: 0 },
    target: { row: 1, col: 3 },
    solvedCells: LEVEL_1_SOLVED,
    initialCells: LEVEL_1_INITIAL,
  },
  {
    id: 2,
    title: 'Повороты тепла',
    description: 'Маршрут с изгибами — соберите путь по углам.',
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
    description: 'Обойдите засор — через него поток не проходит.',
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
    description: 'Лишние трубы отвлекают — найдите рабочий путь.',
    reward: 500,
    gridSize: 5,
    source: { row: 2, col: 0 },
    target: { row: 2, col: 4 },
    solvedCells: LEVEL_4_SOLVED,
    initialCells: LEVEL_4_INITIAL,
  },
  {
    id: 5,
    title: 'Финальный запуск',
    description: 'Сложная схема на время — 60 секунд до запуска.',
    reward: 600,
    gridSize: 5,
    timeLimit: 60,
    source: { row: 2, col: 0 },
    target: { row: 2, col: 4 },
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
