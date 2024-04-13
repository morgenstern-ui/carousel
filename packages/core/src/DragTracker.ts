import type { AxisOptionType, AxisType } from './Axis.ts'
import { isMouseEvent, mathAbs, type WindowType } from './utils.ts'

type PointerCoordType = keyof Touch | keyof MouseEvent
export type PointerEventType = TouchEvent | MouseEvent

export type DragTrackerType = ReturnType<typeof useDragTracker>

/**
 * Создает отслеживатель перетаскивания для определенной оси.
 *
 * @param axis - Тип оси ('x' или 'y').
 * @param ownerWindow - Объект окна.
 * @returns Объект с методами для отслеживания событий указателя и расчета силы перетаскивания.
 */
export function useDragTracker(axis: AxisType, ownerWindow: WindowType) {
  const logInterval = 170

  let startEvent: PointerEventType
  let lastEvent: PointerEventType

  /**
   * Считывает время из события указателя.
   *
   * @param evt - Событие указателя.
   * @returns Временная метка события.
   */
  function readTime(evt: PointerEventType): number {
    return evt.timeStamp
  }

  /**
   * Считывает значение координаты из события указателя.
   *
   * @param evt - Событие указателя.
   * @param evtAxis - Тип опции оси.
   * @returns Значение координаты.
   */
  function readPoint(evt: PointerEventType, evtAxis?: AxisOptionType): number {
    const property = evtAxis || axis.scroll
    const coord: PointerCoordType = `client${property === 'x' ? 'X' : 'Y'}`

    return (isMouseEvent(evt, ownerWindow) ? evt : evt.touches[0])[coord]
  }

  /**
   * Обрабатывает событие нажатия указателя.
   *
   * @param evt - Событие указателя.
   * @returns Разница в значениях координат.
   */
  function pointerDown(evt: PointerEventType): number {
    startEvent = evt
    lastEvent = evt

    return readPoint(evt)
  }

  /**
   * Обрабатывает событие перемещения указателя.
   *
   * @param evt - Событие указателя.
   * @returns Разница в значениях координат.
   */
  function pointerMove(evt: PointerEventType): number {
    const diff = readPoint(evt) - readPoint(lastEvent)
    const expired = readTime(evt) - readTime(startEvent) > logInterval

    lastEvent = evt
    if (expired) startEvent = evt

    return diff
  }

  /**
   * Обрабатывает событие отпускания указателя.
   *
   * @param evt - Событие указателя.
   * @returns Рассчитанная сила перетаскивания.
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
