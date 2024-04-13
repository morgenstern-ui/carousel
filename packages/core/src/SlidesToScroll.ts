import type { AxisType } from './Axis.ts'
import type { NodeRectType } from './NodeRects.ts'
import { arrayKeys, arrayLast, arrayLastIndex, isNumber, mathAbs } from './utils'

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
   * @param array - Массив для группировки.
   * @param groupSize - Размер каждой группы.
   * @returns Массив сгруппированных элементов.
   */
  function byNumber<Type>(array: Type[], groupSize: number): Type[][] {
    return arrayKeys(array)
      .filter((i) => i % groupSize === 0)
      .map((i) => array.slice(i, i + groupSize))
  }

  /**
   * Группирует массив элементов по их размеру.
   * @param array - Массив для группировки.
   * @returns Массив сгруппированных элементов.
   */
  function bySize<Type>(array: Type[]): Type[][] {
    if (!array.length) return []

    return arrayKeys(array)
      .reduce((groups: number[], rectB, index) => {
        const rectA = arrayLast(groups) || 0
        const isFirst = rectA === 0
        const isLast = rectB === arrayLastIndex(array)

        const edgeA = containerRect[startEdge] - slideRects[rectA][startEdge]
        const edgeB = containerRect[startEdge] - slideRects[rectB][endEdge]
        const gapA = !loop && isFirst ? direction(startGap) : 0
        const gapB = !loop && isLast ? direction(endGap) : 0
        const chunkSize = mathAbs(edgeB - gapB - (edgeA + gapA))

        if (index && chunkSize > viewSize + pixelTolerance) groups.push(rectB)
        if (isLast) groups.push(array.length)
        return groups
      }, [])
      .map((currentSize, index, groups) => {
        const previousSize = Math.max(groups[index - 1] || 0)
        return array.slice(previousSize, currentSize)
      })
  }

  /**
   * Группирует массив элементов на основе опции `slidesToScroll`.
   * @param array - Массив для группировки.
   * @returns Массив сгруппированных элементов.
   */
  function groupSlides<Type>(array: Type[]): Type[][] {
    return groupByNumber ? byNumber(array, slidesToScroll) : bySize(array)
  }

  const self = {
    groupSlides
  } as const

  return self
}
