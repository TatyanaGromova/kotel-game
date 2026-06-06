import { useState } from 'react'

const LOGO_SRC = `${import.meta.env.BASE_URL}assets/logo/logo-kotel.png?v=2`

type LogoSize = 'sm' | 'md' | 'lg' | 'hero'

const sizeClasses: Record<LogoSize, { img: string; text: string }> = {
  sm: { img: 'h-7 w-auto', text: 'text-base' },
  md: { img: 'h-9 w-auto', text: 'text-lg' },
  lg: { img: 'h-12 w-auto', text: 'text-2xl' },
  hero: { img: 'h-16 w-auto sm:h-20', text: 'text-3xl sm:text-4xl' },
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
        <img
          src={LOGO_SRC}
          alt="КотёлЪ"
          className={`${s.img} rounded-full object-contain`}
          onError={() => setImgError(true)}
        />
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
