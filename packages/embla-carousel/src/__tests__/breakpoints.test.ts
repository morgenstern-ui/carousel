import { beforeEach, describe, expect, test } from 'vitest'
import { useEmblaCarousel } from '../useEmblaCarousel'
import { mockTestElements, resetMatchingMediaQuery, setMatchingMediaQuery } from './mocks'
import { FIXTURE_BREAKPOINTS } from './fixtures/breakpoints.fixture'

const MEDIA_QUERY_EXTRA_LARGE = '(min-width: 1200px)'
const MEDIA_QUERY_EXTRA_SMALL = '(min-width: 576px)'

describe('➡️  Breakpoints', () => {
  const emblaApi = useEmblaCarousel(mockTestElements(FIXTURE_BREAKPOINTS), {
    align: 'start',
    breakpoints: {
      [MEDIA_QUERY_EXTRA_LARGE]: {
        align: 'center',
        startIndex: 1
      },
      [MEDIA_QUERY_EXTRA_SMALL]: {
        align: 'end'
      }
    }
  })

  beforeEach(() => {
    resetMatchingMediaQuery()
  })

  test('Применяет опции на уровне корневого элемента, когда нет совпадения с медиа-запросом', () => {
    emblaApi.reInit()

    const engine = emblaApi.internalEngine()
    const expectedScrollSnaps = [0, -800, -1200]

    expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
  })

  test('Применяет опции для совпадающего медиа-запроса', () => {
    setMatchingMediaQuery(MEDIA_QUERY_EXTRA_LARGE)
    emblaApi.reInit()

    const engine = emblaApi.internalEngine()
    const expectedScrollSnaps = [0, -500, -800, -1150, -1200]

    expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
  })

  test('Применяет опции для последнего совпадающего запроса, если несколько запросов совпадают и опции конфликтуют', () => {
    setMatchingMediaQuery([MEDIA_QUERY_EXTRA_LARGE, MEDIA_QUERY_EXTRA_SMALL])
    emblaApi.reInit()

    const engine = emblaApi.internalEngine()
    const expectedScrollSnaps = [0, -200, -400, -900, -1200]

    expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
  })

  test('Объединяет опции, когда несколько запросов совпадают и опции не конфликтуют', () => {
    setMatchingMediaQuery([MEDIA_QUERY_EXTRA_LARGE, MEDIA_QUERY_EXTRA_SMALL])
    emblaApi.reInit()

    const engine = emblaApi.internalEngine()
    const expectedScrollSnaps = [0, -200, -400, -900, -1200]

    expect(engine.scrollSnaps).toEqual(expectedScrollSnaps)
    expect(engine.locationVector.get()).toBe(expectedScrollSnaps[engine.options.startIndex])
  })
})
