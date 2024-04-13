import { Limit } from './Limit.ts'
import { arrayLast } from './utils.ts'

export type ScrollLimitType = ReturnType<typeof ScrollLimit>
/**
 * Функция для создания объекта ограничения прокрутки.
 * @param {number} contentSize - Размер содержимого.
 * @param {number[]} scrollSnaps - Массив снимков прокрутки.
 * @param {boolean} loop - Флаг цикличности.
 * @returns {ScrollLimitType} Возвращает объект ограничения прокрутки.
 */
export function ScrollLimit(contentSize: number, scrollSnaps: number[], loop: boolean) {
  const max = scrollSnaps[0]
  const min = loop ? max - contentSize : arrayLast(scrollSnaps)
  const limit = Limit(min, max)

  const self = {
    limit
  } as const

  return self
}
