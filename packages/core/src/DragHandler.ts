import type { EmblaCarouselType } from './EmblaCarousel.ts'
import type { AnimationsType } from './Animations.ts'
import type { CounterType } from './Counter.ts'
import type { DragTrackerType, PointerEventType } from './DragTracker.ts'
import type { EventHandlerType } from './EventHandler.ts'
import type { AxisType } from './Axis.ts'
import { EventStore } from './EventStore.ts'
import type { ScrollBodyType } from './ScrollBody.ts'
import type { ScrollTargetType } from './ScrollTarget.ts'
import type { ScrollToType } from './ScrollTo.ts'
import type { Vector1DType } from './Vector1d.ts'
import type { PercentOfViewType } from './PercentOfView.ts'
import { Limit } from './Limit.ts'
import {
  deltaAbs,
  factorAbs,
  isBoolean,
  isMouseEvent,
  mathAbs,
  mathSign,
  type WindowType
} from './utils.ts'

type DragHandlerCallbackType = (
  emblaApi: EmblaCarouselType,
  evt: PointerEventType
) => boolean | void

export type DragHandlerOptionType = boolean | DragHandlerCallbackType

export type DragHandlerType = ReturnType<typeof DragHandler>

/**
 * Создает обработчик перетаскивания.
 *
 * @param {AxisType} axis - Тип оси.
 * @param {HTMLElement} rootNode - Корневой элемент.
 * @param {Document} ownerDocument - Документ-владелец.
 * @param {WindowType} ownerWindow - Окно-владелец.
 * @param {Vector1DType} target - Целевой вектор.
 * @param {DragTrackerType} dragTracker - Трекер перетаскивания.
 * @param {Vector1DType} location - Местоположение.
 * @param {AnimationsType} animation - Анимация.
 * @param {ScrollToType} scrollTo - Функция прокрутки до.
 * @param {ScrollBodyType} scrollBody - Тело прокрутки.
 * @param {ScrollTargetType} scrollTarget - Цель прокрутки.
 * @param {CounterType} index - Индекс.
 * @param {EventHandlerType} eventHandler - Обработчик событий.
 * @param {PercentOfViewType} percentOfView - Процент отображения.
 * @param {boolean} dragFree - Свободное перетаскивание.
 * @param {number} dragThreshold - Порог перетаскивания.
 * @param {boolean} skipSnaps - Пропустить снимки.
 * @param {number} baseFriction - Базовое трение.
 * @param {DragHandlerOptionType} watchDrag - Опция наблюдения за перетаскиванием.
 * @returns {DragHandlerType} - Возвращает тип обработчика перетаскивания.
 */
export function DragHandler(
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
  const initEvents = EventStore()
  const dragEvents = EventStore()
  const goToNextThreshold = Limit(50, 225).constrain(percentOfView.measure(20))
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
   * @param {EmblaCarouselType} emblaApi - API карусели Embla.
   */
  function init(emblaApi: EmblaCarouselType): void {
    if (!watchDrag) return

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
   * Проверяет, является ли узел узлом фокуса.
   * @param {Element} node - Узел для проверки.
   * @returns {boolean} Возвращает true, если узел является узлом фокуса, иначе false.
   */
  function isFocusNode(node: Element): boolean {
    const nodeName = node.nodeName || ''
    return focusNodes.includes(nodeName)
  }

  /**
   * Вычисляет усиление силы.
   * @returns {number} Возвращает усиление силы.
   */
  function forceBoost(): number {
    const boost = dragFree ? freeForceBoost : snapForceBoost
    const type = isMouse ? 'mouse' : 'touch'
    return boost[type]
  }

  /**
   * Вычисляет разрешенную силу.
   * @param {number} force - Исходная сила.
   * @param {boolean} targetChanged - Флаг, указывающий, изменилась ли цель.
   * @returns {number} Возвращает разрешенную силу.
   */
  function allowedForce(force: number, targetChanged: boolean): number {
    const next = index.add(mathSign(force) * -1)
    const baseForce = scrollTarget.byDistance(force, !dragFree).distance

    if (dragFree || mathAbs(force) < goToNextThreshold) return baseForce
    if (skipSnaps && targetChanged) return baseForce * 0.5

    return scrollTarget.byIndex(next.get(), 0).distance
  }

  /**
   * Обрабатывает событие "вниз".
   * @param {PointerEventType} evt - Событие указателя.
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
   * Обрабатывает событие "движение".
   * @param {PointerEventType} evt - Событие указателя.
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
   * Обрабатывает событие "вверх".
   * @param {PointerEventType} evt - Событие указателя.
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
   * Обрабатывает событие "клик".
   * @param {MouseEvent} evt - Событие мыши.
   */
  function click(evt: MouseEvent): void {
    if (preventClick) {
      evt.stopPropagation()
      evt.preventDefault()
      preventClick = false
    }
  }

  /**
   * Проверяет, происходит ли в данный момент нажатие указателя.
   * @returns {boolean} Возвращает true, если происходит нажатие указателя, иначе false.
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
