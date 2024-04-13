import type { AxisType } from './useAxis.ts'
import type { NodeRectType } from './useNodeRects.ts'
import { arrayIsLastIndex, arrayLast, mathAbs, type WindowType } from './utils.ts'
/**
 * Возвращает тип размеров слайдов, возвращаемый функцией `useSlideSizes`.
 */
export type SlideSizesType = ReturnType<typeof useSlideSizes>

/**
 * Вычисляет размеры слайдов и промежутки между ними.
 *
 * @param axis - Тип оси (горизонтальная или вертикальная).
 * @param containerRect - Прямоугольник, представляющий контейнер.
 * @param slideRects - Массив прямоугольников, представляющих каждый слайд.
 * @param slides - Массив HTML-элементов, представляющих каждый слайд.
 * @param readEdgeGap - Булево значение, указывающее, нужно ли считывать промежуток на краю.
 * @param ownerWindow - Объект окна владельца.
 * @returns Объект, содержащий размеры слайдов, размеры слайдов с промежутками, начальный промежуток и конечный промежуток.
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
   * Измеряет начальный промежуток между контейнером и первым слайдом.
   *
   * @returns Начальный промежуток.
   */
  function measureStartGap(): number {
    if (!withEdgeGap) return 0
    const slideRect = slideRects[0]
    return mathAbs(containerRect[startEdge] - slideRect[startEdge])
  }

  /**
   * Измеряет конечный промежуток между последним слайдом и контейнером.
   *
   * @returns Конечный промежуток.
   */
  function measureEndGap(): number {
    if (!withEdgeGap) return 0
    const style = ownerWindow.getComputedStyle(arrayLast(slides))
    return parseFloat(style.getPropertyValue(`margin-${endEdge}`))
  }

  /**
   * Измеряет размеры слайдов с промежутками между ними.
   *
   * @returns Массив размеров слайдов с промежутками.
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

  const self = {
    slideSizes,
    slideSizesWithGaps,
    startGap,
    endGap
  } as const

  return self
}
