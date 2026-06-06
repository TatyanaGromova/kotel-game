import { TECH } from './techTheme'
import { TechLabel } from './TechLabel'
import { HeatingPieceIcon } from './heatingIcons'

interface Props {
  filled: Record<string, string>
  finished: boolean
}

/** Схема отопления с узнаваемыми элементами */
export function HeatingSchemeIllustration({ filled, finished }: Props) {
  const has = (slot: string) => filled[slot]

  return (
    <svg viewBox="0 0 360 200" className="mx-auto w-full max-w-lg" aria-hidden>
      {/* Котёл */}
      <g transform="translate(20, 70)">
        <HeatingPieceIcon name="Котёл" size={56} active={!!has('source')} />
        <TechLabel x={28} y={62} text="Источник" />
      </g>

      {/* Группа безопасности + насос + фильтр */}
      <g transform="translate(100, 40)">
        <HeatingPieceIcon name="Группа безопасности" size={44} active={!!has('safety')} />
        <TechLabel x={22} y={50} text="Защита" />
      </g>
      <g transform="translate(100, 100)">
        <HeatingPieceIcon name="Насос" size={44} active={!!has('pump')} />
      </g>
      <g transform="translate(100, 155)">
        <HeatingPieceIcon name="Фильтр" size={44} active={!!has('filter')} />
      </g>

      {/* Трубы — соединительные линии */}
      <path
        d="M76 98 H100 M144 62 H180 M144 122 H200 M144 177 H200"
        stroke={finished ? TECH.warmGlow : TECH.stroke}
        strokeWidth={finished ? 3 : 2}
        fill="none"
        opacity={finished ? 1 : 0.5}
        className={finished ? 'heat-flow-line' : ''}
      />
      <path d="M76 108 H100" stroke={TECH.return} strokeWidth="3" opacity="0.7" />
      <path d="M76 98 H76 108" stroke={TECH.supply} strokeWidth="3" />

      {/* Магистраль */}
      <g transform="translate(180, 90)">
        <HeatingPieceIcon name="Трубы" size={48} active={!!has('main')} />
        <TechLabel x={24} y={54} text="Магистраль" />
      </g>

      {/* Радиаторы */}
      <g transform="translate(250, 60)">
        <HeatingPieceIcon name="Радиаторы" size={52} active={!!has('emitters')} />
        <TechLabel x={26} y={58} text="Отдача тепла" />
      </g>

      {/* Бак */}
      <g transform="translate(250, 130)">
        <HeatingPieceIcon name="Расширительный бак" size={48} active={!!has('expansion')} />
      </g>

      {/* Дымоход + вентиляция */}
      <g transform="translate(20, 10)">
        <HeatingPieceIcon name="Дымоход" size={40} active={!!has('flue')} />
      </g>
      <g transform="translate(60, 10)">
        <HeatingPieceIcon name="Вентиляция" size={40} active={!!has('air')} />
      </g>
    </svg>
  )
}
