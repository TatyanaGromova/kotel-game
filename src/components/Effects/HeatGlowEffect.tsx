export function HeatGlowEffect({ active, className = '' }: { active: boolean; className?: string }) {
  if (!active) return null
  return (
    <div
      className={`warm-glow-pulse pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-warm-500/40 ${className}`}
      aria-hidden
    />
  )
}
