import { useCallback } from 'react'
import { Layout } from './components/Layout'
import { StartScreen } from './components/StartScreen'
import { LevelSelect } from './components/LevelSelect'
import { RewardScreen } from './components/RewardScreen'
import { FinalScreen } from './components/FinalScreen'
import { LeadForm } from './components/LeadForm'
import { LevelOneSaveBoiler } from './levels/LevelOneSaveBoiler'
import { LevelTwoMasterKotel } from './levels/LevelTwoMasterKotel'
import { LevelThreeNoSurprises } from './levels/LevelThreeNoSurprises'
import { LevelFourBuildHeating } from './levels/LevelFourBuildHeating'
import { LevelFiveWinterMode } from './levels/LevelFiveWinterMode'
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
    const props = {
      onBack: () => update({ screen: 'levels', currentLevel: null }),
      onHeat: addHeat,
      onComplete: () => handleLevelComplete(id),
    }
    switch (id) {
      case 1:
        return <LevelOneSaveBoiler {...props} />
      case 2:
        return <LevelTwoMasterKotel {...props} />
      case 3:
        return <LevelThreeNoSurprises {...props} />
      case 4:
        return <LevelFourBuildHeating {...props} />
      case 5:
        return <LevelFiveWinterMode {...props} />
      default:
        return null
    }
  }

  const showHud = state.screen !== 'start'

  return (
    <Layout
      heatScore={state.heatScore}
      winterBonus={state.winterBonus}
      onReset={resetProgress}
      showHud={showHud}
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
            if (status === 'completed') {
              update({ screen: 'level', currentLevel: id })
              return
            }
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
