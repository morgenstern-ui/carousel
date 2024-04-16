import { useLimit, type LimitType } from './useLimit.ts'
import type { ScrollBodyType } from './useScrollBody.ts'
import type { Vector1DType } from './useVector1D.ts'
import { mathAbs } from './utils.ts'
import type { PercentOfViewType } from './usePercentOfView.ts'

/**
 * Представляет тип хука `useScrollBounds`.
 */
export type ScrollBoundsType = ReturnType<typeof useScrollBounds>

/**
 * Хук, предоставляющий функциональность ограничения прокрутки.
 * @param limit - Ограничение прокрутки.
 * @param offsetLocation - Текущее смещение.
 * @param target - Целевое смещение.
 * @param scrollBody - Тело прокрутки.
 * @param percentOfView - Процент отображения.
 * @returns Объект, содержащий функции `constrain` и `toggleActive`.
 */
export function useScrollBounds(
  limit: LimitType,
  offsetLocation: Vector1DType,
  target: Vector1DType,
  scrollBody: ScrollBodyType,
  percentOfView: PercentOfViewType
) {
  const pullBackThreshold = percentOfView.measure(10)
  const edgeOffsetTolerance = percentOfView.measure(50)
  const frictionLimit = useLimit(0.1, 0.99)
  let disabled = false

  /**
   * Проверяет, должна ли быть ограничена прокрутка.
   * @returns Булево значение, указывающее, должна ли быть ограничена прокрутка.
   */
  function shouldConstrain(): boolean {
    if (disabled) return false
    if (!limit.reachedAny(target.get())) return false
    if (!limit.reachedAny(offsetLocation.get())) return false
    return true
  }

  /**
   * Ограничивает прокрутку в пределах границ.
   * @param pointerDown - Булево значение, указывающее, нажата ли кнопка указателя.
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
   * Переключает активное состояние границ прокрутки.
   * @param active - Булево значение, указывающее, должны ли границы прокрутки быть активными.
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
