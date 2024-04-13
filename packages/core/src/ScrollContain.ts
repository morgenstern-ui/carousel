import { Limit, type LimitType } from './Limit.ts'
import { arrayIsLastIndex, arrayLast, deltaAbs } from './utils.ts'

export type ScrollContainOptionType = false | 'trimSnaps' | 'keepSnaps'

export type ScrollContainType = ReturnType<typeof ScrollContain>

/**
 * Функция для создания объекта содержания прокрутки.
 * @param {number} viewSize - Размер вида.
 * @param {number} contentSize - Размер содержимого.
 * @param {number[]} snapsAligned - Массив выровненных снимков.
 * @param {ScrollContainOptionType} containScroll - Опция содержания прокрутки.
 * @param {number} pixelTolerance - Пиксельная толерантность.
 * @returns {ScrollContainType} Возвращает объект содержания прокрутки.
 */
export function ScrollContain(
  viewSize: number,
  contentSize: number,
  snapsAligned: number[],
  containScroll: ScrollContainOptionType,
  pixelTolerance: number
) {
  const scrollBounds = Limit(-contentSize + viewSize, 0)
  const snapsBounded = measureBounded()
  const scrollContainLimit = findScrollContainLimit()
  const snapsContained = measureContained()

  /**
   * Функция для использования пиксельной толерантности.
   * @param {number} bound - Граница.
   * @param {number} snap - Снимок.
   * @returns {boolean} Возвращает true, если разница между границей и снимком меньше 1, иначе false.
   */
  function usePixelTolerance(bound: number, snap: number): boolean {
    return deltaAbs(bound, snap) < 1
  }

  /**
   * Функция для нахождения ограничения содержания прокрутки.
   * @returns {LimitType} Возвращает объект ограничения.
   */
  function findScrollContainLimit(): LimitType {
    const startSnap = snapsBounded[0]
    const endSnap = arrayLast(snapsBounded)
    const min = snapsBounded.lastIndexOf(startSnap)
    const max = snapsBounded.indexOf(endSnap) + 1
    return Limit(min, max)
  }

  /**
   * Функция для измерения ограниченных снимков.
   * @returns {number[]} Возвращает массив ограниченных снимков.
   */
  function measureBounded(): number[] {
    return snapsAligned
      .map((snapAligned, index) => {
        const { min, max } = scrollBounds
        const snap = scrollBounds.constrain(snapAligned)
        const isFirst = !index
        const isLast = arrayIsLastIndex(snapsAligned, index)
        if (isFirst) return max
        if (isLast) return min
        if (usePixelTolerance(min, snap)) return min
        if (usePixelTolerance(max, snap)) return max
        return snap
      })
      .map((scrollBound) => parseFloat(scrollBound.toFixed(3)))
  }

  /**
   * Функция для измерения содержимого снимков.
   * @returns {number[]} Возвращает массив содержимого снимков.
   */
  function measureContained(): number[] {
    if (contentSize <= viewSize + pixelTolerance) return [scrollBounds.max]
    if (containScroll === 'keepSnaps') return snapsBounded
    const { min, max } = scrollContainLimit
    return snapsBounded.slice(min, max)
  }

  const self = {
    snapsContained,
    scrollContainLimit
  } as const

  return self
}
