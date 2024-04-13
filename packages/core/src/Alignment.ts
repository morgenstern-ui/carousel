import { isString } from './utils'

export type AlignmentOptionType =
  | 'start'
  | 'center'
  | 'end'
  | ((viewSize: number, snapSize: number, index: number) => number)

export type AlignmentType = ReturnType<typeof Alignment>

/**
 * Функция для создания объекта выравнивания.
 * @param {AlignmentOptionType} align - Опции выравнивания.
 * @param {number} viewSize - Размер области просмотра.
 * @returns {AlignmentType} Возвращает объект выравнивания.
 */
export function Alignment(
  align: AlignmentOptionType,
  viewSize: number
) {
  const predefined = { start, center, end }

  /**
   * Функция для выравнивания в начале.
   * @returns {number} Возвращает 0.
   */
  function start(): number {
    return 0
  }

  /**
   * Функция для центрального выравнивания.
   * @param {number} n - Размер элемента.
   * @returns {number} Возвращает половину отступа от конца.
   */
  function center(n: number): number {
    return end(n) / 2
  }

  /**
   * Функция для выравнивания в конце.
   * @param {number} n - Размер элемента.
   * @returns {number} Возвращает отступ от конца.
   */
  function end(n: number): number {
    return viewSize - n
  }

  /**
   * Функция для измерения выравнивания.
   * @param {number} n - Размер элемента.
   * @param {number} index - Индекс элемента.
   * @returns {number} Возвращает измеренное значение выравнивания.
   */
  function measure(n: number, index: number): number {
    if (isString(align)) return predefined[align](n)
    return align(viewSize, n, index)
  }

  const self = {
    measure
  } as const

  return self
}
