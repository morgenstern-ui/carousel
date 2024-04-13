import { Limit } from './Limit.ts'
import { mathAbs } from './utils.ts'

export type CounterType = ReturnType<typeof Counter>

/**
 * Экспортируемая функция Counter, которая создает объект для управления счетчиком.
 * @param {number} max - Максимальное значение счетчика.
 * @param {number} start - Начальное значение счетчика.
 * @param {boolean} loop - Флаг, указывающий, должен ли счетчик зацикливаться.
 * @returns {CounterType} Возвращает объект Counter.
 */
export function Counter(max: number, start: number, loop: boolean) {
  const { constrain } = Limit(0, max)
  const loopEnd = max + 1
  let counter = withinLimit(start)

  /**
   * Проверяет, находится ли значение в пределах допустимого диапазона.
   * @param {number} n - Значение для проверки.
   * @returns {number} Возвращает значение в пределах допустимого диапазона.
   */
  function withinLimit(n: number): number {
    return !loop ? constrain(n) : mathAbs((loopEnd + n) % loopEnd)
  }

  /**
   * Получает текущее значение счетчика.
   * @returns {number} Возвращает текущее значение счетчика.
   */
  function get(): number {
    return counter
  }

  /**
   * Устанавливает значение счетчика.
   * @param {number} n - Значение для установки.
   * @returns {CounterType} Возвращает объект Counter.
   */
  function set(n: number): CounterType {
    counter = withinLimit(n)
    return self
  }

  /**
   * Добавляет значение к счетчику.
   * @param {number} n - Значение для добавления.
   * @returns {CounterType} Возвращает объект Counter.
   */
  function add(n: number): CounterType {
    return clone().set(get() + n)
  }

  /**
   * Создает копию счетчика.
   * @returns {CounterType} Возвращает копию объекта Counter.
   */
  function clone(): CounterType {
    return Counter(max, get(), loop)
  }

  const self = {
    get,
    set,
    add,
    clone
  } as const

  return self
}
