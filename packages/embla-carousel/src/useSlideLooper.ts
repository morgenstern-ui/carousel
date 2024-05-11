import type { AxisType } from './useAxis.ts'
import { arrayKeys } from './utils.ts'
import { useVector1D, type Vector1DType } from './useVector1D.ts'
import { useTranslate, type TranslateType } from './useTranslate.ts'

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

export type SlideLooperType = ReturnType<typeof useSlideLooper>

/**
 * Пользовательский хук, который обрабатывает циклическое поведение слайдов в карусели.
 *
 * @param axis - Тип оси карусели (горизонтальная или вертикальная).
 * @param containerSize - Размер видимой области карусели.
 * @param contentSize - Общий размер содержимого карусели.
 * @param slideSizes - Массив размеров для каждого слайда.
 * @param slideSizesWithGaps - Массив размеров для каждого слайда с учетом промежутков.
 * @param slideSnaps - Массив точек привязки для каждого слайда.
 * @param scrollSnaps - Массив точек прокрутки для каждого слайда.
 * @param offsetLocationVector - Текущее смещение карусели.
 * @param $slides - Массив элементов слайдов.
 * @returns Объект, содержащий функции и данные, связанные с циклическим поведением слайдов.
 */
export function useSlideLooper(
  axis: AxisType,
  containerSize: number,
  contentSize: number,
  slideSizes: number[],
  slideSizesWithGaps: number[],
  slideSnaps: number[],
  scrollSnaps: number[],
  offsetLocationVector: Vector1DType,
  $slides: HTMLElement[]
) {
  const roundingSafety = 0.5
  const ascItems = arrayKeys(slideSizesWithGaps)
  const descItems = [...ascItems].reverse()
  const loopPoints = startPoints().concat(endPoints())

  /**
   * Проверяет, может ли карусель циклически перемещаться.
   *
   * @returns True, если карусель может циклически перемещаться, в противном случае - false.
   */
  function canLoop(): boolean {
    for (const { index } of loopPoints) {
      const otherIndexes = ascItems.filter((i) => i !== index)

      if (removeSlideSizes(otherIndexes, containerSize) > 0.1)
        return false
    }

    return true
  }

  /**
   * Циклически перемещает слайды в карусели.
   */
  function loop(): void {
    for (const loopPoint of loopPoints) {
      const { target, translate, slideLocation } = loopPoint
      const shiftLocation = target()

      if (shiftLocation === slideLocation.get()) continue

      translate.to(shiftLocation)
      slideLocation.set(shiftLocation)
    }
  }

  /**
   * Очищает переводы точек цикла.
   */
  function clear(): void {
    for (const loopPoint of loopPoints) {
      loopPoint.translate.clear()
    }
  }

  /**
   * Находит точки цикла для начального края карусели.
   *
   * @returns Массив точек цикла для начального края.
   */
  function startPoints(): LoopPointType[] {
    const gap = scrollSnaps[0]
    const indexes = slidesInGap(descItems, gap)

    return findLoopPoints(indexes, contentSize, false)
  }

  /**
   * Находит точки цикла для конечного края карусели.
   *
   * @returns Массив точек цикла для конечного края.
   */
  function endPoints(): LoopPointType[] {
    const gap = containerSize - scrollSnaps[0] - 1
    const indexes = slidesInGap(ascItems, gap)

    return findLoopPoints(indexes, -contentSize, true)
  }

  /**
   * Возвращает массив индексов слайдов, которые помещаются в заданный размер промежутка.
   *
   * @param indexes - Массив индексов слайдов.
   * @param gap - Доступный размер промежутка.
   * @returns Массив индексов слайдов, которые помещаются в промежуток.
   */
  function slidesInGap(indexes: number[], gap: number): number[] {
    const slides: number[] = []

    for (const index of indexes) {
      const remainingGap = removeSlideSizes(slides, gap)

      if (remainingGap > 0)
        slides.push(index)
    }

    return slides
  }

  /**
   * Удаляет размеры слайдов с заданными индексами из общего размера.
   *
   * @param indexes - Массив индексов слайдов.
   * @param from - Общий размер, из которого нужно вычесть.
   * @returns Обновленный общий размер после удаления размеров слайдов.
   */
  function removeSlideSizes(indexes: number[], from: number): number {
    let to = from

    for (const index of indexes) {
      to -= slideSizesWithGaps[index]
    }

    return to
  }

  /**
   * Находит точки цикла для заданных индексов слайдов и смещения.
   *
   * @param indexes - Массив индексов слайдов.
   * @param offset - Текущее смещение.
   * @param isEndEdge - Указывает, являются ли точки цикла для конечного края.
   * @returns Массив точек цикла.
   */
  function findLoopPoints(indexes: number[], offset: number, isEndEdge: boolean): LoopPointType[] {
    const slideBounds = findSlideBounds(offset)

    return indexes.map((index) => {
      const initial = isEndEdge ? 0 : -contentSize
      const altered = isEndEdge ? contentSize : 0
      const boundEdge = isEndEdge ? 'end' : 'start'
      const loopPoint = slideBounds[index][boundEdge]

      return {
        index,
        loopPoint,
        slideLocation: useVector1D(-1),
        translate: useTranslate(axis, $slides[index]),
        target: () => (offsetLocationVector.get() > loopPoint ? initial : altered)
      }
    })
  }

  /**
   * Находит начальные и конечные границы каждого слайда на основе текущего смещения.
   *
   * @param offset - Текущее смещение.
   * @returns Массив границ слайдов.
   */
  function findSlideBounds(offset: number): SlideBoundType[] {
    return slideSnaps.map((snap, index) => ({
      start: snap - slideSizes[index] + roundingSafety + offset,
      end: snap + containerSize - roundingSafety + offset
    }))
  }

  const self = {
    canLoop,
    clear,
    loop,
    loopPoints
  } as const

  return self
}
