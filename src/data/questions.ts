// Уровень 1 — диагностика котла
export interface DiagnosticQuestion {
  id: number
  situation: string
  options: string[]
  correctIndex: number
  comment: string
  effect?: 'steam' | 'error' | 'smoke' | 'shake' | 'sparks'
  criticalWrong?: number[]
}

export const LEVEL_ONE_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    situation: 'Котёл стал шуметь сильнее обычного. Что делать?',
    options: [
      'Подождать, само пройдёт.',
      'Проверить давление и вызвать диагностику.',
      'Постучать по корпусу.',
    ],
    correctIndex: 1,
    comment:
      'Шум может быть связан с давлением, загрязнением теплообменника или работой системы. Лучше проверить причину заранее.',
    effect: 'steam',
    criticalWrong: [2],
  },
  {
    id: 2,
    situation: 'На дисплее появилась ошибка.',
    options: [
      'Сбрасывать ошибку бесконечно.',
      'Выяснить причину и обратиться к специалисту.',
      'Заклеить дисплей.',
    ],
    correctIndex: 1,
    comment:
      'Ошибка — это сигнал системы. Если просто сбрасывать её снова и снова, причина может стать серьёзнее.',
    effect: 'error',
    criticalWrong: [0, 2],
  },
  {
    id: 3,
    situation: 'Появился запах гари рядом с котлом.',
    options: [
      'Проветрить и забыть.',
      'Выключить оборудование и вызвать мастера.',
      'Добавить мощность котла.',
    ],
    correctIndex: 1,
    comment:
      'Запах гари нельзя игнорировать. Это повод остановить оборудование и обратиться к специалисту.',
    effect: 'smoke',
    criticalWrong: [0, 2],
  },
  {
    id: 4,
    situation: 'Давление в системе постоянно падает.',
    options: [
      'Постоянно доливать воду и ничего не проверять.',
      'Проверить систему на утечки и вызвать диагностику.',
      'Открыть все окна.',
    ],
    correctIndex: 1,
    comment:
      'Постоянное падение давления может говорить об утечке или проблемах в системе отопления.',
    effect: 'steam',
    criticalWrong: [0],
  },
]

// Уровень 2 — заявки мастера
export interface MasterTicket {
  id: number
  settlement: string
  message: string
  options: string[]
  correctIndex: number
  comment: string
}

export const LEVEL_TWO_TICKETS: MasterTicket[] = [
  {
    id: 1,
    settlement: 'Сатка',
    message: 'Котёл включается, потом тухнет. На дисплее ошибка.',
    options: [
      'Сразу менять котёл.',
      'Уточнить модель, код ошибки и провести диагностику.',
      'Посоветовать выключить отопление до весны.',
    ],
    correctIndex: 1,
    comment: 'Отличное решение. Диагностика помогает найти проблему до серьёзной поломки.',
  },
  {
    id: 2,
    settlement: 'Бакал',
    message: 'Батареи в дальних комнатах почти холодные.',
    options: [
      'Проверить циркуляцию, воздух в системе, давление и балансировку.',
      'Сказать, что так и должно быть.',
      'Посоветовать купить обогреватель.',
    ],
    correctIndex: 0,
    comment: 'Дом становится теплее. Вы двигаетесь в правильном направлении.',
  },
  {
    id: 3,
    settlement: 'Межевой',
    message: 'Купили новый котёл, хотим правильно запустить.',
    options: [
      'Запустить самостоятельно без проверки.',
      'Вызвать специалиста для запуска и проверки подключения.',
      'Включить на максимум и ждать.',
    ],
    correctIndex: 1,
    comment: 'Правильный запуск продлевает срок службы оборудования.',
  },
]

// Уровень 3 — опасно / не опасно
export type RiskAnswer = 'Опасно' | 'Рискованно' | 'Нужна проверка' | 'Нормально'

