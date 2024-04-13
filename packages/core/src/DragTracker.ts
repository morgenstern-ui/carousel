import type { AxisOptionType, AxisType } from './Axis.ts'
import { isMouseEvent, mathAbs, type WindowType } from './utils.ts'

type PointerCoordType = keyof Touch | keyof MouseEvent
export type PointerEventType = TouchEvent | MouseEvent

export type DragTrackerType = ReturnType<typeof DragTracker>

/**
 * Функция для создания трекера перетаскивания.
 * @param {AxisType} axis - Ось прокрутки.
 * @param {WindowType} ownerWindow - Окно, в котором происходит перетаскивание.
 * @returns {DragTrackerType} Возвращает объект трекера перетаскивания.
 */
export function DragTracker(
  axis: AxisType,
  ownerWindow: WindowType
) {
  const logInterval = 170

  let startEvent: PointerEventType
  let lastEvent: PointerEventType

  /**
   * Функция для создания трекера перетаскивания.
   * @param {AxisType} axis - Ось прокрутки.
   * @param {WindowType} ownerWindow - Окно, в котором происходит перетаскивание.
   * @returns {DragTrackerType} Возвращает объект трекера перетаскивания.
   */
  function readTime(evt: PointerEventType): number {
    return evt.timeStamp
  }
  /**
   * Функция для чтения координаты указателя.
   * @param {PointerEventType} evt - Событие указателя.
   * @param {AxisOptionType} [evtAxis] - Ось события.
   * @returns {number} Возвращает координату указателя.
   */
  function readPoint(evt: PointerEventType, evtAxis?: AxisOptionType): number {
    const property = evtAxis || axis.scroll
    const coord: PointerCoordType = `client${property === 'x' ? 'X' : 'Y'}`

    return (isMouseEvent(evt, ownerWindow) ? evt : evt.touches[0])[coord]
  }

  /**
   * Функция для обработки начала перетаскивания.
   * @param {PointerEventType} evt - Событие указателя.
   * @returns {number} Возвращает координату указателя.
   */
  function pointerDown(evt: PointerEventType): number {
    startEvent = evt
    lastEvent = evt

    return readPoint(evt)
  }

  /**
   * Функция для обработки перемещения при перетаскивании.
   * @param {PointerEventType} evt - Событие указателя.
   * @returns {number} Возвращает разницу между текущей и последней координатой указателя.
   */
  function pointerMove(evt: PointerEventType): number {
    const diff = readPoint(evt) - readPoint(lastEvent)
    const expired = readTime(evt) - readTime(startEvent) > logInterval

    lastEvent = evt
    if (expired) startEvent = evt

    return diff
  }

  /**
   * Функция для обработки окончания перетаскивания.
   * @param {PointerEventType} evt - Событие указателя.
   * @returns {number} Возвращает силу, с которой было произведено перетаскивание, или 0, если перетаскивание не было произведено.
   */
  function pointerUp(evt: PointerEventType): number {
    if (!startEvent || !lastEvent) return 0

    const diffDrag = readPoint(lastEvent) - readPoint(startEvent)
    const diffTime = readTime(evt) - readTime(startEvent)
    const expired = readTime(evt) - readTime(lastEvent) > logInterval
    const force = diffDrag / diffTime
    const isFlick = diffTime && !expired && mathAbs(force) > 0.1

    return isFlick ? force : 0
  }

  const self = {
    pointerDown,
    pointerMove,
    pointerUp,
    readPoint
  } as const

  return self
}
