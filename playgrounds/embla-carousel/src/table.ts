import type { CreatePluginType } from '@teleskop150750/embla-carousel/plugins'
import type { EmblaCarouselType } from '@teleskop150750/embla-carousel'
import type { OptionsHandlerType } from '@teleskop150750/embla-carousel/useOptionsHandler'
import type { AxisType } from "@teleskop150750/embla-carousel/useAxis"

declare module '@teleskop150750/embla-carousel/plugins' {
  interface EmblaPluginsType {
    table?: TableType
  }
}

export type TableType = CreatePluginType<{}, {}>

export type TableOptionsType = TableType['options']

export function Table(): TableType {
  let emblaApi: EmblaCarouselType
  let root: HTMLElement

  function init(
    emblaApiInstance: EmblaCarouselType,
    optionsHandler: OptionsHandlerType
  ): void {
    emblaApi = emblaApiInstance
    root = emblaApi.rootNode()
    const containers = [...(emblaApi.rootNode().children as unknown as HTMLElement[])]
    const engine = emblaApi.internalEngine()
    engine.translate = useTranslate(engine.axis, containers)
  }

  function destroy(): void {
  }

  const self: TableType = {
    name: 'table',
    options: {},
    init,
    destroy
  }
  return self
}

/**
 * Создает утилиту для трансляции заданной оси и контейнера.
 * @param axis - Тип оси ('x' или 'y').
 * @param container - Элемент контейнера, к которому применяется трансляция.
 * @returns Объект с утилитами для трансляции элемента контейнера.
 */
export function useTranslate(axis: AxisType, containers: HTMLElement[]) {
  const translate = axis.scroll === 'x' ? x : y
  let disabled = false

  const styles: CSSStyleDeclaration[] = []

  for (const container of containers) {
    styles.push(container.style)
  }

  /**
   * Транслирует элемент контейнера по оси x на указанное значение.
   * @param n - Значение для трансляции.
   * @returns Значение CSS transform для трансляции.
   */
  function x(n: number): string {
    return `translate3d(${n}px,0px,0px)`
  }

  /**
   * Транслирует элемент контейнера по оси y на указанное значение.
   * @param n - Значение для трансляции.
   * @returns Значение CSS transform для трансляции.
   */
  function y(n: number): string {
    return `translate3d(0px,${n}px,0px)`
  }

  /**
   * Транслирует элемент контейнера к указанной целевой позиции.
   * @param target - Целевая позиция для трансляции.
   */
  function to(target: number): void {
    if (disabled) return

    for (const style of styles) {
      style.transform = translate(axis.direction(target))
    }
  }

  /**
   * Переключает активное состояние утилиты трансляции.
   * @param active - Определяет, должна ли утилита трансляции быть активной или нет.
   */
  function toggleActive(active: boolean): void {
    disabled = !active
  }

  /**
   * Очищает трансляцию, примененную к элементу контейнера.
   */
  function clear(): void {
    if (disabled) return

    for (const container of containers) {
      container.style.transform = ''
      if (!container.getAttribute('style')) container.removeAttribute('style')
    }      
  }

  const self = {
    to,
    toggleActive,
    clear,
  } as const

  return self
}
