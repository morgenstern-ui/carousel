import { mathAbs } from './utils.ts'

export type LimitType = ReturnType<typeof useLimit>

/**
 * Создает объект ограничения, который может использоваться для ограничения числа в заданном диапазоне.
 * @param min - Минимальное значение диапазона. По умолчанию 0.
 * @param max - Максимальное значение диапазона. По умолчанию 0.
 * @returns Объект с утилитарными функциями для ограничения и манипулирования числами в заданном диапазоне.
 */
export function useLimit(min: number = 0, max: number = 0) {
  const length = mathAbs(min - max)

  /**
   * Проверяет, достигло ли число минимального значения диапазона.
   * @param n - Проверяемое число.
   * @returns Булево значение, указывающее, достигло ли число минимального значения.
   */
  function reachedMin(n: number): boolean {
    return n < min
  }

  /**
   * Проверяет, достигло ли число максимального значения диапазона.
   * @param n - Проверяемое число.
   * @returns Булево значение, указывающее, достигло ли число максимального значения.
   */
  function reachedMax(n: number): boolean {
    return n > max
  }

  /**
   * Проверяет, достигло ли число либо минимального, либо максимального значения диапазона.
   * @param n - Проверяемое число.
   * @returns Булево значение, указывающее, достигло ли число либо минимального, либо максимального значения.
   */
  function reachedAny(n: number): boolean {
    return reachedMin(n) || reachedMax(n)
  }

  /**
   * Ограничивает число в заданном диапазоне.
   * @param n - Ограничиваемое число.
   * @returns Ограниченное число. Если число находится в диапазоне, оно возвращается без изменений. Если оно меньше минимального значения, возвращается минимальное значение. Если оно больше максимального значения, возвращается максимальное значение.
   */
  function constrain(n: number): number {
    if (!reachedAny(n)) return n
    return reachedMin(n) ? min : max
  }

  /**
   * Удаляет смещение из числа на основе длины диапазона.
   * @param n - Число, из которого нужно удалить смещение.
   * @returns Число с удаленным смещением. Если длина диапазона равна 0, число возвращается без изменений.
   */
  function removeOffset(n: number): number {
    if (!length) return n
    return n - length * Math.ceil((n - max) / length)
  }

  const self = {
    length,
    max,
    min,
    constrain,
    reachedAny,
    reachedMax,
    reachedMin,
    removeOffset
  } as const

  return self
}
