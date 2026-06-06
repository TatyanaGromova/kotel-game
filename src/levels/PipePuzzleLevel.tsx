import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer } from 'lucide-react'
import { LevelHeader } from '../components/LevelHeader'
import { HumorBubble } from '../components/HumorBubble'
import { PipeBoard } from '../components/pipe/PipeBoard'
import { LEVELS } from '../data/levels'
import {
  canRotate,
  cloneGrid,
  findHeatPath,
  findReachable,
  getPipeLevel,
  type GridCell,
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
  const [cells, setCells] = useState<GridCell[][]>(() => cloneGrid(def.cells))
  const [humor, setHumor] = useState<string | null>(null)
  const [humorVariant, setHumorVariant] = useState<'neutral' | 'success'>('neutral')
  const [hasInteracted, setHasInteracted] = useState(false)
  const [solved, setSolved] = useState(false)
  const [radiatorLit, setRadiatorLit] = useState(false)
  const [timeLeft, setTimeLeft] = useState(def.timerSec ?? null)
  const [timedOut, setTimedOut] = useState(false)

  const reachable = useMemo(() => findReachable(cells, def.entry), [cells, def.entry])
  const heatPath = useMemo(() => findHeatPath(cells, def.entry, def.exit), [cells, def.entry, def.exit])

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

  const resetLevel = useCallback(() => {
    setCells(cloneGrid(def.cells))
    setSolved(false)
    setRadiatorLit(false)
    setHumor(null)
    setTimedOut(false)
    setHasInteracted(false)
    setTimeLeft(def.timerSec ?? null)
  }, [def])

  useEffect(() => {
    if (!def.timerSec || solved || timedOut) return
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
  }, [def.timerSec, solved, timedOut, timeLeft])

  useEffect(() => {
    if (!hasInteracted || solved || timedOut || !heatPath) return

    setSolved(true)
    setRadiatorLit(true)
    setHumor(PIPE_HUMOR.flow)
    setHumorVariant('success')
    onHeat(10)

    const timer = window.setTimeout(() => onComplete(), 2200)
    return () => window.clearTimeout(timer)
  }, [heatPath, hasInteracted, solved, timedOut, onComplete, onHeat])

  const handleRotate = (row: number, col: number) => {
    if (solved || timedOut) return
    const cell = cells[row][col]
    if (!canRotate(cell.type)) return

    setHasInteracted(true)
    setCells((prev) =>
      prev.map((r, ri) =>
        r.map((c, ci) =>
          ri === row && ci === col ? { ...c, rotation: (c.rotation + 1) % 4 } : c
        )
      )
    )

    if (Math.random() < 0.35) {
      setHumor(pickPipeHumor('rotate'))
      setHumorVariant('neutral')
    }
  }

  const showBlockHumor = cells.some((row) => row.some((c) => c.type === 'block'))

  return (
    <div>
      <LevelHeader
        title={meta.title}
        subtitle={`Уровень ${levelId} · +${meta.reward} ₽`}
        onBack={onBack}
        badge="Трубный маршрут"
      />

      {def.timerSec != null && !solved && (
        <div className="mb-4 flex items-center justify-center gap-2">
          <div
            className={`hud-capsule ${timeLeft !== null && timeLeft <= 15 ? 'border-red-500/40 text-red-300' : ''}`}
          >
            <Timer className="h-4 w-4" />
            <span className="font-mono font-semibold">{timeLeft ?? def.timerSec} с</span>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-3 sm:p-5"
      >
        <PipeBoard
          cells={cells}
          entry={def.entry}
          reachable={reachable}
          pathKeys={pathKeys}
          flowIndex={flowIndex}
          solved={solved}
          radiatorLit={radiatorLit}
          onRotate={handleRotate}
        />
      </motion.div>

      {humor && <HumorBubble text={humor} variant={humorVariant} />}

      {!humor && levelId === 1 && (
        <HumorBubble text={PIPE_HUMOR.start} variant="neutral" />
      )}

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
