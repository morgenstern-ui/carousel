import type { LimitType } from './useLimit.ts'

export type ScrollProgressType = {
  get: (n: number) => number
}

/**
 * Пользовательский хук, который вычисляет прогресс прокрутки на основе заданного предела.
 * @param limit - Объект предела, содержащий максимальное и длину значений.
 * @returns Объект с функцией `get`, которая вычисляет прогресс прокрутки.
 */
export function useScrollProgress(limit: LimitType): ScrollProgressType {
  const { max, length } = limit

  function get(n: number): number {
    const currentLocation = n - max

    return length ? currentLocation / -length : 0
  }

  return {
    get
  }
}
