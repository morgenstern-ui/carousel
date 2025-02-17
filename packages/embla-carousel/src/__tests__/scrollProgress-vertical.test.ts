import { describe, expect, test } from 'vitest'
import { useEmblaCarousel } from '../useEmblaCarousel'
import { mockTestElements } from './mocks'
import { FIXTURE_SCROLL_PROGRESS_Y_1, FIXTURE_SCROLL_PROGRESS_Y_2 } from './fixtures/scrollProgress-vertical.fixture'

describe('➡️  ScrollProgress - Vertical', () => {
  describe('Корректен для каждой точки привязки, когда:', () => {
    test('Слайды БЕЗ ОТСТУПОВ', () => {
      const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SCROLL_PROGRESS_Y_1), { axis: 'y' })

      expect(emblaApi.scrollProgress()).toBe(-0)

      emblaApi.reInit({ startIndex: 1 })
      expect(emblaApi.scrollProgress()).toBe(0.4166666666666667)

      emblaApi.reInit({ startIndex: 2 })
      expect(emblaApi.scrollProgress()).toBe(0.6666666666666666)

      emblaApi.reInit({ startIndex: 3 })
      expect(emblaApi.scrollProgress()).toBe(0.9583333333333334)

      emblaApi.reInit({ startIndex: 4 })
      expect(emblaApi.scrollProgress()).toBe(1)
    })

    test('Слайды С ОТСТУПАМИ', () => {
      const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_SCROLL_PROGRESS_Y_2), { axis: 'y' })

      expect(emblaApi.scrollProgress()).toBe(-0)

      emblaApi.reInit({ startIndex: 1 })
      expect(emblaApi.scrollProgress()).toBe(0.4076923076923077)

      emblaApi.reInit({ startIndex: 2 })
      expect(emblaApi.scrollProgress()).toBe(0.6538461538461539)

      emblaApi.reInit({ startIndex: 3 })
      expect(emblaApi.scrollProgress()).toBe(0.9384615384615385)

      emblaApi.reInit({ startIndex: 4 })
      expect(emblaApi.scrollProgress()).toBe(1)
    })
  })
})
