import type { EmblaCarouselType } from '@teleskop150750/embla-carousel'
import type { CreateOptionsType } from '@teleskop150750/embla-carousel/options'
import type { CreatePluginType } from '@teleskop150750/embla-carousel/plugins'
import type { AxisType } from '@teleskop150750/embla-carousel/useAxis'
import type { OptionsHandlerType } from '@teleskop150750/embla-carousel/useOptionsHandler'

export type OptionsType = CreateOptionsType<{
  row: string
}>

const defaultOptions: OptionsType = {
  active: true,
  breakpoints: {},
  row: '.embla__container'
}

export type TableType = CreatePluginType<
  {
  },
  OptionsType
>

export type TableOptionsType = TableType['options']

export function useTranslate(axis: AxisType, $containers: HTMLElement[]) {
  const translate = axis.scroll === 'x' ? x : y
  let disabled = false

  const styles: CSSStyleDeclaration[] = []

  for (const $container of $containers) {
    styles.push($container.style)
  }

  function x(n: number): string {
    return `translate3d(${n}px,0px,0px)`
  }

  function y(n: number): string {
    return `translate3d(0px,${n}px,0px)`
  }

  function to(target: number): void {
    if (disabled) return

    for (const style of styles) {
      style.transform = translate(axis.direction(target))
    }
  }

  function toggleActive(active: boolean): void {
    disabled = !active
  }

  function clear(): void {
    if (disabled) return

    for (const $container of $containers) {
      $container.style.transform = ''
      if (!$container.getAttribute('style')) $container.removeAttribute('style')
    }
  }

  const self = {
    to,
    toggleActive,
    clear
  } as const

  return self
}

export function Table(userOptions: TableOptionsType = {}): TableType {
  function init(emblaApiInstance: EmblaCarouselType, optionsHandler: OptionsHandlerType): void {
    const { mergeOptions } = optionsHandler
    const allOptions = mergeOptions(defaultOptions, userOptions)
    const $root = emblaApiInstance.rootNode()

    const $rows = [...$root.querySelectorAll<HTMLElement>(allOptions.row)]

    const engine = emblaApiInstance.internalEngine()
    engine.translate = useTranslate(engine.axis, $rows)
  }

  function destroy(): void {}

  const self: TableType = {
    name: 'table',
    options: {},
    init,
    destroy
  }
  return self
}

export type AutoplayType = CreatePluginType<
  {
    play: (jump?: boolean) => void
    stop: () => void
    reset: () => void
    isPlaying: () => boolean
  },
  OptionsType
>

declare module '@teleskop150750/embla-carousel/plugins' {
  interface EmblaPluginsType {
    autoplay?: AutoplayType
  }
}
