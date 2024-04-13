export type PercentOfViewType = ReturnType<typeof usePercentOfView>

/**
 * Вычисляет значение измерения на основе процента от размера представления.
 * @param viewSize Размер представления.
 * @returns Объект с функцией `measure`, которая вычисляет значение измерения.
 */
export function usePercentOfView(viewSize: number) {
  /**
   * Вычисляет значение измерения на основе процента.
   * @param percent Значение процента.
   * @returns Вычисленное значение измерения.
   */
  function measure(percent: number): number {
    return viewSize * (percent / 100)
  }

  const self = {
    measure
  } as const

  return self
}
