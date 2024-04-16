import type { LimitType } from './useLimit.ts'
import type { ScrollContainOptionType } from './useScrollContain.ts'
import type { SlidesToScrollType } from './useSlidesToScroll.ts'
import { arrayFromNumber, arrayIsLastIndex, arrayLast, arrayLastIndex } from './utils.ts'

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
    const groupedSlideIndexes = groupSlides(slideIndexes)
    const doNotContain = !containSnaps || containScroll === 'keepSnaps'

    if (scrollSnaps.length === 1) return [slideIndexes]
    if (doNotContain) return groupedSlideIndexes

    return groupedSlideIndexes.slice(min, max).map((group, index, groups) => {
      const isFirst = index === 0
      const isLast = arrayIsLastIndex(groups, index)

      if (isFirst) {
        const range = arrayLast(groups[0]) + 1
        return arrayFromNumber(range)
      }

      if (isLast) {
        const range = arrayLastIndex(slideIndexes) - arrayLast(groups)[0] + 1
        return arrayFromNumber(range, arrayLast(groups)[0])
      }

      return group
    })
  }

  const self = {
    slideRegistry
  } as const

  return self
}
