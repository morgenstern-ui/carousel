import { isNumber } from './utils'

export type Vector1DType = ReturnType<typeof Vector1D>

/**
 * Функция для создания вектора в одномерном пространстве.
 * @param {number} initialValue - Начальное значение вектора.
 * @returns {Vector1DType} Возвращает объект вектора.
 */
export function Vector1D(initialValue: number) {
  let value = initialValue

  /**
   * Функция для получения текущего значения вектора.
   * @returns {number} Возвращает текущее значение вектора.
   */
  function get(): number {
    return value
  }

  /**
   * Функция для установки нового значения вектора.
   * @param {Vector1DType | number} n - Новое значение вектора.
   */
  function set(n: Vector1DType | number): void {
    value = normalizeInput(n)
  }

  /**
   * Функция для добавления значения к текущему значению вектора.
   * @param {Vector1DType | number} n - Значение, которое нужно добавить к текущему значению вектора.
   */
  function add(n: Vector1DType | number): void {
    value += normalizeInput(n)
  }

  /**
   * Функция для вычитания значения из текущего значения вектора.
   * @param {Vector1DType | number} n - Значение, которое нужно вычесть из текущего значения вектора.
   */
  function subtract(n: Vector1DType | number): void {
    value -= normalizeInput(n)
  }

  /**
   * Функция для нормализации входного значения.
   * @param {Vector1DType | number} n - Входное значение.
   * @returns {number} Возвращает нормализованное значение.
   */
  function normalizeInput(n: Vector1DType | number): number {
    return isNumber(n) ? n : n.get()
  }

  const self = {
    get,
    set,
    add,
    subtract
  } as const

  return self
}
