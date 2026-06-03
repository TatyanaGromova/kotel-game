export function SteamEffect({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {[0, 1, 2, 4, 5].map((i) => (
        <div
          key={i}
          className="steam-particle absolute bottom-[20%] h-16 w-8 rounded-full bg-white/10 blur-md"
          style={{ left: `${15 + i * 18}%`, animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </div>
  )
}
