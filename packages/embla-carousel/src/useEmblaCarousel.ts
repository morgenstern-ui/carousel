import { useEngine, type EngineType } from './useEngine.ts'
import { useEventStore } from './useEventStore.ts'
import { useEventHandler, type EventHandlerType } from './useEventHandler.ts'
import { defaultOptions, type EmblaOptionsType, type OptionsType } from './options.ts'
import { useOptionsHandler } from './useOptionsHandler.ts'
import { usePluginsHandler } from './usePluginsHandler.ts'
import type { EmblaPluginsType, EmblaPluginType } from './plugins.ts'
import { isString, type WindowType } from './utils.ts'

/**
 * Представляет экземпляр карусели Embla.
 */
export type EmblaCarouselType = {
  /**
   * Проверяет, может ли карусель прокрутиться к следующему слайду.
   * @returns Булевое значение, указывающее, может ли карусель прокрутиться к следующему слайду.
   */
  canScrollNext: () => boolean

  /**
   * Проверяет, может ли карусель прокрутиться к предыдущему слайду.
   * @returns Булевое значение, указывающее, может ли карусель прокрутиться к предыдущему слайду.
   */
  canScrollPrev: () => boolean

  /**
   * Возвращает узел контейнера карусели.
   * @returns Узел контейнера карусели.
   */
  containerNode: () => HTMLElement

  /**
   * Возвращает внутренний движок карусели.
   * @returns Внутренний движок карусели.
   */
  internalEngine: () => EngineType

  /**
   * Уничтожает экземпляр карусели.
   */
  destroy: () => void

  /**
   * Удаляет слушатель событий из карусели.
   * @param event Событие, с которого нужно удалить слушатель.
   */
  off: EventHandlerType['off']

  /**
   * Добавляет слушатель событий к карусели.
   * @param event Событие, на которое нужно слушать.
   * @param listener Функция-слушатель, которая будет вызвана при срабатывании события.
   */
  on: EventHandlerType['on']

  /**
   * Генерирует событие в карусели.
   * @param event Событие, которое нужно сгенерировать.
   * @param data Данные, передаваемые слушателям событий.
   */
  emit: EventHandlerType['emit']

  /**
   * Возвращает плагины карусели.
   * @returns Плагины карусели.
   */
  plugins: () => EmblaPluginsType

  /**
   * Возвращает индекс предыдущего прокрученного снапа.
   * @returns Индекс предыдущего прокрученного снапа.
   */
  previousScrollSnap: () => number

  /**
   * Переинициализирует карусель с новыми параметрами и плагинами.
   * @param options Новые параметры для карусели.
   * @param plugins Новые плагины для карусели.
   */
  reInit: (options?: EmblaOptionsType, plugins?: EmblaPluginType[]) => void

  /**
   * Возвращает корневой узел карусели.
   * @returns Корневой узел карусели.
   */
  rootNode: () => HTMLElement

  /**
   * Прокручивает к следующему слайду.
   * @param jump Булевое значение, указывающее, должна ли прокрутка перейти к следующему слайду.
   */
  scrollNext: (jump?: boolean) => void

  /**
   * Прокручивает к предыдущему слайду.
   * @param jump Булевое значение, указывающее, должна ли прокрутка перейти к предыдущему слайду.
   */
  scrollPrev: (jump?: boolean) => void

  /**
   * Возвращает прогресс текущей прокрутки.
   * @returns Прогресс текущей прокрутки.
   */
  scrollProgress: () => number

  /**
   * Возвращает список снапов прокрутки.
   * @returns Список снапов прокрутки.
   */
  scrollSnapList: () => number[]

  /**
   * Прокручивает к указанному индексу слайда.
   * @param index Индекс слайда, к которому нужно прокрутить.
   * @param jump Булевое значение, указывающее, должна ли прокрутка перейти к указанному слайду.
   */
  scrollTo: (index: number, jump?: boolean) => void

  /**
   * Возвращает индекс текущего выбранного снапа прокрутки.
   * @returns Индекс текущего выбранного снапа прокрутки.
   */
  selectedScrollSnap: () => number

  /**
   * Возвращает узлы слайдов.
   * @returns Узлы слайдов.
   */
  slideNodes: () => HTMLElement[]

  /**
   * Возвращает количество слайдов в виде.
   * @returns Количество слайдов в виде.
   */
  slidesInView: () => number[]

  /**
   * Возвращает количество слайдов, не входящих в вид.
   * @returns Количество слайдов, не входящих в вид.
   */
  slidesNotInView: () => number[]
}

