import type { CSSProperties } from 'react'

export function FrostEffect({ intensity = 0.5 }: { intensity?: number }) {
  if (intensity <= 0) return null
  return (
    <div
      className="frost-overlay pointer-events-none absolute inset-0 z-10"
      style={{ '--frost-opacity': intensity } as CSSProperties}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}
