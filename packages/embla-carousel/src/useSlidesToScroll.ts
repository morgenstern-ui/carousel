import type { AxisType } from './useAxis.ts'
import type { NodeRectType } from './useNodeRects.ts'
import { isNumber, mathAbs } from './utils.ts'

/**
 * Тип опции `slidesToScroll`.
 * Может быть либо `'auto'`, либо число.
 */
export type SlidesToScrollOptionType = 'auto' | number

export type SlidesToScrollType = ReturnType<typeof useSlidesToScroll>

/**
 * Вычисляет группы слайдов для прокрутки на основе предоставленных параметров.
 *
 * @param axis - Конфигурация оси для карусели.
 * @param containerSize - Размер контейнера карусели.
 * @param slidesToScroll - Количество слайдов для прокрутки или размер слайдов для прокрутки.
 * @param loop - Указывает, находится ли карусель в режиме цикла.
 * @param containerRect - Ограничивающий прямоугольник контейнера карусели.
 * @param slideRects - Ограничивающие прямоугольники слайдов.
 * @param startGap - Начальный зазор между контейнером и первым слайдом.
 * @param endGap - Конечный зазор между контейнером и последним слайдом.
 * @param pixelTolerance - Допустимое отклонение в пикселях для определения размеров групп.
 * @returns Объект с функцией `groupSlides`, которая вычисляет группы слайдов для прокрутки.
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
   * Группирует массив элементов на основе опции `slidesToScroll`.
   * Если `slidesToScroll` равно `'auto'`, то группирует элементы на основе размеров слайдов.
   * Если `slidesToScroll` равно числу, то группирует элементы на основе этого числа.
   * 
   * @param array - Массив для группировки.
   * @returns Массив сгруппированных элементов.
   */
  function groupSlides<Type>(array: Type[]): Type[][] {
    return groupByNumber ? byNumber(array, slidesToScroll) : bySize(array)
  }

  /**
   * Группирует массив элементов по заданному числу.
   *
   * @param array - Массив для группировки.
   * @param groupSize - Размер группы.
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
   * Группирует массив элементов на основе размера слайдов.
   *
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


  const self = {
    groupSlides
  } as const

  return self
}
