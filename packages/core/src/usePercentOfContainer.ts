export type PercentOfViewType = ReturnType<typeof usePercentOfContainer>

/**
 * Возвращает функцию, которая вычисляет указанный процент от размера контейнера.
 * 
 * @param containerSize - Размер контейнера.
 * @returns Объект с функцией `measure`, которая вычисляет указанный процент от размера контейнера.
 */
export function usePercentOfContainer(containerSize: number) {
  /**
   * Вычисляет измерение на основе заданного процента от размера контейнера.
   * 
   * @param percent - Значение процента для вычисления измерения.
   * @returns Вычисленное измерение.
   */
  function measure(percent: number): number {
    return containerSize * (percent / 100)
  }

  const self = {
    measure
  } as const

  return self
}
