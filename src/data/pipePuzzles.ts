export type { PipeType, CellPosition, PipeCellState, SolvedCellDef } from './pipeLogic'
export {
  getMask,
  canRotate,
  cloneCells,
  getConnectedPath,
  checkSolved,
  checkFullySolved,
  findHintCell,
  isRotationCorrect,
  getSolutionPath,
  getPathProgress,
  getConnectionStatus,
  type ConnectionStatus,
} from './pipeLogic'
export { getPipeLevel, PIPE_LEVELS, type PipeLevelConfig } from './pipeLevels'

import { getConnectedPath, type CellPosition, type PipeCellState } from './pipeLogic'

export type GridCell = PipeCellState
export type Point = CellPosition

export const cloneGrid = (cells: GridCell[][]) =>
  cells.map((row) => row.map((c) => ({ ...c })))

export function findHeatPath(cells: GridCell[][], entry: Point, exit: Point) {
  return getConnectedPath(cells, entry, exit)
}
