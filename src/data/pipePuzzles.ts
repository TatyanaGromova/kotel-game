export type {
  PipeType,
  PipeSide,
  CellPosition,
  ConnectionPoint,
  TerminalLayout,
  PipeCellState,
  SolvedCellDef,
} from './pipeLogic'
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

import { getConnectedPath, type ConnectionPoint, type PipeCellState } from './pipeLogic'

export type GridCell = PipeCellState

export const cloneGrid = (cells: GridCell[][]) =>
  cells.map((row) => row.map((c) => ({ ...c })))

export function findHeatPath(cells: GridCell[][], entry: ConnectionPoint, exit: ConnectionPoint) {
  return getConnectedPath(cells, entry, exit)
}
