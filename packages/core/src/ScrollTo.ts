import type { AnimationsType } from './Animations.ts'
import type { CounterType } from './Counter.ts'
import type { EventHandlerType } from './EventHandler.ts'
import type { ScrollBodyType } from './ScrollBody.ts'
import type { ScrollTargetType, TargetType } from './ScrollTarget.ts'
import type { Vector1DType } from './Vector1d.ts'

export type ScrollToType = ReturnType<typeof ScrollTo>

/**
 * Создает функцию для прокрутки до определенной позиции.
 * @param {AnimationsType} animation - Объект анимации.
 * @param {CounterType} indexCurrent - Текущий индекс.
 * @param {CounterType} indexPrevious - Предыдущий индекс.
 * @param {ScrollBodyType} scrollBody - Тело прокрутки.
 * @param {ScrollTargetType} scrollTarget - Цель прокрутки.
 * @param {Vector1DType} targetVector - Вектор цели.
 * @param {EventHandlerType} eventHandler - Обработчик событий.
 * @returns {ScrollToType} Функция прокрутки.
 */
export function ScrollTo(
  animation: AnimationsType,
  indexCurrent: CounterType,
  indexPrevious: CounterType,
  scrollBody: ScrollBodyType,
  scrollTarget: ScrollTargetType,
  targetVector: Vector1DType,
  eventHandler: EventHandlerType
) {
  /**
   * Прокручивает до указанной цели.
   * @param {TargetType} target - Цель прокрутки.
   */
  function scrollTo(target: TargetType): void {
    const distanceDiff = target.distance
    const indexDiff = target.index !== indexCurrent.get()

    targetVector.add(distanceDiff)

    if (distanceDiff) {
      if (scrollBody.duration()) {
        animation.start()
      } else {
        animation.update()
        animation.render(1)
        animation.update()
      }
    }

    if (indexDiff) {
      indexPrevious.set(indexCurrent.get())
      indexCurrent.set(target.index)
      eventHandler.emit('select')
    }
  }

  /**
   * Прокручивает на указанное расстояние.
   * @param {number} n - Расстояние для прокрутки.
   * @param {boolean} snap - Флаг для привязки к ближайшему элементу.
   */
  function distance(n: number, snap: boolean): void {
    const target = scrollTarget.byDistance(n, snap)
    scrollTo(target)
  }

  /**
   * Прокручивает до указанного индекса.
   * @param {number} n - Индекс для прокрутки.
   * @param {number} direction - Направление прокрутки.
   */
  function index(n: number, direction: number): void {
    const targetIndex = indexCurrent.clone().set(n)
    const target = scrollTarget.byIndex(targetIndex.get(), direction)
    scrollTo(target)
  }

  const self = {
    distance,
    index
  } as const

  return self
}
