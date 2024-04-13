import { describe, expect, test } from 'vitest'
import { EmblaCarousel } from '../EmblaCarousel'
import { mockTestElements } from './mocks'
import { FIXTURE_CONSTRUCTOR_1, FIXTURE_CONSTRUCTOR_2 } from './fixtures/constructor.fixture'

describe('➡️  EmblaCarousel', () => {
  describe('Не выбрасывает ошибку при инициализации и', () => {
    test('Все необходимые узлы предоставлены', () => {
      expect(() => EmblaCarousel(mockTestElements(FIXTURE_CONSTRUCTOR_1))).not.toThrow()
    })

    test('Узлы слайдов опущены', () => {
      expect(() => EmblaCarousel(mockTestElements(FIXTURE_CONSTRUCTOR_2))).not.toThrow()
    })
  })

  describe('Выбрасывает ошибку при инициализации и', () => {
    test('Параметр корневого узла опущен', () => {
      expect(() => EmblaCarousel(undefined as any)).toThrow()
    })

    test('Узел контейнера опущен', () => {
      expect(() =>
        EmblaCarousel(
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
