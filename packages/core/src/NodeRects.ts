export type NodeRectType = {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

export type NodeRectsType = ReturnType<typeof NodeRects>

/**
 * Функция, которая возвращает объект с функцией измерения.
 * @returns {NodeRectsType} Объект с функцией измерения.
 */
export function NodeRects() {
   /**
   * Функция, которая измеряет node и возвращает его размеры и позицию.
   * @param {HTMLElement} node - Node для измерения.
   * @returns {NodeRectType} Размеры и позиция узла.
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
