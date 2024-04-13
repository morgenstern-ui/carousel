import type { AxisType } from './Axis.ts'
import { arrayKeys } from './utils.ts'
import { Vector1D, type Vector1DType } from './Vector1d.ts'
import { Translate, type TranslateType } from './Translate.ts'

type SlideBoundType = {
  start: number
  end: number
}

type LoopPointType = {
  loopPoint: number
  index: number
  translate: TranslateType
  slideLocation: Vector1DType
  target: () => number
}

export type SlideLooperType = ReturnType<typeof SlideLooper>

/**
 * Экспортируемая функция SlideLooper, которая создает объект для управления циклическими слайдами.
 * @param {AxisType} axis - Ось, по которой происходит прокрутка.
 * @param {number} viewSize - Размер видимой области.
 * @param {number} contentSize - Общий размер контента.
 * @param {number[]} slideSizes - Массив размеров слайдов.
 * @param {number[]} slideSizesWithGaps - Массив размеров слайдов с учетом промежутков.
 * @param {number[]} snaps - Массив точек привязки.
 * @param {number[]} scrollSnaps - Массив точек привязки прокрутки.
 * @param {Vector1DType} offsetLocation - Вектор смещения.
 * @param {HTMLElement[]} slides - Массив элементов слайдов.
 * @returns {SlideLooperType} Возвращает объект SlideLooper.
 */
export function SlideLooper(
  axis: AxisType,
  viewSize: number,
  contentSize: number,
  slideSizes: number[],
  slideSizesWithGaps: number[],
  snaps: number[],
  scrollSnaps: number[],
  offsetLocation: Vector1DType,
  slides: HTMLElement[]
) {
  const roundingSafety = 0.5
  const ascItems = arrayKeys(slideSizesWithGaps)
  const descItems = arrayKeys(slideSizesWithGaps).reverse()
  const loopPoints = startPoints().concat(endPoints())

  /**
   * Удаляет размеры слайдов из заданного числа.
   * @param {number[]} indexes - Индексы слайдов.
   * @param {number} from - Число, из которого удаляются размеры слайдов.
   * @returns {number} Возвращает результат.
   */
  function removeSlideSizes(indexes: number[], from: number): number {
    return indexes.reduce((a: number, i) => {
      return a - slideSizesWithGaps[i]
    }, from)
  }

  /**
   * Определяет слайды в заданном промежутке.
   * @param {number[]} indexes - Индексы слайдов.
   * @param {number} gap - Промежуток.
   * @returns {number[]} Возвращает массив индексов слайдов.
   */
  function slidesInGap(indexes: number[], gap: number): number[] {
    return indexes.reduce((a: number[], i) => {
      const remainingGap = removeSlideSizes(a, gap)
      return remainingGap > 0 ? a.concat([i]) : a
    }, [])
  }

  /**
   * Находит границы слайдов.
   * @param {number} offset - Смещение.
   * @returns {SlideBoundType[]} Возвращает массив объектов границ слайдов.
   */
  function findSlideBounds(offset: number): SlideBoundType[] {
    return snaps.map((snap, index) => ({
      start: snap - slideSizes[index] + roundingSafety + offset,
      end: snap + viewSize - roundingSafety + offset
    }))
  }

  /**
   * Находит точки цикла.
   * @param {number[]} indexes - Индексы слайдов.
   * @param {number} offset - Смещение.
   * @param {boolean} isEndEdge - Флаг, указывающий на конечную границу.
   * @returns {LoopPointType[]} Возвращает массив объектов точек цикла.
   */
  function findLoopPoints(
    indexes: number[],
    offset: number,
    isEndEdge: boolean
  ): LoopPointType[] {
    const slideBounds = findSlideBounds(offset)

    return indexes.map((index) => {
      const initial = isEndEdge ? 0 : -contentSize
      const altered = isEndEdge ? contentSize : 0
      const boundEdge = isEndEdge ? 'end' : 'start'
      const loopPoint = slideBounds[index][boundEdge]

      return {
        index,
        loopPoint,
        slideLocation: Vector1D(-1),
        translate: Translate(axis, slides[index]),
        target: () => (offsetLocation.get() > loopPoint ? initial : altered)
      }
    })
  }

  /**
   * Находит начальные точки цикла.
   * @returns {LoopPointType[]} Возвращает массив объектов начальных точек цикла.
   */
  function startPoints(): LoopPointType[] {
    const gap = scrollSnaps[0]
    const indexes = slidesInGap(descItems, gap)
    return findLoopPoints(indexes, contentSize, false)
  }

  /**
   * Находит конечные точки цикла.
   * @returns {LoopPointType[]} Возвращает массив объектов конечных точек цикла.
   */
  function endPoints(): LoopPointType[] {
    const gap = viewSize - scrollSnaps[0] - 1
    const indexes = slidesInGap(ascItems, gap)
    return findLoopPoints(indexes, -contentSize, true)
  }

  /**
   * Проверяет, возможен ли цикл.
   * @returns {boolean} Возвращает true, если цикл возможен, иначе false.
   */
  function canLoop(): boolean {
    return loopPoints.every(({ index }) => {
      const otherIndexes = ascItems.filter((i) => i !== index)
      return removeSlideSizes(otherIndexes, viewSize) <= 0.1
    })
  }

  /**
   * Выполняет цикл.
   */
  function loop(): void {
    loopPoints.forEach((loopPoint) => {
      const { target, translate, slideLocation } = loopPoint
      const shiftLocation = target()
      if (shiftLocation === slideLocation.get()) return
      translate.to(shiftLocation)
      slideLocation.set(shiftLocation)
    })
  }

  /**
   * Очищает цикл.
   */
  function clear(): void {
    loopPoints.forEach((loopPoint) => loopPoint.translate.clear())
  }

  const self = {
    canLoop,
    clear,
    loop,
    loopPoints
  } as const

  return self
}
