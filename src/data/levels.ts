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
    description: 'Соедините котёл с радиатором — простой маршрут по прямой.',
    reward: 300,
    icon: Circle,
  },
  {
    id: 2,
    title: 'Повороты тепла',
    description: 'Поворачивайте трубы и соберите маршрут с изгибами.',
    reward: 300,
    icon: CornerDownRight,
  },
  {
    id: 3,
    title: 'Засор на линии',
    description: 'Обойдите засор — через него поток не проходит.',
    reward: 300,
    icon: Ban,
  },
  {
    id: 4,
    title: 'Ложный маршрут',
    description: 'Найдите единственный рабочий путь среди лишних веток.',
    reward: 500,
    icon: Split,
  },
  {
    id: 5,
    title: 'Финальный запуск',
    description: 'Сложная схема на время — 60 секунд до запуска тепла.',
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
