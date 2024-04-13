import { useSlideAlignment } from './Alignment.ts'
import { useAnimations, type AnimationsType, type AnimationsUpdateType, type AnimationsRenderType } from './Animations.ts'
import { useAxis, type AxisType } from './Axis.ts'
import { useCounter, type CounterType } from './Counter.ts'
import { useDragHandler, type DragHandlerType } from './DragHandler.ts'
import { useDragTracker } from './DragTracker.ts'
import type { EventHandlerType } from './EventHandler.ts'
import { useEventStore, type EventStoreType } from './EventStore.ts'
import type { LimitType } from './Limit.ts'
import { useNodeRects, type NodeRectType } from './NodeRects.ts'
import type { OptionsType } from './Options.ts'
import { usePercentOfView, type PercentOfViewType } from './PercentOfView.ts'
import { useResizeHandler, type ResizeHandlerType } from './ResizeHandler.ts'
import { useScrollBody, type ScrollBodyType } from './ScrollBody.ts'
import { useScrollBounds, type ScrollBoundsType } from './ScrollBounds.ts'
import { useScrollContain } from './ScrollContain.ts'
import { useScrollLimit } from './ScrollLimit.ts'
import { useScrollLooper, type ScrollLooperType } from './ScrollLooper.ts'
import { useScrollProgress, type ScrollProgressType } from './ScrollProgress.ts'
import { useScrollSnaps } from './ScrollSnaps.ts'
import { useSlideRegistry, type SlideRegistryType } from './SlideRegistry.ts'
import { useScrollTarget, type ScrollTargetType } from './ScrollTarget.ts'
import { useScrollTo, type ScrollToType } from './ScrollTo.ts'
import { useSlideFocus, type SlideFocusType } from './SlideFocus.ts'
import { useSlideLooper, type SlideLooperType } from './SlideLooper.ts'
import { SlidesHandler, type SlidesHandlerType } from './SlidesHandler.ts'
import { useSlidesInView, type SlidesInViewType } from './SlidesInView.ts'
import { useSlideSizes } from './SlideSizes.ts'
import { useSlidesToScroll, type SlidesToScrollType } from './SlidesToScroll.ts'
import { useTranslate, type TranslateType } from './Translate.ts'
import { arrayKeys, arrayLast, arrayLastIndex, type WindowType } from './utils.ts'
import { useVector1D, type Vector1DType } from './Vector1d.ts'

export type EngineType = {
  ownerDocument: Document
  ownerWindow: WindowType
  eventHandler: EventHandlerType
  axis: AxisType
  animation: AnimationsType
  scrollBounds: ScrollBoundsType
  scrollLooper: ScrollLooperType
  scrollProgress: ScrollProgressType
  index: CounterType
  indexPrevious: CounterType
  limit: LimitType
  location: Vector1DType
  offsetLocation: Vector1DType
  options: OptionsType
  percentOfView: PercentOfViewType
  scrollBody: ScrollBodyType
  dragHandler: DragHandlerType
  eventStore: EventStoreType
  slideLooper: SlideLooperType
  slidesInView: SlidesInViewType
  slidesToScroll: SlidesToScrollType
  target: Vector1DType
  translate: TranslateType
  resizeHandler: ResizeHandlerType
  slidesHandler: SlidesHandlerType
  scrollTo: ScrollToType
  scrollTarget: ScrollTargetType
  scrollSnapList: number[]
  scrollSnaps: number[]
  slideIndexes: number[]
  slideFocus: SlideFocusType
  slideRegistry: SlideRegistryType['slideRegistry']
  containerRect: NodeRectType
  slideRects: NodeRectType[]
}

