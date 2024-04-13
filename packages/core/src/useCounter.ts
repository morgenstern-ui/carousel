import { useLimit } from "./useLimit.ts"
import { mathAbs } from "./utils.ts"

/**
 * Тип счетчика.
 */
export type CounterType = ReturnType<typeof useCounter>

/**
 * Создает и возвращает счетчик.
 * 
 * @param max - Максимальное значение счетчика.
 * @param start - Начальное значение счетчика.
 * @param loop - Флаг, указывающий, должен ли счетчик зацикливаться.
 * @returns Возвращает объект счетчика.
 */
export function useCounter(max: number, start: number, loop: boolean) {
  const { constrain } = useLimit(0, max)
  const loopEnd = max + 1
  let counter = withinLimit(start)

  /**
   * Проверяет, что значение находится в пределах ограничений счетчика.
   * 
   * @param n - Значение для проверки.
   * @returns Возвращает значение, ограниченное пределами счетчика.
   */
  function withinLimit(n: number): number {
    return !loop ? constrain(n) : mathAbs((loopEnd + n) % loopEnd)
  }

  /**
   * Возвращает текущее значение счетчика.
   * 
   * @returns Возвращает текущее значение счетчика.
   */
  function get(): number {
    return counter
  }

  /**
   * Устанавливает новое значение счетчика.
   * 
   * @param n - Новое значение счетчика.
   * @returns Возвращает объект счетчика.
   */
  function set(n: number): CounterType {
    counter = withinLimit(n)
    return self
  }

  /**
   * Увеличивает значение счетчика на указанное количество.
   * 
   * @param n - Количество, на которое нужно увеличить счетчик.
   * @returns Возвращает объект счетчика.
   */
  function add(n: number): CounterType {
    return clone().set(get() + n)
  }

  /**
   * Создает и возвращает копию счетчика.
   * 
   * @returns Возвращает копию счетчика.
   */
  function clone(): CounterType {
    return useCounter(max, get(), loop)
  }

  const self = {
    get,
    set,
    add,
    clone
  } as const

  return self
}
