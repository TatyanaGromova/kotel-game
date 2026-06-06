import { useState } from 'react'

const LOGO_SRC = `${import.meta.env.BASE_URL}assets/logo/logo-kotel.png?v=4`

type LogoSize = 'sm' | 'md' | 'lg' | 'hero'

const sizeClasses: Record<
  LogoSize,
  { img: string; text: string; overlay: string; label: string }
> = {
  sm: {
    img: 'h-8 w-8',
    text: 'text-base',
    overlay: 'text-[5px] bottom-[7%]',
    label: 'w-[78%]',
  },
  md: {
    img: 'h-10 w-10',
    text: 'text-lg',
    overlay: 'text-[6px] bottom-[7%]',
    label: 'w-[78%]',
  },
  lg: {
    img: 'h-14 w-14',
    text: 'text-2xl',
    overlay: 'text-[8px] bottom-[7%]',
    label: 'w-[78%]',
  },
  hero: {
    img: 'h-20 w-20 sm:h-24 sm:w-24',
    text: 'text-3xl sm:text-4xl',
    overlay: 'text-[10px] sm:text-[11px] bottom-[7%]',
    label: 'w-[78%]',
  },
}

interface KotelLogoProps {
  size?: LogoSize
  showText?: boolean
  className?: string
}

export function KotelLogo({ size = 'md', showText = true, className = '' }: KotelLogoProps) {
  const [imgError, setImgError] = useState(false)
  const s = sizeClasses[size]

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {!imgError ? (
        <div className={`relative shrink-0 ${s.img}`}>
          <img
            src={LOGO_SRC}
            alt="КотёлЪ"
            className="h-full w-full object-contain brightness-[1.04] contrast-[1.08]"
            decoding="async"
            onError={() => setImgError(true)}
          />
          <div
            className={`pointer-events-none absolute left-1/2 ${s.label} -translate-x-1/2 ${s.overlay}`}
            aria-hidden
          >
            <div className="rounded-sm bg-graphite-950/88 px-1.5 py-0.5">
              <span className="block text-center font-serif font-bold leading-none tracking-wide text-gray-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                КотёлЪ
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center rounded-xl border border-warm-500/35 bg-warm-600/15 px-3 py-1.5 font-black tracking-tight text-warm-400 ${s.text}`}
        >
          КотёлЪ
        </div>
      )}
      {showText && !imgError && (
        <span className={`font-display font-bold tracking-tight text-gray-50 ${s.text}`}>КотёлЪ</span>
      )}
    </div>
  )
}
