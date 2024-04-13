import type { EmblaCarouselType } from './EmblaCarousel.ts'
import type { EventHandlerType } from './EventHandler.ts'
import { isBoolean } from './utils.ts'

type SlidesHandlerCallbackType = (emblaApi: EmblaCarouselType, mutations: MutationRecord[]) => boolean | void

export type SlidesHandlerOptionType = boolean | SlidesHandlerCallbackType

export type SlidesHandlerType = ReturnType<typeof SlidesHandler>

/**
 * Создает обработчик слайдов.
 * @param {HTMLElement} container - Контейнер слайдов.
 * @param {EventHandlerType} eventHandler - Обработчик событий.
 * @param {SlidesHandlerOptionType} watchSlides - Опция для отслеживания изменений слайдов.
 * @returns {SlidesHandlerType} Обработчик слайдов.
 */
export function SlidesHandler(
  container: HTMLElement,
  eventHandler: EventHandlerType,
  watchSlides: SlidesHandlerOptionType
) {
  let mutationObserver: MutationObserver
  let destroyed = false

  /**
   * Инициализирует обработчик слайдов.
   * @param {EmblaCarouselType} emblaApi - API карусели.
   */
  function init(emblaApi: EmblaCarouselType): void {
    if (!watchSlides) return

    /**
     * Обратный вызов по умолчанию для обработки мутаций.
     * @param {MutationRecord[]} mutations - Массив мутаций.
     */
    function defaultCallback(mutations: MutationRecord[]): void {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          emblaApi.reInit()
          eventHandler.emit('slidesChanged')
          break
        }
      }
    }

    mutationObserver = new MutationObserver((mutations) => {
      if (destroyed) return
      if (isBoolean(watchSlides) || watchSlides(emblaApi, mutations)) {
        defaultCallback(mutations)
      }
    })

    mutationObserver.observe(container, { childList: true })
  }

  /**
   * Уничтожает обработчик слайдов.
   */
  function destroy(): void {
    if (mutationObserver) mutationObserver.disconnect()
    destroyed = true
  }

  const self = {
    init,
    destroy
  } as const

  return self
}
