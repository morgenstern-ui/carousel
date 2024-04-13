import { describe, expect, test } from 'vitest'
import { useEmblaCarousel } from '../useEmblaCarousel'
import { mockTestElements } from './mocks'
import { FIXTURE_CONSTRUCTOR_1, FIXTURE_CONSTRUCTOR_2 } from './fixtures/constructor.fixture'

describe('➡️  useEmblaCarousel', () => {
  describe('Не выбрасывает ошибку при инициализации и', () => {
    test('Все необходимые узлы предоставлены', () => {
      expect(() => useEmblaCarousel(mockTestElements(FIXTURE_CONSTRUCTOR_1))).not.toThrow()
    })

    test('Узлы слайдов опущены', () => {
      expect(() => useEmblaCarousel(mockTestElements(FIXTURE_CONSTRUCTOR_2))).not.toThrow()
    })
  })

  describe('Выбрасывает ошибку при инициализации и', () => {
    test('Параметр корневого узла опущен', () => {
      expect(() => useEmblaCarousel(undefined as any)).toThrow()
    })

    test('Узел контейнера опущен', () => {
      expect(() =>
        useEmblaCarousel(
          mockTestElements({
            slideOffsets: [],
            endMargin: {
              property: 'marginRight',
              value: 0
            }
          })
        )
      ).toThrow()
    })
  })
})
