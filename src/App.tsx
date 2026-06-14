import { useCallback, useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { StartScreen } from './components/StartScreen'
import { LevelSelect } from './components/LevelSelect'
import { RewardScreen } from './components/RewardScreen'
import { FinalScreen } from './components/FinalScreen'
import { LeadForm } from './components/LeadForm'
import { AdminPage } from './components/AdminPage'
import { PipePuzzleLevel } from './levels/PipePuzzleLevel'
import { LEVELS, getLevelStatus } from './data/levels'
import { calcWinterBonus } from './data/rewards'
import { useGameStorage } from './hooks/useGameStorage'
import { trackEvent } from './services/analytics'
import {
  clearPromoClaim,
  ensurePromoClaim,
  getPromoClaim,
  isPromoExpired,
  type PromoClaim,
} from './services/promo'

function App() {
  const { state, update, addHeat, completeLevel, resetProgress } = useGameStorage()
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === '#/admin')
  const [activePromo, setActivePromo] = useState<PromoClaim | null>(() => getPromoClaim())

  useEffect(() => {
    const onHashChange = () => setIsAdmin(window.location.hash === '#/admin')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    trackEvent('game_opened', {
      completedLevels: state.completedLevels,
      currentBonus: state.winterBonus,
      promoCode: activePromo?.promoCode ?? null,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getStatus = useCallback(
    (id: number) => getLevelStatus(id, state.completedLevels),
    [state.completedLevels]
  )

  const allComplete = state.completedLevels.length >= LEVELS.length

  const analyticsContext = useCallback(
    () => ({
      currentLevel: state.currentLevel,
      completedLevels: state.completedLevels,
      currentBonus: state.winterBonus,
      promoCode: activePromo?.promoCode ?? getPromoClaim()?.promoCode ?? null,
    }),
    [state.currentLevel, state.completedLevels, state.winterBonus, activePromo]
  )

  const handleLevelComplete = (levelId: number) => {
    if (!state.completedLevels.includes(levelId)) {
      const nextCompleted = [...state.completedLevels, levelId].sort((a, b) => a - b)
      const nextBonus = calcWinterBonus(nextCompleted)
      completeLevel(levelId)
      trackEvent('level_completed', {
        currentLevel: levelId,
        completedLevels: nextCompleted,
        currentBonus: nextBonus,
        promoCode: activePromo?.promoCode ?? null,
      })
      if (nextCompleted.length >= LEVELS.length) {
        trackEvent('game_finished', {
          completedLevels: nextCompleted,
          currentBonus: nextBonus,
          promoCode: activePromo?.promoCode ?? null,
        })
      }
    } else {
      update({ screen: 'levels', currentLevel: null })
    }
  }

  const openClaimFlow = useCallback(
    (bonusAmount: number) => {
      const existing = getPromoClaim()
      if (existing && isPromoExpired(existing.expiresAt)) {
        clearPromoClaim()
      }

      const claim = ensurePromoClaim(bonusAmount)
      setActivePromo(claim)

      trackEvent('bonus_claim_clicked', {
        ...analyticsContext(),
        currentBonus: bonusAmount,
        promoCode: claim.promoCode,
      })
      trackEvent('lead_form_opened', {
        ...analyticsContext(),
        currentBonus: bonusAmount,
        promoCode: claim.promoCode,
      })

      update({ screen: 'form' })
    },
    [analyticsContext, update]
  )

  const handleRenewBonus = () => {
    clearPromoClaim()
    setActivePromo(null)
    resetProgress()
    update({ screen: 'start' })
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

  if (isAdmin) {
    return <AdminPage />
  }

  const showHud = state.screen !== 'start'
  const promoForForm = activePromo ?? getPromoClaim()

  return (
    <Layout
      heatScore={state.heatScore}
      winterBonus={state.winterBonus}
      onReset={resetProgress}
      showHud={showHud}
      compact={state.screen === 'level'}
    >
      {state.screen === 'start' && (
        <StartScreen
          onStart={() => {
            trackEvent('game_started', analyticsContext())
            update({ screen: 'levels' })
          }}
        />
      )}

      {state.screen === 'levels' && (
        <LevelSelect
          completedLevels={state.completedLevels}
          winterBonus={state.winterBonus}
          getStatus={getStatus}
          onSelectLevel={(id) => {
            const status = getStatus(id)
            if (status === 'locked') return
            trackEvent('level_started', {
              currentLevel: id,
              completedLevels: state.completedLevels,
              currentBonus: state.winterBonus,
              promoCode: activePromo?.promoCode ?? null,
            })
            update({ screen: 'level', currentLevel: id })
          }}
          allComplete={allComplete}
          onFinal={() => update({ screen: 'final' })}
          onClaimBonus={
            state.winterBonus > 0 ? () => openClaimFlow(state.winterBonus) : undefined
          }
        />
      )}

      {state.screen === 'level' && renderLevel()}

      {state.screen === 'reward' && state.lastRewardLevel && (
        <RewardScreen
          levelId={state.lastRewardLevel}
          winterBonus={state.winterBonus}
          onClaimBonus={() => openClaimFlow(state.winterBonus)}
          onContinue={() => {
            update({
              screen: allComplete ? 'final' : 'levels',
              lastRewardLevel: null,
            })
          }}
        />
      )}

      {state.screen === 'final' && (
        <FinalScreen
          readiness={state.readiness}
          heatScore={state.heatScore}
          winterBonus={state.winterBonus}
          onGetBonus={() => openClaimFlow(state.winterBonus)}
          onRestart={() => {
            resetProgress()
            setActivePromo(null)
            update({ screen: 'start' })
          }}
          onRenewBonus={handleRenewBonus}
        />
      )}

      {state.screen === 'form' && promoForForm && !isPromoExpired(promoForForm.expiresAt) && (
        <LeadForm
          promoCode={promoForForm.promoCode}
          bonusAmount={promoForForm.bonusAmount}
          promoExpiresAt={promoForForm.expiresAt}
          completedLevels={state.completedLevels}
          onBack={() => update({ screen: state.completedLevels.length >= LEVELS.length ? 'final' : 'levels' })}
          onSubmitted={() => {
            trackEvent('lead_form_submitted', {
              ...analyticsContext(),
              currentBonus: promoForForm.bonusAmount,
              promoCode: promoForForm.promoCode,
            })
          }}
        />
      )}

      {state.screen === 'form' && (!promoForForm || isPromoExpired(promoForForm.expiresAt)) && (
        <div className="glass-panel-strong flex flex-col items-center gap-4 p-8 text-center">
          <p className="text-steel-300">
            Срок действия промокода истёк. Пройдите игру заново, чтобы получить новый бонус.
          </p>
          <button type="button" onClick={handleRenewBonus} className="btn-primary">
            Получить новый бонус
          </button>
        </div>
      )}
    </Layout>
  )
}

export default App
