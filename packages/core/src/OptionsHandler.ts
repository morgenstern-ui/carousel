import type { LooseOptionsType, CreateOptionsType } from './Options.ts'
import { objectKeys, objectsMergeDeep, type WindowType } from './utils.ts'

type OptionsType = Partial<CreateOptionsType<LooseOptionsType>>

export type OptionsHandlerType = ReturnType<typeof OptionsHandler>

/**
 * Создает обработчик опций.
 * @param {WindowType} ownerWindow - Объект окна.
 * @returns {OptionsHandlerType} Обработчик опций.
 */
export function OptionsHandler(ownerWindow: WindowType) {
  /**
   * Объединяет два набора опций в один.
   * @param {TypeA} optionsA - Первый набор опций.
   * @param {TypeB} optionsB - Второй набор опций.
   * @returns {TypeA} Объединенный набор опций.
   */
  function mergeOptions<TypeA extends OptionsType, TypeB extends OptionsType>(
    optionsA: TypeA,
    optionsB?: TypeB
  ): TypeA {
    return <TypeA>objectsMergeDeep(optionsA, optionsB || {})
  }

  /**
   * Получает опции, соответствующие текущим медиа-запросам.
   * @param {Type} options - Набор опций.
   * @returns {Type} Опции, соответствующие текущим медиа-запросам.
   */
  function optionsAtMedia<Type extends OptionsType>(options: Type): Type {
    const optionsAtMedia = options.breakpoints || {}
    const matchedMediaOptions = objectKeys(optionsAtMedia)
      .filter((media) => ownerWindow.matchMedia(media).matches)
      .map((media) => optionsAtMedia[media])
      .reduce((a, mediaOption) => mergeOptions(a, mediaOption), {})

    return mergeOptions(options, matchedMediaOptions)
  }

  /**
   * Получает медиа-запросы из списка опций.
   * @param {OptionsType[]} optionsList - Список опций.
   * @returns {MediaQueryList[]} Список медиа-запросов.
   */
  function optionsMediaQueries(optionsList: OptionsType[]): MediaQueryList[] {
    return optionsList
      .map((options) => objectKeys(options.breakpoints || {}))
      .reduce((acc, mediaQueries) => acc.concat(mediaQueries), [])
      .map(ownerWindow.matchMedia)
  }

  const self = {
    mergeOptions,
    optionsAtMedia,
    optionsMediaQueries
  } as const

  return self
}
