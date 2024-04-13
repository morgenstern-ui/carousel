import type { AxisType } from './useAxis'

export type TranslateType = ReturnType<typeof useTranslate>

/**
 * Создает утилиту для трансляции заданной оси и контейнера.
 * @param axis - Тип оси ('x' или 'y').
 * @param container - Элемент контейнера, к которому применяется трансляция.
 * @returns Объект с утилитами для трансляции элемента контейнера.
 */
export function useTranslate(axis: AxisType, container: HTMLElement) {
  const translate = axis.scroll === 'x' ? x : y
  const containerStyle = container.style
  let disabled = false

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
    containerStyle.transform = translate(axis.direction(target))
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
    containerStyle.transform = ''
    if (!container.getAttribute('style')) container.removeAttribute('style')
  }

  const self = {
    clear,
    to,
    toggleActive
  } as const

  return self
}
