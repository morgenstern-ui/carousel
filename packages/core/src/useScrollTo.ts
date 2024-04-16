import type { AnimationsType } from './useAnimations.ts'
import type { CounterType } from './useCounter.ts'
import type { EventHandlerType } from './useEventHandler.ts'
import type { ScrollBodyType } from './useScrollBody.ts'
import type { ScrollTargetType, TargetType } from './useScrollTarget.ts'
import type { Vector1DType } from './useVector1D.ts'

export type ScrollToType = ReturnType<typeof useScrollTo>

/**
 * Хук, который предоставляет функцию для прокрутки к определенной цели.
 *
 * @param animation - Объект анимации.
 * @param indexCurrent - Текущий счетчик индекса.
 * @param indexPrevious - Предыдущий счетчик индекса.
 * @param scrollBody - Тип прокрутки тела.
 * @param scrollTarget - Тип цели прокрутки.
 * @param targetVector - Тип вектора цели.
 * @param eventHandler - Тип обработчика событий.
 * @returns Объект, содержащий функции distance и index для прокрутки.
 */
export function useScrollTo(
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
   *
   * @param target - Цель для прокрутки.
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
   *
   * @param n - Расстояние для прокрутки.
   * @param snap - Привязываться ли к ближайшей цели.
   */
  function distance(n: number, snap: boolean): void {
    const target = scrollTarget.byDistance(n, snap)
    scrollTo(target)
  }

  /**
   * Прокручивает до указанного индекса.
   *
   * @param n - Индекс для прокрутки.
   * @param direction - Направление прокрутки.
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
