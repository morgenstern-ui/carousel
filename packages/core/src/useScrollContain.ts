import { useLimit, type LimitType } from './useLimit.ts'
import { arrayLast, deltaAbs } from './utils.ts'

export type ScrollContainOptionType = false | 'trimSnaps' | 'keepSnaps'

export type ScrollContainType = ReturnType<typeof useScrollContain>

/**
 * Рассчитывает ограниченные и содержащиеся снапы группы слайдов на основе размера контейнера, размера контента,
 * снапов группы слайдов, опции ограничения прокрутки и пиксельной допустимости.
 *
 * @param containerSize - Размер контейнера.
 * @param contentSize - Размер контента.
 * @param slideGroupSnaps - Массив снапов группы слайдов.
 * @param containScroll - Опция ограничения прокрутки.
 * @param pixelTolerance - Пиксельная допустимость.
 * @returns Объект, содержащий ограниченные и содержащиеся снапы группы слайдов.
 */
export function useScrollContain(
  containerSize: number,
  contentSize: number,
  slideGroupSnaps: number[],
  containScroll: ScrollContainOptionType,
  pixelTolerance: number
) {
  const scrollLimit = useLimit(-(contentSize - containerSize), 0)

  const slideGroupSnapsBounded = measureSlideGroupSnapsBounded()
  const slideGroupSnapsLimit = getSlideGroupSnapsLimit()
  const slideGroupSnapsContained = measureSlideGroupSnapsContained()

  /**
   * Рассчитывает ограниченные снапы группы слайдов на основе ограничения прокрутки.
   * 
   * @returns Массив ограниченных снапов группы слайдов.
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
   * Рассчитывает ограничение снапов группы слайдов на основе ограниченных снапов группы слайдов.
   * 
   * @returns Ограничение снапов группы слайдов.
   */
  function getSlideGroupSnapsLimit(): LimitType {
    const maxSnapBounded = slideGroupSnapsBounded[0]
    const minSnapBounded = arrayLast(slideGroupSnapsBounded)

    const minSnapIdx = slideGroupSnapsBounded.lastIndexOf(maxSnapBounded)
    const maxSnapIdx = slideGroupSnapsBounded.indexOf(minSnapBounded)

    return useLimit(minSnapIdx, maxSnapIdx + 1)
  }

  /**
   * Рассчитывает снапы группы слайдов, которые содержатся в контейнере прокрутки.
   * 
   * @returns Массив снапов группы слайдов, которые содержатся в контейнере прокрутки.
   */
  function measureSlideGroupSnapsContained(): number[] {
    if (contentSize <= containerSize + pixelTolerance) return [scrollLimit.max]
    if (containScroll === false || containScroll === 'keepSnaps') return slideGroupSnapsBounded

    const { min, max } = slideGroupSnapsLimit

    return slideGroupSnapsBounded.slice(min, max)
  }

  /**
   * Проверяет, находится ли разница между двумя значениями в пределах пиксельной допустимости.
   * 
   * @param bound - Ограничение.
   * @param snap - Снап.
   * @returns True, если разница между ограничением и снапом меньше 1, иначе false.
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
