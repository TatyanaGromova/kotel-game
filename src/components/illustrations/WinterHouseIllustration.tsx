import { TECH } from './techTheme'
import { TechLabel } from './TechLabel'

interface Props {
  warm?: boolean
  cold?: boolean
  className?: string
}

export function WinterHouseIllustration({ warm = false, cold = false, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 320 220"
      className={`mx-auto h-full w-full max-w-md ${className}`}
      role="img"
      aria-label="Дом с окнами и отоплением"
    >
      {/* Небо */}
      <rect width="320" height="140" fill={cold ? '#1a2838' : warm ? '#2a2018' : '#141820'} opacity="0.5" />

      {/* Дом */}
      <g transform="translate(60, 55)">
        <TechLabel x={100} y={-5} text="Дом" />
        {/* Крыша */}
        <polygon
          points="100,0 200,0 160,45 40,45"
          fill={TECH.panelLight}
          stroke={warm ? TECH.warm : TECH.stroke}
          strokeWidth="2"
        />
        {/* Стены */}
        <rect x="48" y="45" width="144" height="100" fill={TECH.panel} stroke={warm ? TECH.warm : TECH.strokeLight} strokeWidth="2" />
        {/* Окна 2x2 */}
        {[
          [62, 58],
          [118, 58],
          [62, 100],
          [118, 100],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width="40"
              height="32"
              fill={warm ? TECH.warmDim : '#1a2028'}
              stroke={warm ? TECH.warmGlow : TECH.stroke}
              strokeWidth="1.5"
            />
            <line x1={x + 20} y1={y} x2={x + 20} y2={y + 32} stroke={warm ? TECH.warmGlow : TECH.stroke} strokeWidth="1" />
            <line x1={x} y1={y + 16} x2={x + 40} y2={y + 16} stroke={warm ? TECH.warmGlow : TECH.stroke} strokeWidth="1" />
            {warm && (
              <rect x={x + 4} y={y + 4} width="32" height="24" fill={TECH.warmGlow} opacity="0.25" />
            )}
          </g>
        ))}
        {/* Дверь */}
        <rect x="138" y="95" width="28" height="50" rx="2" fill="#0d0f12" stroke={TECH.stroke} strokeWidth="1.5" />
        <circle cx="160" cy="120" r="2" fill={TECH.warm} />
        {/* Труба на крыше */}
        <rect x="88" y="32" width="12" height="18" fill={TECH.metal} stroke={TECH.stroke} />
        <rect x="84" y="28" width="20" height="6" rx="1" fill={TECH.panelLight} stroke={TECH.stroke} />
        <TechLabel x={94} y={22} text="Дымоход" />
      </g>

      {/* Котёл рядом с домом (маленький) */}
      <g transform="translate(228, 130)">
        <rect x="0" y="0" width="48" height="62" rx="3" fill={TECH.panelLight} stroke={warm ? TECH.warm : TECH.stroke} strokeWidth="1.5" />
        <rect x="6" y="8" width="36" height="14" rx="1" fill="#080a0c" stroke={TECH.strokeLight} />
        <text x="24" y="18" textAnchor="middle" fill={warm ? TECH.warmGlow : TECH.label} fontSize="6" fontFamily="monospace">
          {warm ? 'ON' : '—'}
        </text>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={8 + i * 9} y="32" width="6" height="22" fill={TECH.metal} />
        ))}
        <TechLabel x={24} y={72} text="Котёл" />
        {warm && (
          <path d="M-15 35 H0" stroke={TECH.supply} strokeWidth="4" strokeLinecap="round" />
        )}
      </g>

      {/* Снег / холод у земли */}
      {cold && (
        <ellipse cx="160" cy="200" rx="140" ry="12" fill={TECH.frost} opacity="0.15" />
      )}
      {warm && (
        <ellipse cx="160" cy="200" rx="100" ry="20" fill={TECH.warm} opacity="0.08" />
      )}
    </svg>
  )
}
