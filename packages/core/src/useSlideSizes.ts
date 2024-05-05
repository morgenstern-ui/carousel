import type { AxisType } from './useAxis.ts'
import type { NodeRectType } from './useNodeRects.ts'
import { arrayLast, mathAbs, type WindowType } from './utils.ts'

export type SlideSizesType = ReturnType<typeof useSlideSizes>

/**
 * Вычисляет размеры слайдов и промежутки между ними.
 *
 * @param axis - Ось.
 * @param containerRect - Размеры контейнера.
 * @param slideRects - Размеры каждого слайда.
 * @param $slides - Элементы слайдов.
 * @param readEdgeGap - Определяет, нужно ли учитывать промежуток на краях.
 * @param $ownerWindow - Объект окна.
 * @returns Объект, содержащий размеры слайдов, размеры слайдов с промежутками, начальный промежуток и конечный промежуток.
 */
export function useSlideSizes(
  axis: AxisType,
  containerRect: NodeRectType,
  slideRects: NodeRectType[],
  $slides: HTMLElement[],
  readEdgeGap: boolean,
  $ownerWindow: WindowType
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

    const [firstSlideRect] = slideRects

    return mathAbs(containerRect[startEdge] - firstSlideRect[startEdge])
  }

  /**
   * Измеряет конечный промежуток между последним слайдом и контейнером.
   *
   * @returns Конечный промежуток.
   */
  function measureEndGap(): number {
    if (!withEdgeGap) return 0

    const style = $ownerWindow.getComputedStyle(arrayLast($slides))

    return parseFloat(style.getPropertyValue(`margin-${endEdge}`))
  }

  /**
   * Измеряет размеры слайдов с промежутками между ними.
   *
   * @returns Массив размеров слайдов с промежутками.
   */
  function measureWithGaps(): number[] {
    const slideSizesWithGaps: number[] = []
    const slideRectsLength = slideRects.length
    const slideRectsLastIndex = slideRectsLength - 1

    for (let i = 0; i < slideRectsLength; i++) {
      const slideRect = slideRects[i]
      const isFirst = i === 0
      const isLast = i === slideRectsLastIndex

      if (isFirst) {
        slideSizesWithGaps.push(slideSizes[i] + startGap)
      } else if (isLast) {
        slideSizesWithGaps.push(slideSizes[i] + endGap)
      } else {
        const nextSlideRect = slideRects[i + 1]
        slideSizesWithGaps.push(mathAbs(nextSlideRect[startEdge] - slideRect[startEdge]))
      }
    }

    return slideSizesWithGaps
  }

  const self = {
    slideSizes,
    slideSizesWithGaps,
    startGap,
    endGap
  } as const

  return self
}
