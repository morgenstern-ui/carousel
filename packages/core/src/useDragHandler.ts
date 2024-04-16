import type { EmblaCarouselType } from './useEmblaCarousel.ts'
import type { AnimationsType } from './useAnimations.ts'
import type { CounterType } from './useCounter.ts'
import type { DragTrackerType, PointerEventType } from './useDragTracker.ts'
import type { EventHandlerType } from './useEventHandler.ts'
import type { AxisType } from './useAxis.ts'
import { useEventStore } from './useEventStore.ts'
import type { ScrollBodyType } from './useScrollBody.ts'
import type { ScrollTargetType } from './useScrollTarget.ts'
import type { ScrollToType } from './useScrollTo.ts'
import type { Vector1DType } from './useVector1D.ts'
import type { PercentOfViewType } from './usePercentOfView.ts'
import { useLimit } from './useLimit.ts'
import { deltaAbs, factorAbs, isBoolean, isMouseEvent, mathAbs, mathSign, type WindowType } from './utils.ts'

/**
 * Тип обратного вызова для обработчика перетаскивания.
 */
type DragHandlerCallbackType = (emblaApi: EmblaCarouselType, evt: PointerEventType) => boolean | void

/**
 * Тип опции для обработчика перетаскивания.
 */
export type DragHandlerOptionType = boolean | DragHandlerCallbackType

/**
 * Определение типа для обработчика перетаскивания.
 */
export type DragHandlerType = ReturnType<typeof useDragHandler>

/**
 * Функция для обработки поведения перетаскивания.
 * @param axis Конфигурация оси.
 * @param rootNode Корневой элемент карусели.
 * @param ownerDocument Документ-владелец.
 * @param ownerWindow Окно-владелец.
 * @param target Целевой вектор.
 * @param dragTracker Трекер перетаскивания.
 * @param location Вектор местоположения.
 * @param animation Конфигурация анимации.
 * @param scrollTo Конфигурация прокрутки.
 * @param scrollBody Конфигурация тела прокрутки.
 * @param scrollTarget Конфигурация цели прокрутки.
 * @param index Счетчик текущего индекса.
 * @param eventHandler Обработчик событий.
 * @param percentOfView Конфигурация процента видимости.
 * @param dragFree Флаг, указывающий, является ли перетаскивание свободным.
 * @param dragThreshold Порог перетаскивания.
 * @param skipSnaps Флаг, указывающий, пропускать ли снимки.
 * @param baseFriction Базовое значение трения.
 * @param watchDrag Опция обработчика перетаскивания.
 * @returns Объект обработчика перетаскивания.
 */
