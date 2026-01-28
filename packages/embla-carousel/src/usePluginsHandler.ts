import type { EmblaCarouselType } from './useEmblaCarousel.ts'
import type { OptionsHandlerType } from './useOptionsHandler.ts'
import type { EmblaPluginsType, EmblaPluginType } from './plugins.ts'

/**
 * Представляет тип PluginsHandler.
 */
export type PluginsHandlerType = {
  init: (emblaApi: EmblaCarouselType, plugins: EmblaPluginType[]) => EmblaPluginsType
  destroy: () => void
}

/**
 * Создает экземпляр PluginsHandler.
 * @param optionsHandler - Экземпляр OptionsHandler.
 * @returns Экземпляр PluginsHandler.
 */
export function usePluginsHandler(optionsHandler: OptionsHandlerType): PluginsHandlerType {
  let activePlugins: EmblaPluginType[] = []

  /**
   * Инициализирует плагины с предоставленным экземпляром useEmblaCarousel.
   * @param emblaApi - Экземпляр useEmblaCarousel.
   * @param plugins - Массив экземпляров EmblaPlugin.
   * @returns Карта имен плагинов и экземпляров плагинов.
   */
  function init(emblaApi: EmblaCarouselType, plugins: EmblaPluginType[]): EmblaPluginsType {
    const pluginMap: EmblaPluginsType = {}

    for (const plugin of plugins) {
      if (optionsHandler.optionsAtMedia(plugin.options).active !== false) {
        activePlugins.push(plugin)
        plugin.init(emblaApi, optionsHandler)
        pluginMap[plugin.name] = plugin
      }
    }

    return pluginMap
  }

  /**
   * Уничтожает активные плагины.
   */
  function destroy(): void {
    activePlugins = activePlugins.filter((plugin) => plugin.destroy())
  }

  return {
    init,
    destroy
  }
}
