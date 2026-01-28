import { isNumber } from './utils'

export type Vector1DType = {
  readonly get: () => number
  readonly set: (n: Vector1DType | number) => void
  readonly add: (n: Vector1DType | number) => void
  readonly subtract: (n: Vector1DType | number) => void
}

/**
 * Создает вектор с одним измерением.
 * @param initialValue - Начальное значение вектора.
 * @returns Объект с методами для манипуляции вектором.
 */
export function useVector1D(initialValue: number): Vector1DType {
  let value = initialValue

  /**
   * Возвращает текущее значение вектора.
   * @returns Текущее значение вектора.
   */
  function get(): number {
    return value
  }

  /**
   * Устанавливает значение вектора.
   * @param n - Новое значение вектора.
   */
  function set(n: Vector1DType | number): void {
    value = normalizeInput(n)
  }

  /**
   * Добавляет значение к вектору.
   * @param n - Значение, которое нужно добавить к вектору.
   */
  function add(n: Vector1DType | number): void {
    value += normalizeInput(n)
  }

  /**
   * Вычитает значение из вектора.
   * @param n - Значение, которое нужно вычесть из вектора.
   */
  function subtract(n: Vector1DType | number): void {
    value -= normalizeInput(n)
  }

  /**
   * Нормализует входное значение до числа.
   * @param n - Входное значение для нормализации.
   * @returns Нормализованное значение в виде числа.
   */
  function normalizeInput(n: Vector1DType | number): number {
    return isNumber(n) ? n : n.get()
  }

  return {
    get,
    set,
    add,
    subtract
  }
}
