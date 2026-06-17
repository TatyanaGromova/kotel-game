import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Tag, Banknote, Calendar, Phone } from 'lucide-react'
import { SETTLEMENTS } from '../data/settlements'
import { BONUS_DISCLAIMER } from '../data/rewards'
import { PERSONAL_DATA_CONSENT, PRIVACY_POLICY } from '../data/legalTexts'
import { formatDate } from '../services/promo'
import { submitLead } from '../services/leads'
import { LegalModal } from './LegalModal'

type LegalModalType = 'consent' | 'privacy' | null

const KOTEL_PHONE = 'tel:+79191152443'
const KOTEL_VK = 'https://vk.me/gazkotelsatka'
const KOTEL_MAX = 'https://max.ru/u/f9LHodD0cOJFb-0Hk-PV5blrkLmGEaUP8Q4Y3My8WCZtHL3TokbHttXSVdw'
const AUTHOR_VK = 'https://vk.com/tavi_grom'
const VK_ICON = `${import.meta.env.BASE_URL}assets/images/vk-icon.png`
const MAX_ICON = `${import.meta.env.BASE_URL}assets/images/max-icon.png`

const INTEREST_OPTIONS = [
  'Покупка котла',
  'Монтаж котла',
  'Монтаж отопления',
  'Комплекс: котёл + монтаж + отопление',
  'Пока хочу консультацию',
] as const

interface LeadFormProps {
  promoCode: string
  bonusAmount: number
  promoExpiresAt: string
  completedLevels: number[]
  onBack: () => void
  onSubmitted?: () => void
}

