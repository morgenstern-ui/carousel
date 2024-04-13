type EventNameType = keyof DocumentEventMap | keyof WindowEventMap
type EventHandlerType = (evt: any) => void
type EventOptionsType = boolean | AddEventListenerOptions | undefined
type EventRemoverType = () => void

export type EventStoreType = ReturnType<typeof EventStore>

/**
 * Экспортируемая функция EventStore, которая создает объект для управления хранилищем событий.
 * @returns {EventStoreType} Возвращает объект EventStore.
 */
export function EventStore() {
  let listeners: EventRemoverType[] = []

  /**
   * Добавляет обработчик события к указанному узлу.
   * @param {EventTarget} node - Узел, к которому добавляется обработчик события.
   * @param {EventNameType} type - Тип события.
   * @param {EventHandlerType} handler - Обработчик события.
   * @param {EventOptionsType} options - Опции события.
   * @returns {EventStoreType} Возвращает объект EventStore.
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
   * Очищает все обработчики событий.
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
