// ——— Уровень 1 — диагностика котла ———
export type ProblemZone = 'gauge' | 'display' | 'pipe' | 'chimney' | 'boiler'

export const ZONE_LABELS: Record<ProblemZone, string> = {
  gauge: 'Давление',
  display: 'Дисплей',
  pipe: 'Трубы',
  chimney: 'Дымоход',
  boiler: 'Корпус котла',
}

export interface DiagnosticQuestion {
  id: number
  situation: string
  symptom: string
  options: string[]
  correctIndex: number
  comment: string
  problemZone: ProblemZone
  effect?: 'steam' | 'error' | 'smoke' | 'shake' | 'sparks'
  criticalWrong?: number[]
}

export const LEVEL_ONE_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    symptom: 'Котёл стал шуметь сильнее обычного.',
    situation: 'Шум в трубах и контуре. Что делать?',
    options: ['Подождать, само пройдёт.', 'Проверить давление и вызвать диагностику.', 'Постучать по корпусу.'],
    correctIndex: 1,
    comment: 'Шум может быть связан с давлением, загрязнением теплообменника или работой системы.',
    problemZone: 'pipe',
    effect: 'steam',
    criticalWrong: [2],
  },
  {
    id: 2,
    symptom: 'На дисплее появилась ошибка.',
    situation: 'Код на дисплее. Ваши действия?',
    options: ['Сбрасывать ошибку бесконечно.', 'Выяснить причину и обратиться к специалисту.', 'Заклеить дисплей.'],
    correctIndex: 1,
    comment: 'Ошибка — сигнал системы. Бесконечный сброс не убирает причину.',
    problemZone: 'display',
    effect: 'error',
    criticalWrong: [0, 2],
  },
  {
    id: 3,
    symptom: 'Появился запах гари рядом с котлом.',
    situation: 'Запах у дымохода и котла. Что делать?',
    options: ['Проветрить и забыть.', 'Выключить оборудование и вызвать мастера.', 'Добавить мощность котла.'],
    correctIndex: 1,
    comment: 'Запах гари нельзя игнорировать — остановите оборудование.',
    problemZone: 'chimney',
    effect: 'smoke',
    criticalWrong: [0, 2],
  },
  {
    id: 4,
    symptom: 'Давление в системе постоянно падает.',
    situation: 'Манометр показывает падение. Ваш шаг?',
    options: ['Постоянно доливать воду и ничего не проверять.', 'Проверить систему на утечки и вызвать диагностику.', 'Открыть все окна.'],
    correctIndex: 1,
    comment: 'Падение давления часто говорит об утечке или проблемах в контуре.',
    problemZone: 'gauge',
    effect: 'steam',
    criticalWrong: [0],
  },
]

// ——— Уровень 2 — мастер ———
export type DispatchStatus = 'Диагностика' | 'Монтаж' | 'Запуск' | 'Срочно'

export const DISPATCH_ZONES: DispatchStatus[] = ['Диагностика', 'Монтаж', 'Запуск', 'Срочно']

export interface MasterTicket {
  id: number
  settlement: string
  message: string
  options: string[]
  correctIndex: number
  comment: string
  dispatchStatus: DispatchStatus
}

export const LEVEL_TWO_TICKETS: MasterTicket[] = [
  {
    id: 1,
    settlement: 'Сатка',
    message: 'Котёл включается, потом тухнет. На дисплее ошибка.',
    options: ['Сразу менять котёл.', 'Уточнить модель, код ошибки и провести диагностику.', 'Посоветовать выключить отопление до весны.'],
    correctIndex: 1,
    comment: 'Диагностика помогает найти проблему до серьёзной поломки.',
    dispatchStatus: 'Диагностика',
  },
  {
    id: 2,
    settlement: 'Бакал',
    message: 'Батареи в дальних комнатах почти холодные.',
    options: ['Проверить циркуляцию, воздух в системе, давление и балансировку.', 'Сказать, что так и должно быть.', 'Посоветовать купить обогреватель.'],
    correctIndex: 0,
    comment: 'Нужна проверка циркуляции и балансировки системы.',
    dispatchStatus: 'Диагностика',
  },
  {
    id: 3,
    settlement: 'Межевой',
    message: 'Купили новый котёл, хотим правильно запустить.',
    options: ['Запустить самостоятельно без проверки.', 'Вызвать специалиста для запуска и проверки подключения.', 'Включить на максимум и ждать.'],
    correctIndex: 1,
    comment: 'Правильный запуск продлевает срок службы оборудования.',
    dispatchStatus: 'Запуск',
  },
]

