import { useLimit, type LimitType } from './useLimit.ts'
import type { ScrollBodyType } from './useScrollBody.ts'
import type { Vector1DType } from './useVector1D.ts'
import { mathAbs } from './utils.ts'
import type { PercentOfViewType } from './usePercentOfContainer.ts'

/**
 * Представляет тип хука `useScrollBounds`.
 */
export type ScrollBoundsType = ReturnType<typeof useScrollBounds>

/**
 * Хук, предоставляющий функциональность ограничения прокрутки.
 * @param limit - Ограничение прокрутки.
 * @param offsetLocationVector - Текущее смещение.
 * @param targetVector - Целевое смещение.
 * @param scrollBody - Тело прокрутки.
 * @param percentOfContainer - Процент отображения.
 * @returns Объект, содержащий функции `constrain` и `toggleActive`.
 */
export function useScrollBounds(
  limit: LimitType,
  offsetLocationVector: Vector1DType,
  targetVector: Vector1DType,
  scrollBody: ScrollBodyType,
  percentOfContainer: PercentOfViewType
) {
  const pullBackThreshold = percentOfContainer.measure(10)
  const edgeOffsetTolerance = percentOfContainer.measure(50)
  const frictionLimit = useLimit(0.1, 0.99)
  let disabled = false

  /**
   * Ограничивает прокрутку в пределах границ.
   *
   * @param pointerDown - Булево значение, указывающее, нажата ли кнопка указателя.
   */
  function constrain(pointerDown: boolean): void {
    if (!shouldConstrain()) return
    const edge = limit.reachedMin(offsetLocationVector.get()) ? 'min' : 'max'
    const diffToEdge = mathAbs(limit[edge] - offsetLocationVector.get())
    const diffToTarget = targetVector.get() - offsetLocationVector.get()
    const friction = frictionLimit.constrain(diffToEdge / edgeOffsetTolerance)

    targetVector.subtract(diffToTarget * friction)

    if (!pointerDown && mathAbs(diffToTarget) < pullBackThreshold) {
      targetVector.set(limit.constrain(targetVector.get()))
      scrollBody.useDuration(25).useBaseFriction()
    }
  }

  /**
   * Переключает активное состояние границ прокрутки.
   *
   * @param active - Булево значение, указывающее, должны ли границы прокрутки быть активными.
   */
  function toggleActive(active: boolean): void {
    disabled = !active
  }

  /**
   * Проверяет, должна ли быть ограничена прокрутка.
   *
   * @returns Булево значение, указывающее, должна ли быть ограничена прокрутка.
   */
  function shouldConstrain(): boolean {
    if (disabled) return false
    if (!limit.reachedAny(targetVector.get())) return false
    if (!limit.reachedAny(offsetLocationVector.get())) return false
    return true
  }

  const self = {
    constrain,
    toggleActive
  } as const

  return self
}
