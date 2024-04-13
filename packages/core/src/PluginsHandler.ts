import type { EmblaCarouselType } from './EmblaCarousel.ts'
import type { OptionsHandlerType } from './OptionsHandler.ts'
import type { EmblaPluginsType, EmblaPluginType } from './Plugins.ts'

/**
 * Представляет тип PluginsHandler.
 */
export type PluginsHandlerType = ReturnType<typeof usePluginsHandler>

/**
 * Создает экземпляр PluginsHandler.
 * @param optionsHandler - Экземпляр OptionsHandler.
 * @returns Экземпляр PluginsHandler.
 */
export function usePluginsHandler(optionsHandler: OptionsHandlerType) {
  let activePlugins: EmblaPluginType[] = []

  /**
   * Инициализирует плагины с предоставленным экземпляром EmblaCarousel.
   * @param emblaApi - Экземпляр EmblaCarousel.
   * @param plugins - Массив экземпляров EmblaPlugin.
   * @returns Карта имен плагинов и экземпляров плагинов.
   */
  function init(emblaApi: EmblaCarouselType, plugins: EmblaPluginType[]): EmblaPluginsType {
    activePlugins = plugins.filter(({ options }) => optionsHandler.optionsAtMedia(options).active !== false)
    activePlugins.forEach((plugin) => plugin.init(emblaApi, optionsHandler))

    return plugins.reduce((map, plugin) => Object.assign(map, { [plugin.name]: plugin }), {})
  }

  /**
   * Уничтожает активные плагины.
   */
  function destroy(): void {
    activePlugins = activePlugins.filter((plugin) => plugin.destroy())
  }

  const self = {
    init,
    destroy
  } as const

  return self
}
