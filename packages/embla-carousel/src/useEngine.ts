import { useAlignment } from './useAlignment.ts'
import { useAnimations, type AnimationsType } from './useAnimations.ts'
import { useAxis, type AxisType } from './useAxis.ts'
import { useCounter, type CounterType } from './useCounter.ts'
import { useDragHandler, type DragHandlerType } from './useDragHandler.ts'
import { useDragTracker } from './useDragTracker.ts'
import type { EventHandlerType } from './useEventHandler.ts'
import { useEventStore, type EventStoreType } from './useEventStore.ts'
import { useNodeRects, type NodeRectType } from './useNodeRects.ts'
import type { OptionsType } from './options.ts'
import { usePercentOfContainer, type PercentOfViewType } from './usePercentOfContainer.ts'
import { useResizeHandler, type ResizeHandlerType } from './useResizeHandler.ts'
import { useScrollBody, type ScrollBodyType } from './useScrollBody.ts'
import { useScrollBounds, type ScrollBoundsType } from './useScrollBounds.ts'
import { useScrollContain } from './useScrollContain.ts'
import { useScrollLimit } from './useScrollLimit.ts'
import { useScrollLooper, type ScrollLooperType } from './useScrollLooper.ts'
import { useScrollProgress, type ScrollProgressType } from './useScrollProgress.ts'
import { useScrollSnaps } from './useScrollSnaps.ts'
import { useSlideRegistry } from './useSlideRegistry.ts'
import { useScrollTarget, type ScrollTargetType } from './useScrollTarget.ts'
import { useScrollTo, type ScrollToType } from './useScrollTo.ts'
import { useSlideFocus, type SlideFocusType } from './useSlideFocus.ts'
import { useSlideLooper, type SlideLooperType } from './useSlideLooper.ts'
import { useSlidesHandler, type SlidesHandlerType } from './useSlidesHandler.ts'
import { useSlidesInView, type SlidesInViewType } from './useSlidesInView.ts'
import { useSlideSizes } from './useSlideSizes.ts'
import { useSlidesToScroll, type SlidesToScrollType } from './useSlidesToScroll.ts'
import { useTranslate, type TranslateType } from './useTranslate.ts'
import { arrayKeys, arrayLast, arrayLastIndex, type WindowType } from './utils.ts'
import { useVector1D, type Vector1DType } from './useVector1D.ts'
import type { LimitType } from './useLimit.ts'

export type EngineType = {
  $ownerDocument: Document
  $ownerWindow: WindowType
  eventHandler: EventHandlerType
  containerRect: NodeRectType
  slideRects: NodeRectType[]
  animation: AnimationsType
  axis: AxisType
  dragHandler: DragHandlerType
  eventStore: EventStoreType
  percentOfContainer: PercentOfViewType
  indexCurrent: CounterType
  indexPrevious: CounterType
  limit: LimitType
  locationVector: Vector1DType
  offsetLocationVector: Vector1DType
  options: OptionsType
  resizeHandler: ResizeHandlerType
  scrollBody: ScrollBodyType
  scrollBounds: ScrollBoundsType
  scrollLooper: ScrollLooperType
  scrollProgress: ScrollProgressType
  scrollSnapList: number[]
  scrollSnaps: number[]
  scrollTarget: ScrollTargetType
  scrollTo: ScrollToType
  slideLooper: SlideLooperType
  slideFocus: SlideFocusType
  slidesHandler: SlidesHandlerType
  slidesInView: SlidesInViewType
  slideIndexes: number[]
  slideRegistry: number[][]
  slidesToScroll: SlidesToScrollType
  targetVector: Vector1DType
  translate: TranslateType
}

