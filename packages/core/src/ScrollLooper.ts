import { Limit, type LimitType } from './Limit.ts'
import type { Vector1DType } from './Vector1d'

export type ScrollLooperType = ReturnType<typeof ScrollLooper>

/**
 * Функция для создания объекта циклической прокрутки.
 * @param {number} contentSize - Размер содержимого.
 * @param {LimitType} limit - Объект ограничения.
 * @param {Vector1DType} offsetLocation - Объект вектора смещения.
 * @param {Vector1DType[]} vectors - Массив векторов.
 * @returns {ScrollLooperType} Возвращает объект циклической прокрутки.
 */
export function ScrollLooper(
  contentSize: number,
  limit: LimitType,
  offsetLocation: Vector1DType,
  vectors: Vector1DType[]
) {
  const jointSafety = 0.1
  const min = limit.min + jointSafety
  const max = limit.max + jointSafety
  const { reachedMin, reachedMax } = Limit(min, max)

  /**
   * Функция для определения необходимости циклической прокрутки.
   * @param {number} direction - Направление.
   * @returns {boolean} Возвращает true, если необходима циклическая прокрутка, иначе false.
   */
  function shouldLoop(direction: number): boolean {
    if (direction === 1) return reachedMax(offsetLocation.get())
    if (direction === -1) return reachedMin(offsetLocation.get())
    return false
  }

  /**
   * Функция для выполнения циклической прокрутки.
   * @param {number} direction - Направление.
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
