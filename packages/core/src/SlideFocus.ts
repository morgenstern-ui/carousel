import type { EventStoreType } from './EventStore.ts'
import type { ScrollBodyType } from './ScrollBody.ts'
import type { ScrollToType } from './ScrollTo.ts'
import type { SlideRegistryType } from './SlideRegistry.ts'
import { isNumber } from './utils.ts'

/**
 * Представляет тип хука `useSlideFocus`.
 */
export type SlideFocusType = ReturnType<typeof useSlideFocus>

/**
 * Хук, управляющий поведением фокуса слайдов в карусели.
 * @param root - Корневой элемент карусели.
 * @param slides - Массив элементов слайдов.
 * @param slideRegistry - Объект реестра слайдов.
 * @param scrollTo - Функция прокрутки к слайду.
 * @param scrollBody - Объект тела прокрутки.
 * @param eventStore - Объект хранилища событий.
 * @returns Объект, содержащий функцию `init`.
 */
export function useSlideFocus(
  root: HTMLElement,
  slides: HTMLElement[],
  slideRegistry: SlideRegistryType['slideRegistry'],
  scrollTo: ScrollToType,
  scrollBody: ScrollBodyType,
  eventStore: EventStoreType
) {
  let lastTabPressTime = 0

  /**
   * Инициализирует поведение фокуса слайдов.
   */
  function init(): void {
    eventStore.add(document, 'keydown', registerTabPress, false)
    slides.forEach(addSlideFocusEvent)
  }

  /**
   * Регистрирует событие нажатия клавиши Tab.
   * @param event - Событие клавиатуры.
   */
  function registerTabPress(event: KeyboardEvent): void {
    if (event.code === 'Tab') lastTabPressTime = new Date().getTime()
  }

  /**
   * Добавляет слушатель события фокуса к элементу слайда.
   * @param slide - Элемент слайда.
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
