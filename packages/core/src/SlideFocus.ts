import type { EventStoreType } from './EventStore.ts'
import type { ScrollBodyType } from './ScrollBody.ts'
import type { ScrollToType } from './ScrollTo.ts'
import type { SlideRegistryType } from './SlideRegistry.ts'
import { isNumber } from './utils.ts'

export type SlideFocusType = ReturnType<typeof SlideFocus>

/**
 * Создает функцию для управления фокусом слайдов.
 * @param {HTMLElement} root - Корневой элемент.
 * @param {HTMLElement[]} slides - Массив слайдов.
 * @param {SlideRegistryType['slideRegistry']} slideRegistry - Реестр слайдов.
 * @param {ScrollToType} scrollTo - Функция прокрутки до определенного слайда.
 * @param {ScrollBodyType} scrollBody - Тело прокрутки.
 * @param {EventStoreType} eventStore - Хранилище событий.
 * @returns {SlideFocusType} Функция для управления фокусом слайдов.
 */
export function SlideFocus(
  root: HTMLElement,
  slides: HTMLElement[],
  slideRegistry: SlideRegistryType['slideRegistry'],
  scrollTo: ScrollToType,
  scrollBody: ScrollBodyType,
  eventStore: EventStoreType
) {
  let lastTabPressTime = 0

  /**
   * Инициализирует функцию управления фокусом слайдов.
   */
  function init(): void {
    eventStore.add(document, 'keydown', registerTabPress, false)
    slides.forEach(addSlideFocusEvent)
  }

  /**
   * Регистрирует время нажатия клавиши Tab.
   * @param {KeyboardEvent} event - Событие клавиатуры.
   */
  function registerTabPress(event: KeyboardEvent): void {
    if (event.code === 'Tab') lastTabPressTime = new Date().getTime()
  }

  /**
   * Добавляет событие фокуса на слайд.
   * @param {HTMLElement} slide - Слайд.
   */
  function addSlideFocusEvent(slide: HTMLElement): void {
    const focus = (): void => {
      const nowTime = new Date().getTime()
      const diffTime = nowTime - lastTabPressTime

      if (diffTime > 10) return

      root.scrollLeft = 0
      const index = slides.indexOf(slide)
      const group = slideRegistry.findIndex((group) => group.includes(index))

      if (!isNumber(group)) return

      scrollBody.useDuration(0)
      scrollTo.index(group, 0)
    }

    eventStore.add(slide, 'focus', focus, {
      passive: true,
      capture: true
    })
  }

  const self = {
    init
  } as const

  return self
}