export function useDragHandler(
  axis: AxisType,
  rootNode: HTMLElement,
  ownerDocument: Document,
  ownerWindow: WindowType,
  target: Vector1DType,
  dragTracker: DragTrackerType,
  location: Vector1DType,
  animation: AnimationsType,
  scrollTo: ScrollToType,
  scrollBody: ScrollBodyType,
  scrollTarget: ScrollTargetType,
  index: CounterType,
  eventHandler: EventHandlerType,
  percentOfView: PercentOfViewType,
  dragFree: boolean,
  dragThreshold: number,
  skipSnaps: boolean,
  baseFriction: number,
  watchDrag: DragHandlerOptionType
) {
  const { cross: crossAxis, direction } = axis
  const focusNodes = ['INPUT', 'SELECT', 'TEXTAREA']
  const nonPassiveEvent = { passive: false }
  const initEvents = useEventStore()
  const dragEvents = useEventStore()
  const goToNextThreshold = useLimit(50, 225).constrain(percentOfView.measure(20))
  const snapForceBoost = { mouse: 300, touch: 400 }
  const freeForceBoost = { mouse: 500, touch: 600 }
  const baseSpeed = dragFree ? 43 : 25

  let isMoving = false
  let startScroll = 0
  let startCross = 0
  let pointerIsDown = false
  let preventScroll = false
  let preventClick = false
  let isMouse = false

  /**
   * Инициализирует обработчик перетаскивания.
   * @param emblaApi API карусели Embla.
   */
  function init(emblaApi: EmblaCarouselType): void {
    if (!watchDrag) return

    /**
     * Обрабатывает событие нажатия указателя, если разрешено.
     * @param evt Событие указателя.
     */
    function downIfAllowed(evt: PointerEventType): void {
      if (isBoolean(watchDrag) || watchDrag(emblaApi, evt)) down(evt)
    }

    const node = rootNode
    initEvents
      .add(node, 'dragstart', (evt) => evt.preventDefault(), nonPassiveEvent)
      .add(node, 'touchmove', () => undefined, nonPassiveEvent)
      .add(node, 'touchend', () => undefined)
      .add(node, 'touchstart', downIfAllowed)
      .add(node, 'mousedown', downIfAllowed)
      .add(node, 'touchcancel', up)
      .add(node, 'contextmenu', up)
      .add(node, 'click', click, true)
  }

  /**
   * Уничтожает обработчик перетаскивания.
   */
  function destroy(): void {
    initEvents.clear()
    dragEvents.clear()
  }

  /**
   * Добавляет события перетаскивания.
   */
  function addDragEvents(): void {
    const node = isMouse ? ownerDocument : rootNode
    dragEvents
      .add(node, 'touchmove', move, nonPassiveEvent)
      .add(node, 'touchend', up)
      .add(node, 'mousemove', move, nonPassiveEvent)
      .add(node, 'mouseup', up)
  }

  /**
   * Проверяет, является ли узел фокусируемым.
   * @param node Проверяемый узел.
   * @returns True, если узел является фокусируемым, иначе false.
   */
  function isFocusNode(node: Element): boolean {
    const nodeName = node.nodeName || ''
    return focusNodes.includes(nodeName)
  }

  /**
   * Вычисляет значение усиления силы.
   * @returns Значение усиления силы.
   */
  function forceBoost(): number {
    const boost = dragFree ? freeForceBoost : snapForceBoost
    const type = isMouse ? 'mouse' : 'touch'
    return boost[type]
  }

  /**
   * Вычисляет разрешенное значение силы.
   * @param force Сырое значение силы.
   * @param targetChanged Флаг, указывающий, изменилась ли цель.
   * @returns Разрешенное значение силы.
   */
  function allowedForce(force: number, targetChanged: boolean): number {
    const next = index.add(mathSign(force) * -1)
    const baseForce = scrollTarget.byDistance(force, !dragFree).distance

    if (dragFree || mathAbs(force) < goToNextThreshold) return baseForce
    if (skipSnaps && targetChanged) return baseForce * 0.5

    return scrollTarget.byIndex(next.get(), 0).distance
  }

  /**
   * Обрабатывает событие нажатия указателя.
   * @param evt Событие указателя.
   */
  function down(evt: PointerEventType): void {
    const isMouseEvt = isMouseEvent(evt, ownerWindow)
    isMouse = isMouseEvt
    preventClick = dragFree && isMouseEvt && !evt.buttons && isMoving
    isMoving = deltaAbs(target.get(), location.get()) >= 2

    if (isMouseEvt && evt.button !== 0) return
    if (isFocusNode(evt.target as Element)) return

    pointerIsDown = true
    dragTracker.pointerDown(evt)
    scrollBody.useFriction(0).useDuration(0)
    target.set(location)
    addDragEvents()
    startScroll = dragTracker.readPoint(evt)
    startCross = dragTracker.readPoint(evt, crossAxis)
    eventHandler.emit('pointerDown')
  }

  /**
   * Обрабатывает событие перемещения указателя.
   * @param evt Событие указателя.
   */
  function move(evt: PointerEventType): void {
    const lastScroll = dragTracker.readPoint(evt)
    const lastCross = dragTracker.readPoint(evt, crossAxis)
    const diffScroll = deltaAbs(lastScroll, startScroll)
    const diffCross = deltaAbs(lastCross, startCross)

    if (!preventScroll && !isMouse) {
      if (!evt.cancelable) return up(evt)
      preventScroll = diffScroll > diffCross
      if (!preventScroll) return up(evt)
    }

    const diff = dragTracker.pointerMove(evt)

    if (diffScroll > dragThreshold) preventClick = true

    scrollBody.useFriction(0.3).useDuration(1)
    animation.start()
    target.add(direction(diff))
    evt.preventDefault()
  }

  /**
   * Обрабатывает событие отпускания указателя.
   * @param evt Событие указателя.
   */
  function up(evt: PointerEventType): void {
    const currentLocation = scrollTarget.byDistance(0, false)
    const targetChanged = currentLocation.index !== index.get()
    const rawForce = dragTracker.pointerUp(evt) * forceBoost()
    const force = allowedForce(direction(rawForce), targetChanged)
    const forceFactor = factorAbs(rawForce, force)
    const speed = baseSpeed - 10 * forceFactor
    const friction = baseFriction + forceFactor / 50

    preventScroll = false
    pointerIsDown = false
    dragEvents.clear()
    scrollBody.useDuration(speed).useFriction(friction)
    scrollTo.distance(force, !dragFree)
    isMouse = false
    eventHandler.emit('pointerUp')
  }

  /**
   * Обрабатывает событие клика.
   * @param evt Событие клика.
   */
  function click(evt: MouseEvent): void {
    if (preventClick) {
      evt.stopPropagation()
      evt.preventDefault()
      preventClick = false
    }
  }

  /**
   * Проверяет, нажат ли указатель.
   * @returns True, если указатель нажат, иначе false.
   */
  function pointerDown(): boolean {
    return pointerIsDown
  }

  const self = {
    init,
    pointerDown,
    destroy
  } as const

  return self
}
