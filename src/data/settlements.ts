export const SETTLEMENTS = [
  'Сатка',
  'Бакал',
  'Межевой',
  'Бердяуш',
  'Айлино',
  'Романовка',
  'Сулея',
] as const

export type Settlement = (typeof SETTLEMENTS)[number]

export const SETTLEMENT_COORDS: Record<Settlement, { x: number; y: number }> = {
  Сатка: { x: 50, y: 45 },
  Бакал: { x: 72, y: 38 },
  Межевой: { x: 28, y: 55 },
  Бердяуш: { x: 65, y: 62 },
  Айлино: { x: 38, y: 72 },
  Романовка: { x: 55, y: 28 },
  Сулея: { x: 22, y: 35 },
}
