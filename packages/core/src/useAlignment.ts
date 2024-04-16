import { isString } from './utils.ts'

/**
 * Тип опции выравнивания.
 * Может быть одним из следующих значений:
 * - 'start' - начало;
 * - 'center' - центр;
 * - 'end' - конец;
 * - функция, принимающая параметры viewSize, snapSize и index и возвращающая число.
 */
export type AlignmentOptionType =
  | 'start'
  | 'center'
  | 'end'
  | ((viewSize: number, snapSize: number, index: number) => number)

/**
 * Тип выравнивания слайда.
 * Возвращаемый тип функции useAlignment.
 */
export type AlignmentType = ReturnType<typeof useAlignment>

/**
 * Функция для выравнивания слайда.
 * @param align - опция выравнивания.
 * @param viewSize - размер области просмотра.
 * @returns объект с методом measure для измерения выравнивания.
 */
export function useAlignment(align: AlignmentOptionType, viewSize: number) {
  const predefined = { start, center, end }

  /**
   * Функция для выравнивания в начало.
   * @returns число - начальное значение выравнивания.
   */
  function start(): number {
    return 0
  }

  /**
   * Функция для выравнивания в центр.
   * @param slideSize - размер слайда.
   * @returns число - значение выравнивания в центре.
   */
  function center(slideSize: number): number {
    return end(slideSize) / 2
  }

  /**
   * Функция для выравнивания в конец.
   * @param slideSize - размер слайда.
   * @returns число - значение выравнивания в конце.
   */
  function end(slideSize: number): number {
    return viewSize - slideSize
  }

  /**
   * Функция для измерения выравнивания.
   * @param slideSize - размер слайда.
   * @param index - индекс слайда.
   * @returns число - значение выравнивания.
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
