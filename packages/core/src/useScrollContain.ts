import { useLimit, type LimitType } from './useLimit.ts'
import { arrayLast, deltaAbs } from './utils.ts'

export type ScrollContainOptionType = false | 'trimSnaps' | 'keepSnaps'

export type ScrollContainType = ReturnType<typeof useScrollContain>

/**
 * Рассчитывает поведение ограничения прокрутки на основе предоставленных параметров.
 * @param containerSize - Размер области просмотра.
 * @param contentSize - Размер содержимого.
 * @param slideGroupSnaps - Массив выровненных снапов.
 * @param containScroll - Опция ограничения прокрутки.
 * @param pixelTolerance - Значение пиксельной допустимости.
 * @returns Объект, содержащий ограниченные снапы и предел ограничения прокрутки.
 */
export function useScrollContain(
  containerSize: number,
  contentSize: number,
  slideGroupSnaps: number[],
  containScroll: ScrollContainOptionType,
  pixelTolerance: number
) {
  /**
   * Рассчитывает границы прокрутки на основе размера содержимого и размера области просмотра.
   */
  const scrollLimit = useLimit(containerSize - contentSize, 0)

  const slideGroupSnapsBounded = measureSlideGroupSnapsBounded()
  const slideGroupSnapsLimit = getSlideGroupSnapsLimit()
  const slideGroupSnapsContained = measureSlideGroupSnapsContained()

  /**
   * Измеряет ограниченные снапы на основе границ прокрутки.
   * @returns Массив ограниченных снапов.
   */
  function measureSlideGroupSnapsBounded(): number[] {
    const { min, max } = scrollLimit
    const slideGroupSnapsLength = slideGroupSnaps.length
    const slideGroupSnapsLastIndex = slideGroupSnapsLength - 1

    const boundedList: number[] = []

    for (let i = 0; i < slideGroupSnapsLength; i++) {
      const slideGroupSnap = slideGroupSnaps[i]
      const snap = scrollLimit.constrain(slideGroupSnap)
      const isFirst = i === 0
      const isLast = i === slideGroupSnapsLastIndex

      let bounded = 0

      if (isFirst) {
        bounded = max
      } else if (isLast) {
        bounded = min
      } else if (usePixelTolerance(min, snap)) {
        bounded = min
      } else if (usePixelTolerance(max, snap)) {
        bounded = max
      } else {
        bounded = snap
      }

      boundedList.push(parseFloat(bounded.toFixed(3)))
    }

    return boundedList
  }

  /**
   * Находит предел ограничения прокрутки на основе ограниченных снапов.
   * @returns Предел ограничения прокрутки.
   */
  function getSlideGroupSnapsLimit(): LimitType {
    const maxSnapBounded = slideGroupSnapsBounded[0]
    const minSnapBounded = arrayLast(slideGroupSnapsBounded)

    const minSnapIdx = slideGroupSnapsBounded.lastIndexOf(maxSnapBounded)
    const maxSnapIdx = slideGroupSnapsBounded.indexOf(minSnapBounded) + 1

    return useLimit(minSnapIdx, maxSnapIdx)
  }

  /**
   * Измеряет содержащиеся снапы на основе размера содержимого, размера области просмотра и опции ограничения прокрутки.
   * @returns Массив содержащихся снапов.
   */
  function measureSlideGroupSnapsContained(): number[] {
    if (contentSize <= containerSize + pixelTolerance) return [scrollLimit.max]
    if (containScroll === 'keepSnaps') return slideGroupSnapsBounded

    const { min, max } = slideGroupSnapsLimit

    return slideGroupSnapsBounded.slice(min, max)
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
    slideGroupSnapsLimit,
    slideGroupSnapsContained,
  } as const

  return self
}
