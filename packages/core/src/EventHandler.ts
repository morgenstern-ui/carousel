import type { EmblaCarouselType } from './EmblaCarousel.ts'

type CallbackType = (emblaApi: EmblaCarouselType, evt: EmblaEventType) => void
type ListenersType = Partial<{ [key in EmblaEventType]: CallbackType[] }>

export type EmblaEventType = EmblaEventListType[keyof EmblaEventListType]

export interface EmblaEventListType {
  init: 'init'
  pointerDown: 'pointerDown'
  pointerUp: 'pointerUp'
  slidesChanged: 'slidesChanged'
  slidesInView: 'slidesInView'
  scroll: 'scroll'
  select: 'select'
  settle: 'settle'
  destroy: 'destroy'
  reInit: 'reInit'
  resize: 'resize'
}

export type EventHandlerType = ReturnType<typeof EventHandler>

/**
 * Создает обработчик событий.
 * @returns {EventHandlerType} Обработчик событий.
 */
export function EventHandler() {
  const listeners: ListenersType = {}
  let api: EmblaCarouselType

  /**
   * Инициализирует обработчик событий.
   * @param {EmblaCarouselType} emblaApi - API карусели Embla.
   */
  function init(emblaApi: EmblaCarouselType): void {
    api = emblaApi
  }

  /**
   * Получает слушателей для указанного события.
   * @param {EmblaEventType} evt - Тип события.
   * @returns {CallbackType[]} Массив слушателей.
   */
  function getListeners(evt: EmblaEventType): CallbackType[] {
    return listeners[evt] || []
  }

  /**
   * Генерирует событие.
   * @param {EmblaEventType} evt - Тип события.
   * @returns {EventHandlerType} Обработчик событий.
   */
  function emit(evt: EmblaEventType): EventHandlerType {
    getListeners(evt).forEach((e) => e(api, evt))
    return self
  }

  /**
   * Добавляет слушателя для указанного события.
   * @param {EmblaEventType} evt - Тип события.
   * @param {CallbackType} cb - Функция обратного вызова.
   * @returns {EventHandlerType} Обработчик событий.
   */
  function on(evt: EmblaEventType, cb: CallbackType): EventHandlerType {
    listeners[evt] = getListeners(evt).concat([cb])
    return self
  }

  /**
   * Удаляет слушателя для указанного события.
   * @param {EmblaEventType} evt - Тип события.
   * @param {CallbackType} cb - Функция обратного вызова.
   * @returns {EventHandlerType} Обработчик событий.
   */
  function off(evt: EmblaEventType, cb: CallbackType): EventHandlerType {
    listeners[evt] = getListeners(evt).filter((e) => e !== cb)
    return self
  }

  const self = {
    init,
    emit,
    off,
    on
  } as const

  return self
}
