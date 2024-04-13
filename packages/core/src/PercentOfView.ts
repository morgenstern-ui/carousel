export type PercentOfViewType = ReturnType<typeof usePercentOfView>

/**
 * Функция для создания объекта процентного соотношения вида.
 * @param {number} viewSize - Размер вида.
 * @returns {PercentOfViewType} Возвращает объект процентного соотношения вида.
 */
export function usePercentOfView(viewSize: number) {
  /**
   * Функция для измерения процентного соотношения вида.
   * @param {number} percent - Процентное значение.
   * @returns {number} Возвращает измеренное значение.
   */
  function measure(percent: number): number {
    return viewSize * (percent / 100)
  }

  const self = {
    measure
  } as const

  return self
}
