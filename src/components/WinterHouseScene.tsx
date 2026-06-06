import { FrostEffect } from './Effects/FrostEffect'
import { SteamEffect } from './Effects/SteamEffect'
import { WinterHouseIllustration } from './illustrations/WinterHouseIllustration'

interface WinterHouseSceneProps {
  temp: number
  warm: boolean
  frostIntensity: number
}

export function WinterHouseScene({ temp, warm, frostIntensity }: WinterHouseSceneProps) {
  const cold = temp < 14

  return (
    <div
      className={`scene-frame relative min-h-[240px] overflow-hidden sm:min-h-[280px] ${
        cold ? 'frost-edge' : warm ? 'ring-1 ring-warm-500/30' : ''
      }`}
    >
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          cold
            ? 'bg-gradient-to-b from-frost-700/25 via-graphite-900 to-graphite-950'
            : warm
              ? 'bg-gradient-to-b from-warm-600/20 via-graphite-900 to-graphite-950'
              : 'bg-gradient-to-b from-graphite-850 to-graphite-950'
        }`}
      />
      <FrostEffect intensity={frostIntensity} />
      {warm && <SteamEffect intensity="normal" />}

      <div className="relative flex items-center justify-center py-4">
        <WinterHouseIllustration warm={warm} cold={cold} />
      </div>

      <div className="absolute right-3 top-3 glass-panel px-3 py-2 sm:right-4 sm:top-4">
        <p className="text-[9px] uppercase tracking-wider text-steel-400">В доме</p>
        <p className={`font-mono text-xl font-bold sm:text-2xl ${cold ? 'text-frost-300' : 'text-warm-400'}`}>
          {temp.toFixed(1)}°C
        </p>
      </div>

      {cold && !warm && (
        <p className="absolute bottom-2 left-3 text-[10px] text-frost-300/80">❄ Холодно снаружи</p>
      )}
      {warm && (
        <p className="absolute bottom-2 left-0 right-0 text-center text-sm font-medium text-warm-400">
          Дом готов к зиме — тепло в окнах
        </p>
      )}
    </div>
  )
}
