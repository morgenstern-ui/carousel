import type { AlignmentType } from './useAlignment.ts'
import type { AxisType } from './useAxis.ts'
import type { NodeRectType } from './useNodeRects.ts'
import type { SlidesToScrollType } from './useSlidesToScroll.ts'
import { arrayLast, mathAbs } from './utils.ts'

export type ScrollSnapsType = ReturnType<typeof useScrollSnaps>

/**
 * Вычисляет точки прокрутки для карусели на основе предоставленных параметров.
 *
 * @param axis - Тип оси карусели (горизонтальная или вертикальная).
 * @param alignment - Тип выравнивания слайдов карусели.
 * @param containerRect - Размеры контейнера карусели.
 * @param slideRects - Размеры слайдов карусели.
 * @param slidesToScroll - Количество слайдов для прокрутки за раз.
 * @returns Объект, содержащий вычисленные точки прокрутки слайдов и групп слайдов.
 */
export function useScrollSnaps(
  axis: AxisType,
  alignment: AlignmentType,
  containerRect: NodeRectType,
  slideRects: NodeRectType[],
  slidesToScroll: SlidesToScrollType
) {
  const { startEdge, endEdge } = axis
  const { groupSlides } = slidesToScroll

  const slideSnaps = measureSlideSnaps()
  const slideGroupSnaps = measureSlideGroupSnaps()

  /**
   * Измеряет точки прокрутки для отдельных слайдов.
   *
   * @returns Массив точек прокрутки для отдельных слайдов.
   */
  function measureSlideSnaps(): number[] {
    const snapsUnaligned: number[] = []

    const startContainer = containerRect[startEdge]

    for (const slideRect of slideRects) {
      snapsUnaligned.push(-mathAbs(startContainer - slideRect[startEdge]))
    }

    return snapsUnaligned
  }

  /**
   * Измеряет точки прокрутки для групп слайдов.
   *
   * @returns Массив точек прокрутки для групп слайдов.
   */
  function measureSlideGroupSnaps(): number[] {
    const slideGroupSnaps: number[] = []

    const slideSnapGroups = groupSlides(slideSnaps)
    const slideSnapGroupsLength = slideSnapGroups.length
    const slideSnapGroupAlignments = measureSlideGroupAlignments()

    for (let i = 0; i < slideSnapGroupsLength; i++) {
      const slideSnapGroup = slideSnapGroups[i]
      const slideSnapGroupAlignment = slideSnapGroupAlignments[i]

      slideGroupSnaps.push(slideSnapGroup[0] + slideSnapGroupAlignment)
    }

    return slideGroupSnaps
  }

  /**
   * Измеряет выравнивание для групп слайдов.
   *
   * @returns Массив выравниваний для групп слайдов.
   */
  function measureSlideGroupAlignments(): number[] {
    const slideGroupAlignments: number[] = []

    const slideGroups = groupSlides(slideRects)
    const slideGroupsLength = slideGroups.length

    for (let i = 0; i < slideGroupsLength; i++) {
      const slideGroup = slideGroups[i]
      const slideGroupSize = mathAbs(arrayLast(slideGroup)[endEdge] - slideGroup[0][startEdge])
      slideGroupAlignments.push(alignment.measure(slideGroupSize, i))
    }

    return slideGroupAlignments
  }

  const self = {
    slideSnaps,
    slideGroupSnaps,
  } as const

  return self
}
