import type { NodeRectType } from './useNodeRects.ts'

export type AxisOptionType = 'x' | 'y'

export type AxisDirectionOptionType = 'ltr' | 'rtl'

type AxisEdgeType = 'top' | 'right' | 'bottom' | 'left'

export type AxisType = ReturnType<typeof useAxis>

/**
 * Пользовательский хук, который предоставляет утилиты, связанные с осью.
 * @param axis - Опция оси ('x' или 'y').
 * @param contentDirection - Опция направления контента ('ltr' или 'rtl').
 * @returns Объект, содержащий свойства и функции, связанные с осью.
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
   * Измеряет размер DOM-узла вдоль оси.
   * @param nodeRect - Объект rect DOM-узла.
   * @returns Размер узла вдоль оси.
   */
  function measureSize(nodeRect: NodeRectType): number {
    const { height, width } = nodeRect
    return isVertical ? height : width
  }

  /**
   * Возвращает значение направления, умноженное на знак.
   * @param n - Значение направления.
   * @returns Значение направления, умноженное на знак.
   */
  function direction(n: number): number {
    return n * sign
  }

  /**
   * Возвращает начальный край оси.
   * @returns Начальный край оси.
   */
  function getStartEdge(): AxisEdgeType {
    if (isVertical) return 'top'
    return isRightToLeft ? 'right' : 'left'
  }

  /**
   * Возвращает конечный край оси.
   * @returns Конечный край оси.
   */
  function getEndEdge(): AxisEdgeType {
    if (isVertical) return 'bottom'
    return isRightToLeft ? 'left' : 'right'
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
