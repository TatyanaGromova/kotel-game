import type { CSSProperties } from 'react'

export function SparksEffect({ active }: { active: boolean }) {
  if (!active) return null
  const sparks = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    sx: `${(Math.random() - 0.5) * 80}px`,
    sy: `${-20 - Math.random() * 60}px`,
    left: `${40 + Math.random() * 20}%`,
    top: `${45 + Math.random() * 15}%`,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden>
      {sparks.map((s) => (
        <div
          key={s.id}
          className="spark-dot absolute h-1.5 w-1.5 rounded-full bg-warm-400"
          style={
            {
              left: s.left,
              top: s.top,
              '--sx': s.sx,
              '--sy': s.sy,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
