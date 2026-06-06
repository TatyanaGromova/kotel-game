import { Snowflake } from 'lucide-react'

export function BonusBadge({ amount, max = 2000 }: { amount: number; max?: number }) {
  return (
    <div className="hud-capsule ring-1 ring-warm-500/25">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-frost-500/10 ring-1 ring-frost-300/20">
        <Snowflake className="h-3.5 w-3.5 text-frost-300" />
      </div>
      <div className="text-right sm:text-left">
        <p className="text-[9px] uppercase tracking-wider text-steel-500">Бонус</p>
        <p className="font-bold leading-none text-warm-300">
          {amount} <span className="text-[10px] font-normal text-steel-500">/ {max} ₽</span>
        </p>
      </div>
    </div>
  )
}
