import { Snowflake } from 'lucide-react'

export function BonusBadge({ amount, max = 2000 }: { amount: number; max?: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-warm-500/40 bg-graphite-800/80 px-4 py-2">
      <Snowflake className="h-5 w-5 text-warm-400" />
      <div>
        <div className="text-xs text-gray-400">Зимний бонус</div>
        <div className="font-bold text-warm-400">
          {amount} ₽ <span className="font-normal text-gray-500">из {max} ₽</span>
        </div>
      </div>
    </div>
  )
}
