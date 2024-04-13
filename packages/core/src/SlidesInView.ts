import type { EventHandlerType } from './EventHandler.ts'
import { objectKeys } from './utils.ts'

type IntersectionEntryMapType = {
  [key: number]: IntersectionObserverEntry
}

export type SlidesInViewOptionsType = IntersectionObserverInit['threshold']

export type SlidesInViewType = ReturnType<typeof SlidesInView>

/**
 * Создает функцию для отслеживания видимых слайдов.
 * @param {HTMLElement} container - Контейнер слайдов.
 * @param {HTMLElement[]} slides - Массив слайдов.
 * @param {EventHandlerType} eventHandler - Обработчик событий.
 * @param {SlidesInViewOptionsType} threshold - Порог для определения видимости слайдов.
 * @returns {SlidesInViewType} Функция для отслеживания видимых слайдов.
 */
export function SlidesInView(
  container: HTMLElement,
  slides: HTMLElement[],
  eventHandler: EventHandlerType,
  threshold: SlidesInViewOptionsType
) {
  const intersectionEntryMap: IntersectionEntryMapType = {}
  let inViewCache: number[] | null = null
  let notInViewCache: number[] | null = null
  let intersectionObserver: IntersectionObserver
  let destroyed = false

  /**
   * Инициализирует функцию для отслеживания видимых слайдов.
   */
  function init(): void {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (destroyed) return

        entries.forEach((entry) => {
          const index = slides.indexOf(<HTMLElement>entry.target)
          intersectionEntryMap[index] = entry
        })

        inViewCache = null
        notInViewCache = null
        eventHandler.emit('slidesInView')
      },
      {
        root: container.parentElement,
        threshold
      }
    )

    slides.forEach((slide) => intersectionObserver.observe(slide))
  }

  /**
   * Уничтожает функцию для отслеживания видимых слайдов.
   */
  function destroy(): void {
    if (intersectionObserver) intersectionObserver.disconnect()
    destroyed = true
  }

  /**
   * Создает список индексов слайдов в зависимости от их видимости.
   * @param {boolean} inView - Флаг видимости слайдов.
   * @returns {number[]} Список индексов слайдов.
   */
  function createInViewList(inView: boolean): number[] {
    return objectKeys(intersectionEntryMap).reduce((list: number[], slideIndex) => {
      const index = parseInt(slideIndex)
      const { isIntersecting } = intersectionEntryMap[index]
      const inViewMatch = inView && isIntersecting
      const notInViewMatch = !inView && !isIntersecting

      if (inViewMatch || notInViewMatch) list.push(index)
      return list
    }, [])
  }

  /**
   * Возвращает список индексов слайдов в зависимости от их видимости.
   * @param {boolean} inView - Флаг видимости слайдов.
   * @returns {number[]} Список индексов слайдов.
   */
  function get(inView: boolean = true): number[] {
    if (inView && inViewCache) return inViewCache
    if (!inView && notInViewCache) return notInViewCache

    const slideIndexes = createInViewList(inView)

    if (inView) inViewCache = slideIndexes
    if (!inView) notInViewCache = slideIndexes

    return slideIndexes
  }

  const self = {
    init,
    destroy,
    get
  } as const

  return self
}
