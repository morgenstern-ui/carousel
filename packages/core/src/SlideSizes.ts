import type { AxisType } from './Axis.ts'
import type { NodeRectType } from './NodeRects.ts'
import { arrayIsLastIndex, arrayLast, mathAbs, type WindowType } from './utils.ts'

export type SlideSizesType = ReturnType<typeof useSlideSizes>

/**
 * Функция для измерения размеров слайдов.
 * @param {AxisType} axis - Ось прокрутки.
 * @param {NodeRectType} containerRect - Прямоугольник контейнера.
 * @param {NodeRectType[]} slideRects - Массив прямоугольников слайдов.
 * @param {HTMLElement[]} slides - Массив элементов слайдов.
 * @param {boolean} readEdgeGap - Флаг, указывающий на необходимость чтения отступа от края.
 * @param {WindowType} ownerWindow - Окно, в котором находятся слайды.
 * @returns {SlideSizesType} Возвращает объект с измеренными размерами слайдов.
 */
export function useSlideSizes(
  axis: AxisType,
  containerRect: NodeRectType,
  slideRects: NodeRectType[],
  slides: HTMLElement[],
  readEdgeGap: boolean,
  ownerWindow: WindowType
) {
  const { measureSize, startEdge, endEdge } = axis
  const withEdgeGap = slideRects[0] && readEdgeGap
  const startGap = measureStartGap()
  const endGap = measureEndGap()
  const slideSizes = slideRects.map(measureSize)
  const slideSizesWithGaps = measureWithGaps()

  /**
   * Функция для измерения отступа от начала.
   * @returns {number} Возвращает отступ от начала.
   */
  function measureStartGap(): number {
    if (!withEdgeGap) return 0
    const slideRect = slideRects[0]
    return mathAbs(containerRect[startEdge] - slideRect[startEdge])
  }

  /**
   * Функция для измерения отступа от конца.
   * @returns {number} Возвращает отступ от конца.
   */
  function measureEndGap(): number {
    if (!withEdgeGap) return 0
    const style = ownerWindow.getComputedStyle(arrayLast(slides))
    return parseFloat(style.getPropertyValue(`margin-${endEdge}`))
  }

  /**
   * Функция для измерения размеров слайдов с учетом отступов.
   * @returns {number[]} Возвращает массив размеров слайдов с учетом отступов.
   */
  function measureWithGaps(): number[] {
    return slideRects
      .map((rect, index, rects) => {
        const isFirst = !index
        const isLast = arrayIsLastIndex(rects, index)
        if (isFirst) return slideSizes[index] + startGap
        if (isLast) return slideSizes[index] + endGap

        return rects[index + 1][startEdge] - rect[startEdge]
      })
      .map(mathAbs)
  }

  // function measureWithGapsFoo(): number[] {
  //   const len = slideRects.length
  //   const result = new Array(len)

  //   for (let index = 0; index < len; index++) {
  //     const rect = slideRects[index]
  //     const isFirst = !index
  //     const isLast = arrayIsLastIndex(slideRects, index)

  //     if (isFirst) {
  //       result[index] = slideSizes[index] + startGap
  //     } else if (isLast) {
  //       result[index] = slideSizes[index] + endGap
  //     } else {
  //       result[index] = mathAbs(slideRects[index + 1][startEdge] - rect[startEdge])
  //     }
  //   }

  //   return result
  // }

  const self = {
    slideSizes,
    slideSizesWithGaps,
    startGap,
    endGap
  } as const

  return self
}
