import type { SlideAlignmentType } from './useSlideAlignment.ts'
import type { AxisType } from './useAxis.ts'
import type { NodeRectType } from './useNodeRects.ts'
import type { SlidesToScrollType } from './useSlidesToScroll.ts'
import { arrayLast, mathAbs } from './utils.ts'

export type ScrollSnapsType = ReturnType<typeof useScrollSnaps>

/**
 * Рассчитывает точки прокрутки для карусели на основе предоставленных параметров.
 *
 * @param axis - Тип оси карусели (горизонтальная или вертикальная).
 * @param alignment - Тип выравнивания слайдов карусели.
 * @param containerRect - Ограничивающий прямоугольник контейнера карусели.
 * @param slideRects - Ограничивающие прямоугольники слайдов карусели.
 * @param slidesToScroll - Количество слайдов для прокрутки за раз.
 * @returns Объект, содержащий рассчитанные точки прокрутки и выровненные точки прокрутки.
 */
export function useScrollSnaps(
  axis: AxisType,
  alignment: SlideAlignmentType,
  containerRect: NodeRectType,
  slideRects: NodeRectType[],
  slidesToScroll: SlidesToScrollType
) {
  const { startEdge, endEdge } = axis
  const { groupSlides } = slidesToScroll
  const alignments = measureAlignments()
  const snaps = measureSnaps()
  const snapsAligned = measureSnapsAligned()

  /**
   * Измеряет выравнивание групп слайдов.
   *
   * @returns Массив выравниваний.
   */
  function measureAlignments(): number[] {
    const groupAlignments = groupSlides(slideRects) as any[]

    for (let idx = 0; idx < groupAlignments.length; idx++) {
      const group = groupAlignments[idx] as any[]
      groupAlignments[idx] = alignment.measure(mathAbs(arrayLast(group)[endEdge] - group[0][startEdge]), idx)
    }

    return groupAlignments
  }

  /**
   * Измеряет несогласованные точки прокрутки.
   *
   * @returns Массив чисел, представляющих несогласованные точки прокрутки.
   */
  function measureSnaps(): number[] {
    const startContainer = containerRect[startEdge]

    return slideRects.map((rect) => -mathAbs(startContainer - rect[startEdge]))
  }

  /**
   * Измеряет выровненные точки прокрутки.
   *
   * @returns Массив чисел, представляющих выровненные точки прокрутки.
   */
  function measureSnapsAligned(): number[] {
    return groupSlides(snaps).map((group, index) => group[0] + alignments[index])
  }

  const self = {
    snaps,
    snapsAligned
  } as const

  return self
}
