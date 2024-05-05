import type { LimitType } from './useLimit.ts'
import type { ScrollContainOptionType } from './useScrollContain.ts'
import type { SlidesToScrollType } from './useSlidesToScroll.ts'
import { arrayFromNumber, arrayLast, arrayLastIndex } from './utils.ts'

export type SlideRegistryType = ReturnType<typeof useSlideRegistry>

/**
 * Создает реестр слайдов на основе предоставленных параметров.
 *
 * @param containSnaps - Булево значение, указывающее, должны ли слайды находиться внутри контейнера прокрутки.
 * @param containScroll - Тип опции контейнера прокрутки.
 * @param scrollSnaps - Массив позиций прокрутки.
 * @param scrollContainLimit - Тип ограничения контейнера прокрутки.
 * @param slidesToScroll - Тип количества прокручиваемых слайдов.
 * @param slideIndexes - Массив индексов слайдов.
 * @returns Объект, содержащий реестр слайдов.
 */
export function useSlideRegistry(
  containSnaps: boolean,
  containScroll: ScrollContainOptionType,
  scrollSnaps: number[],
  scrollContainLimit: LimitType,
  slidesToScroll: SlidesToScrollType,
  slideIndexes: number[]
) {
  const { groupSlides } = slidesToScroll
  const { min, max } = scrollContainLimit
  const slideRegistry = createSlideRegistry()

  /**
   * Создает реестр слайдов на основе предоставленных параметров.
   *
   * @returns Массив индексов слайдов, сгруппированных в соответствии с указанными условиями.
   */
  function createSlideRegistry(): number[][] {
    let slideIndexGroups = groupSlides(slideIndexes)
    const doNotContain = !containSnaps || containScroll === 'keepSnaps'

    if (scrollSnaps.length === 1) return [slideIndexes]
    if (doNotContain) return slideIndexGroups

    const slideRegistry: number[][] = []

    slideIndexGroups = slideIndexGroups.slice(min, max)
    const slideIndexGroupsLengths = slideIndexGroups.length
    const slideIndexGroupsLastIndex = slideIndexGroupsLengths - 1

    for (let i = 0; i < slideIndexGroupsLengths; i++) {
      const isFirst = i === 0
      const isLast = i === slideIndexGroupsLastIndex

      const slideIndexGroup = slideIndexGroups[i]

      if (isFirst) {
        const range = arrayLast(slideIndexGroups[0]) + 1
        slideRegistry.push(arrayFromNumber(range))
      } else if (isLast) {
        const range = arrayLastIndex(slideIndexes) - arrayLast(slideIndexGroups)[0] + 1
        slideRegistry.push(arrayFromNumber(range, arrayLast(slideIndexGroups)[0]))
      } else {
        slideRegistry.push(slideIndexGroup)
      }
    }

    return slideRegistry
  }

  const self = {
    slideRegistry
  } as const

  return self
}
