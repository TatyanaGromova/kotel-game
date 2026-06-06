import { useId } from 'react'
import { TECH } from './techTheme'
import { TechLabel } from './TechLabel'

interface Props {
  showError?: boolean
  className?: string
}

/** Читаемая схема котельной: котёл, трубы, дымоход, манометр */
export function BoilerRoomIllustration({ showError = false, className = '' }: Props) {
  const uid = useId().replace(/:/g, '')
  const warmGrad = `warmGrad-${uid}`
  const needleRad = (((showError ? 200 : 120) - 90) * Math.PI) / 180
  const needleX = 35 + Math.cos(needleRad) * 18
  const needleY = 35 + Math.sin(needleRad) * 18

  return (
    <svg
      viewBox="0 0 400 260"
      className={`mx-auto h-full w-full max-w-lg ${className}`}
      role="img"
      aria-label="Схема котельной: котёл, трубы, дымоход, манометр"
    >
      <defs>
        <linearGradient id={warmGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={TECH.warmDim} />
          <stop offset="100%" stopColor={TECH.warmGlow} />
        </linearGradient>
      </defs>

      {/* Стена */}
      <rect x="0" y="0" width="400" height="200" fill={TECH.panel} opacity="0.35" />
      <line x1="0" y1="200" x2="400" y2="200" stroke={TECH.stroke} strokeWidth="1" />

      {/* —— Дымоход —— */}
      <g id="zone-chimney-visual">
        <rect x="178" y="18" width="44" height="8" rx="2" fill={TECH.panelLight} stroke={TECH.stroke} strokeWidth="1.2" />
        <rect x="188" y="26" width="24" height="72" fill={TECH.metal} stroke={TECH.strokeLight} strokeWidth="1.5" />
        <path d="M182 18h40l6-10H176z" fill={TECH.panelLight} stroke={TECH.stroke} />
        <ellipse cx="202" cy="12" rx="14" ry="5" fill="#6b7280" opacity="0.35" />
        <TechLabel x={202} y={8} text="Дымоход" />
      </g>

      {/* —— Трубы подача / обратка —— */}
      <g id="zone-pipes-visual">
        <TechLabel x={72} y={95} text="Трубы" />
        <text x="28" y="108" fill={TECH.supply} fontSize="8" fontWeight="bold">подача</text>
        <text x="28" y="148" fill={TECH.return} fontSize="8" fontWeight="bold">обратка</text>
        <path d="M40 115 H165" stroke={TECH.supply} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9" />
        <path d="M40 140 H165" stroke={TECH.return} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9" />
        <path d="M165 115 V175" stroke={TECH.supply} strokeWidth="5" fill="none" />
        <path d="M165 140 V195" stroke={TECH.return} strokeWidth="5" fill="none" />
        {/* Стрелки направления */}
        <path d="M55 115l-8-4v8z" fill={TECH.supply} />
        <path d="M55 140l-8 4v-8z" fill={TECH.return} />
        <circle cx="40" cy="115" r="5" fill={TECH.panel} stroke={TECH.supply} strokeWidth="1.5" />
        <circle cx="40" cy="140" r="5" fill={TECH.panel} stroke={TECH.return} strokeWidth="1.5" />
      </g>

      {/* —— Настенный котёл —— */}
      <g id="zone-boiler-visual" transform="translate(155, 95)">
        <TechLabel x={45} y={-8} text="Котёл" />
        {/* Кронштейн */}
        <rect x="30" y="0" width="30" height="6" fill={TECH.metal} stroke={TECH.stroke} />
        {/* Корпус */}
        <rect x="8" y="6" width="74" height="98" rx="4" fill={TECH.panelLight} stroke={TECH.strokeLight} strokeWidth="2" />
        <rect x="12" y="10" width="66" height="90" rx="3" fill={TECH.panel} stroke={TECH.stroke} strokeWidth="1" />
        {/* Дисплей */}
        <g id="zone-display-visual">
          <rect x="18" y="18" width="54" height="22" rx="2" fill="#080a0c" stroke={showError ? TECH.red : TECH.strokeLight} strokeWidth="1.5" />
          <text x="45" y="28" textAnchor="middle" fill={showError ? '#fca5a5' : TECH.warmGlow} fontSize="7" fontFamily="monospace" fontWeight="bold">
            {showError ? 'ERR' : 'READY'}
          </text>
          <text x="45" y="36" textAnchor="middle" fill={TECH.label} fontSize="6" fontFamily="monospace">
            {showError ? 'E04' : '1.4 bar'}
          </text>
          <TechLabel x={45} y={14} text="Дисплей" />
        </g>
        {/* Регулятор */}
        <circle cx="62" cy="52" r="7" fill={TECH.panelLight} stroke={TECH.warm} strokeWidth="1.5" />
        <circle cx="62" cy="52" r="3" fill={TECH.warmDim} />
        {/* Решётка */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={16 + i * 8} y="72" width="5" height="22" rx="1" fill={TECH.metal} stroke={TECH.stroke} strokeWidth="0.5" />
        ))}
        {/* Подводы */}
        <rect x="-8" y="50" width="10" height="8" rx="1" fill={TECH.supply} opacity="0.85" />
        <rect x="-8" y="72" width="10" height="8" rx="1" fill={TECH.return} opacity="0.85" />
      </g>

      {/* —— Манометр —— */}
      <g id="zone-gauge-visual" transform="translate(300, 110)">
        <TechLabel x={35} y={-6} text="Давление" />
        <circle cx="35" cy="35" r="32" fill={TECH.panel} stroke={TECH.strokeLight} strokeWidth="2" />
        <circle cx="35" cy="35" r="26" fill="#0a0c0e" stroke={TECH.stroke} />
        {/* Шкала */}
        {[0, 45, 90, 135, 180, 225, 270].map((deg, i) => {
          const rad = ((deg - 90) * Math.PI) / 180
          const x1 = 35 + Math.cos(rad) * 20
          const y1 = 35 + Math.sin(rad) * 20
          const x2 = 35 + Math.cos(rad) * 24
          const y2 = 35 + Math.sin(rad) * 24
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={TECH.strokeLight} strokeWidth="1" />
        })}
        <line x1="35" y1="35" x2={needleX} y2={needleY} stroke={showError ? TECH.red : `url(#${warmGrad})`} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="35" cy="35" r="4" fill={TECH.warm} />
        <text x="35" y="78" textAnchor="middle" fill={showError ? TECH.red : TECH.warmGlow} fontSize="10" fontWeight="bold" fontFamily="monospace">
          {showError ? '0.8' : '1.4'} bar
        </text>
      </g>

      {/* Вентиляция (отдельно, справа внизу) */}
      <g transform="translate(318, 185)">
        <rect x="0" y="0" width="36" height="28" rx="2" fill={TECH.panel} stroke={TECH.stroke} strokeWidth="1.2" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="4" y1={5 + i * 4.5} x2="32" y2={5 + i * 4.5} stroke={TECH.strokeLight} strokeWidth="1" />
        ))}
        <TechLabel x={18} y={38} text="Вентиляция" />
      </g>

      {/* Пол */}
      <rect x="0" y="200" width="400" height="60" fill="#141820" opacity="0.6" />
    </svg>
  )
}
