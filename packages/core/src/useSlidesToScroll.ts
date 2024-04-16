import type { AxisType } from './useAxis.ts'
import type { NodeRectType } from './useNodeRects.ts'
import { isNumber, mathAbs } from './utils.ts'

/**
 * Тип опции `slidesToScroll`.
 * Может быть либо `'auto'`, либо число.
 */
export type SlidesToScrollOptionType = 'auto' | number

/**
 * Тип функции `useSlidesToScroll`.
 */
export type SlidesToScrollType = ReturnType<typeof useSlidesToScroll>

/**
 * Рассчитывает количество слайдов для прокрутки на основе заданных параметров.
 * @param axis - Тип оси.
 * @param viewSize - Размер области просмотра.
 * @param slidesToScroll - Количество слайдов для прокрутки или `'auto'`.
 * @param loop - Булево значение, указывающее, находится ли карусель в режиме цикла.
 * @param containerRect - Прямоугольник контейнера.
 * @param slideRects - Прямоугольники слайдов.
 * @param startGap - Начальный зазор.
 * @param endGap - Конечный зазор.
 * @param pixelTolerance - Пиксельная допустимая погрешность.
 * @returns Объект с функцией `groupSlides`.
 */
export function useSlidesToScroll(
  axis: AxisType,
  viewSize: number,
  slidesToScroll: SlidesToScrollOptionType,
  loop: boolean,
  containerRect: NodeRectType,
  slideRects: NodeRectType[],
  startGap: number,
  endGap: number,
  pixelTolerance: number
) {
  const { startEdge, endEdge, direction } = axis
  const groupByNumber = isNumber(slidesToScroll)

  /**
   * Группирует массив элементов по заданному числу.
   * @param slides - Массив для группировки.
   * @param groupSize - Размер каждой группы.
   * @returns Массив сгруппированных элементов.
   */
  function byNumber<Type>(slides: Type[], groupSize: number): Type[][] {
    const groups: Type[][] = []

    for (let i = 0; i < slides.length; i += groupSize) {
      groups.push(slides.slice(i, i + groupSize))
    }

    return groups
  }

  /**
   * Группирует массив элементов по их размеру.
   * @param array - Массив для группировки.
   * @returns Массив сгруппированных элементов.
   */
  function bySize<Type>(array: Type[]): Type[][] {
    if (!array.length) return []

    const groups: Type[][] = []
    const arrayLength = array.length
    const arrayLastIndex = arrayLength - 1

    let startIndex = 0

    for (let endIndex = 0; endIndex < arrayLength; endIndex++) {
      const isFirstGroup = startIndex === 0
      const isLastGroup = endIndex === arrayLastIndex

      const gapStart = isFirstGroup && !loop ? direction(startGap) : 0
      const gapEnd = isLastGroup && !loop ? direction(endGap) : 0

      const offsetStart = containerRect[startEdge] - slideRects[startIndex][startEdge] + gapStart
      const offsetEnd = containerRect[startEdge] - slideRects[endIndex][endEdge] - gapEnd

      const groupSize = mathAbs(offsetEnd - offsetStart)

      if (endIndex && groupSize > viewSize + pixelTolerance) {
        groups.push(array.slice(startIndex, endIndex))
        startIndex = endIndex
      }

      if (isLastGroup) {
        groups.push(array.slice(startIndex, arrayLength))
      }
    }

    return groups
  }

  /**
   * Группирует массив элементов на основе опции `slidesToScroll`.
   * @param slides - Массив для группировки.
   * @returns Массив сгруппированных элементов.
   */
  function groupSlides<Type>(slides: Type[]): Type[][] {
    return groupByNumber ? byNumber(slides, slidesToScroll) : bySize(slides)
  }

  const self = {
    groupSlides
  } as const

  return self
}
