import { isString } from './utils'

export type AlignmentOptionType =
  | 'start'
  | 'center'
  | 'end'
  | ((viewSize: number, snapSize: number, index: number) => number)

export type SlideAlignmentType = ReturnType<typeof useSlideAlignment>

/**
 * Функция для создания объекта выравнивания.
 * @param {AlignmentOptionType} align - Опции выравнивания.
 * @param {number} viewSize - Размер области просмотра.
 * @returns {SlideAlignmentType} Возвращает объект выравнивания.
 */
export function useSlideAlignment(align: AlignmentOptionType, viewSize: number) {
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
   * @param {number} slideSize - Размер элемента.
   * @returns {number} Возвращает половину отступа от конца.
   */
  function center(slideSize: number): number {
    return end(slideSize) / 2
  }

  /**
   * Функция для выравнивания в конце.
   * @param {number} slideSize - Размер элемента.
   * @returns {number} Возвращает отступ от конца.
   */
  function end(slideSize: number): number {
    return viewSize - slideSize
  }

  /**
   * Функция для измерения выравнивания.
   * @param {number} slideSize - Размер элемента.
   * @param {number} index - Индекс элемента.
   * @returns {number} Возвращает измеренное значение выравнивания.
   */
  function measure(slideSize: number, index: number): number {
    if (isString(align)) return predefined[align](slideSize)
    return align(viewSize, slideSize, index)
  }

  const self = {
    measure
  } as const

  return self
}
