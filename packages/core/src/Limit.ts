import { mathAbs } from './utils.ts'

export type LimitType = ReturnType<typeof Limit>

/**
 * Функция для создания объекта ограничений.
 * @param {number} [min=0] - Минимальное значение.
 * @param {number} [max=0] - Максимальное значение.
 * @returns {LimitType} Возвращает объект ограничений.
 */
export function Limit(min: number = 0, max: number = 0) {
  const length = mathAbs(min - max)

  /**
   * Функция для проверки, достигло ли число минимального значения.
   * @param {number} n - Проверяемое число.
   * @returns {boolean} Возвращает true, если число достигло минимального значения, иначе false.
   */
  function reachedMin(n: number): boolean {
    return n < min
  }

  /**
   * Функция для проверки, достигло ли число максимального значения.
   * @param {number} n - Проверяемое число.
   * @returns {boolean} Возвращает true, если число достигло максимального значения, иначе false.
   */
  function reachedMax(n: number): boolean {
    return n > max
  }

  /**
   * Функция для проверки, достигло ли число минимального или максимального значения.
   * @param {number} n - Проверяемое число.
   * @returns {boolean} Возвращает true, если число достигло минимального или максимального значения, иначе false.
   */
  function reachedAny(n: number): boolean {
    return reachedMin(n) || reachedMax(n)
  }

  /**
   * Функция для ограничения числа в пределах min и max.
   * @param {number} n - Число для ограничения.
   * @returns {number} Возвращает ограниченное число.
   */
  function constrain(n: number): number {
    if (!reachedAny(n)) return n
    return reachedMin(n) ? min : max
  }

  /**
   * Функция для удаления смещения.
   * @param {number} n - Число, от которого требуется удалить смещение.
   * @returns {number} Возвращает число без смещения.
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

