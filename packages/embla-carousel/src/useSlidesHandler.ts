import type { EmblaCarouselType } from './useEmblaCarousel.ts'
import type { EventHandlerType } from './useEventHandler.ts'
import { isBoolean } from './utils.ts'

type SlidesHandlerCallbackType = (emblaApi: EmblaCarouselType, mutations: MutationRecord[]) => boolean | void

export type SlidesHandlerOptionType = boolean | SlidesHandlerCallbackType

export type SlidesHandlerType = ReturnType<typeof useSlidesHandler>

/**
 * Создает экземпляр SlidesHandler.
 *
 * @param $container - HTML-элемент, содержащий слайды.
 * @param eventHandler - Обработчик событий для карусели.
 * @param watchSlides - Опция для отслеживания изменений слайдов.
 * @returns Объект с методами `init` и `destroy`.
 */
export function useSlidesHandler(
  $container: HTMLElement,
  eventHandler: EventHandlerType,
  watchSlides: SlidesHandlerOptionType
) {
  let mutationObserver: MutationObserver
  let destroyed = false

  /**
   * Инициализирует обработчик слайдов.
   *
   * @param emblaApi - Объект типа EmblaCarouselType.
   */
  function init(emblaApi: EmblaCarouselType): void {
    if (!watchSlides) return

    function callback(mutations: MutationRecord[]): void {
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
        callback(mutations)
      }
    })

    mutationObserver.observe($container, { childList: true })
  }

  /**
   * Уничтожает экземпляр SlidesHandler.
   * Эта функция отключает наблюдение за мутациями и устанавливает флаг `destroyed` в true.
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
