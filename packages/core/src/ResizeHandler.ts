import type { AxisType } from './Axis.ts'
import type { EmblaCarouselType } from './EmblaCarousel.ts'
import type { EventHandlerType } from './EventHandler.ts'
import type { NodeRectsType } from './NodeRects.ts'
import { isBoolean, mathAbs, type WindowType } from './utils.ts'

type ResizeHandlerCallbackType = (
  emblaApi: EmblaCarouselType,
  entries: ResizeObserverEntry[]
) => boolean | void

export type ResizeHandlerOptionType = boolean | ResizeHandlerCallbackType

export type ResizeHandlerType = ReturnType<typeof ResizeHandler>

/**
 * Создает обработчик изменения размера.
 * @param {HTMLElement} container - Контейнер.
 * @param {EventHandlerType} eventHandler - Обработчик событий.
 * @param {WindowType} ownerWindow - Объект окна.
 * @param {HTMLElement[]} slides - Слайды.
 * @param {AxisType} axis - Ось.
 * @param {ResizeHandlerOptionType} watchResize - Опция отслеживания изменения размера.
 * @param {NodeRectsType} nodeRects - Прямоугольники узлов.
 * @returns {ResizeHandlerType} Обработчик изменения размера.
 */
export function ResizeHandler(
  container: HTMLElement,
  eventHandler: EventHandlerType,
  ownerWindow: WindowType,
  slides: HTMLElement[],
  axis: AxisType,
  watchResize: ResizeHandlerOptionType,
  nodeRects: NodeRectsType
)
 {
  let resizeObserver: ResizeObserver
  let containerSize: number
  let slideSizes: number[] = []
  let destroyed = false

  /**
   * Читает размер узла.
   * @param {HTMLElement} node - Узел.
   * @returns {number} Размер узла.
   */
  function readSize(node: HTMLElement): number {
    return axis.measureSize(nodeRects.measure(node))
  }

  /**
   * Инициализирует обработчик изменения размера.
   * @param {EmblaCarouselType} emblaApi - API карусели Embla.
   */
  function init(emblaApi: EmblaCarouselType): void {
    if (!watchResize) return

    containerSize = readSize(container)
    slideSizes = slides.map(readSize)

    function defaultCallback(entries: ResizeObserverEntry[]): void {
      for (const entry of entries) {
        const isContainer = entry.target === container
        const slideIndex = slides.indexOf(<HTMLElement>entry.target)
        const lastSize = isContainer ? containerSize : slideSizes[slideIndex]
        const newSize = readSize(isContainer ? container : slides[slideIndex])
        const diffSize = mathAbs(newSize - lastSize)

        if (diffSize >= 0.5) {
          ownerWindow.requestAnimationFrame(() => {
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

    const observeNodes = [container].concat(slides)
    observeNodes.forEach((node) => resizeObserver.observe(node))
  }

  /**
   * Уничтожает обработчик изменения размера.
   */
  function destroy(): void {
    if (resizeObserver) resizeObserver.disconnect()
    destroyed = true
  }

  const self
   = {
    init,
    destroy
  } as const

  return self
}
