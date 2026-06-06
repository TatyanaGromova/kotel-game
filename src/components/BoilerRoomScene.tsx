import { SteamEffect } from './Effects/SteamEffect'
import { BoilerRoomIllustration } from './illustrations/BoilerRoomIllustration'

export interface BoilerRoomSceneProps {
  showError?: boolean
  alert?: boolean
  warm?: boolean
  compact?: boolean
  hero?: boolean
}

export function BoilerRoomScene({
  showError = false,
  alert = false,
  warm = false,
  compact = false,
  hero = false,
}: BoilerRoomSceneProps) {
  const height = hero
    ? 'min-h-[220px] sm:min-h-[300px] md:min-h-[360px]'
    : compact
      ? 'h-40 sm:h-48'
      : 'h-56 sm:h-64 md:h-72'

  return (
    <div
      className={`scene-frame relative w-full overflow-hidden ${height} ${hero ? 'scene-frame-hero' : ''} ${warm ? 'ring-1 ring-warm-500/30' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-graphite-850 via-graphite-900 to-graphite-950" />
      <div className="absolute inset-0 bg-hero-mesh opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-warm-radial opacity-50" />
      <div className="scene-vignette pointer-events-none absolute inset-0" />

      {alert && <div className="alert-pulse-overlay absolute inset-0 z-20" />}

      <SteamEffect intensity={hero ? 'high' : 'normal'} />

      <div className="relative z-10 flex h-full items-center justify-center px-2 py-3">
        <BoilerRoomIllustration showError={showError} className="max-h-full" />
      </div>

      <div className="absolute bottom-2 left-3 z-10 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-warm-500/80 indicator-blink" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-steel-400/90">Котельная</span>
      </div>

      {warm && (
        <div className="warm-success-flash pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-warm-500/10 to-transparent" />
      )}
    </div>
  )
}
