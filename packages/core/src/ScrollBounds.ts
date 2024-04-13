import { Limit, type LimitType } from './Limit.ts'
import type { ScrollBodyType } from './ScrollBody.ts'
import type { Vector1DType } from './Vector1d.ts'
import { mathAbs } from './utils.ts'
import type { PercentOfViewType } from './PercentOfView.ts'

export type ScrollBoundsType = ReturnType<typeof ScrollBounds>

/**
 * Функция для создания объекта ограничений прокрутки.
 * @param {LimitType} limit - Объект ограничений.
 * @param {Vector1DType} offsetLocation - Вектор смещения.
 * @param {Vector1DType} target - Целевой вектор.
 * @param {ScrollBodyType} scrollBody - Объект тела прокрутки.
 * @param {PercentOfViewType} percentOfView - Объект процентного соотношения вида.
 * @returns {ScrollBoundsType} Возвращает объект ограничений прокрутки.
 */
export function ScrollBounds(
  limit: LimitType,
  offsetLocation: Vector1DType,
  target: Vector1DType,
  scrollBody: ScrollBodyType,
  percentOfView: PercentOfViewType
) {
  const pullBackThreshold = percentOfView.measure(10)
  const edgeOffsetTolerance = percentOfView.measure(50)
  const frictionLimit = Limit(0.1, 0.99)
  let disabled = false

  /**
   * Функция для определения необходимости ограничения.
   * @returns {boolean} Возвращает true, если необходимо ограничение, иначе false.
   */
  function shouldConstrain(): boolean {
    if (disabled) return false
    if (!limit.reachedAny(target.get())) return false
    if (!limit.reachedAny(offsetLocation.get())) return false
    return true
  }

  /**
   * Функция для применения ограничения.
   * @param {boolean} pointerDown - Флаг активности указателя.
   */
  function constrain(pointerDown: boolean): void {
    if (!shouldConstrain()) return
    const edge = limit.reachedMin(offsetLocation.get()) ? 'min' : 'max'
    const diffToEdge = mathAbs(limit[edge] - offsetLocation.get())
    const diffToTarget = target.get() - offsetLocation.get()
    const friction = frictionLimit.constrain(diffToEdge / edgeOffsetTolerance)

    target.subtract(diffToTarget * friction)

    if (!pointerDown && mathAbs(diffToTarget) < pullBackThreshold) {
      target.set(limit.constrain(target.get()))
      scrollBody.useDuration(25).useBaseFriction()
    }
  }

  /**
   * Функция для переключения активности ограничения.
   * @param {boolean} active - Флаг активности.
   */
  function toggleActive(active: boolean): void {
    disabled = !active
  }

  const self = {
    constrain,
    toggleActive
  } as const

  return self
}
