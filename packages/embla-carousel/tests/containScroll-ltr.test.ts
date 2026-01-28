import { describe, expect, test } from 'vitest'
import { useEmblaCarousel } from '../src/useEmblaCarousel'
import { mockTestElements } from './mocks'
import {
  FIXTURE_CONTAIN_SCROLL_LTR_1,
  FIXTURE_CONTAIN_SCROLL_LTR_2,
  FIXTURE_CONTAIN_SCROLL_LTR_3,
  FIXTURE_CONTAIN_SCROLL_LTR_4,
  FIXTURE_CONTAIN_SCROLL_LTR_5,
  FIXTURE_CONTAIN_SCROLL_LTR_6,
  FIXTURE_CONTAIN_SCROLL_LTR_7
} from './fixtures/containScroll-ltr.fixture'

const FIRST_SNAP_INDEX = 0

describe('➡️  ContainScroll - Horizontal LTR', () => {
  describe('Правильное значение "trimSnaps" для слайдов БЕЗ ОТСТУПОВ и ВЫРАВНИВАНИЯ:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_1))
    emblaApi.initOrUpdate({ options: { containScroll: 'trimSnaps' } })

    test('В начале', () => {
      emblaApi.initOrUpdate({ options: { align: 'start' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -100, -300, -450, -660]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4, 5, 6, 7, 8, 9]])
    })

    test('По центру', () => {
      emblaApi.initOrUpdate({ options: { align: 'center' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -75, -265, -380, -530, -660]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1, 2], [3], [4], [5], [6], [7, 8, 9]])
    })

    test('В конце', () => {
      emblaApi.initOrUpdate({ options: { align: 'end' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -130, -280, -530, -660]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1, 2, 3, 4, 5], [6], [7], [8], [9]])
    })

    test('Пользовательское значение', () => {
      emblaApi.initOrUpdate({ options: { align: (viewSize) => viewSize * 0.1 } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -200, -350, -600, -660]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1], [2], [3], [4], [5, 6, 7, 8, 9]])
    })
  })

  describe('Правильное значение "trimSnaps" для слайдов С ОТСТУПАМИ и ВЫРАВНИВАНИЕМ:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_2))
    emblaApi.initOrUpdate({ options: { containScroll: 'trimSnaps' } })

    test('В начале', () => {
      emblaApi.initOrUpdate({ options: { align: 'start' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -130, -350, -520, -790, -860]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5, 6, 7, 8, 9]])
    })

    test('По центру', () => {
      emblaApi.initOrUpdate({ options: { align: 'center' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -145, -355, -490, -660, -855, -860]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1, 2], [3], [4], [5], [6], [7], [8, 9]])
    })

    test('В конце', () => {
      emblaApi.initOrUpdate({ options: { align: 'end' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -40, -260, -430, -700, -860]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1, 2, 3, 4], [5], [6], [7], [8], [9]])
    })

    test('Пользовательское значение', () => {
      emblaApi.initOrUpdate({ options: { align: (viewSize) => viewSize * 0.1 } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -30, -250, -420, -690, -840, -860]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6, 7, 8, 9]])
    })
  })

  describe('Правильное значение "trimSnaps" для крайних случаев, когда:', () => {
    test('Размер контента на 2 пикселя больше видимой области', () => {
      const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_3))
      emblaApi.initOrUpdate()

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1]])
    })

    test('Размер контента на 3 пикселя больше видимой области', () => {
      const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_4))
      emblaApi.initOrUpdate()

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -3]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1]])
    })

    test('Размер контента меньше видимой области', () => {
      const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_5))
      emblaApi.initOrUpdate()

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1]])
    })

    test('Смещение в начало меньше 1 пикселя', () => {
      const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_6))
      emblaApi.initOrUpdate()

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -80.5, -167.5, -254.5, -341.5, -428]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1, 2], [3], [4], [5], [6], [7, 8, 9]])
    })

    test('Смещение в конец меньше 1 пикселя', () => {
      const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_7))
      emblaApi.initOrUpdate()

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -215.5, -430.5, -646]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1], [2], [3], [4, 5]])
    })
  })

  describe('Правильное значение "keepSnaps" для слайдов БЕЗ ОТСТУПОВ и выравнивание:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_1))
    emblaApi.initOrUpdate({ options: { containScroll: 'keepSnaps' } })

    test('В начале', () => {
      emblaApi.initOrUpdate({ options: { align: 'start' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -100, -300, -450, -660, -660, -660, -660, -660, -660]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('По центру', () => {
      emblaApi.initOrUpdate({ options: { align: 'center' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, 0, 0, -75, -265, -380, -530, -660, -660, -660]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('В конце', () => {
      emblaApi.initOrUpdate({ options: { align: 'end' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, 0, 0, 0, 0, 0, -130, -280, -530, -660]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('Пользовательское значение', () => {
      emblaApi.initOrUpdate({ options: { align: (viewSize) => viewSize * 0.1 } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, 0, -200, -350, -600, -660, -660, -660, -660, -660]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })
  })

  describe('Правильное значение "keepSnaps" для слайдов С ОТСТУПАМИ и выравнивание:', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_2))
    emblaApi.initOrUpdate({ options: { containScroll: 'keepSnaps' } })

    test('В начале', () => {
      emblaApi.initOrUpdate({ options: { align: 'start' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -130, -350, -520, -790, -860, -860, -860, -860, -860]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('По центру', () => {
      emblaApi.initOrUpdate({ options: { align: 'center' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, 0, 0, -145, -355, -490, -660, -855, -860, -860]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('В конце', () => {
      emblaApi.initOrUpdate({ options: { align: 'end' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, 0, 0, 0, 0, -40, -260, -430, -700, -860]

      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })

    test('Пользовательское значение', () => {
      emblaApi.initOrUpdate({ options: { align: (viewSize) => viewSize * 0.1 } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -30, -250, -420, -690, -840, -860, -860, -860, -860]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
    })
  })

  describe('Правильное значение "keepSnaps" для крайних случаев, когда размер контента:', () => {
    test('На 2 пикселя больше видимой области', () => {
      const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_3))
      emblaApi.initOrUpdate({ options: { containScroll: 'keepSnaps' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1]])
    })

    test('На 3 пикселя больше видимой области', () => {
      const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_4))
      emblaApi.initOrUpdate({ options: { containScroll: 'keepSnaps' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0, -3]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0], [1]])
    })

    test('Меньше видимой области', () => {
      const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_CONTAIN_SCROLL_LTR_5))
      emblaApi.initOrUpdate({ options: { containScroll: 'keepSnaps' } })

      const engine = emblaApi.internalEngine()
      const expectedScrollSnaps = [0]
      expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
      expect(engine.locationVector.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

      expect(engine.slideRegistry).toEqual([[0, 1]])
    })
  })
})
