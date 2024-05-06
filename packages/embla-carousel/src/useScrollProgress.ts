import type { LimitType } from './useLimit.ts'

export type ScrollProgressType = ReturnType<typeof useScrollProgress>

/**
 * Пользовательский хук, который вычисляет прогресс прокрутки на основе заданного предела.
 * @param limit - Объект предела, содержащий максимальное и длину значений.
 * @returns Объект с функцией `get`, которая вычисляет прогресс прокрутки.
 */
export function useScrollProgress(limit: LimitType) {
  const { max, length } = limit

  function get(n: number): number {
    const currentLocation = n - max

    return length ? currentLocation / -length : 0
  }

  const self = {
    get
  } as const

  return self
}
