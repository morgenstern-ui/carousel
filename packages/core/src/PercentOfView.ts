export type PercentOfViewType = ReturnType<typeof PercentOfView>

/**
 * Функция для создания объекта процентного соотношения вида.
 * @param {number} viewSize - Размер вида.
 * @returns {PercentOfViewType} Возвращает объект процентного соотношения вида.
 */
export function PercentOfView(viewSize: number) {
  /**
   * Функция для измерения процентного соотношения вида.
   * @param {number} n - Процентное значение.
   * @returns {number} Возвращает измеренное значение.
   */
  function measure(n: number): number {
    return viewSize * (n / 100)
  }

  const self = {
    measure
  } as const

  return self
}
