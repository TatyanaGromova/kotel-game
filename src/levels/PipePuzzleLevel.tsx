import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer, Lightbulb, RotateCcw, Footprints, Gauge } from 'lucide-react'
import { LevelHeader } from '../components/LevelHeader'
import { HumorBubble } from '../components/HumorBubble'
import { PipeBoard } from '../components/pipe/PipeBoard'
import { LEVELS } from '../data/levels'
import {
  canRotate,
  checkFullySolved,
  checkSolved,
  cloneCells,
  findHintCell,
  getConnectedPath,
  getConnectionStatus,
  getPathProgress,
  getPipeLevel,
  isRotationCorrect,
  type CellPosition,
  type ConnectionStatus,
  type PipeCellState,
} from '../data/pipePuzzles'
import { pickHumor, STATUS_LABELS } from '../data/humor'

interface PipePuzzleLevelProps {
  levelId: number
  onBack: () => void
  onHeat: (delta: number) => void
  onComplete: () => void
}

const IDLE_MS = 20000
const REPEAT_THRESHOLD = 4

function statusClass(status: ConnectionStatus): string {
  if (status === 'almost') return 'puzzle-status-almost'
  if (status === 'connected') return 'puzzle-status-connected'
  if (status === 'solved') return 'puzzle-status-solved'
  return 'puzzle-status-broken'
}