export function LeadForm({
  promoCode,
  bonusAmount,
  promoExpiresAt,
  completedLevels,
  onBack,
  onSubmitted,
}: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [legalModal, setLegalModal] = useState<LegalModalType>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '',
    phone: '',
    settlement: '',
    interest: '',
    comment: '',
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

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const { sent } = await submitLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        settlement: form.settlement,
        interest: form.interest,
        comment: form.comment.trim(),
        completedLevels,
        bonusAmount,
        promoCode,
        promoExpiresAt,
      })

      if (!sent) {
        setSubmitError(
          'Не удалось отправить заявку. Проверьте подключение к интернету и попробуйте ещё раз.'
        )
        return
      }

      onSubmitted?.()
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel-strong flex flex-col items-center gap-5 p-6 text-center sm:p-10"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/40 bg-green-950/40 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <CheckCircle className="h-9 w-9 text-green-400" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="heading-display text-2xl">Заявка отправлена</h2>
          <p className="max-w-sm text-steel-400">
            Мы свяжемся с вами и подскажем условия по бонусу.
          </p>
        </div>

        <div className="promo-block w-full max-w-sm !p-4">
          <p className="text-xs uppercase tracking-wider text-steel-400">Ваш промокод</p>
          <p className="promo-shine mt-1 text-2xl font-black tracking-wider">{promoCode}</p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-steel-500">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            Действует до {formatDate(promoExpiresAt)}
          </p>
        </div>

        <div className="w-full max-w-lg">
          <p className="mb-3 text-xs uppercase tracking-wider text-steel-500">
            Связь с сервисным центром «КотёлЪ»
          </p>
          <div className="contact-cards">
            <a href={KOTEL_PHONE} className="contact-card contact-card-phone">
              <span className="contact-card-icon contact-card-icon-phone" aria-hidden="true">
                <Phone className="h-7 w-7" />
              </span>
              <span className="contact-card-label">+7 (919) 115-24-43</span>
            </a>
            <a
              href={KOTEL_VK}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card contact-card-vk"
            >
              <span className="contact-card-icon" aria-hidden="true">
                <img src={VK_ICON} alt="" width={28} height={28} className="h-7 w-7" />
              </span>
              <span className="contact-card-label">ВКонтакте</span>
            </a>
            <a
              href={KOTEL_MAX}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card contact-card-max"
            >
              <span className="contact-card-icon" aria-hidden="true">
                <img src={MAX_ICON} alt="" width={28} height={28} className="h-7 w-7" />
              </span>
              <span className="contact-card-label">MAX</span>
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-steel-500">
          Мини-игра разработана{' '}
          <a
            href={AUTHOR_VK}
            target="_blank"
            rel="noopener noreferrer"
            className="author-credit-link font-medium text-warm-400 transition-all hover:text-warm-300"
          >
            Татьяной Громовой
          </a>
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-1 text-sm text-steel-500 underline decoration-steel-600/50 underline-offset-2 transition-colors hover:text-steel-400"
        >
          Вернуться к уровням
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
        <p className="mt-1 text-sm text-steel-400">Заполните заявку — бонус и промокод уже подставлены</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <ReadonlyField icon={<Banknote className="h-4 w-4" />} label="Сумма бонуса" value={`${bonusAmount} ₽`} />
        <ReadonlyField icon={<Tag className="h-4 w-4" />} label="Промокод" value={promoCode} highlight />
        <ReadonlyField
          icon={<Calendar className="h-4 w-4" />}
          label="Действует до"
          value={formatDate(promoExpiresAt)}
        />
      </div>

      <Field label="Имя *" error={errors.name}>
        <input
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Как к вам обращаться"
        />
      </Field>

      <Field label="Телефон *" error={errors.phone}>
        <input
          className="input-field"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+7 (___) ___-__-__"
        />
      </Field>

      <Field label="Населённый пункт *" error={errors.settlement}>
        <select
          className="input-field"
          value={form.settlement}
          onChange={(e) => setForm({ ...form, settlement: e.target.value })}
        >
          <option value="">Выберите...</option>
          {SETTLEMENTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Что вас интересует? *" error={errors.interest}>
        <select
          className="input-field"
          value={form.interest}
          onChange={(e) => setForm({ ...form, interest: e.target.value })}
        >
          <option value="">Выберите...</option>
          {INTEREST_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Комментарий">
        <textarea
          className="input-field min-h-[88px] resize-y"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="Дополнительные пожелания"
        />
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
          <button
            type="button"
            onClick={() => setLegalModal('consent')}
            className="inline cursor-pointer border-0 bg-transparent p-0 font-inherit text-warm-400 underline hover:text-warm-300"
          >
            обработку персональных данных
          </button>{' '}
          и принимаю{' '}
          <button
            type="button"
            onClick={() => setLegalModal('privacy')}
            className="inline cursor-pointer border-0 bg-transparent p-0 font-inherit text-warm-400 underline hover:text-warm-300"
          >
            Политику конфиденциальности
          </button>
          .
        </span>
      </label>
      {errors.consent && <p className="text-xs text-red-400">{errors.consent}</p>}

      <p className="text-xs leading-relaxed text-steel-600">{BONUS_DISCLAIMER}</p>

      {submitError && (
        <p className="rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-200">
          {submitError}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex flex-1 items-center justify-center gap-2 disabled:opacity-60"
        >
          <Send className="h-5 w-5" />
          {submitting ? 'Отправка…' : 'Отправить заявку'}
        </button>
        <button type="button" onClick={onBack} className="btn-secondary">
          К уровням
        </button>
      </div>

      <LegalModal
        open={legalModal === 'consent'}
        title={PERSONAL_DATA_CONSENT.title}
        paragraphs={PERSONAL_DATA_CONSENT.paragraphs}
        onClose={() => setLegalModal(null)}
      />
      <LegalModal
        open={legalModal === 'privacy'}
        title={PRIVACY_POLICY.title}
        paragraphs={PRIVACY_POLICY.paragraphs}
        onClose={() => setLegalModal(null)}
      />
    </motion.form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-steel-500">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

function ReadonlyField({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="promo-block !p-3 !text-left">
      <div className="flex items-center gap-2 text-steel-400">
        <span className="text-warm-500">{icon}</span>
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className={`mt-1 text-sm font-semibold ${highlight ? 'promo-shine tracking-wider' : 'text-warm-300'}`}>
        {value}
      </p>
    </div>
  )
}
