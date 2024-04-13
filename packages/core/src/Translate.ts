import type { AxisType } from './Axis'

export type TranslateType = ReturnType<typeof Translate>

/**
 * Функция для создания объекта перевода (смещения) элемента.
 * @param {AxisType} axis - Ось прокрутки.
 * @param {HTMLElement} container - Элемент контейнера.
 * @returns {TranslateType} Возвращает объект перевода.
 */
export function Translate(axis: AxisType, container: HTMLElement) {
  const translate = axis.scroll === 'x' ? x : y
  const containerStyle = container.style
  let disabled = false

  /**
   * Функция для создания строки перевода по оси X.
   * @param {number} n - Значение смещения.
   * @returns {string} Возвращает строку перевода.
   */
  function x(n: number): string {
    return `translate3d(${n}px,0px,0px)`
  }

  /**
   * Функция для создания строки перевода по оси Y.
   * @param {number} n - Значение смещения.
   * @returns {string} Возвращает строку перевода.
   */
  function y(n: number): string {
    return `translate3d(0px,${n}px,0px)`
  }

  /**
   * Функция для применения перевода к элементу контейнера.
   * @param {number} target - Целевое значение смещения.
   */
  function to(target: number): void {
    if (disabled) return
    containerStyle.transform = translate(axis.direction(target))
  }

  /**
   * Функция для переключения активности перевода.
   * @param {boolean} active - Флаг активности.
   */
  function toggleActive(active: boolean): void {
    disabled = !active
  }

  /**
   * Функция для очистки перевода элемента контейнера.
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
