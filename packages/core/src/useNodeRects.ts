export type NodeRectType = {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

export type NodeRectsType = ReturnType<typeof useNodeRects>

/**
 * Возвращает хук, который предоставляет функцию для измерения размеров и позиции HTML-элемента.
 * @returns Объект, содержащий функцию `measure`.
 */
export function useNodeRects() {
  /**
   * Измеряет размеры и позицию HTML-элемента.
   * @param node - HTML-элемент, который нужно измерить.
   * @returns Объект, представляющий размеры и позицию элемента.
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
