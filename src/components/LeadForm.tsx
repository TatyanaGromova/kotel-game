import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Tag } from 'lucide-react'
import { SETTLEMENTS } from '../data/settlements'
import { BONUS_DISCLAIMER } from '../data/rewards'

const INTEREST_OPTIONS = [
  'Покупка котла',
  'Монтаж котла',
  'Монтаж отопления',
  'Комплекс: котёл + монтаж + отопление',
  'Пока хочу консультацию',
] as const

interface LeadFormProps {
  promoCode: string
  onBack: () => void
}

export function LeadForm({ promoCode, onBack }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '',
    phone: '',
    settlement: '',
    interest: '',
    boilerBrand: '',
    comment: '',
    promo: promoCode,
    consent: false,
  })

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Укажите имя'
    if (!form.phone.trim()) e.phone = 'Укажите телефон'
    else if (!/^[\d\s+()-]{7,}$/.test(form.phone)) e.phone = 'Проверьте номер телефона'
    if (!form.settlement) e.settlement = 'Выберите населённый пункт'
    if (!form.interest) e.interest = 'Выберите, что вас интересует'
    if (!form.consent) e.consent = 'Необходимо согласие на обработку данных'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel-strong flex flex-col items-center gap-5 p-10 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/40 bg-green-950/40 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <CheckCircle className="h-9 w-9 text-green-400" />
        </div>
        <h2 className="heading-display text-2xl">Заявка подготовлена</h2>
        <p className="max-w-sm text-steel-400">
          Мы свяжемся с вами и подскажем условия по зимнему бонусу.
        </p>
        <button type="button" onClick={onBack} className="btn-secondary mt-2">
          Вернуться к результатам
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass-panel-strong flex flex-col gap-5 p-5 sm:p-8"
    >
      <div>
        <h2 className="heading-display text-2xl">Получить зимний бонус</h2>
        <p className="mt-1 text-sm text-steel-400">Заполните форму — промокод уже подставлен</p>
      </div>

      <div className="promo-block !p-4 !text-left">
        <div className="flex items-center gap-2 text-steel-400">
          <Tag className="h-4 w-4 text-warm-500" />
          <span className="text-xs uppercase tracking-wider">Ваш промокод</span>
        </div>
        <p className="promo-shine mt-1 text-2xl font-black tracking-wider">{form.promo}</p>
      </div>

      <Field label="Имя *" error={errors.name}>
        <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Как к вам обращаться" />
      </Field>

      <Field label="Телефон *" error={errors.phone}>
        <input className="input-field" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+7 (___) ___-__-__" />
      </Field>

      <Field label="Населённый пункт *" error={errors.settlement}>
        <select className="input-field" value={form.settlement} onChange={(e) => setForm({ ...form, settlement: e.target.value })}>
          <option value="">Выберите...</option>
          {SETTLEMENTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <Field label="Что вас интересует? *" error={errors.interest}>
        <select className="input-field" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
          <option value="">Выберите...</option>
          {INTEREST_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </Field>

      <Field label="Марка котла (если уже выбрали)">
        <input className="input-field" value={form.boilerBrand} onChange={(e) => setForm({ ...form, boilerBrand: e.target.value })} placeholder="Необязательно" />
      </Field>

      <Field label="Комментарий">
        <textarea className="input-field min-h-[88px] resize-y" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Дополнительные пожелания" />
      </Field>

      <label className="flex gap-3 rounded-xl border border-steel-600/30 bg-graphite-900/50 p-4 text-sm text-steel-400">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          className="mt-1 h-4 w-4 shrink-0 rounded accent-warm-500"
        />
        <span>
          Я соглашаюсь на{' '}
          <a href="/privacy" className="text-warm-400 underline hover:text-warm-300">обработку персональных данных</a>
          {' '}и принимаю{' '}
          <a href="/privacy" className="text-warm-400 underline hover:text-warm-300">Политику конфиденциальности</a>.
        </span>
      </label>
      {errors.consent && <p className="text-xs text-red-400">{errors.consent}</p>}

      <p className="text-xs leading-relaxed text-steel-600">{BONUS_DISCLAIMER}</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="submit" className="btn-primary flex flex-1 items-center justify-center gap-2">
          <Send className="h-5 w-5" />
          Отправить заявку
        </button>
        <button type="button" onClick={onBack} className="btn-secondary">
          Назад
        </button>
      </div>
    </motion.form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-steel-500">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
