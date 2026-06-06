import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer, Lightbulb, RotateCcw } from 'lucide-react'
import { LevelHeader } from '../components/LevelHeader'
import { HumorBubble } from '../components/HumorBubble'
import { PipeBoard } from '../components/pipe/PipeBoard'
import { LEVELS } from '../data/levels'
import {
  canRotate,
  checkFullySolved,
  cloneCells,
  findHintCell,
  getConnectedPath,
  getPipeLevel,
  type CellPosition,
  type PipeCellState,
} from '../data/pipePuzzles'
import { pickPipeHumor, PIPE_HUMOR } from '../data/humor'

interface PipePuzzleLevelProps {
  levelId: number
  onBack: () => void
  onHeat: (delta: number) => void
  onComplete: () => void
}

export function PipePuzzleLevel({ levelId, onBack, onHeat, onComplete }: PipePuzzleLevelProps) {
  const def = getPipeLevel(levelId)
  const meta = LEVELS.find((l) => l.id === levelId)!
  const [cells, setCells] = useState<PipeCellState[][]>(() => cloneCells(def.initialCells))
  const [humor, setHumor] = useState<string | null>(levelId === 1 ? PIPE_HUMOR.start : null)
  const [humorVariant, setHumorVariant] = useState<'neutral' | 'success'>('neutral')
  const [hasInteracted, setHasInteracted] = useState(false)
  const [solved, setSolved] = useState(false)
  const [radiatorLit, setRadiatorLit] = useState(false)
  const [timeLeft, setTimeLeft] = useState(def.timeLimit ?? null)
  const [timedOut, setTimedOut] = useState(false)
  const [hintCell, setHintCell] = useState<CellPosition | null>(null)
  const [hintUsed, setHintUsed] = useState(false)

  const heatPath = useMemo(() => {
    if (!solved) return null
    return getConnectedPath(cells, def.source, def.target)
  }, [cells, def.source, def.target, solved])

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

  const resetLevel = useCallback(() => {
    setCells(cloneCells(def.initialCells))
    setSolved(false)
    setRadiatorLit(false)
    setHumor(levelId === 1 ? PIPE_HUMOR.start : null)
    setHumorVariant('neutral')
    setTimedOut(false)
    setHasInteracted(false)
    setHintCell(null)
    setHintUsed(false)
    setTimeLeft(def.timeLimit ?? null)
  }, [def, levelId])

  useEffect(() => {
    if (!def.timeLimit || solved || timedOut) return
    if (timeLeft === null || timeLeft <= 0) return

    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) {
          setTimedOut(true)
          setHumor(PIPE_HUMOR.timeout)
          setHumorVariant('neutral')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [def.timeLimit, solved, timedOut, timeLeft])

  useEffect(() => {
    if (!hasInteracted || solved || timedOut) return
    if (!checkFullySolved(cells, def.solvedCells, def.source, def.target)) return

    setSolved(true)
    setRadiatorLit(true)
    setHintCell(null)
    setHumor(PIPE_HUMOR.flow)
    setHumorVariant('success')
    onHeat(10)

    const timer = window.setTimeout(() => onComplete(), 2200)
    return () => window.clearTimeout(timer)
  }, [cells, hasInteracted, solved, timedOut, def, onComplete, onHeat])

  const handleRotate = (row: number, col: number) => {
    if (solved || timedOut) return
    const defCell = def.solvedCells[row][col]
    if (!canRotate(cells[row][col].type, defCell.locked)) return

    setHasInteracted(true)
    setHintCell(null)
    setCells((prev) =>
      prev.map((r, ri) =>
        r.map((c, ci) =>
          ri === row && ci === col ? { ...c, rotation: (c.rotation + 1) % 4 } : c
        )
      )
    )

    if (Math.random() < 0.3) {
      setHumor(pickPipeHumor('rotate'))
      setHumorVariant('neutral')
    }
  }

  const handleHint = () => {
    if (hintUsed || solved || timedOut) return
    const hint = findHintCell(cells, def.solvedCells, def.source, def.target)
    if (!hint) return
    setHintCell(hint)
    setHintUsed(true)
    setHumor('Вот эта труба явно смотрит не туда.')
    setHumorVariant('neutral')
  }

  const showBlockHumor = def.solvedCells.some((row) => row.some((c) => c.type === 'block'))

  return (
    <div>
      <LevelHeader
        title={meta.title}
        subtitle={`Этап ${levelId} · +${meta.reward} ₽`}
        onBack={onBack}
        badge="Трубный маршрут"
      />

      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        {def.timeLimit != null && !solved && (
          <div
            className={`hud-capsule ${timeLeft !== null && timeLeft <= 15 ? 'border-red-500/40 text-red-300' : ''}`}
          >
            <Timer className="h-4 w-4" />
            <span className="font-mono font-semibold">{timeLeft ?? def.timeLimit} с</span>
          </div>
        )}
        {!solved && !timedOut && (
          <button
            type="button"
            onClick={handleHint}
            disabled={hintUsed}
            className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-40"
          >
            <Lightbulb className="h-4 w-4" />
            {hintUsed ? 'Подсказка использована' : 'Подсказка'}
          </button>
        )}
        <button type="button" onClick={resetLevel} className="btn-ghost flex items-center gap-2 text-sm">
          <RotateCcw className="h-4 w-4" />
          Сброс
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-3 sm:p-5"
      >
        <PipeBoard
          cells={cells}
          source={def.source}
          target={def.target}
          pathKeys={pathKeys}
          flowIndex={flowIndex}
          solved={solved}
          radiatorLit={radiatorLit}
          hintKey={hintKey}
          onRotate={handleRotate}
        />
      </motion.div>

      {humor && <HumorBubble text={humor} variant={humorVariant} />}

      {!humor && showBlockHumor && levelId === 3 && (
        <HumorBubble text={PIPE_HUMOR.block} variant="neutral" />
      )}

      {timedOut && !solved && (
        <div className="mt-4 flex justify-center">
          <button type="button" onClick={resetLevel} className="btn-primary">
            Попробовать снова
          </button>
        </div>
      )}
    </div>
  )
}
