import { beforeEach, describe, expect, test } from 'vitest'
import { useEmblaCarousel } from '../useEmblaCarousel'
import { defaultOptions } from '../Options'
import { mockTestElements } from './mocks'
import {
  FIXTURE_SLIDES_TO_SCROLL_RTL_1,
  FIXTURE_SLIDES_TO_SCROLL_RTL_2,
  FIXTURE_SLIDES_TO_SCROLL_RTL_3
} from './fixtures/slidesToScroll-rtl.fixture'

const FIRST_SNAP_INDEX = 0

describe('➡️  Слайды для прокрутки - Горизонтальная RTL', () => {
  describe('"auto" правильно для слайдов БЕЗ ОТСТУПОВ и:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SLIDES_TO_SCROLL_RTL_1))
    beforeEach(() => {
      emblaApi.reInit({
        ...defaultOptions,
        slidesToScroll: 'auto',
        direction: 'rtl'
      })
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
  describe('"auto" правильно для слайдов С ОТСТУПАМИ и:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SLIDES_TO_SCROLL_RTL_2))
    beforeEach(() => {
      emblaApi.reInit({
        ...defaultOptions,
        slidesToScroll: 'auto',
        direction: 'rtl'
      })
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
  describe('"auto" правильно для крайних случаев, когда ширина слайда больше видимой области и:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SLIDES_TO_SCROLL_RTL_3))
    beforeEach(() => {
      emblaApi.reInit({
        ...defaultOptions,
        slidesToScroll: 'auto',
        direction: 'rtl'
      })
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
  describe('"Пользовательское число 2" правильно для слайдов БЕЗ ОТСТУПОВ и:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SLIDES_TO_SCROLL_RTL_1))
    beforeEach(() => {
      emblaApi.reInit({
        ...defaultOptions,
        slidesToScroll: 2,
        direction: 'rtl'
      })
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
  describe('"Пользовательское число 2" правильно для слайдов С ОТСТУПАМИ и:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SLIDES_TO_SCROLL_RTL_2))
    beforeEach(() => {
      emblaApi.reInit({
        ...defaultOptions,
        slidesToScroll: 2,
        direction: 'rtl'
      })
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
