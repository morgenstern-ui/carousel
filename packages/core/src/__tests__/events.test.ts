import { describe, expect, test, vi } from 'vitest'
import { EmblaCarousel } from '../EmblaCarousel'
import { mockTestElements } from './mocks'
import { FIXTURE_EVENTS } from './fixtures/events.fixture'

describe('➡️  Events', () => {
  const emblaApi = EmblaCarousel(mockTestElements(FIXTURE_EVENTS))

  describe('Events added with on():', () => {
    test('Calls the provided callback when its associated event are emitted', () => {
      const callback = vi.fn()

      emblaApi.on('select', callback)
      emblaApi.scrollNext()
      expect(callback).toHaveBeenCalledTimes(1)

      emblaApi.on('reInit', callback)
      emblaApi.reInit()
      expect(callback).toHaveBeenCalledTimes(2)
    })

    test('Calls all callbacks associated with a specific event', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      emblaApi.on('select', callback1)
      emblaApi.on('select', callback2)
      emblaApi.scrollNext()
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    test('Will NOT fire a callback when a different event is emitted', () => {
      const callback = vi.fn()

      emblaApi.on('reInit', callback)
      emblaApi.scrollNext()
      expect(callback).toHaveBeenCalledTimes(0)
    })

    test('Will NOT fire a callback anymore when it has been removed with off()', () => {
      const callback = vi.fn()

      emblaApi.on('select', callback)
      emblaApi.scrollNext()
      expect(callback).toHaveBeenCalledTimes(1)

      emblaApi.off('select', callback)
      emblaApi.scrollNext()
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('Calls the provided callback when emit() is triggered by the user', () => {
      const callback = vi.fn()

      emblaApi.on('select', callback)
      emblaApi.emit('select')
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})
