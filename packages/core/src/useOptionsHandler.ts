import type { LooseOptionsType, CreateOptionsType } from './Options.ts'
import { objectKeys, objectsMergeDeep, type WindowType } from './utils.ts'

type OptionsType = Partial<CreateOptionsType<LooseOptionsType>>

export type OptionsHandlerType = ReturnType<typeof useOptionsHandler>

/**
 * Пользовательский хук, который предоставляет функции для обработки параметров в компоненте карусели.
 * @param ownerWindow - Объект окна владельца компонента.
 * @returns Объект, содержащий функции для объединения параметров, получения параметров для конкретных медиа-точек и получения списков медиа-запросов для параметров.
 */
export function useOptionsHandler(ownerWindow: WindowType) {
  /**
   * Глубоко объединяет два объекта параметров.
   * @param optionsA - Первый объект параметров.
   * @param optionsB - Второй объект параметров.
   * @returns Объединенный объект параметров.
   */
  function mergeOptions<TypeA extends OptionsType, TypeB extends OptionsType>(
    optionsA: TypeA,
    optionsB?: TypeB
  ): TypeA {
    return <TypeA>objectsMergeDeep(optionsA, optionsB || {})
  }

  /**
   * Получает параметры для текущих медиа-точек.
   * @param options - Базовый объект параметров.
   * @returns Объект параметров с объединенными параметрами для соответствующих медиа-точек.
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
   * Получает списки медиа-запросов для заданного списка параметров.
   * @param optionsList - Список объектов параметров.
   * @returns Массив списков медиа-запросов, соответствующих медиа-точкам в объектах параметров.
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
