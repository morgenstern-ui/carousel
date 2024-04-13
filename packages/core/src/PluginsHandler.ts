import type { EmblaCarouselType } from './EmblaCarousel.ts'
import type { OptionsHandlerType } from './OptionsHandler.ts'
import type { EmblaPluginsType, EmblaPluginType } from './Plugins.ts'

export type PluginsHandlerType = ReturnType<typeof PluginsHandler>

/**
 * Создает обработчик плагинов.
 * @param {OptionsHandlerType} optionsHandler - Обработчик опций.
 * @returns {PluginsHandlerType} Обработчик плагинов.
 */
export function PluginsHandler(optionsHandler: OptionsHandlerType) {
  let activePlugins: EmblaPluginType[] = []

  /**
   * Инициализирует плагины.
   * @param {EmblaCarouselType} emblaApi - API карусели Embla.
   * @param {EmblaPluginType[]} plugins - Список плагинов.
   * @returns {EmblaPluginsType} Объект с инициализированными плагинами.
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
