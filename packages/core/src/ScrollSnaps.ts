import type { AlignmentType } from './Alignment.ts'
import type { AxisType } from './Axis.ts'
import type { NodeRectType } from './NodeRects.ts'
import type { SlidesToScrollType } from './SlidesToScroll.ts'
import { arrayLast, mathAbs } from './utils.ts'

export type ScrollSnapsType = ReturnType<typeof ScrollSnaps>
/**
 * Экспортируемая функция ScrollSnaps, которая создает объект для управления снимками прокрутки.
 * @param {AxisType} axis - Ось, по которой происходит прокрутка.
 * @param {AlignmentType} alignment - Выравнивание.
 * @param {NodeRectType} containerRect - Объект, описывающий прямоугольник контейнера.
 * @param {NodeRectType[]} slideRects - Массив объектов, описывающих прямоугольники слайдов.
 * @param {SlidesToScrollType} slidesToScroll - Объект для управления группами слайдов.
 * @returns {ScrollSnapsType} Возвращает объект ScrollSnaps.
 */
export function ScrollSnaps(
  axis: AxisType,
  alignment: AlignmentType,
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
   * Измеряет размеры.
   * @returns {number[]} Возвращает массив размеров.
   */
  function measureSizes(): number[] {
    return groupSlides(slideRects)
      .map((rects) => arrayLast(rects)[endEdge] - rects[0][startEdge])
      .map(mathAbs)
  }

  /**
   * Измеряет не выровненные снимки.
   * @returns {number[]} Возвращает массив снимков.
   */
  function measureUnaligned(): number[] {
    return slideRects
      .map((rect) => containerRect[startEdge] - rect[startEdge])
      .map((snap) => -mathAbs(snap))
  }

  /**
   * Измеряет выровненные снимки.
   * @returns {number[]} Возвращает массив выровненных снимков.
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