export function useEngine(
  $root: HTMLElement,
  $container: HTMLElement,
  $slides: HTMLElement[],
  $ownerDocument: Document,
  $ownerWindow: WindowType,
  options: OptionsType,
  eventHandler: EventHandlerType
): EngineType {
  // Options
  const {
    align,
    axis: scrollAxis,
    direction,
    startIndex,
    loop,
    duration,
    dragFree,
    dragThreshold,
    inViewThreshold,
    slidesToScroll: slidesToScrollCount,
    skipSnaps,
    containScroll,
    watchResize,
    watchSlides,
    watchDrag
  } = options

  // Measurements
  const pixelTolerance = 2
  const containSnaps = !loop && containScroll !== false
  const readEdgeGap = loop || containScroll !== false

  const axis = useAxis(scrollAxis, direction)

  const nodeRects = useNodeRects()
  const containerRect = nodeRects.measure($container)
  const slideRects = $slides.map(nodeRects.measure)
  const containerSize = axis.measureSize(containerRect)

  const percentOfContainer = usePercentOfContainer(containerSize)
  const alignment = useAlignment(align, containerSize)

  const { slideSizes, slideSizesWithGaps, startGap, endGap } = useSlideSizes(
    axis,
    containerRect,
    slideRects,
    $slides,
    readEdgeGap,
    $ownerWindow
  )

  const slidesToScroll = useSlidesToScroll(
    axis,
    containerSize,
    slidesToScrollCount,
    loop,
    containerRect,
    slideRects,
    startGap,
    endGap,
    pixelTolerance
  )

  const { slideSnaps, slideGroupSnaps } = useScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll)

  const contentSize = -arrayLast(slideSnaps) + arrayLast(slideSizesWithGaps)

  const { slideGroupSnapsLimit, slideGroupSnapsContained } = useScrollContain(
    containerSize,
    contentSize,
    slideGroupSnaps,
    containScroll,
    pixelTolerance
  )

  const scrollSnaps = containSnaps ? slideGroupSnapsContained : slideGroupSnaps

  const { limit } = useScrollLimit(contentSize, scrollSnaps, loop)

  // Indexes
  const indexCurrent = useCounter(arrayLastIndex(scrollSnaps), startIndex, loop)
  const indexPrevious = indexCurrent.clone()
  const slideIndexes = arrayKeys($slides)

  // Animation
  function update({ dragHandler, scrollBody, scrollBounds, options: { loop } }: EngineType): void {
    if (!loop) scrollBounds.constrain(dragHandler.pointerDown())
    scrollBody.seek()
  }

  function render(
    {
      scrollBody,
      translate,
      locationVector,
      offsetLocationVector,
      scrollLooper,
      slideLooper,
      dragHandler,
      animation,
      eventHandler,
      options: { loop }
    }: EngineType,
    lagOffset: number
  ) {
    const velocity = scrollBody.velocity()
    const hasSettled = scrollBody.settled()

    if (hasSettled && !dragHandler.pointerDown()) {
      animation.stop()
      eventHandler.emit('settle')
    }

    if (!hasSettled) eventHandler.emit('scroll')

    offsetLocationVector.set(locationVector.get() - velocity + velocity * lagOffset)

    if (loop) {
      scrollLooper.loop(scrollBody.direction())
      slideLooper.loop()
    }

    translate.to(offsetLocationVector.get())
  }

  const animation = useAnimations(
    $ownerDocument,
    $ownerWindow,
    () => update(engine),
    (lagOffset: number) => render(engine, lagOffset)
  )

  // Shared
  const friction = 0.68
  const startLocation = scrollSnaps[indexCurrent.get()]!

  const locationVector = useVector1D(startLocation)
  const offsetLocationVector = useVector1D(startLocation)
  const targetVector = useVector1D(startLocation)

  const scrollBody = useScrollBody(locationVector, offsetLocationVector, targetVector, duration, friction)
  const scrollTarget = useScrollTarget(loop, scrollSnaps, contentSize, limit, targetVector)
  const scrollTo = useScrollTo(
    animation,
    indexCurrent,
    indexPrevious,
    scrollBody,
    scrollTarget,
    targetVector,
    eventHandler
  )

  const scrollProgress = useScrollProgress(limit)

  const eventStore = useEventStore()

  const slidesInView = useSlidesInView($container, $slides, eventHandler, inViewThreshold)

  const { slideRegistry } = useSlideRegistry(
    containSnaps,
    containScroll,
    scrollSnaps,
    slideGroupSnapsLimit,
    slidesToScroll,
    slideIndexes
  )

  const slideFocus = useSlideFocus($root, $slides, slideRegistry, scrollTo, scrollBody, eventStore)

  // Engine
  const engine: EngineType = {
    $ownerDocument,
    $ownerWindow,
    eventHandler,
    containerRect,
    slideRects,
    animation,
    axis,
    dragHandler: useDragHandler(
      axis,
      $root,
      $ownerDocument,
      $ownerWindow,
      targetVector,
      useDragTracker(axis, $ownerWindow),
      locationVector,
      animation,
      scrollTo,
      scrollBody,
      scrollTarget,
      indexCurrent,
      eventHandler,
      percentOfContainer,
      dragFree,
      dragThreshold,
      skipSnaps,
      friction,
      watchDrag
    ),
    eventStore,
    percentOfContainer,
    indexCurrent,
    indexPrevious,
    limit,
    locationVector,
    offsetLocationVector,
    options,
    resizeHandler: useResizeHandler($container, eventHandler, $ownerWindow, $slides, axis, watchResize, nodeRects),
    scrollBody,
    scrollBounds: useScrollBounds(limit, offsetLocationVector, targetVector, scrollBody, percentOfContainer),
    scrollLooper: useScrollLooper(contentSize, limit, offsetLocationVector, [
      locationVector,
      offsetLocationVector,
      targetVector
    ]),
    scrollProgress,
    scrollSnapList: scrollSnaps.map(scrollProgress.get),
    scrollSnaps,
    scrollTarget,
    scrollTo,
    slideLooper: useSlideLooper(
      axis,
      containerSize,
      contentSize,
      slideSizes,
      slideSizesWithGaps,
      slideSnaps,
      scrollSnaps,
      offsetLocationVector,
      $slides
    ),
    slideFocus,
    slidesHandler: useSlidesHandler($container, eventHandler, watchSlides),
    slidesInView,
    slideIndexes,
    slideRegistry,
    slidesToScroll,
    targetVector,
    translate: useTranslate(axis, $container)
  }

  return engine
}
