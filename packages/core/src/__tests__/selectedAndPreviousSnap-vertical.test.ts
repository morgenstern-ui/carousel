import { beforeEach, describe, expect, test } from 'vitest'
import { EmblaCarousel } from '../EmblaCarousel'
import { mockTestElements } from './mocks'
import { FIXTURE_SELECTED_PREVIOUS_SNAP_Y } from './fixtures/selectedAndPreviousSnap-vertical.fixture'

describe('➡️  SelectedScrollSnap & PreviousScrollSnap - Vertical', () => {
  describe('Корректно, когда LOOP:FALSE, когда:', () => {
    const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_SELECTED_PREVIOUS_SNAP_Y), {
      axis: 'y'
    })
    const lastIndex = FIXTURE_SELECTED_PREVIOUS_SNAP_Y.slideOffsets.length - 1
    const firstIndex = 0

    beforeEach(() => {
      emblaApi.reInit({ startIndex: firstIndex })
    })

    test('startIndex не установлен', () => {
      expect(emblaApi.selectedScrollSnap()).toBe(firstIndex)
      expect(emblaApi.previousScrollSnap()).toBe(firstIndex)
    })

    test('startIndex установлен', () => {
      emblaApi.reInit({ startIndex: 2 })

      expect(emblaApi.selectedScrollSnap()).toBe(2)
      expect(emblaApi.previousScrollSnap()).toBe(2)
    })

    test('Пользователь пытается прокрутить вперед за последним слайдом', () => {
      emblaApi.reInit({ startIndex: lastIndex })
      emblaApi.scrollNext()

      expect(emblaApi.selectedScrollSnap()).toBe(lastIndex)
      expect(emblaApi.previousScrollSnap()).toBe(lastIndex)
    })

    test('Пользователь пытается прокрутить назад перед первым слайдом', () => {
      emblaApi.scrollPrev()

      expect(emblaApi.selectedScrollSnap()).toBe(firstIndex)
      expect(emblaApi.previousScrollSnap()).toBe(firstIndex)
    })

    test('Пользователь пытается прокрутить к индексу, превышающему последний индекс', () => {
      emblaApi.scrollTo(lastIndex + 1)

      expect(emblaApi.selectedScrollSnap()).toBe(lastIndex)
      expect(emblaApi.previousScrollSnap()).toBe(firstIndex)
    })

    test('Пользователь пытается прокрутить к индексу, меньшему первого индекса', () => {
      emblaApi.scrollTo(firstIndex - 1)

      expect(emblaApi.selectedScrollSnap()).toBe(firstIndex)
      expect(emblaApi.previousScrollSnap()).toBe(firstIndex)
    })

    test('Шаг вперед по одному снэпу от начала', () => {
      let i = firstIndex

      while (i !== lastIndex) {
        emblaApi.scrollNext()
        expect(emblaApi.previousScrollSnap()).toBe(i)
        i += 1
        expect(emblaApi.selectedScrollSnap()).toBe(i)
      }
    })

    test('Шаг назад по одному снэпу от конца', () => {
      emblaApi.reInit({ startIndex: lastIndex })
      let i = lastIndex

      while (i !== firstIndex) {
        emblaApi.scrollPrev()
        expect(emblaApi.previousScrollSnap()).toBe(i)
        i -= 1
        expect(emblaApi.selectedScrollSnap()).toBe(i)
      }
    })
  })

  describe('Корректно, когда LOOP:TRUE, когда:', () => {
    const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_SELECTED_PREVIOUS_SNAP_Y), {
      axis: 'y',
      loop: true
    })
    const lastIndex = FIXTURE_SELECTED_PREVIOUS_SNAP_Y.slideOffsets.length - 1
    const firstIndex = 0

    beforeEach(() => {
      emblaApi.reInit({ startIndex: firstIndex })
    })

    test('startIndex не установлен', () => {
      expect(emblaApi.selectedScrollSnap()).toBe(firstIndex)
      expect(emblaApi.previousScrollSnap()).toBe(firstIndex)
    })

    test('startIndex установлен', () => {
      emblaApi.reInit({ startIndex: 2 })

      expect(emblaApi.selectedScrollSnap()).toBe(2)
      expect(emblaApi.previousScrollSnap()).toBe(2)
    })

    test('Пользователь пытается прокрутить вперед за последним слайдом', () => {
      emblaApi.reInit({ startIndex: lastIndex })
      emblaApi.scrollNext()

      expect(emblaApi.selectedScrollSnap()).toBe(firstIndex)
      expect(emblaApi.previousScrollSnap()).toBe(lastIndex)
    })

    test('Пользователь пытается прокрутить назад перед первым слайдом', () => {
      emblaApi.scrollPrev()

      expect(emblaApi.selectedScrollSnap()).toBe(lastIndex)
      expect(emblaApi.previousScrollSnap()).toBe(firstIndex)
    })

    test('Пользователь пытается прокрутить к индексу, превышающему последний индекс', () => {
      emblaApi.scrollTo(lastIndex + 1)

      expect(emblaApi.selectedScrollSnap()).toBe(firstIndex)
      expect(emblaApi.previousScrollSnap()).toBe(firstIndex)
    })

    test('Пользователь пытается прокрутить к индексу, меньшему первого индекса', () => {
      emblaApi.scrollTo(firstIndex - 1)

      expect(emblaApi.selectedScrollSnap()).toBe(lastIndex)
      expect(emblaApi.previousScrollSnap()).toBe(firstIndex)
    })

    test('Шаг вперед по одному снэпу от начала', () => {
      let i = firstIndex

      while (i !== lastIndex) {
        emblaApi.scrollNext()
        expect(emblaApi.previousScrollSnap()).toBe(i)
        i += 1
        expect(emblaApi.selectedScrollSnap()).toBe(i)
      }
    })

    test('Шаг назад по одному снэпу от конца', () => {
      emblaApi.reInit({ startIndex: lastIndex })
      let i = lastIndex

      while (i !== firstIndex) {
        emblaApi.scrollPrev()
        expect(emblaApi.previousScrollSnap()).toBe(i)
        i -= 1
        expect(emblaApi.selectedScrollSnap()).toBe(i)
      }
    })
  })
})
