import type { EventHandlerType } from './useEventHandler.ts'
import { objectKeys } from './utils.ts'

type IntersectionEntryMapType = Record<number, IntersectionObserverEntry>

export type SlidesInViewOptionsType = IntersectionObserverInit['threshold']

export type SlidesInViewType = ReturnType<typeof useSlidesInView>

/**
 * Создает пользовательский хук, который отслеживает, какие слайды находятся в видимости внутри контейнера.
 * @param $container - Элемент контейнера, содержащий слайды.
 * @param $slides - Массив элементов слайдов.
 * @param eventHandler - Объект обработчика событий.
 * @param threshold - Параметры порога для IntersectionObserver.
 * @returns Объект с методами для инициализации, уничтожения и получения слайдов в видимости.
 */
export function useSlidesInView(
  $container: HTMLElement,
  $slides: HTMLElement[],
  eventHandler: EventHandlerType,
  threshold: SlidesInViewOptionsType
) {
  const intersectionEntryMap: IntersectionEntryMapType = {}
  let inViewCache: number[] | null = null
  let notInViewCache: number[] | null = null
  let intersectionObserver: IntersectionObserver
  let destroyed = false

  /**
   * Инициализирует IntersectionObserver и начинает отслеживать слайды в видимости.
   */
  function init(): void {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (destroyed) return

        for (const entry of entries) {
          const index = $slides.indexOf(<HTMLElement>entry.target)
          intersectionEntryMap[index] = entry
        }

        inViewCache = null
        notInViewCache = null
        eventHandler.emit('slidesInView')
      },
      {
        root: $container.parentElement,
        threshold
      }
    )

    for (const $slide of $slides) {
      intersectionObserver.observe($slide)
    }
  }

  /**
   * Отключает IntersectionObserver и прекращает отслеживать слайды в видимости.
   */
  function destroy(): void {
    if (intersectionObserver) intersectionObserver.disconnect()
    destroyed = true
  }

  /**
   * Получает индексы слайдов, которые находятся в видимости или не находятся в видимости.
   * @param inView - Определяет, получать слайды в видимости или не в видимости.
   * @returns Массив индексов слайдов.
   */
  function get(inView: boolean = true): number[] {
    if (inView && inViewCache) return inViewCache
    if (!inView && notInViewCache) return notInViewCache

    const slideIndexes = createInViewList(inView)

    if (inView) inViewCache = slideIndexes
    else notInViewCache = slideIndexes

    return slideIndexes
  }

  /**
   * Создает список индексов слайдов, которые находятся в видимости или не находятся в видимости.
   * @param inView - Определяет, создавать список слайдов в видимости или не в видимости.
   * @returns Массив индексов слайдов.
   */
  function createInViewList(inView: boolean): number[] {
    const list: number[] = []

    for (const slideIndex of objectKeys(intersectionEntryMap)) {
      const { isIntersecting } = intersectionEntryMap[slideIndex]
      const inViewMatch = inView && isIntersecting
      const notInViewMatch = !inView && !isIntersecting

      if (inViewMatch || notInViewMatch) list.push(slideIndex)
    }

    return list
  }

  const self = {
    init,
    destroy,
    get
  } as const

  return self
}
