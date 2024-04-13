import { useLimit, type LimitType } from './useLimit.ts'
import type { Vector1DType } from './Vector1d.ts'

export type ScrollLooperType = ReturnType<typeof useScrollLooper>

/**
 * Пользовательский хук, который предоставляет функциональность циклической прокрутки.
 *
 * @param contentSize - Размер контента, который нужно прокрутить.
 * @param limit - Ограничения прокрутки.
 * @param offsetLocation - Текущее положение смещения.
 * @param vectors - Векторы, представляющие позицию прокрутки.
 * @returns Объект с функцией `loop` для циклической прокрутки.
 */
export function useScrollLooper(
  contentSize: number,
  limit: LimitType,
  offsetLocation: Vector1DType,
  vectors: Vector1DType[]
) {
  const jointSafety = 0.1
  const min = limit.min + jointSafety
  const max = limit.max + jointSafety
  const { reachedMin, reachedMax } = useLimit(min, max)

  /**
   * Проверяет, должна ли происходить циклическая прокрутка в заданном направлении.
   *
   * @param direction - Направление прокрутки (1 для вперед, -1 для назад).
   * @returns Булево значение, указывающее, должна ли происходить циклическая прокрутка в заданном направлении.
   */
  function shouldLoop(direction: number): boolean {
    if (direction === 1) return reachedMax(offsetLocation.get())
    if (direction === -1) return reachedMin(offsetLocation.get())
    return false
  }

  /**
   * Циклически изменяет позицию прокрутки в заданном направлении.
   *
   * @param direction - Направление прокрутки (1 для вперед, -1 для назад).
   */
  function loop(direction: number): void {
    if (!shouldLoop(direction)) return

    const loopDistance = contentSize * (direction * -1)
    vectors.forEach((v) => v.add(loopDistance))
  }

  const self = {
    loop
  } as const

  return self
}
