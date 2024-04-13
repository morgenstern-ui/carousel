import { describe, expect, test, vi } from 'vitest'
import { EmblaCarousel } from '../EmblaCarousel'
import { mockTestElements } from './mocks'
import { FIXTURE_EVENTS } from './fixtures/events.fixture'

describe('➡️  Events', () => {
  const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_EVENTS))

  describe('События, добавленные с помощью on():', () => {
    test('Вызывает указанный обратный вызов при возникновении связанного события', () => {
      const callback = vi.fn()

      emblaApi.on('select', callback)
      emblaApi.scrollNext()
      expect(callback).toHaveBeenCalledTimes(1)

      emblaApi.on('reInit', callback)
      emblaApi.reInit()
      expect(callback).toHaveBeenCalledTimes(2)
    })

    test('Вызывает все обратные вызовы, связанные с определенным событием', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      emblaApi.on('select', callback1)
      emblaApi.on('select', callback2)
      emblaApi.scrollNext()
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    test('Не вызывает обратный вызов, когда возникает другое событие', () => {
      const callback = vi.fn()

      emblaApi.on('reInit', callback)
      emblaApi.scrollNext()
      expect(callback).toHaveBeenCalledTimes(0)
    })

    test('Больше не вызывает обратный вызов, когда он был удален с помощью off()', () => {
      const callback = vi.fn()

      emblaApi.on('select', callback)
      emblaApi.scrollNext()
      expect(callback).toHaveBeenCalledTimes(1)

      emblaApi.off('select', callback)
      emblaApi.scrollNext()
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('Вызывает указанный обратный вызов при вызове emit() пользователем', () => {
      const callback = vi.fn()

      emblaApi.on('select', callback)
      emblaApi.emit('select')
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})
