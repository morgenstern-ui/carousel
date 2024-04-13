/**
 * Тип, представляющий прямоугольник узла.
 */
export type NodeRectType = {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

/**
 * Тип, представляющий прямоугольники узлов, возвращаемые функцией useNodeRects.
 */
export type NodeRectsType = ReturnType<typeof useNodeRects>

/**
 * Функция, используемая для измерения прямоугольника узла.
 * @param node - HTML-элемент, для которого нужно измерить прямоугольник.
 * @returns Прямоугольник узла.
 */
export function useNodeRects() {
  /**
   * Измеряет прямоугольник узла.
   * @param node - HTML-элемент, для которого нужно измерить прямоугольник.
   * @returns Прямоугольник узла.
   */
  function measure(node: HTMLElement): NodeRectType {
    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = node

    const offset: NodeRectType = {
      top: offsetTop,
      right: offsetLeft + offsetWidth,
      bottom: offsetTop + offsetHeight,
      left: offsetLeft,
      width: offsetWidth,
      height: offsetHeight
    }

    return offset
  }

  const self = {
    measure
  } as const

  return self
}
