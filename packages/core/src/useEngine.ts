import { useSlideAlignment } from './useSlideAlignment.ts'
import { useAnimations, type AnimationsUpdateType, type AnimationsRenderType } from './useAnimations.ts'
import { useAxis } from './useAxis.ts'
import { useCounter } from './useCounter.ts'
import { useDragHandler } from './useDragHandler.ts'
import { useDragTracker } from './useDragTracker.ts'
import type { EventHandlerType } from './useEventHandler.ts'
import { useEventStore } from './useEventStore.ts'
import { useNodeRects } from './useNodeRects.ts'
import type { OptionsType } from './Options.ts'
import { usePercentOfView } from './usePercentOfView.ts'
import { useResizeHandler } from './useResizeHandler.ts'
import { useScrollBody } from './useScrollBody.ts'
import { useScrollBounds } from './useScrollBounds.ts'
import { useScrollContain } from './useScrollContain.ts'
import { useScrollLimit } from './useScrollLimit.ts'
import { useScrollLooper } from './useScrollLooper.ts'
import { useScrollProgress } from './useScrollProgress.ts'
import { useScrollSnaps } from './useScrollSnaps.ts'
import { useSlideRegistry } from './useSlideRegistry.ts'
import { useScrollTarget } from './useScrollTarget.ts'
import { useScrollTo } from './useScrollTo.ts'
import { useSlideFocus } from './useSlideFocus.ts'
import { useSlideLooper } from './useSlideLooper.ts'
import { useSlidesHandler } from './useSlidesHandler.ts'
import { useSlidesInView } from './useSlidesInView.ts'
import { useSlideSizes } from './useSlideSizes.ts'
import { useSlidesToScroll } from './useSlidesToScroll.ts'
import { useTranslate } from './useTranslate.ts'
import { arrayKeys, arrayLast, arrayLastIndex, type WindowType } from './utils.ts'
import { useVector1D } from './Vector1d.ts'

export type EngineType = ReturnType<typeof useEngine>

export function useEngine(
  $root: HTMLElement,
  $container: HTMLElement,
  $slides: HTMLElement[],
  $ownerDocument: Document,
  $ownerWindow: WindowType,
  options: OptionsType,
  eventHandler: EventHandlerType
) {
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
    slidesToScroll: slidesToScrollProp,
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
  const viewSize = axis.measureSize(containerRect)

  const percentOfView = usePercentOfView(viewSize)
  const alignment = useSlideAlignment(align, viewSize)

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
    viewSize,
    slidesToScrollProp,
    loop,
    containerRect,
    slideRects,
    startGap,
    endGap,
    pixelTolerance
  )

  const { snaps, snapsAligned } = useScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll)

  const contentSize = -arrayLast(snaps)! + arrayLast(slideSizesWithGaps) 

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
  const slideIndexes = arrayKeys($slides)

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
    $ownerDocument,
    $ownerWindow,
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
  const slidesInView = useSlidesInView($container, $slides, eventHandler, inViewThreshold)
  const { slideRegistry } = useSlideRegistry(
    containSnaps,
    containScroll,
    scrollSnaps,
    scrollContainLimit,
    slidesToScroll,
    slideIndexes
  )
  const slideFocus = useSlideFocus($root, $slides, slideRegistry, scrollTo, scrollBody, eventStore)

  // Engine
  const engine = {
    ownerDocument: $ownerDocument,
    ownerWindow: $ownerWindow,
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
      target,
      useDragTracker(axis, $ownerWindow),
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
    resizeHandler: useResizeHandler($container, eventHandler, $ownerWindow, $slides, axis, watchResize, nodeRects),
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
      $slides
    ),
    slideFocus,
    slidesHandler: useSlidesHandler($container, eventHandler, watchSlides),
    slidesInView,
    slideIndexes,
    slideRegistry,
    slidesToScroll,
    target,
    translate: useTranslate(axis, $container)
  } as const

  return engine
}