export function useEmblaCarousel(
  $root: HTMLElement,
  userOptions?: EmblaOptionsType,
  userPlugins?: EmblaPluginType[]
): EmblaCarouselType {
  const $ownerDocument = $root.ownerDocument
  const $ownerWindow = <WindowType>$ownerDocument.defaultView
  const optionsHandler = useOptionsHandler($ownerWindow)
  const pluginsHandler = usePluginsHandler(optionsHandler)
  const mediaHandlers = useEventStore()
  const eventHandler = useEventHandler()
  const { mergeOptions, optionsAtMedia, optionsMediaQueries } = optionsHandler
  const { on, off, emit } = eventHandler
  const reInit = reActivate

  let destroyed = false
  let engine: EngineType
  let optionsBase = mergeOptions(defaultOptions, useEmblaCarousel.globalOptions)
  let options = mergeOptions(optionsBase)
  let pluginList: EmblaPluginType[] = []
  let pluginApis: EmblaPluginsType

  let $container: HTMLElement
  let $slides: HTMLElement[]

  function activate(withOptions?: EmblaOptionsType, withPlugins?: EmblaPluginType[]): void {
    if (destroyed) return

    optionsBase = mergeOptions(optionsBase, withOptions)
    options = optionsAtMedia(optionsBase)
    pluginList = withPlugins || pluginList

    storeElements()

    engine = createEngine(options)

    for (const mediaQuery of optionsMediaQueries([optionsBase, ...pluginList.map(({ options }) => options)])) {
      mediaHandlers.add(mediaQuery, 'change', reActivate);
    }

    if (!options.active) return

    pluginApis = pluginsHandler.init(self, pluginList)
    engine.translate.to(engine.locationVector.get())
    engine.animation.init()
    engine.slidesInView.init()
    engine.slideFocus.init()
    engine.eventHandler.init(self)
    engine.resizeHandler.init(self)
    engine.slidesHandler.init(self)

    if (engine.options.loop) engine.slideLooper.loop()
    if ($container.offsetParent && $slides.length) engine.dragHandler.init(self)

  }

  function reActivate(withOptions?: EmblaOptionsType, withPlugins?: EmblaPluginType[]): void {
    const startIndex = selectedScrollSnap()
    deActivate()
    activate(mergeOptions({ startIndex }, withOptions), withPlugins)
    eventHandler.emit('reInit')
  }

  function deActivate(): void {
    engine.dragHandler.destroy()
    engine.eventStore.clear()
    engine.translate.clear()
    engine.slideLooper.clear()
    engine.resizeHandler.destroy()
    engine.slidesHandler.destroy()
    engine.slidesInView.destroy()
    engine.animation.destroy()
    pluginsHandler.destroy()
    mediaHandlers.clear()
  }

  /**
   * Уничтожает экземпляр карусели.
   * Эта функция очищает все слушатели событий, удаляет все плагины и устанавливает флаг `destroyed` в true.
   * После вызова этой функции экземпляр карусели больше не может быть использован.
   * @example
   * ```javascript
   * const embla = useEmblaCarousel(document.querySelector('.embla'))
   * embla.destroy()
   * ```
   * @returns void
   */
  function destroy(): void {
    if (destroyed) return
    destroyed = true
    mediaHandlers.clear()
    deActivate()
    eventHandler.emit('destroy')
  }

  function scrollTo(index: number, jump?: boolean, direction?: number): void {
    if (!options.active || destroyed) return
    engine.scrollBody.useBaseFriction().useDuration(jump === true ? 0 : options.duration)
    engine.scrollTo.index(index, direction || 0)
  }

  function scrollNext(jump?: boolean): void {
    const next = engine.indexCurrent.add(1).get()
    scrollTo(next, jump, -1)
  }

  function scrollPrev(jump?: boolean): void {
    const prev = engine.indexCurrent.add(-1).get()
    scrollTo(prev, jump, 1)
  }

  function canScrollNext(): boolean {
    const next = engine.indexCurrent.add(1).get()
    return next !== selectedScrollSnap()
  }

  function canScrollPrev(): boolean {
    const prev = engine.indexCurrent.add(-1).get()
    return prev !== selectedScrollSnap()
  }

  function scrollSnapList(): number[] {
    return engine.scrollSnapList
  }

  function scrollProgress(): number {
    return engine.scrollProgress.get(engine.locationVector.get())
  }

  function selectedScrollSnap(): number {
    return engine.indexCurrent.get()
  }

  function previousScrollSnap(): number {
    return engine.indexPrevious.get()
  }

  function slidesInView(): number[] {
    return engine.slidesInView.get()
  }

  function slidesNotInView(): number[] {
    return engine.slidesInView.get(false)
  }

  function plugins(): EmblaPluginsType {
    return pluginApis
  }

  function internalEngine(): EngineType {
    return engine
  }

  function rootNode(): HTMLElement {
    return $root
  }

  function containerNode(): HTMLElement {
    return $container
  }

  function slideNodes(): HTMLElement[] {
    return $slides
  }

  function storeElements(): void {
    const { container: userContainer, slides: userSlides } = options

    const customContainer = isString(userContainer) ? $root.querySelector<HTMLElement>(userContainer) : userContainer
    $container = customContainer || <HTMLElement>$root.children[0]

    const customSlides = isString(userSlides) ? $container.querySelectorAll<HTMLElement>(userSlides) : userSlides
    $slides = [].slice.call(customSlides || $container.children)
  }

  function createEngine(options: OptionsType): EngineType {
    const engine = useEngine($root, $container, $slides, $ownerDocument, $ownerWindow, options, eventHandler)

    if (options.loop && !engine.slideLooper.canLoop()) {
      const optionsWithoutLoop = Object.assign({}, options, { loop: false })
      return createEngine(optionsWithoutLoop)
    }
  
    return engine
  }

  const self = {
    canScrollNext,
    canScrollPrev,
    containerNode,
    internalEngine,
    destroy,
    off,
    on,
    emit,
    plugins,
    previousScrollSnap,
    reInit,
    rootNode,
    scrollNext,
    scrollPrev,
    scrollProgress,
    scrollSnapList,
    scrollTo,
    selectedScrollSnap,
    slideNodes,
    slidesInView,
    slidesNotInView
  } as const

  activate(userOptions, userPlugins)
  setTimeout(() => eventHandler.emit('init'), 0)
 
  return self
}

useEmblaCarousel.globalOptions = <EmblaOptionsType | undefined>undefined
