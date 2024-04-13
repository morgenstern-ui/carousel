import { beforeEach, describe, expect, test, vi } from 'vitest'
import { EmblaCarousel, type EmblaCarouselType } from '../EmblaCarousel'
import { mockTestElements } from './mocks'
import { FIXTURE_PLUGINS } from './fixtures/plugins.fixture'
import { EmblaPluginType } from '../Plugins'

const PLUGIN_ONE: EmblaPluginType = {
  name: 'plugin-one',
  init: vi.fn(),
  destroy: vi.fn(),
  options: { active: true, breakpoints: {} }
}

const PLUGIN_TWO: EmblaPluginType = {
  name: 'plugin-two',
  init: vi.fn(),
  destroy: vi.fn(),
  options: { active: true, breakpoints: {} }
}

describe('➡️  Plugins', () => {
  let emblaApi: EmblaCarouselType

  beforeEach(() => {
    vi.clearAllMocks()
    emblaApi = EmblaCarousel(mockTestElements(FIXTURE_PLUGINS), {}, [PLUGIN_ONE, PLUGIN_TWO])
  })

  test('Инициализируются при инициализации карусели с помощью конструктора', () => {
    expect(PLUGIN_ONE.init).toHaveBeenCalledTimes(1)
    expect(PLUGIN_TWO.init).toHaveBeenCalledTimes(1)
  })

  test('Уничтожаются и инициализируются заново при вызове метода reInit() карусели', () => {
    emblaApi.reInit()
    expect(PLUGIN_ONE.destroy).toHaveBeenCalledTimes(1)
    expect(PLUGIN_TWO.destroy).toHaveBeenCalledTimes(1)
    expect(PLUGIN_ONE.init).toHaveBeenCalledTimes(2)
    expect(PLUGIN_TWO.init).toHaveBeenCalledTimes(2)
  })

  test('Уничтожаются при уничтожении карусели', () => {
    emblaApi.destroy()
    expect(PLUGIN_ONE.destroy).toHaveBeenCalledTimes(1)
    expect(PLUGIN_TWO.destroy).toHaveBeenCalledTimes(1)
  })

  test('API-интерфейсы доступны при вызове метода plugins()', () => {
    expect(emblaApi.plugins()[PLUGIN_ONE.name]).toEqual(PLUGIN_ONE)
    expect(emblaApi.plugins()[PLUGIN_TWO.name]).toEqual(PLUGIN_TWO)
  })
})
