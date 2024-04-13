import type { NodeRectType } from './NodeRects.ts'

/**
 * Опции оси.
 */
export type AxisOptionType = 'x' | 'y'

/**
 * Опции направления оси.
 */
export type AxisDirectionOptionType = 'ltr' | 'rtl'

/**
 * Тип границы оси.
 */
type AxisEdgeType = 'top' | 'right' | 'bottom' | 'left'

/**
 * Тип оси.
 */
export type AxisType = ReturnType<typeof useAxis>

/**
 * Создает объект оси.
 * @param axis - Опция оси, может быть 'x' или 'y'.
 * @param contentDirection - Направление содержимого, может быть 'ltr' или 'rtl'.
 * @returns Объект оси.
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
   * Измеряет размер элемента.
   * @param nodeRect - Размеры элемента.
   * @returns Размер элемента.
   */
  function measureSize(nodeRect: NodeRectType): number {
    const { height, width } = nodeRect
    return isVertical ? height : width
  }

  /**
   * Возвращает границу начала оси.
   * @returns Граница начала оси.
   */
  function getStartEdge(): AxisEdgeType {
    if (isVertical) return 'top'
    return isRightToLeft ? 'right' : 'left'
  }

  /**
   * Возвращает границу конца оси.
   * @returns Граница конца оси.
   */
  function getEndEdge(): AxisEdgeType {
    if (isVertical) return 'bottom'
    return isRightToLeft ? 'left' : 'right'
  }

  /**
   * Возвращает направление с учетом знака.
   * @param n - Число.
   * @returns Направление.
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
