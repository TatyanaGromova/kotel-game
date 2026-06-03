export function SmokeEffect({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex justify-center" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="smoke-cloud absolute bottom-[30%] h-20 w-20 rounded-full bg-gray-500/30 blur-xl"
          style={{ left: `${35 + i * 12}%`, animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </div>
  )
}
