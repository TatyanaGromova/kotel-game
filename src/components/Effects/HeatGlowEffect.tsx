export function HeatGlowEffect({ active, className = '' }: { active: boolean; className?: string }) {
  if (!active) return null
  return (
    <>
      <div
        className={`warm-glow-pulse pointer-events-none absolute -inset-1 rounded-2xl ring-2 ring-warm-500/50 ${className}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-warm-500/10 via-transparent to-transparent"
        aria-hidden
      />
    </>
  )
}
