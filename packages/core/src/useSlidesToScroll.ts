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
 * @param containerSize - Размер области просмотра.
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
  containerSize: number,
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
    const groups: Type[][] = []
    const arrayLength = array.length

    for (let i = 0; i < arrayLength; i += groupSize) {
      groups.push(array.slice(i, i + groupSize))
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

    let startChunkIdx = 0

    const containerStart = containerRect[startEdge]

    for (let endChunkIdx = 0; endChunkIdx < arrayLength; endChunkIdx++) {
      const isFirstGroup = startChunkIdx === 0
      const isLastGroup = endChunkIdx === arrayLastIndex

      const chunkStartGap = isFirstGroup && !loop ? direction(startGap) : 0
      const chunkEndGap = isLastGroup && !loop ? direction(endGap) : 0

      const startChunk = containerStart - slideRects[startChunkIdx][startEdge] + chunkStartGap
      const endChunk = containerStart - slideRects[endChunkIdx][endEdge] - chunkEndGap

      const chunkSize = mathAbs(endChunk - startChunk)

      if (endChunkIdx && chunkSize > containerSize + pixelTolerance) {
        groups.push(array.slice(startChunkIdx, endChunkIdx))
        startChunkIdx = endChunkIdx
      }

      if (isLastGroup) {
        groups.push(array.slice(startChunkIdx, arrayLength))
      }
    }

    return groups
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
