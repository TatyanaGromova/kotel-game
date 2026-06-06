import type { ReactNode } from 'react'
import { TECH } from './techTheme'

type IconProps = { size?: number; className?: string; active?: boolean }

function IconWrap({ size = 48, className = '', children }: { size?: number; className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden>
      {children}
    </svg>
  )
}

export function IconBoiler({ size, className, active }: IconProps) {
  return (
    <IconWrap size={size} className={className}>
      <rect x="10" y="6" width="28" height="34" rx="3" fill={TECH.panel} stroke={active ? TECH.warm : TECH.stroke} strokeWidth="1.5" />
      <rect x="14" y="12" width="20" height="10" rx="1" fill="#0a0c0e" stroke={TECH.strokeLight} />
      <text x="24" y="19" textAnchor="middle" fill={TECH.warmGlow} fontSize="5" fontFamily="monospace">LCD</text>
      <circle cx="32" cy="28" r="4" fill={TECH.panelLight} stroke={TECH.stroke} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={12 + i * 4.5} y="32" width="3" height="6" fill={TECH.metal} />
      ))}
    </IconWrap>
  )
}

export function IconRadiator({ size, className, active }: IconProps) {
  return (
    <IconWrap size={size} className={className}>
      <rect x="8" y="10" width="32" height="28" rx="2" fill={TECH.panel} stroke={active ? TECH.warm : TECH.stroke} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x={11 + i * 5} y="12" width="3" height="24" rx="0.5" fill={active ? TECH.warmDim : TECH.metal} stroke={TECH.stroke} strokeWidth="0.5" />
        </g>
      ))}
      <rect x="6" y="22" width="4" height="6" fill={TECH.supply} opacity="0.8" />
      <rect x="38" y="22" width="4" height="6" fill={TECH.return} opacity="0.8" />
    </IconWrap>
  )
}

export function IconPump({ size, className, active }: IconProps) {
  return (
    <IconWrap size={size} className={className}>
      <circle cx="24" cy="24" r="14" fill={TECH.panel} stroke={active ? TECH.warm : TECH.stroke} strokeWidth="1.5" />
      <path d="M18 24h12M24 18v12" stroke={active ? TECH.warmGlow : TECH.strokeLight} strokeWidth="2" />
      <path d="M28 20l4 4-4 4" fill="none" stroke={TECH.warm} strokeWidth="1.5" />
    </IconWrap>
  )
}

export function IconFilter({ size, className, active }: IconProps) {
  return (
    <IconWrap size={size} className={className}>
      <rect x="14" y="10" width="20" height="28" rx="3" fill={TECH.panel} stroke={active ? TECH.warm : TECH.stroke} strokeWidth="1.5" />
      {[12, 18, 24, 30, 36].map((y) => (
        <line key={y} x1="16" y1={y} x2="32" y2={y} stroke={TECH.strokeLight} strokeWidth="0.8" />
      ))}
    </IconWrap>
  )
}

export function IconExpansionTank({ size, className, active }: IconProps) {
  return (
    <IconWrap size={size} className={className}>
      <ellipse cx="24" cy="30" rx="14" ry="10" fill={TECH.panel} stroke={active ? TECH.warm : TECH.stroke} strokeWidth="1.5" />
      <rect x="20" y="8" width="8" height="14" fill={TECH.panelLight} stroke={TECH.stroke} />
      <line x1="16" y1="30" x2="32" y2="30" stroke={TECH.strokeLight} />
    </IconWrap>
  )
}

export function IconChimney({ size, className, active }: IconProps) {
  return (
    <IconWrap size={size} className={className}>
      <rect x="20" y="8" width="8" height="32" fill={TECH.metal} stroke={active ? TECH.warm : TECH.stroke} strokeWidth="1.5" />
      <path d="M16 8h16l2-4H14z" fill={TECH.panelLight} stroke={active ? TECH.warm : TECH.stroke} />
      <ellipse cx="24" cy="6" rx="6" ry="2" fill="#4a5568" opacity="0.5" />
    </IconWrap>
  )
}

export function IconVent({ size, className, active }: IconProps) {
  return (
    <IconWrap size={size} className={className}>
      <rect x="10" y="12" width="28" height="24" rx="2" fill={TECH.panel} stroke={active ? TECH.warm : TECH.stroke} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1="12" y1={14 + i * 3.5} x2="36" y2={14 + i * 3.5} stroke={TECH.strokeLight} strokeWidth="1.2" />
      ))}
    </IconWrap>
  )
}

export function IconPipes({ size, className, active }: IconProps) {
  return (
    <IconWrap size={size} className={className}>
      <path d="M8 20h32" stroke={TECH.supply} strokeWidth="4" strokeLinecap="round" opacity={active ? 1 : 0.7} />
      <path d="M8 28h32" stroke={TECH.return} strokeWidth="4" strokeLinecap="round" opacity={active ? 1 : 0.7} />
      <path d="M32 20v16" stroke={TECH.supply} strokeWidth="3" />
      <path d="M16 28v8" stroke={TECH.return} strokeWidth="3" />
    </IconWrap>
  )
}

export function IconSafetyGroup({ size, className, active }: IconProps) {
  return (
    <IconWrap size={size} className={className}>
      <rect x="12" y="14" width="24" height="20" rx="2" fill={TECH.panel} stroke={active ? TECH.warm : TECH.stroke} strokeWidth="1.5" />
      <circle cx="24" cy="22" r="5" fill={TECH.red} opacity="0.3" stroke={TECH.red} strokeWidth="1" />
      <path d="M24 18v4M24 26v2" stroke={TECH.warmGlow} strokeWidth="1.5" />
    </IconWrap>
  )
}

export function IconDecoy({ label, size, className }: { label: string; size?: number; className?: string }) {
  return (
    <IconWrap size={size} className={className}>
      <rect x="10" y="10" width="28" height="28" rx="4" fill={TECH.panel} stroke={TECH.stroke} strokeDasharray="3 2" />
      <text x="24" y="26" textAnchor="middle" fill={TECH.label} fontSize="6" fontFamily="system-ui">
        {label.slice(0, 6)}
      </text>
    </IconWrap>
  )
}

const PIECE_ICONS: Record<string, React.FC<IconProps>> = {
  Котёл: IconBoiler,
  Радиаторы: IconRadiator,
  Насос: IconPump,
  Фильтр: IconFilter,
  'Расширительный бак': IconExpansionTank,
  Дымоход: IconChimney,
  Вентиляция: IconVent,
  Трубы: IconPipes,
  'Группа безопасности': IconSafetyGroup,
}

export function HeatingPieceIcon({ name, size = 40, active }: { name: string; size?: number; active?: boolean }) {
  const Icon = PIECE_ICONS[name]
  if (Icon) return <Icon size={size} active={active} />
  return <IconDecoy label={name} size={size} />
}
