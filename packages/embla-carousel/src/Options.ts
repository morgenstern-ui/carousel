import type { AlignmentOptionType } from './useAlignment.ts'
import type { AxisDirectionOptionType, AxisOptionType } from './useAxis.ts'
import type { SlidesToScrollOptionType } from './useSlidesToScroll.ts'
import type { ScrollContainOptionType } from './useScrollContain.ts'
import type { DragHandlerOptionType } from './useDragHandler.ts'
import type { ResizeHandlerOptionType } from './useResizeHandler.ts'
import type { SlidesHandlerOptionType } from './useSlidesHandler.ts'
import type { SlidesInViewOptionsType } from './useSlidesInView.ts'

export type LooseOptionsType = Record<string, unknown>

export type CreateOptionsType<Type extends LooseOptionsType> = Type & {
  active: boolean
  breakpoints: Record<string, Omit<Partial<CreateOptionsType<Type>>, 'breakpoints'>>
}

export type OptionsType = CreateOptionsType<{
  /**
   * Выровняйте слайды относительно области просмотра карусели.
   * Используйте одно из предопределенных выравниваний start или center, end.
   * Альтернативно, предоставьте свой собственный обратный вызов, чтобы полностью настроить выравнивание.
   * 
   * @default 'center'
   */
  align: AlignmentOptionType

  /**
   * Выберите ось прокрутки между x и y.
   * Не забудьте расположить слайды горизонтально или вертикально, используя CSS,
   * чтобы соответствовать этому параметру.
   *
   * @default 'x'
   */
  axis: AxisOptionType

  /**
   * Позволяет выбрать пользовательский элемент-контейнер, в котором хранятся слайды.
   * По умолчанию Embla выберет первый прямой дочерний элемент корневого элемента .
   * Укажите действительный CSS selector string или HTML element.
   *
   * @default null
   */
  container: string | HTMLElement | null

  /**
   * Позволяет использовать пользовательские элементы слайда.
   * По умолчанию Embla выберет все прямые дочерние элементы своего объекта.контейнер.
   * Укажите действительный CSS selector string или nodeList/array содержащий HTML elements.
   *
   * @default null
   */
  slides: string | HTMLElement[] | NodeListOf<HTMLElement> | null

  /**
   * Очистите начальное и конечное пустое пространство, вызывающее чрезмерную прокрутку.
   * Используйте trimSnaps, чтобы использовать только точки привязки,
   * вызывающие прокрутку, или keepSnaps сохранять их.
   *
   * @default 'trimSnaps'
   */
  containScroll: ScrollContainOptionType

  /**
   * Выберите направление содержимого между ltr и rtl.
   *
   * @default 'ltr'
   */
  direction: AxisDirectionOptionType

  /**
   * Группа слайдов вместе. Взаимодействия перетаскивания, точечная навигация
   * и кнопки «Предыдущий/следующий» сопоставляются с группировкой
   * слайдов по заданному числу, которое должно быть целым числом.
   * Установите его, auto если хотите, чтобы Embla автоматически группировала слайды.
   *
   * @default 1
   */
  slidesToScroll: SlidesToScrollOptionType

  /**
   * Включает импульсную прокрутку. Продолжительность непрерывной
   * прокрутки пропорциональна силе жеста перетаскивания.
   *
   * @default false
   */
  dragFree: boolean

  /**
   * Перетащите порог в пикселях. Это влияет только на то, когда происходят
   * щелчки, а не на другие. В отличие от других библиотек карусели,
   * это не повлияет на начало перетаскивания карусели.
   *
   * @default 10
   */
  dragThreshold: number

  /**
   * Это Intersection Observer threshold параметр, который будет применен ко всем слайдам.
   * 
   * @default 0
   */
  inViewThreshold: SlidesInViewOptionsType

  /**
   * Включает бесконечный цикл. Embla применит translateX или
   * translateYк слайдам, которым необходимо изменить
   * положение, чтобы создать эффект зацикливания.
   *
   * @default false
   */
  loop: boolean

  /**
   * Разрешите карусели пропускать снимки прокрутки, если ее сильно перетаскивать.
   * Обратите внимание, что эта опция будет игнорироваться, если перетащить
   * `dragFree` установлена ​​на true.
   *
   * @default false
   */
  skipSnaps: boolean

  /**
   * Установите продолжительность прокрутки при запуске любым из методов API.
   * Более высокие числа включают более медленную прокрутку. Взаимодействия
   * при перетаскивании не затрагиваются, поскольку продолжительность в
   * этом случае определяется силой сопротивления.
   *
   * @default 25
   */
  duration: number

  /**
   * Установите начальную привязку прокрутки к заданному номеру.
   * Индекс первой привязки начинается с 0. Обратите внимание,
   * что это число не обязательно равно количеству слайдов
   * при использовании вместе `slidesToScroll` вариант.
   *
   * @default 0
   */
  startIndex: number

  /**
   * Позволяет прокручивать карусель с помощью мыши и сенсорного взаимодействия.
   * Установите это значение, `false` чтобы отключить события перетаскивания
   * или передать собственный обратный вызов для добавления
   * собственной логики перетаскивания.
   *
   * @default true
   */
  watchDrag: DragHandlerOptionType

  /**
   * Embla автоматически отслеживает `container` и `slides` для изменения размера и пробега
   * повторно инициализировать когда какой-либо размер изменился.
   * Установите это значение, false чтобы отключить это поведение
   * или передать собственный обратный вызов,
   * чтобы добавить собственную логику изменения размера.
   *
   * @default true
   */
  watchResize: ResizeHandlerOptionType

  /**
   * Embla автоматически отслеживает `контейнер` за добавленные и/или удаленные слайды и прогоны
   * повторно инициализировать если нужно. Установите это значение false,
   * чтобы отключить это поведение или передать собственный обратный вызов
   * для добавления собственной измененной логики слайдов.
   *
   * @default true
   */
  watchSlides: SlidesHandlerOptionType
}>

export const defaultOptions: OptionsType = {
  align: 'center',
  axis: 'x',
  container: null,
  slides: null,
  containScroll: 'trimSnaps',
  direction: 'ltr',
  slidesToScroll: 1,
  inViewThreshold: 0,
  breakpoints: {},
  dragFree: false,
  dragThreshold: 10,
  loop: false,
  skipSnaps: false,
  duration: 25,
  startIndex: 0,
  active: true,
  watchDrag: true,
  watchResize: true,
  watchSlides: true
}

export type EmblaOptionsType = Partial<OptionsType>
