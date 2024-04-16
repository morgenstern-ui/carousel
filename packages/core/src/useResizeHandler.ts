import type { AxisType } from './useAxis.ts'
import type { EmblaCarouselType } from './useEmblaCarousel.ts'
import type { EventHandlerType } from './useEventHandler.ts'
import type { NodeRectsType } from './useNodeRects.ts'
import { isBoolean, mathAbs, type WindowType } from './utils.ts'

type ResizeHandlerCallbackType = (emblaApi: EmblaCarouselType, entries: ResizeObserverEntry[]) => boolean | void

export type ResizeHandlerOptionType = boolean | ResizeHandlerCallbackType

export type ResizeHandlerType = ReturnType<typeof useResizeHandler>

/**
 * Создает обработчик изменения размера для контейнера карусели.
 *
 * @param $container - HTML-элемент, представляющий контейнер карусели.
 * @param eventHandler - Обработчик событий для карусели.
 * @param $ownerWindow - Объект окна карусели.
 * @param $slides - Массив HTML-элементов, представляющих слайды карусели.
 * @param axis - Тип оси карусели (горизонтальная или вертикальная).
 * @param watchResize - Опция для отслеживания событий изменения размера.
 * @param nodeRects - Объект, содержащий методы для измерения размера узла.
 * @returns Объект с методами для инициализации и уничтожения обработчика изменения размера.
 */
export function useResizeHandler(
  $container: HTMLElement,
  eventHandler: EventHandlerType,
  $ownerWindow: WindowType,
  $slides: HTMLElement[],
  axis: AxisType,
  watchResize: ResizeHandlerOptionType,
  nodeRects: NodeRectsType
) {
  let resizeObserver: ResizeObserver
  let containerSize: number
  let slideSizes: number[] = []
  let destroyed = false

  function readSize(node: HTMLElement): number {
    return axis.measureSize(nodeRects.measure(node))
  }

  /**
   * Инициализирует обработчик изменения размера.
   *
   * @param emblaApi - Экземпляр useEmblaCarousel.
   */
  function init(emblaApi: EmblaCarouselType): void {
    if (!watchResize) return

    containerSize = readSize($container)
    slideSizes = $slides.map(readSize)

    function defaultCallback(entries: ResizeObserverEntry[]): void {
      for (const entry of entries) {
        const isContainer = entry.target === $container
        const slideIndex = $slides.indexOf(<HTMLElement>entry.target)
        const lastSize = isContainer ? containerSize : slideSizes[slideIndex]
        const newSize = readSize(<HTMLElement>entry.target)
        const diffSize = mathAbs(newSize - lastSize)

        if (diffSize >= 0.5) {
          $ownerWindow.requestAnimationFrame(() => {
            emblaApi.reInit()
            eventHandler.emit('resize')
          })
          break
        }
      }
    }

    resizeObserver = new ResizeObserver((entries) => {
      if (destroyed) return
      if (isBoolean(watchResize) || watchResize(emblaApi, entries)) {
        defaultCallback(entries)
      }
    })

    const observeNodes = [$container].concat($slides)
    observeNodes.forEach((node) => resizeObserver.observe(node))
  }

  /**
   * Уничтожает обработчик изменения размера.
   */
  function destroy(): void {
    if (resizeObserver) resizeObserver.disconnect()
    destroyed = true
  }

  const self = {
    init,
    destroy
  } as const

  return self
}
