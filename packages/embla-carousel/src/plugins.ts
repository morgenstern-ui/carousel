import type { CreateOptionsType, LooseOptionsType } from './options.ts'
import type { EmblaCarouselType } from './useEmblaCarousel.ts'
import type { OptionsHandlerType } from './useOptionsHandler.ts'

export type LoosePluginType = {
  [key: string]: unknown
}

export type CreatePluginType<TypeA extends LoosePluginType, TypeB extends LooseOptionsType> = TypeA & {
  name: string
  options: Partial<CreateOptionsType<TypeB>>
  init: (embla: EmblaCarouselType, OptionsHandler: OptionsHandlerType) => void
  destroy: () => void
}

export interface EmblaPluginsType {
  [key: string]: CreatePluginType<LoosePluginType, {}>
}

export type EmblaPluginType = EmblaPluginsType[keyof EmblaPluginsType]
