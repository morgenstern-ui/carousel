import { beforeEach, describe, expect, test } from 'vitest'
import { useEmblaCarousel } from '../useEmblaCarousel'
import { defaultOptions } from '../options'
import { mockTestElements } from './mocks'
import {
  FIXTURE_SLIDES_TO_SCROLL_LTR_1,
  FIXTURE_SLIDES_TO_SCROLL_LTR_2,
  FIXTURE_SLIDES_TO_SCROLL_LTR_3
} from './fixtures/slidesToScroll-ltr.fixture'

const FIRST_SNAP_INDEX = 0

describe('➡️  Скролл слайдов - Горизонтальный LTR', () => {
  describe('"auto" корректно для слайдов БЕЗ ОТСТУПОВ и:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SLIDES_TO_SCROLL_LTR_1))

    beforeEach(() => {
      emblaApi.reInit({ ...defaultOptions, slidesToScroll: 'auto' })
    })

    test('LOOP:FALSE', () => {
      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -1000, -2000, -3001]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3, 4, 5],
        [6, 7],
        [8, 9]
      ])
    })

    test('LOOP:FALSE и CONTAINSCROLL:FALSE', () => {
      emblaApi.reInit({ containScroll: false })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -1000, -2000, -3000.5]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3, 4, 5],
        [6, 7],
        [8, 9]
      ])
    })

    test('LOOP:TRUE', () => {
      emblaApi.reInit({ loop: true })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -1000, -2000, -3000.5]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3, 4, 5],
        [6, 7],
        [8, 9]
      ])
    })
  })

  describe('"auto" корректно для слайдов С ОТСТУПАМИ и:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SLIDES_TO_SCROLL_LTR_2))

    beforeEach(() => {
      emblaApi.reInit({ ...defaultOptions, slidesToScroll: 'auto' })
    })

    test('LOOP:FALSE', () => {
      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -1020, -2030, -3041]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3, 4, 5],
        [6, 7],
        [8, 9]
      ])
    })

    test('LOOP:FALSE и CONTAINSCROLL:FALSE', () => {
      emblaApi.reInit({ containScroll: false })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [-10, -1020, -2030, -3030.5]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3, 4, 5],
        [6, 7],
        [8, 9]
      ])
    })

    test('LOOP:TRUE', () => {
      emblaApi.reInit({ loop: true })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [-10, -1020, -2030, -3030.5]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3, 4, 5],
        [6, 7],
        [8, 9]
      ])
    })
  })

  describe('"auto" корректно для крайних случаев, когда ширина слайда больше видимой области и:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SLIDES_TO_SCROLL_LTR_3))

    beforeEach(() => {
      emblaApi.reInit({ ...defaultOptions, slidesToScroll: 'auto' })
    })

    test('LOOP:FALSE', () => {
      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -624, -1200, -1776, -2352, -2976]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5]])
    })

    test('LOOP:FALSE и CONTAINSCROLL:FALSE', () => {
      emblaApi.reInit({ containScroll: false })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [-48, -624, -1200, -1776, -2352, -2928]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5]])
    })

    test('LOOP:TRUE', () => {
      emblaApi.reInit({ loop: true })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [-48, -624, -1200, -1776, -2352, -2928]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5]])
    })
  })

  describe('"Custom number 2" корректно для слайдов БЕЗ ОТСТУПОВ и:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SLIDES_TO_SCROLL_LTR_1))

    beforeEach(() => {
      emblaApi.reInit({ ...defaultOptions, slidesToScroll: 2 })
    })

    test('LOOP:FALSE', () => {
      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -750, -1250, -2000, -3001]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9]
      ])
    })

    test('LOOP:FALSE и CONTAINSCROLL:FALSE', () => {
      emblaApi.reInit({ containScroll: false })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -750, -1250, -2000, -3000.5]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9]
      ])
    })

    test('LOOP:TRUE', () => {
      emblaApi.reInit({ loop: true })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -750, -1250, -2000, -3000.5]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9]
      ])
    })
  })

  describe('"Custom number 2" корректно для слайдов С ОТСТУПАМИ и:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SLIDES_TO_SCROLL_LTR_2))

    beforeEach(() => {
      emblaApi.reInit({ ...defaultOptions, slidesToScroll: 2 })
    })

    test('LOOP:FALSE', () => {
      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -765, -1275, -2030, -3041]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9]
      ])
    })

    test('LOOP:FALSE и CONTAINSCROLL:FALSE', () => {
      emblaApi.reInit({ containScroll: false })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [-10, -765, -1275, -2030, -3030.5]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9]
      ])
    })

    test('LOOP:TRUE', () => {
      emblaApi.reInit({ loop: true })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [-10, -765, -1275, -2030, -3030.5]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9]
      ])
    })
  })
})
