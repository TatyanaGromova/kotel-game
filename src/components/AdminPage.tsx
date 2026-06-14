import { useEffect, useState } from 'react'
import { Trash2, RefreshCw } from 'lucide-react'
import { clearLeads, getLeads } from '../services/leads'
import { formatDate } from '../services/promo'
import type { LeadRecord } from '../services/leads'

export function AdminPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([])

  const reload = () => setLeads(getLeads())

  useEffect(() => {
    reload()
  }, [])

  const handleClear = () => {
    if (!confirm('Очистить все тестовые заявки из localStorage?')) return
    clearLeads()
    reload()
  }

  return (
    <div className="boiler-room-bg min-h-dvh px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500/80">Dev only</p>
            <h1 className="heading-display text-2xl">Заявки (localStorage)</h1>
            <p className="mt-1 text-sm text-steel-500">Страница для проверки: #/admin</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={reload} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Обновить
            </button>
            <button type="button" onClick={handleClear} className="btn-secondary flex items-center gap-2 text-red-300">
              <Trash2 className="h-4 w-4" />
              Очистить тестовые заявки
            </button>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="glass-panel p-8 text-center text-steel-500">Заявок пока нет</div>
        ) : (
          <div className="flex flex-col gap-3">
            {leads
              .slice()
              .reverse()
              .map((lead) => (
                <div key={lead.leadId} className="glass-panel overflow-x-auto p-4 text-sm">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <Cell label="Дата" value={formatDate(lead.createdAt)} />
                    <Cell label="Имя" value={lead.name} />
                    <Cell label="Телефон" value={lead.phone} />
                    <Cell label="Населённый пункт" value={lead.settlement} />
                    <Cell label="Интерес" value={lead.interest} />
                    <Cell label="Пройдено уровней" value={String(lead.completedLevels.length)} />
                    <Cell label="Бонус" value={`${lead.bonusAmount} ₽`} />
                    <Cell label="Промокод" value={lead.promoCode} highlight />
                    <Cell label="Действует до" value={formatDate(lead.promoExpiresAt)} />
                    {lead.comment && (
                      <div className="sm:col-span-2 lg:col-span-4">
                        <Cell label="Комментарий" value={lead.comment} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        <p className="mt-6 text-center">
          <a href="#" className="text-sm text-warm-400 underline hover:text-warm-300">
            ← Вернуться к игре
          </a>
        </p>
      </div>
    </div>
  )
}

function Cell({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-steel-500">{label}</p>
      <p className={`mt-0.5 font-medium ${highlight ? 'text-warm-300' : 'text-gray-200'}`}>{value}</p>
    </div>
  )
}
