type EventNameType = keyof DocumentEventMap | keyof WindowEventMap
type EventHandlerType = (evt: any) => void
type EventOptionsType = boolean | AddEventListenerOptions | undefined
type EventRemoverType = () => void

export type EventStoreType = ReturnType<typeof useEventStore>

/**
 * Функция, которая создает хранилище событий для управления слушателями событий.
 * @returns Объект с методами `add` и `clear`.
 */
export function useEventStore() {
  let listeners: EventRemoverType[] = []

  /**
   * Добавляет слушатель событий к указанному узлу.
   * @param node - Целевой узел, к которому прикрепляется слушатель событий.
   * @param type - Тип события, на которое нужно реагировать.
   * @param handler - Функция обработчик события.
   * @param options - Дополнительные параметры слушателя событий (необязательно).
   * @returns Объект хранилища событий.
   */
  function add(
    node: EventTarget,
    type: EventNameType,
    handler: EventHandlerType,
    options: EventOptionsType = { passive: true }
  ): EventStoreType {
    let removeListener: EventRemoverType

    if ('addEventListener' in node) {
      node.addEventListener(type, handler, options)
      removeListener = () => node.removeEventListener(type, handler, options)
    } else {
      const legacyMediaQueryList = <MediaQueryList>node
      legacyMediaQueryList.addListener(handler)
      removeListener = () => legacyMediaQueryList.removeListener(handler)
    }

    listeners.push(removeListener)

    return self
  }

  /**
   * Очищает все слушатели событий из хранилища.
   */
  function clear(): void {
    listeners = listeners.filter((remove) => remove())
  }

  const self = {
    add,
    clear
  } as const

  return self
}
