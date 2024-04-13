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
  const alignments = measureSizes().map(alignment.measure)
  const snaps = measureUnaligned()
  const snapsAligned = measureAligned()

  /**
   * Измеряет размеры групп слайдов.
   *
   * @returns Массив чисел, представляющих размеры групп слайдов.
   */
  function measureSizes(): number[] {
    return groupSlides(slideRects)
      .map((rects) => arrayLast(rects)[endEdge] - rects[0][startEdge])
      .map(mathAbs)
  }

  /**
   * Измеряет несогласованные точки прокрутки.
   *
   * @returns Массив чисел, представляющих несогласованные точки прокрутки.
   */
  function measureUnaligned(): number[] {
    return slideRects.map((rect) => containerRect[startEdge] - rect[startEdge]).map((snap) => -mathAbs(snap))
  }

  /**
   * Измеряет выровненные точки прокрутки.
   *
   * @returns Массив чисел, представляющих выровненные точки прокрутки.
   */
  function measureAligned(): number[] {
    return groupSlides(snaps)
      .map((g) => g[0])
      .map((snap, index) => snap + alignments[index])
  }

  const self = {
    snaps,
    snapsAligned
  } as const

  return self
}
