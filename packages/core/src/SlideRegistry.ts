import type { LimitType } from './Limit.ts'
import type { ScrollContainOptionType } from './ScrollContain.ts'
import type { SlidesToScrollType } from './SlidesToScroll.ts'
import {
  arrayFromNumber,
  arrayIsLastIndex,
  arrayLast,
  arrayLastIndex
} from './utils'

export type SlideRegistryType = ReturnType<typeof SlideRegistry>

/**
 * Экспортируемая функция SlideRegistry, которая создает объект для управления реестром слайдов.
 * @param {boolean} containSnaps - Флаг, указывающий на необходимость содержания снимков.
 * @param {ScrollContainOptionType} containScroll - Опция, определяющая содержание прокрутки.
 * @param {number[]} scrollSnaps - Массив снимков прокрутки.
 * @param {LimitType} scrollContainLimit - Ограничение содержания прокрутки.
 * @param {SlidesToScrollType} slidesToScroll - Объект для управления группами слайдов.
 * @param {number[]} slideIndexes - Массив индексов слайдов.
 * @returns {SlideRegistryType} Возвращает объект SlideRegistry.
 */
export function SlideRegistry(
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
   * Создает реестр слайдов.
   * @returns {number[][]} Возвращает массив групп индексов слайдов.
   */
  function createSlideRegistry(): number[][] {
    const groupedSlideIndexes = groupSlides(slideIndexes)
    const doNotContain = !containSnaps || containScroll === 'keepSnaps'

    if (scrollSnaps.length === 1) return [slideIndexes]
    if (doNotContain) return groupedSlideIndexes

    return groupedSlideIndexes.slice(min, max).map((group, index, groups) => {
      const isFirst = !index
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
