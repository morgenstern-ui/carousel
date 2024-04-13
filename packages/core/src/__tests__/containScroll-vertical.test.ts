import { describe, expect, test } from 'vitest'
import { EmblaCarousel } from '../EmblaCarousel'
import { mockTestElements } from './mocks'
import {
  FIXTURE_CONTAIN_SCROLL_Y_1,
  FIXTURE_CONTAIN_SCROLL_Y_2,
  FIXTURE_CONTAIN_SCROLL_Y_3,
  FIXTURE_CONTAIN_SCROLL_Y_4,
  FIXTURE_CONTAIN_SCROLL_Y_5,
  FIXTURE_CONTAIN_SCROLL_Y_6,
  FIXTURE_CONTAIN_SCROLL_Y_7
} from './fixtures/containScroll-vertical.fixture'

const FIRST_SNAP_INDEX = 0

describe('➡️  ContainScroll - Вертикальное', () => {
  describe('"trimSnaps" правильно работает для слайдов БЕЗ ОТСТУПОВ и ВЫРАВНИВАНИЯ:', () => {
    const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_1), {
      containScroll: 'trimSnaps',
      axis: 'y'
    })

    test('Начало', () => {
      emblaApi.reInit({ align: 'start' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -100, -300, -450, -660]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4, 5, 6, 7, 8, 9]])
    })

    test('Центр', () => {
      emblaApi.reInit({ align: 'center' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -75, -265, -380, -530, -660]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1, 2], [3], [4], [5], [6], [7, 8, 9]])
    })

    test('Конец', () => {
      emblaApi.reInit({ align: 'end' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -130, -280, -530, -660]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1, 2, 3, 4, 5], [6], [7], [8], [9]])
    })

    test('Пользовательский', () => {
      emblaApi.reInit({ align: (viewSize) => viewSize * 0.1 })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -200, -350, -600, -660]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1], [2], [3], [4], [5, 6, 7, 8, 9]])
    })
  })

  describe('"trimSnaps" правильно работает для слайдов С ОТСТУПАМИ и ВЫРАВНИВАНИЕМ:', () => {
    const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_2), {
      containScroll: 'trimSnaps',
      axis: 'y'
    })

    test('Начало', () => {
      emblaApi.reInit({ align: 'start' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -130, -350, -520, -790, -860]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5, 6, 7, 8, 9]])
    })

    test('Центр', () => {
      emblaApi.reInit({ align: 'center' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -145, -355, -490, -660, -855, -860]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1, 2], [3], [4], [5], [6], [7], [8, 9]])
    })

    test('Конец', () => {
      emblaApi.reInit({ align: 'end' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -40, -260, -430, -700, -860]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1, 2, 3, 4], [5], [6], [7], [8], [9]])
    })

    emblaApi.reInit({ align: (viewSize) => viewSize * 0.1 })

    const engine = emblaApi.internalEngine()
    const expectedScrollSnaps = [0, -30, -250, -420, -690, -840, -860]

    expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
    expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

    expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6, 7, 8, 9]])
  })

  describe('"trimSnaps" правильно работает для крайних случаев, когда:', () => {
    test('Размер контента на 2 пикселя больше видимой области', () => {
      const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_3), { axis: 'y' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1]])
    })

    test('Размер контента на 3 пикселя больше видимой области', () => {
      const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_4), { axis: 'y' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -3]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1]])
    })

    test('Размер контента меньше видимой области', () => {
      const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_5), { axis: 'y' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1]])
    })

    test('Снапы в начале с разницей меньше 1 пикселя', () => {
      const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_6), { axis: 'y' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -80, -160, -240, -320, -400]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1, 2], [3], [4], [5], [6], [7, 8, 9]])
    })

    test('Снапы в конце с разницей меньше 1 пикселя', () => {
      const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_7), { axis: 'y' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -133.5, -266.5, -400]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1], [2], [3], [4, 5]])
    })
  })

  describe('"keepSnaps" правильно работает для слайдов БЕЗ ОТСТУПОВ и ВЫРАВНИВАНИЯ:', () => {
    const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_1), {
      containScroll: 'keepSnaps',
      axis: 'y'
    })

    test('Начало', () => {
      emblaApi.reInit({ align: 'start' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -100, -300, -450, -660, -660, -660, -660, -660, -660]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('Центр', () => {
      emblaApi.reInit({ align: 'center' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, 0, 0, -75, -265, -380, -530, -660, -660, -660]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('Конец', () => {
      emblaApi.reInit({ align: 'end' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, 0, 0, 0, 0, 0, -130, -280, -530, -660]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('Пользовательский', () => {
      emblaApi.reInit({ align: (viewSize) => viewSize * 0.1 })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, 0, -200, -350, -600, -660, -660, -660, -660, -660]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })
  })

  describe('"keepSnaps" правильно работает для слайдов С ОТСТУПАМИ и ВЫРАВНИВАНИЕМ:', () => {
    const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_2), {
      containScroll: 'keepSnaps',
      axis: 'y'
    })

    test('Начало', () => {
      emblaApi.reInit({ align: 'start' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -130, -350, -520, -790, -860, -860, -860, -860, -860]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('Центр', () => {
      emblaApi.reInit({ align: 'center' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, 0, 0, -145, -355, -490, -660, -855, -860, -860]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('Конец', () => {
      emblaApi.reInit({ align: 'end' })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, 0, 0, 0, 0, -40, -260, -430, -700, -860]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('Пользовательский', () => {
      emblaApi.reInit({ align: (viewSize) => viewSize * 0.1 })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -30, -250, -420, -690, -840, -860, -860, -860, -860]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })
  })

  describe('"keepSnaps" правильно работает для крайних случаев, когда размер контента:', () => {
    test('на 2 пикселя больше видимой области', () => {
      const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_3), {
        containScroll: 'keepSnaps',
        axis: 'y'
      })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1]])
    })

    test('на 3 пикселя больше видимой области', () => {
      const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_4), {
        containScroll: 'keepSnaps',
        axis: 'y'
      })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -3]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1]])
    })

    test('меньше видимой области', () => {
      const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_Y_5), {
        containScroll: 'keepSnaps',
        axis: 'y'
      })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1]])
    })
  })
})
