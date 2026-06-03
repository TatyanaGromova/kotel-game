import { Flame, MapPin, AlertTriangle, Wrench, Snowflake } from 'lucide-react'
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
    title: 'Спаси котёл до зимы',
    description: 'Найдите тревожные признаки и выберите правильные действия.',
    reward: 300,
    icon: Flame,
  },
  {
    id: 2,
    title: 'Мастер КотёлЪ',
    description: 'Решите реальные заявки клиентов из Саткинского района.',
    reward: 300,
    icon: MapPin,
  },
  {
    id: 3,
    title: 'Котёл не любит сюрпризы',
    description: 'Определите, какие ситуации опасны для котла и отопления.',
    reward: 300,
    icon: AlertTriangle,
  },
  {
    id: 4,
    title: 'Собери отопление',
    description: 'Соберите правильную систему отопления из важных элементов.',
    reward: 500,
    icon: Wrench,
  },
  {
    id: 5,
    title: 'Зимний режим',
    description: 'Подготовьте дом к морозам и удержите тепло.',
    reward: 600,
    icon: Snowflake,
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
