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

export type AlignmentType = ReturnType<typeof useAlignment>

/**
 * Возвращает функцию измерения на основе опции выравнивания и размера контейнера.
 * @param align - Опция выравнивания.
 * @param containerSize - Размер контейнера.
 * @returns Объект с функцией `measure`, которая вычисляет измерение на основе опции выравнивания и размера контейнера.
 */
export function useAlignment(align: AlignmentOptionType, containerSize: number) {
  const predefined = { start, center, end }

  /**
   * Возвращает начальную позицию.
   * @returns Начальная позиция.
   */
  function start(): number {
    return 0
  }

  /**
   * Возвращает центральную позицию на основе размера слайда.
   * @param slideSize - Размер слайда.
   * @returns Центральная позиция.
   */
  function center(slideSize: number): number {
    return end(slideSize) / 2
  }

  /**
   * Возвращает конечную позицию на основе размера слайда.
   * @param slideSize - Размер слайда.
   * @returns Конечная позиция.
   */
  function end(slideSize: number): number {
    return containerSize - slideSize
  }

  /**
   * Измеряет позицию на основе опции выравнивания, размера контейнера, размера слайда и индекса.
   * @param slideSize - Размер слайда.
   * @param index - Индекс слайда.
   * @returns Измеренная позиция.
   */
  function measure(slideSize: number, index: number): number {
    if (isString(align)) return predefined[align](slideSize)
    return align(containerSize, slideSize, index)
  }

  const self = {
    measure
  } as const

  return self
}
