import { useLimit, type LimitType } from './useLimit.ts'
import { arrayIsLastIndex, arrayLast, deltaAbs } from './utils.ts'

export type ScrollContainOptionType = false | 'trimSnaps' | 'keepSnaps'

export type ScrollContainType = ReturnType<typeof useScrollContain>

/**
 * Рассчитывает поведение ограничения прокрутки на основе предоставленных параметров.
 * @param viewSize - Размер области просмотра.
 * @param contentSize - Размер содержимого.
 * @param snapsAligned - Массив выровненных снапов.
 * @param containScroll - Опция ограничения прокрутки.
 * @param pixelTolerance - Значение пиксельной допустимости.
 * @returns Объект, содержащий ограниченные снапы и предел ограничения прокрутки.
 */
export function useScrollContain(
  viewSize: number,
  contentSize: number,
  snapsAligned: number[],
  containScroll: ScrollContainOptionType,
  pixelTolerance: number
) {
  /**
   * Рассчитывает границы прокрутки на основе размера содержимого и размера области просмотра.
   */
  const scrollBounds = useLimit(-contentSize + viewSize, 0)

  const snapsBounded = measureBounded()
  const scrollContainLimit = findScrollContainLimit()
  const snapsContained = measureContained()

  /**
   * Измеряет ограниченные снапы на основе границ прокрутки.
   * @returns Массив ограниченных снапов.
   */
  function measureBounded(): number[] {
    const { min, max } = scrollBounds

    return snapsAligned
      .map((snapAligned, index) => {
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
   * Находит предел ограничения прокрутки на основе ограниченных снапов.
   * @returns Предел ограничения прокрутки.
   */
  function findScrollContainLimit(): LimitType {
    const startSnap = snapsBounded[0]
    const endSnap = arrayLast(snapsBounded)
    const min = snapsBounded.lastIndexOf(startSnap)
    const max = snapsBounded.indexOf(endSnap) + 1

    return useLimit(min, max)
  }

  /**
   * Измеряет содержащиеся снапы на основе размера содержимого, размера области просмотра и опции ограничения прокрутки.
   * @returns Массив содержащихся снапов.
   */
  function measureContained(): number[] {
    if (contentSize <= viewSize + pixelTolerance) return [scrollBounds.max]
    if (containScroll === 'keepSnaps') return snapsBounded

    const { min, max } = scrollContainLimit

    return snapsBounded.slice(min, max)
  }

  /**
   * Проверяет, находится ли разница между двумя значениями в пределах пиксельной допустимости.
   * @param bound - Значение границы.
   * @param snap - Значение снапа.
   * @returns Булево значение, указывающее, находится ли разница в пределах пиксельной допустимости.
   */
  function usePixelTolerance(bound: number, snap: number): boolean {
    return deltaAbs(bound, snap) < 1
  }

  const self = {
    snapsContained,
    scrollContainLimit
  } as const

  return self
}
