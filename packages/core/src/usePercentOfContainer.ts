export type PercentOfViewType = ReturnType<typeof usePercentOfContainer>

/**
 * Вычисляет значение измерения на основе процента от размера представления.
 * @param containerSize Размер контейнера.
 * @returns Объект с функцией `measure`, которая вычисляет значение измерения.
 */
export function usePercentOfContainer(containerSize: number) {
  /**
   * Вычисляет значение измерения на основе процента.
   * @param percent Значение процента.
   * @returns Вычисленное значение измерения.
   */
  function measure(percent: number): number {
    return containerSize * (percent / 100)
  }

  const self = {
    measure
  } as const

  return self
}
