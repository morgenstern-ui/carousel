import type { NodeRectType } from './NodeRects.ts'

export type AxisOptionType = 'x' | 'y'
export type AxisDirectionOptionType = 'ltr' | 'rtl'
type AxisEdgeType = 'top' | 'right' | 'bottom' | 'left'

export type AxisType = ReturnType<typeof useAxis>

/**
 * Функция для использования оси.
 * @param {AxisOptionType} axis - Опция оси, может быть 'x' или 'y'.
 * @param {AxisDirectionOptionType} contentDirection - Направление содержимого, может быть 'ltr' или 'rtl'.
 * @returns {AxisType} Объект, представляющий ось.
 */
export function useAxis(axis: AxisOptionType, contentDirection: AxisDirectionOptionType) {
  const isRightToLeft = contentDirection === 'rtl'
  const isVertical = axis === 'y'
  const scroll = isVertical ? 'y' : 'x'
  const cross = isVertical ? 'x' : 'y'
  const sign = !isVertical && isRightToLeft ? -1 : 1
  const startEdge = getStartEdge()
  const endEdge = getEndEdge()

  /**
   * Функция для измерения размера узла.
   * @param {NodeRectType} nodeRect - Объект, представляющий размеры и позицию узла.
   * @returns {number} Возвращает высоту, если ось вертикальна, иначе возвращает ширину.
   */
  function measureSize(nodeRect: NodeRectType): number {
    const { height, width } = nodeRect
    return isVertical ? height : width
  }

  /**
   * Функция для получения начального ребра оси.
   * @returns {AxisEdgeType} Возвращает 'top', если ось вертикальна, иначе возвращает 'right' для правого режима чтения и 'left' для левого.
   */
  function getStartEdge(): AxisEdgeType {
    if (isVertical) return 'top'
    return isRightToLeft ? 'right' : 'left'
  }

  /**
   * Функция для получения конечного ребра оси.
   * @returns {AxisEdgeType} Возвращает 'bottom', если ось вертикальна, иначе возвращает 'left' для правого режима чтения и 'right' для левого.
   */
  function getEndEdge(): AxisEdgeType {
    if (isVertical) return 'bottom'
    return isRightToLeft ? 'left' : 'right'
  }

  /**
   * Функция для определения направления оси.
   * @param {number} n - Число, которое нужно умножить на знак.
   * @returns {number} Возвращает результат умножения числа на знак.
   */
  function direction(n: number): number {
    return n * sign
  }

  const self = {
    scroll,
    cross,
    startEdge,
    endEdge,
    measureSize,
    direction
  } as const

  return self
}
