import { describe, expect, test } from 'vitest'
import { EmblaCarousel } from '../EmblaCarousel'
import { mockTestElements } from './mocks'
import { FIXTURE_SCROLL_PROGRESS_RTL_1, FIXTURE_SCROLL_PROGRESS_RTL_2 } from './fixtures/scrollProgress-rtl.fixture'

describe('➡️  ScrollProgress - Horizontal RTL', () => {
  describe('Is correct for each snap point when:', () => {
    test('Slides are WITHOUT MARGINS', () => {
      const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_SCROLL_PROGRESS_RTL_1), { direction: 'rtl' })

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

    test('Slides are WITH MARGINS', () => {
      const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_SCROLL_PROGRESS_RTL_2), { direction: 'rtl' })

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