export interface RiskQuestion {
  id: number
  situation: string
  correct: RiskAnswer
  options: RiskAnswer[]
}

export const LEVEL_THREE_QUESTIONS: RiskQuestion[] = [
  { id: 1, situation: 'Появился запах гари.', correct: 'Опасно', options: ['Опасно', 'Рискованно', 'Нужна проверка', 'Нормально'] },
  { id: 2, situation: 'Давление постоянно падает.', correct: 'Опасно', options: ['Опасно', 'Рискованно', 'Нужна проверка', 'Нормально'] },
  { id: 3, situation: 'Котёл не обслуживали больше года.', correct: 'Рискованно', options: ['Опасно', 'Рискованно', 'Нужна проверка', 'Нормально'] },
  { id: 4, situation: 'Батареи греют неравномерно.', correct: 'Нужна проверка', options: ['Опасно', 'Рискованно', 'Нужна проверка', 'Нормально'] },
  { id: 5, situation: 'Котёл работает стабильно после обслуживания.', correct: 'Нормально', options: ['Опасно', 'Рискованно', 'Нужна проверка', 'Нормально'] },
  { id: 6, situation: 'Дымоход или вентиляция вызывают сомнения.', correct: 'Опасно', options: ['Опасно', 'Рискованно', 'Нужна проверка', 'Нормально'] },
]

// Уровень 4 — сборка отопления
export const HEATING_SEQUENCE = [
  'Котёл',
  'Группа безопасности',
  'Насос',
  'Фильтр',
  'Трубы',
  'Радиаторы',
  'Расширительный бак',
  'Дымоход',
  'Вентиляция',
] as const

export const HEATING_ELEMENTS = [...HEATING_SEQUENCE, 'Термостат', 'Клапан'] as const

export const HEATING_HINTS: Record<string, string> = {
  Термостат: 'Термостат важен, но сначала нужна базовая схема безопасности.',
  Клапан: 'Клапан без правильной последовательности монтажа не спасёт систему.',
}

// Уровень 5 — зимний режим
export interface WinterAction {
  id: string
  label: string
  type: 'good' | 'bad'
  heatDelta: number
  safetyDelta: number
  comment: string
}

export const WINTER_ACTIONS: WinterAction[] = [
  { id: 'service', label: 'Вызвать обслуживание', type: 'good', heatDelta: 12, safetyDelta: 10, comment: 'Профилактика — лучший союзник перед морозами.' },
  { id: 'pressure', label: 'Проверить давление', type: 'good', heatDelta: 10, safetyDelta: 8, comment: 'Стабильное давление держит систему в рабочем режиме.' },
  { id: 'chimney', label: 'Проверить дымоход', type: 'good', heatDelta: 10, safetyDelta: 12, comment: 'Чистый дымоход — спокойная работа котла.' },
  { id: 'filter', label: 'Почистить фильтр', type: 'good', heatDelta: 8, safetyDelta: 6, comment: 'Чистый фильтр снижает нагрузку на оборудование.' },
  { id: 'vent', label: 'Проверить вентиляцию', type: 'good', heatDelta: 8, safetyDelta: 10, comment: 'Воздух должен циркулировать правильно.' },
  { id: 'ignore', label: 'Игнорировать ошибку', type: 'bad', heatDelta: -15, safetyDelta: -20, comment: 'Опасный выбор. Ошибку лучше разобрать до морозов.' },
  { id: 'max', label: 'Включить котёл на максимум', type: 'bad', heatDelta: -10, safetyDelta: -15, comment: 'Резкий перегрев не ускорит подготовку к зиме.' },
  { id: 'block', label: 'Закрыть доступ воздуха', type: 'bad', heatDelta: -12, safetyDelta: -18, comment: 'Без воздуха котёл работает нестабильно и опасно.' },
]

export const WINTER_GOAL_HEAT = 70
export const WINTER_GOAL_GOOD_ACTIONS = 5
