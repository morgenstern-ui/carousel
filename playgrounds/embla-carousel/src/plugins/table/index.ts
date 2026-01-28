import type { EmblaCarouselType } from '@teleskop150750/embla-carousel'
import type { CreatePluginType } from '@teleskop150750/embla-carousel/plugins'
import type { AxisType } from '@teleskop150750/embla-carousel/useAxis'
import type { OptionsHandlerType } from '@teleskop150750/embla-carousel/useOptionsHandler'
import type { OptionsType } from './Options'
import { defaultOptions } from './Options'

export type TableType = CreatePluginType<{}, OptionsType>

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

  return {
    to,
    toggleActive,
    clear
  }
}

export function TableCarousel(userOptions: TableOptionsType = {}): TableType {
  function init(emblaApiInstance: EmblaCarouselType, optionsHandler: OptionsHandlerType): void {
    const { mergeOptions } = optionsHandler
    const allOptions = mergeOptions(defaultOptions, userOptions)
    const $root = emblaApiInstance.rootNode()

    const $rows = [...$root.querySelectorAll<HTMLElement>(allOptions.rowSelector)]

    const engine = emblaApiInstance.internalEngine()
    engine.translate = useTranslate(engine.axis, $rows)
  }

  function destroy(): void {}

  return {
    name: 'tableCarousel',
    options: {},
    init,
    destroy
  }
}
TableCarousel.globalOptions = undefined as TableOptionsType | undefined

declare module '@teleskop150750/embla-carousel/plugins' {
  interface EmblaPluginsType {
    tableCarousel?: TableType
  }
}
