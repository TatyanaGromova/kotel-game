export function SteamEffect({
  className = '',
  intensity = 'normal',
}: {
  className?: string
  intensity?: 'normal' | 'high'
}) {
  const count = intensity === 'high' ? 10 : 6
  const particles = Array.from({ length: count }, (_, i) => i)

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {particles.map((i) => (
        <div
          key={i}
          className="steam-particle absolute rounded-full"
          style={{
            left: `${8 + (i * 83) / count}%`,
            bottom: `${18 + (i % 3) * 4}%`,
            width: intensity === 'high' ? 24 + (i % 3) * 8 : 16 + (i % 2) * 6,
            height: intensity === 'high' ? 48 + (i % 2) * 12 : 32,
            animationDelay: `${i * 0.45}s`,
            animationDuration: `${3.5 + (i % 3) * 0.5}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02]" />
    </div>
  )
}