export function PipePuzzleLevel({ levelId, onBack, onHeat, onComplete }: PipePuzzleLevelProps) {
  const def = getPipeLevel(levelId)
  const meta = LEVELS.find((l) => l.id === levelId)!
  const [cells, setCells] = useState<PipeCellState[][]>(() => cloneCells(def.initialCells))
  const [humor, setHumor] = useState<string | null>(() => pickHumor('startLevel'))
  const [humorVariant, setHumorVariant] = useState<'neutral' | 'success'>('neutral')
  const [hasInteracted, setHasInteracted] = useState(false)
  const [solved, setSolved] = useState(false)
  const [radiatorLit, setRadiatorLit] = useState(false)
  const [timeLeft, setTimeLeft] = useState(def.timeLimit ?? null)
  const [timedOut, setTimedOut] = useState(false)
  const [movesOut, setMovesOut] = useState(false)
  const [moves, setMoves] = useState(0)
  const [hintCell, setHintCell] = useState<CellPosition | null>(null)
  const [hintUsed, setHintUsed] = useState(false)
  const [shakeKey, setShakeKey] = useState<string | null>(null)
  const completionScheduled = useRef(false)
  const lastCellRef = useRef<{ key: string; count: number } | null>(null)
  const idleTimerRef = useRef<number | null>(null)
  const timeWarnShown = useRef(false)
  const almostShown = useRef(false)
  const movesLowShown = useRef(false)
  const prevProgressRef = useRef(0)
  const prevConnectedRef = useRef(false)

  const failed = timedOut || movesOut
  const showBlockLegend = def.solvedCells.some((row) => row.some((c) => c.type === 'block'))

  const connectionStatus = useMemo(
    () => getConnectionStatus(cells, def.solvedCells, def.sourceConnection, def.targetConnection),
    [cells, def.solvedCells, def.sourceConnection, def.targetConnection]
  )

  const progress = useMemo(
    () => getPathProgress(cells, def.solvedCells, def.sourceConnection, def.targetConnection),
    [cells, def.solvedCells, def.sourceConnection, def.targetConnection]
  )

  const heatPath = useMemo(() => {
    if (!solved) return null
    return getConnectedPath(cells, def.sourceConnection, def.targetConnection)
  }, [cells, def.sourceConnection, def.targetConnection, solved])

  const pathKeys = useMemo(() => {
    const set = new Set<string>()
    heatPath?.forEach((p) => set.add(`${p.row},${p.col}`))
    return set
  }, [heatPath])

  const flowIndex = useMemo(() => {
    const map = new Map<string, number>()
    heatPath?.forEach((p, i) => map.set(`${p.row},${p.col}`, i))
    return map
  }, [heatPath])

  const hintKey = hintCell ? `${hintCell.row},${hintCell.col}` : null

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current)
    idleTimerRef.current = window.setTimeout(() => {
      if (!solved && !failed) {
        setHumor(pickHumor('idle'))
        setHumorVariant('neutral')
      }
    }, IDLE_MS)
  }, [solved, failed])

  const resetLevel = useCallback(() => {
    setCells(cloneCells(def.initialCells))
    setSolved(false)
    setRadiatorLit(false)
    setHumor(pickHumor('startLevel'))
    setHumorVariant('neutral')
    setTimedOut(false)
    setMovesOut(false)
    setMoves(0)
    setHasInteracted(false)
    setHintCell(null)
    setHintUsed(false)
    setShakeKey(null)
    setTimeLeft(def.timeLimit ?? null)
    completionScheduled.current = false
    lastCellRef.current = null
    timeWarnShown.current = false
    almostShown.current = false
    movesLowShown.current = false
    prevProgressRef.current = 0
    prevConnectedRef.current = false
    resetIdleTimer()
  }, [def, resetIdleTimer])

  useEffect(() => {
    resetIdleTimer()
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current)
    }
  }, [resetIdleTimer])

  useEffect(() => {
    if (!def.timeLimit || solved || failed) return
    if (timeLeft === null || timeLeft <= 0) return

    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) {
          setTimedOut(true)
          setHumor(pickHumor('timeout'))
          setHumorVariant('neutral')
          return 0
        }
        if (t <= 16 && !timeWarnShown.current) {
          timeWarnShown.current = true
          setHumor(pickHumor('timeWarning'))
          setHumorVariant('neutral')
        }
        return t - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [def.timeLimit, solved, failed, timeLeft])

  useEffect(() => {
    if (solved || failed) return
    if (connectionStatus === 'almost' && !almostShown.current) {
      almostShown.current = true
      setHumor(pickHumor('almostSolved'))
      setHumorVariant('neutral')
    }
  }, [connectionStatus, solved, failed])

  useEffect(() => {
    if (!def.maxMoves || solved || failed) return
    const remaining = def.maxMoves - moves
    if (remaining <= 5 && remaining > 0 && !movesLowShown.current) {
      movesLowShown.current = true
      setHumor(pickHumor('movesLow'))
      setHumorVariant('neutral')
    }
  }, [moves, def.maxMoves, solved, failed])

  useEffect(() => {
    if (!hasInteracted || solved || failed) return
    if (!checkFullySolved(cells, def.solvedCells, def.sourceConnection, def.targetConnection)) return

    setSolved(true)
    setRadiatorLit(true)
    setHintCell(null)
    setHumor(pickHumor(levelId === 5 ? 'finalWin' : 'levelComplete'))
    setHumorVariant('success')
    onHeat(10)
  }, [cells, hasInteracted, solved, failed, def, onHeat])

  useEffect(() => {
    if (!solved || failed || completionScheduled.current) return
    completionScheduled.current = true

    const timer = window.setTimeout(() => onComplete(), 2200)
    return () => window.clearTimeout(timer)
  }, [solved, failed, onComplete])

  const triggerShake = (row: number, col: number) => {
    const key = `${row},${col}`
    setShakeKey(key)
    window.setTimeout(() => setShakeKey((k) => (k === key ? null : k)), 300)
  }

  const handleRotate = (row: number, col: number) => {
    if (solved || failed) return
    const defCell = def.solvedCells[row][col]
    if (!canRotate(cells[row][col].type, defCell.locked)) return

    const key = `${row},${col}`
    const wasConnected = checkSolved(cells, def.sourceConnection, def.targetConnection)
    const prevPercent = progress.percent

    setHasInteracted(true)
    resetIdleTimer()

    const nextCells = cells.map((r, ri) =>
      r.map((c, ci) =>
        ri === row && ci === col ? { ...c, rotation: (c.rotation + 1) % 4 } : c
      )
    )

    const nextMoves = moves + 1
    setMoves(nextMoves)
    setHintCell(null)
    setCells(nextCells)

    if (def.maxMoves && nextMoves > def.maxMoves) {
      setMovesOut(true)
      setHumor(pickHumor('movesOut'))
      setHumorVariant('neutral')
      return
    }

    const onSolutionPath = defCell.isPath
    const nowCorrect = isRotationCorrect(
      nextCells[row][col].type,
      nextCells[row][col].rotation,
      defCell.correctRotation
    )
    const nowConnected = checkSolved(nextCells, def.sourceConnection, def.targetConnection)
    const nextProgress = getPathProgress(nextCells, def.solvedCells, def.sourceConnection, def.targetConnection)

    const isWrong =
      (onSolutionPath && !nowCorrect) ||
      (wasConnected && !nowConnected) ||
      nextProgress.percent < prevPercent

    if (isWrong) {
      triggerShake(row, col)
      if (Math.random() < 0.45) {
        setHumor(pickHumor('wrongMove'))
        setHumorVariant('neutral')
      }
    } else if (Math.random() < 0.28) {
      setHumor(pickHumor('rotatePipe'))
      setHumorVariant('neutral')
    }

    if (lastCellRef.current?.key === key) {
      const count = lastCellRef.current.count + 1
      lastCellRef.current = { key, count }
      if (count >= REPEAT_THRESHOLD) {
        setHumor(pickHumor('repeatCell'))
        setHumorVariant('neutral')
      }
    } else {
      lastCellRef.current = { key, count: 1 }
    }

    prevProgressRef.current = nextProgress.percent
    prevConnectedRef.current = nowConnected
  }

  const handleHint = () => {
    if (hintUsed || solved || failed) return
    const hint = findHintCell(cells, def.solvedCells, def.sourceConnection, def.targetConnection)
    if (!hint) return
    const penalty = 5 + Math.floor(Math.random() * 6)
    setHintCell(hint)
    setHintUsed(true)
    onHeat(-penalty)
    setHumor(pickHumor('hintUsed'))
    setHumorVariant('neutral')
    resetIdleTimer()
  }

  const statusLabel = STATUS_LABELS[connectionStatus] ?? STATUS_LABELS.broken
  const movesRemaining = def.maxMoves != null ? def.maxMoves - moves : null

  return (
    <div className="pipe-level-screen">
      <LevelHeader
        compact
        title={meta.title}
        subtitle={`Ур. ${levelId} · +${meta.reward} ₽`}
        onBack={onBack}
      />

      <div className="pipe-level-hud shrink-0">
        <div className={`pipe-level-hud-capsule ${statusClass(connectionStatus)}`}>
          <Gauge className="pipe-level-hud-icon" />
          <span className="font-medium">{statusLabel}</span>
          {progress.percent > 0 && <span className="opacity-70">· {progress.percent}%</span>}
        </div>

        <div className="pipe-level-hud-capsule">
          <Footprints className="pipe-level-hud-icon" />
          <span className="font-mono font-semibold">
            {moves}
            {def.maxMoves != null && (
              <span className={movesRemaining !== null && movesRemaining <= 5 ? 'text-amber-400' : 'text-steel-400'}>
                /{def.maxMoves}
              </span>
            )}
          </span>
        </div>

        {def.timeLimit != null && !solved && (
          <div
            className={`pipe-level-hud-capsule ${
              timeLeft !== null && timeLeft <= 15 ? 'border-red-500/40 text-red-300' : ''
            }`}
          >
            <Timer className="pipe-level-hud-icon" />
            <span className="font-mono font-semibold">{timeLeft ?? def.timeLimit} с</span>
          </div>
        )}

        <div className="pipe-level-hud-capsule">
          <span className="text-warm-400">+{meta.reward} ₽</span>
        </div>
      </div>

      <div className="pipe-level-scene">
        <div className="pipe-level-replica-zone">
          {humor && (
            <div className="pipe-level-replica">
              <HumorBubble compact text={humor} variant={humorVariant} />
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel pipe-level-panel shrink-0"
        >
          <PipeBoard
            cells={cells}
            sourceConnection={def.sourceConnection}
            targetConnection={def.targetConnection}
            sourceTerminal={def.sourceTerminal}
            targetTerminal={def.targetTerminal}
            pathKeys={pathKeys}
            flowIndex={flowIndex}
            solved={solved}
            radiatorLit={radiatorLit}
            hintKey={hintKey}
            shakeKey={shakeKey}
            showBlockLegend={showBlockLegend}
            onRotate={handleRotate}
          />
        </motion.div>

        <div className="pipe-level-scene-spacer" aria-hidden="true" />
      </div>

      <div className="pipe-level-actions">
        {!solved && !failed && (
          <button
            type="button"
            onClick={handleHint}
            disabled={hintUsed}
            className="btn-level disabled:opacity-40"
          >
            <Lightbulb className="pipe-level-hud-icon" />
            {hintUsed ? 'Подсказка (−)' : 'Подсказка'}
          </button>
        )}

        {failed && !solved ? (
          <button type="button" onClick={resetLevel} className="btn-level col-span-2">
            <RotateCcw className="pipe-level-hud-icon" />
            Снова
          </button>
        ) : (
          <button type="button" onClick={resetLevel} className="btn-level">
            <RotateCcw className="pipe-level-hud-icon" />
            Сброс
          </button>
        )}
      </div>
    </div>
  )
}
