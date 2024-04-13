import { useLimit } from './useLimit.ts'
import { arrayLast } from './utils.ts'

export type ScrollLimitType = ReturnType<typeof useScrollLimit>

/**
 * Рассчитывает предел прокрутки на основе размера контента, позиций прокрутки и опции цикла.
 * @param contentSize Размер контента.
 * @param scrollSnaps Массив позиций прокрутки.
 * @param loop Булево значение, указывающее, должен ли карусель циклически прокручиваться.
 * @returns Объект, содержащий предел прокрутки.
 */
export function useScrollLimit(contentSize: number, scrollSnaps: number[], loop: boolean) {
  const max = scrollSnaps[0]
  const min = loop ? max - contentSize : arrayLast(scrollSnaps)
  const limit = useLimit(min, max)

  const self = {
    limit
  } as const

  return self
}
