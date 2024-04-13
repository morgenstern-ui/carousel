import { describe, expect, test } from 'vitest'
import { useEmblaCarousel } from '../useEmblaCarousel'
import { mockTestElementDimensions, mockTestElements } from './mocks'
import { FIXTURE_REINIT_1, FIXTURE_REINIT_2 } from './fixtures/reInit.fixture'

const FIRST_SNAP_INDEX = 0

describe('➡️  ReInit', () => {
  test('Учитывает изменения размеров элемента', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_REINIT_1))

    const engine = emblaApi.internalEngine()
    const expectedScrollSnaps = [0, -500, -800, -1150, -1200]
    expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
    expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

    mockTestElementDimensions(FIXTURE_REINIT_2, emblaApi.rootNode())
    emblaApi.reInit()

    const newEngine = emblaApi.internalEngine()
    const newExpectedScrollSnaps = [0, -530, -850, -1220, -1300]
    expect(newEngine.scrollSnaps).toEqual(newExpectedScrollSnaps)
    expect(newEngine.location.get()).toBe(newExpectedScrollSnaps[FIRST_SNAP_INDEX])
  })

  test('Учитывает изменения количества слайдов', () => {
    const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_REINIT_1))

    const engine = emblaApi.internalEngine()
    const expectedScrollSnaps = [0, -500, -800, -1150, -1200]
    expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
    expect(engine.location.get()).toBe(expectedScrollSnaps[FIRST_SNAP_INDEX])

    const slideOffsets = FIXTURE_REINIT_1.slideOffsets
    const fixtureAllSlidesButFirst = {
      ...FIXTURE_REINIT_1,
      slideOffsets: slideOffsets.slice(0, slideOffsets.length - 1)
    }
    mockTestElementDimensions(fixtureAllSlidesButFirst, emblaApi.rootNode())
    emblaApi.reInit()

    const newEngine = emblaApi.internalEngine()
    const newExpectedScrollSnaps = [0, -500, -800, -900]
    expect(newEngine.scrollSnaps).toEqual(newExpectedScrollSnaps)
    expect(newEngine.location.get()).toBe(newExpectedScrollSnaps[FIRST_SNAP_INDEX])
  })
})
