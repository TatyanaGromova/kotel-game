import { useCallback } from 'react'
import { Layout } from './components/Layout'
import { StartScreen } from './components/StartScreen'
import { LevelSelect } from './components/LevelSelect'
import { RewardScreen } from './components/RewardScreen'
import { FinalScreen } from './components/FinalScreen'
import { LeadForm } from './components/LeadForm'
import { PipePuzzleLevel } from './levels/PipePuzzleLevel'
import { LEVELS, getLevelStatus } from './data/levels'
import { useGameStorage } from './hooks/useGameStorage'

function App() {
  const { state, update, addHeat, completeLevel, resetProgress } = useGameStorage()

  const getStatus = useCallback(
    (id: number) => getLevelStatus(id, state.completedLevels),
    [state.completedLevels]
  )

  const allComplete = state.completedLevels.length >= LEVELS.length

  const handleLevelComplete = (levelId: number) => {
    if (!state.completedLevels.includes(levelId)) {
      completeLevel(levelId)
    } else {
      update({ screen: 'levels', currentLevel: null })
    }
  }

  const renderLevel = () => {
    const id = state.currentLevel
    if (!id) return null
    return (
      <PipePuzzleLevel
        levelId={id}
        onBack={() => update({ screen: 'levels', currentLevel: null })}
        onHeat={addHeat}
        onComplete={() => handleLevelComplete(id)}
      />
    )
  }

  const showHud = state.screen !== 'start'

  return (
    <Layout
      heatScore={state.heatScore}
      winterBonus={state.winterBonus}
      onReset={resetProgress}
      showHud={showHud}
      compact={state.screen === 'level'}
    >
      {state.screen === 'start' && (
        <StartScreen onStart={() => update({ screen: 'levels' })} />
      )}

      {state.screen === 'levels' && (
        <LevelSelect
          completedLevels={state.completedLevels}
          winterBonus={state.winterBonus}
          getStatus={getStatus}
          onSelectLevel={(id) => {
            const status = getStatus(id)
            if (status === 'locked') return
            update({ screen: 'level', currentLevel: id })
          }}
          allComplete={allComplete}
          onFinal={() => update({ screen: 'final' })}
        />
      )}

      {state.screen === 'level' && renderLevel()}

      {state.screen === 'reward' && state.lastRewardLevel && (
        <RewardScreen
          levelId={state.lastRewardLevel}
          winterBonus={state.winterBonus}
          onContinue={() => {
            if (allComplete) {
              update({ screen: 'final', lastRewardLevel: null })
            } else {
              update({ screen: 'levels', lastRewardLevel: null })
            }
          }}
        />
      )}

      {state.screen === 'final' && (
        <FinalScreen
          readiness={state.readiness}
          heatScore={state.heatScore}
          winterBonus={state.winterBonus}
          promoCode={state.promoCode}
          onGetBonus={() => update({ screen: 'form' })}
          onRestart={() => {
            resetProgress()
            update({ screen: 'start' })
          }}
        />
      )}

      {state.screen === 'form' && (
        <LeadForm
          promoCode={state.promoCode}
          onBack={() => update({ screen: 'final' })}
        />
      )}
    </Layout>
  )
}

export default App
