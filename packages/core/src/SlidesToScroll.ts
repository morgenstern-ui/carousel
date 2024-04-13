import type { AxisType } from './Axis.ts'
import type { NodeRectType } from './NodeRects.ts'
import {
  arrayKeys,
  arrayLast,
  arrayLastIndex,
  isNumber,
  mathAbs
} from './utils'

export type SlidesToScrollOptionType = 'auto' | number

export type SlidesToScrollType = ReturnType<typeof SlidesToScroll>

/**
 * Экспортируемая функция SlidesToScroll, которая создает объект для управления группами слайдов.
 * @param {AxisType} axis - Ось, по которой происходит прокрутка.
 * @param {number} viewSize - Размер видимой области.
 * @param {SlidesToScrollOptionType} slidesToScroll - Опция, определяющая количество слайдов для прокрутки.
 * @param {boolean} loop - Флаг, указывающий на необходимость циклической прокрутки.
 * @param {NodeRectType} containerRect - Объект, описывающий прямоугольник контейнера.
 * @param {NodeRectType[]} slideRects - Массив объектов, описывающих прямоугольники слайдов.
 * @param {number} startGap - Промежуток в начале.
 * @param {number} endGap - Промежуток в конце.
 * @param {number} pixelTolerance - Толерантность в пикселях.
 * @returns {SlidesToScrollType} Возвращает объект SlidesToScroll.
 */
export function SlidesToScroll(
  axis: AxisType,
  viewSize: number,
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
   * Группирует элементы массива по заданному числу.
   * @param {Type[]} array - Массив элементов.
   * @param {number} groupSize - Размер группы.
   * @returns {Type[][]} Возвращает массив групп.
   */
  function byNumber<Type>(array: Type[], groupSize: number): Type[][] {
    return arrayKeys(array)
      .filter((i) => i % groupSize === 0)
      .map((i) => array.slice(i, i + groupSize))
  }

  /**
   * Группирует элементы массива по размеру.
   * @param {Type[]} array - Массив элементов.
   * @returns {Type[][]} Возвращает массив групп.
   */
  function bySize<Type>(array: Type[]): Type[][] {
    if (!array.length) return []

    return arrayKeys(array)
      .reduce((groups: number[], rectB, index) => {
        const rectA = arrayLast(groups) || 0
        const isFirst = rectA === 0
        const isLast = rectB === arrayLastIndex(array)

        const edgeA = containerRect[startEdge] - slideRects[rectA][startEdge]
        const edgeB = containerRect[startEdge] - slideRects[rectB][endEdge]
        const gapA = !loop && isFirst ? direction(startGap) : 0
        const gapB = !loop && isLast ? direction(endGap) : 0
        const chunkSize = mathAbs(edgeB - gapB - (edgeA + gapA))

        if (index && chunkSize > viewSize + pixelTolerance) groups.push(rectB)
        if (isLast) groups.push(array.length)
        return groups
      }, [])
      .map((currentSize, index, groups) => {
        const previousSize = Math.max(groups[index - 1] || 0)
        return array.slice(previousSize, currentSize)
      })
  }

  /**
   * Группирует слайды.
   * @param {Type[]} array - Массив слайдов.
   * @returns {Type[][]} Возвращает массив групп слайдов.
   */
  function groupSlides<Type>(array: Type[]): Type[][] {
    return groupByNumber ? byNumber(array, slidesToScroll) : bySize(array)
  }

  const self = {
    groupSlides
  } as const

  return self
}