// ——— Уровень 3 — аркада ———
export type ArcadeZone = 'danger' | 'normal' | 'check'

export const ARCADE_ZONE_LABELS: Record<ArcadeZone, { title: string; hint: string }> = {
  danger: { title: 'Опасно', hint: '← сюда' },
  normal: { title: 'Нормально', hint: 'сюда →' },
  check: { title: 'Нужен мастер', hint: '↑ проверка' },
}

export interface RiskQuestion {
  id: number
  situation: string
  zone: ArcadeZone
}

export const LEVEL_THREE_QUESTIONS: RiskQuestion[] = [
  { id: 1, situation: 'Появился запах гари.', zone: 'danger' },
  { id: 2, situation: 'Давление постоянно падает.', zone: 'danger' },
  { id: 3, situation: 'Котёл не обслуживали больше года.', zone: 'check' },
  { id: 4, situation: 'Батареи греют неравномерно.', zone: 'check' },
  { id: 5, situation: 'Котёл работает стабильно после обслуживания.', zone: 'normal' },
  { id: 6, situation: 'Дымоход или вентиляция вызывают сомнения.', zone: 'danger' },
]

// ——— Уровень 4 — сборка (без подсказки порядка) ———
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

/** Слоты с нейтральными названиями — не выдают порядок элементов */
export const HEATING_SLOTS = [
  { id: 'source', label: 'Источник тепла' },
  { id: 'safety', label: 'Узел безопасности' },
  { id: 'pump', label: 'Циркуляция' },
  { id: 'filter', label: 'Очистка контура' },
  { id: 'main', label: 'Магистраль' },
  { id: 'emitters', label: 'Отдача тепла' },
  { id: 'expansion', label: 'Компенсация объёма' },
  { id: 'flue', label: 'Отвод газов' },
  { id: 'air', label: 'Воздухообмен' },
] as const

export const ELEMENT_TO_SLOT: Record<string, string> = {
  Котёл: 'source',
  'Группа безопасности': 'safety',
  Насос: 'pump',
  Фильтр: 'filter',
  Трубы: 'main',
  Радиаторы: 'emitters',
  'Расширительный бак': 'expansion',
  Дымоход: 'flue',
  Вентиляция: 'air',
}

export const HEATING_PIECES = [
  ...HEATING_SEQUENCE,
  'Термостат',
  'Клапан',
  'Тройник',
  'Датчик',
] as const

export const DECOY_PIECES = ['Термостат', 'Клапан', 'Тройник', 'Датчик']

// ——— Уровень 5 — зимний режим ———
export type WinterZone = 'now' | 'check' | 'danger'

export const WINTER_ZONE_LABELS: Record<WinterZone, string> = {
  now: 'Сделать сейчас',
  check: 'Проверить',
  danger: 'Не делать',
}

export interface WinterAction {
  id: string
  label: string
  type: 'good' | 'bad'
  targetZone: WinterZone
  heatDelta: number
  comment: string
}

export const WINTER_ACTIONS: WinterAction[] = [
  { id: 'service', label: 'Вызвать обслуживание', type: 'good', targetZone: 'now', heatDelta: 12, comment: 'Профилактика — лучший союзник перед морозами.' },
  { id: 'pressure', label: 'Проверить давление', type: 'good', targetZone: 'check', heatDelta: 10, comment: 'Стабильное давление держит систему в рабочем режиме.' },
  { id: 'chimney', label: 'Проверить дымоход', type: 'good', targetZone: 'check', heatDelta: 10, comment: 'Чистый дымоход — спокойная работа котла.' },
  { id: 'filter', label: 'Почистить фильтр', type: 'good', targetZone: 'now', heatDelta: 8, comment: 'Чистый фильтр снижает нагрузку на оборудование.' },
  { id: 'vent', label: 'Проверить вентиляцию', type: 'good', targetZone: 'check', heatDelta: 8, comment: 'Воздух должен циркулировать правильно.' },
  { id: 'ignore', label: 'Игнорировать ошибку', type: 'bad', targetZone: 'danger', heatDelta: -15, comment: 'Опасный выбор. Ошибку лучше разобрать до морозов.' },
  { id: 'max', label: 'Включить котёл на максимум', type: 'bad', targetZone: 'danger', heatDelta: -10, comment: 'Резкий перегрев не ускорит подготовку к зиме.' },
  { id: 'block', label: 'Закрыть доступ воздуха', type: 'bad', targetZone: 'danger', heatDelta: -12, comment: 'Без воздуха котёл работает нестабильно и опасно.' },
]

export const WINTER_GOAL_HEAT = 70
export const WINTER_GOAL_GOOD_ACTIONS = 5
