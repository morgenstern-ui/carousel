import { describe, expect, test } from 'vitest'
import { useEmblaCarousel } from '../useEmblaCarousel'
import { mockTestElements } from './mocks'
import { FIXTURE_AXIS_X_LTR } from './fixtures/axis-ltr.fixture'

describe('➡️  Axis - Horizontal LTR', () => {
  test('Корректное перемещение', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_AXIS_X_LTR), {
      containScroll: false
    })

    expect(emblaApi.containerNode().style.transform).toBe('translate3d(100px,0px,0px)')
  })
})
