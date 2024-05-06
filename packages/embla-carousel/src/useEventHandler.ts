import type { EmblaCarouselType } from './useEmblaCarousel.ts'

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

export type EventHandlerType = ReturnType<typeof useEventHandler>

/**
 * Представляет обработчик событий для Embla Carousel.
 */
export function useEventHandler() {
  /**
   * Определение типа для объекта слушателей.
   */
  const listeners: ListenersType = {}

  /**
   * Экземпляр API Embla Carousel.
   */
  let api: EmblaCarouselType

  /**
   * Инициализирует обработчик событий с экземпляром API Embla Carousel.
   * @param emblaApi - Экземпляр API Embla Carousel.
   */
  function init(emblaApi: EmblaCarouselType): void {
    api = emblaApi
  }

  /**
   * Получает слушателей для определенного события.
   * @param evt - Тип события.
   * @returns Массив функций обратного вызова.
   */
  function getListeners(evt: EmblaEventType): CallbackType[] {
    return listeners[evt] || []
  }

  /**
   * Генерирует событие для всех зарегистрированных слушателей.
   * @param evt - Тип события.
   * @returns Экземпляр обработчика событий.
   */
  function emit(evt: EmblaEventType): EventHandlerType {
    getListeners(evt).forEach((e) => e(api, evt))
    return self
  }

  /**
   * Регистрирует функцию обратного вызова для определенного события.
   * @param evt - Тип события.
   * @param cb - Функция обратного вызова.
   * @returns Экземпляр обработчика событий.
   */
  function on(evt: EmblaEventType, cb: CallbackType): EventHandlerType {
    listeners[evt] = getListeners(evt).concat([cb])
    return self
  }

  /**
   * Отменяет регистрацию функции обратного вызова для определенного события.
   * @param evt - Тип события.
   * @param cb - Функция обратного вызова.
   * @returns Экземпляр обработчика событий.
   */
  function off(evt: EmblaEventType, cb: CallbackType): EventHandlerType {
    listeners[evt] = getListeners(evt).filter((e) => e !== cb)
    return self
  }

  // Экземпляр обработчика событий
  const self = {
    init,
    emit,
    off,
    on
  } as const

  return self
}
