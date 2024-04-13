import type { LimitType } from './Limit.ts'

export type ScrollProgressType = ReturnType<typeof ScrollProgress>

/**
 * Функция для создания объекта прогресса прокрутки.
 * @param {LimitType} limit - Объект ограничения.
 * @returns {ScrollProgressType} Возвращает объект прогресса прокрутки.
 */
export function ScrollProgress(limit: LimitType) {
  const { max, length } = limit

  /**
   * Функция для получения текущего прогресса прокрутки.
   * @param {number} n - Текущее значение.
   * @returns {number} Возвращает прогресс прокрутки.
   */
  function get(n: number): number {
    const currentLocation = n - max
    return length ? currentLocation / -length : 0
  }

  const self = {
    get
  } as const

  return self
}
