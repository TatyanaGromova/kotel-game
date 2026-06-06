import { Circle, CornerDownRight, Ban, Split, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface LevelMeta {
  id: number
  title: string
  description: string
  reward: number
  icon: LucideIcon
}

export const LEVELS: LevelMeta[] = [
  {
    id: 1,
    title: 'Первый контур',
    description: 'Первый изгиб — найдите маршрут среди лишних труб.',
    reward: 300,
    icon: Circle,
  },
  {
    id: 2,
    title: 'Повороты тепла',
    description: 'Длинный маршрут с углами и ложными направлениями.',
    reward: 300,
    icon: CornerDownRight,
  },
  {
    id: 3,
    title: 'Засор на линии',
    description: 'Два засора и обход — ложная ветка в тупик.',
    reward: 300,
    icon: Ban,
  },
  {
    id: 4,
    title: 'Ложный маршрут',
    description: 'Длинный обход и лишние трубы — не больше 28 ходов.',
    reward: 500,
    icon: Split,
  },
  {
    id: 5,
    title: 'Финальный запуск',
    description: 'Поле 6×6, засоры, таймер 60 с и лимит ходов.',
    reward: 600,
    icon: Timer,
  },
]

export function getLevelStatus(
  levelId: number,
  completed: number[]
): 'locked' | 'available' | 'completed' {
  if (completed.includes(levelId)) return 'completed'
  const nextLevel = completed.length === 0 ? 1 : Math.max(...completed) + 1
  if (levelId === nextLevel) return 'available'
  return 'locked'
}
