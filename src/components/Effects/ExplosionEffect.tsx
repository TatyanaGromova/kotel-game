import { SparksEffect } from './SparksEffect'
import { SmokeEffect } from './SmokeEffect'

export function ExplosionEffect({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <>
      <div className="explosion-flash pointer-events-none absolute inset-0 z-40 bg-warm-500/20" aria-hidden />
      <SparksEffect active />
      <SmokeEffect active />
    </>
  )
}