export function useEngine(
  root: HTMLElement,
  container: HTMLElement,
  slides: HTMLElement[],
  ownerDocument: Document,
  ownerWindow: WindowType,
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
    slidesToScroll: groupSlides,
    skipSnaps,
    containScroll,
    watchResize,
    watchSlides,
    watchDrag
  } = options

  // Measurements
  const pixelTolerance = 2
  const nodeRects = useNodeRects()
  const containerRect = nodeRects.measure(container)
  const slideRects = slides.map(nodeRects.measure)
  const axis = useAxis(scrollAxis, direction)
  const viewSize = axis.measureSize(containerRect)
  const percentOfView = usePercentOfView(viewSize)
  const alignment = useSlideAlignment(align, viewSize)
  const containSnaps = !loop && !!containScroll
  const readEdgeGap = loop || !!containScroll
  const { slideSizes, slideSizesWithGaps, startGap, endGap } = useSlideSizes(
    axis,
    containerRect,
    slideRects,
    slides,
    readEdgeGap,
    ownerWindow
  )
  const slidesToScroll = useSlidesToScroll(
    axis,
    viewSize,
    groupSlides,
    loop,
    containerRect,
    slideRects,
    startGap,
    endGap,
    pixelTolerance
  )
  const { snaps, snapsAligned } = useScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll)
  const contentSize = -arrayLast(snaps) + arrayLast(slideSizesWithGaps)
  const { snapsContained, scrollContainLimit } = useScrollContain(
    viewSize,
    contentSize,
    snapsAligned,
    containScroll,
    pixelTolerance
  )
  const scrollSnaps = containSnaps ? snapsContained : snapsAligned
  const { limit } = useScrollLimit(contentSize, scrollSnaps, loop)

  // Indexes
  const index = useCounter(arrayLastIndex(scrollSnaps), startIndex, loop)
  const indexPrevious = index.clone()
  const slideIndexes = arrayKeys(slides)

  // Animation
  const update: AnimationsUpdateType = ({ dragHandler, scrollBody, scrollBounds, options: { loop } }) => {
    if (!loop) scrollBounds.constrain(dragHandler.pointerDown())
    scrollBody.seek()
  }

  const render: AnimationsRenderType = (
    {
      scrollBody,
      translate,
      location,
      offsetLocation,
      scrollLooper,
      slideLooper,
      dragHandler,
      animation,
      eventHandler,
      options: { loop }
    },
    lagOffset
  ) => {
    const velocity = scrollBody.velocity()
    const hasSettled = scrollBody.settled()

    if (hasSettled && !dragHandler.pointerDown()) {
      animation.stop()
      eventHandler.emit('settle')
    }
    if (!hasSettled) eventHandler.emit('scroll')

    offsetLocation.set(location.get() - velocity + velocity * lagOffset)

    if (loop) {
      scrollLooper.loop(scrollBody.direction())
      slideLooper.loop()
    }

    translate.to(offsetLocation.get())
  }
  const animation = useAnimations(
    ownerDocument,
    ownerWindow,
    () => update(engine),
    (lagOffset: number) => render(engine, lagOffset)
  )

  // Shared
  const friction = 0.68
  const startLocation = scrollSnaps[index.get()]
  const location = useVector1D(startLocation)
  const offsetLocation = useVector1D(startLocation)
  const target = useVector1D(startLocation)
  const scrollBody = useScrollBody(location, offsetLocation, target, duration, friction)
  const scrollTarget = useScrollTarget(loop, scrollSnaps, contentSize, limit, target)
  const scrollTo = useScrollTo(animation, index, indexPrevious, scrollBody, scrollTarget, target, eventHandler)
  const scrollProgress = useScrollProgress(limit)
  const eventStore = useEventStore()
  const slidesInView = useSlidesInView(container, slides, eventHandler, inViewThreshold)
  const { slideRegistry } = useSlideRegistry(
    containSnaps,
    containScroll,
    scrollSnaps,
    scrollContainLimit,
    slidesToScroll,
    slideIndexes
  )
  const slideFocus = useSlideFocus(root, slides, slideRegistry, scrollTo, scrollBody, eventStore)

  // Engine
  const engine: EngineType = {
    ownerDocument,
    ownerWindow,
    eventHandler,
    containerRect,
    slideRects,
    animation,
    axis,
    dragHandler: useDragHandler(
      axis,
      root,
      ownerDocument,
      ownerWindow,
      target,
      useDragTracker(axis, ownerWindow),
      location,
      animation,
      scrollTo,
      scrollBody,
      scrollTarget,
      index,
      eventHandler,
      percentOfView,
      dragFree,
      dragThreshold,
      skipSnaps,
      friction,
      watchDrag
    ),
    eventStore,
    percentOfView,
    index,
    indexPrevious,
    limit,
    location,
    offsetLocation,
    options,
    resizeHandler: useResizeHandler(container, eventHandler, ownerWindow, slides, axis, watchResize, nodeRects),
    scrollBody,
    scrollBounds: useScrollBounds(limit, offsetLocation, target, scrollBody, percentOfView),
    scrollLooper: useScrollLooper(contentSize, limit, offsetLocation, [location, offsetLocation, target]),
    scrollProgress,
    scrollSnapList: scrollSnaps.map(scrollProgress.get),
    scrollSnaps,
    scrollTarget,
    scrollTo,
    slideLooper: useSlideLooper(
      axis,
      viewSize,
      contentSize,
      slideSizes,
      slideSizesWithGaps,
      snaps,
      scrollSnaps,
      offsetLocation,
      slides
    ),
    slideFocus,
    slidesHandler: SlidesHandler(container, eventHandler, watchSlides),
    slidesInView,
    slideIndexes,
    slideRegistry,
    slidesToScroll,
    target,
    translate: useTranslate(axis, container)
  }

  return engine
}
