import type { PointerEventType } from './DragTracker.ts'

export type WindowType = Window & typeof globalThis

/**
 * Функция для проверки, является ли переданный аргумент числом.
 * @param {unknown} subject - Проверяемый аргумент.
 * @returns {boolean} Возвращает true, если аргумент является числом, иначе false.
 */
export function isNumber(subject: unknown): subject is number {
  return typeof subject === 'number'
}

/**
 * Функция для проверки, является ли переданный аргумент строкой.
 * @param {unknown} subject - Проверяемый аргумент.
 * @returns {boolean} Возвращает true, если аргумент является строкой, иначе false.
 */

export function isString(subject: unknown): subject is string {
  return typeof subject === 'string'
}

/**
 * Функция для проверки, является ли переданный аргумент булевым значением.
 * @param {unknown} subject - Проверяемый аргумент.
 * @returns {boolean} Возвращает true, если аргумент является булевым значением, иначе false.
 */
export function isBoolean(subject: unknown): subject is boolean {
  return typeof subject === 'boolean'
}

/**
 * Функция для проверки, является ли переданный аргумент объектом.
 * @param {unknown} subject - Проверяемый аргумент.
 * @returns {boolean} Возвращает true, если аргумент является объектом, иначе false.
 */
export function isObject(subject: unknown): subject is Record<string, unknown> {
  return Object.prototype.toString.call(subject) === '[object Object]'
}

/**
 * Функция для получения абсолютного значения числа.
 * @param {number} n - Число.
 * @returns {number} Возвращает абсолютное значение числа.
 */
export const mathAbs = Math.abs

/**
 * Функция для получения знака числа.
 * @param {number} n - Число.
 * @returns {number} Возвращает 1, если число положительное, -1, если число отрицательное, и 0, если число равно нулю.
 */
export const mathSign = Math.sign

/**
 * Функция для получения абсолютного значения разности двух чисел.
 * @param {number} valueB - Первое число.
 * @param {number} valueA - Второе число.
 * @returns {number} Возвращает абсолютное значение разности двух чисел.
 */
export function deltaAbs(valueB: number, valueA: number): number {
  return mathAbs(valueB - valueA)
}

/**
 * Функция для получения абсолютного значения фактора двух чисел.
 * @param {number} valueB - Первое число.
 * @param {number} valueA - Второе число.
 * @returns {number} Возвращает абсолютное значение фактора двух чисел.
 */
export function factorAbs(valueB: number, valueA: number): number {
  if (valueB === 0 || valueA === 0) return 0
  if (mathAbs(valueB) <= mathAbs(valueA)) return 0
  const diff = deltaAbs(mathAbs(valueB), mathAbs(valueA))
  return mathAbs(diff / valueB)
}

/**
 * Функция для получения ключей массива.
 * @param {Type[]} array - Массив.
 * @returns {number[]} Возвращает массив ключей.
 */
export function arrayKeys<Type>(array: Type[]): number[] {
  return objectKeys(array).map(Number)
}

/**
 * Функция для получения последнего элемента массива.
 * @param {Type[]} array - Массив.
 * @returns {Type} Возвращает последний элемент массива.
 */
export function arrayLast<Type>(array: Type[]): Type {
  return array[arrayLastIndex(array)]
}

/**
 * Функция для получения индекса последнего элемента массива.
 * @param {Type[]} array - Массив.
 * @returns {number} Возвращает индекс последнего элемента массива.
 */
export function arrayLastIndex<Type>(array: Type[]): number {
  return Math.max(0, array.length - 1)
}

/**
 * Функция для проверки, является ли индекс последним в массиве.
 * @param {Type[]} array - Массив.
 * @param {number} index - Индекс.
 * @returns {boolean} Возвращает true, если индекс является последним в массиве, иначе false.
 */
export function arrayIsLastIndex<Type>(array: Type[], index: number): boolean {
  return index === arrayLastIndex(array)
}

/**
 * Функция для создания массива из числа.
 * @param {number} n - Число.
 * @param {number} startAt - Начальное значение (по умолчанию равно 0).
 * @returns {number[]} Возвращает массив из числа.
 */
export function arrayFromNumber(n: number, startAt: number = 0): number[] {
  return Array.from(Array(n), (_, i) => startAt + i)
}

/**
 * Функция для получения ключей объекта.
 * @param {Type} object - Объект.
 * @returns {string[]} Возвращает массив ключей объекта.
 */
export function objectKeys<Type extends object>(object: Type): string[] {
  return Object.keys(object)
}

/**
 * Функция для глубокого слияния двух объектов.
 * @param {Record<string, unknown>} objectA - Первый объект.
 * @param {Record<string, unknown>} objectB - Второй объект.
 * @returns {Record<string, unknown>} Возвращает результат глубокого слияния двух объектов.
 */
export function objectsMergeDeep(
  objectA: Record<string, unknown>,
  objectB: Record<string, unknown>
): Record<string, unknown> {
  let mergedObjects: Record<string, unknown> = {}

  for (let currentObject of [objectA, objectB]) {
    for (let key of objectKeys(currentObject)) {
      const valueA = mergedObjects[key]
      const valueB = currentObject[key]
      const areObjects = isObject(valueA) && isObject(valueB)

      mergedObjects[key] = areObjects
        ? objectsMergeDeep(
            valueA as Record<string, unknown>,
            valueB as Record<string, unknown>
          )
        : valueB
    }
  }

  return mergedObjects
}

/**
 * Функция для проверки, является ли событие событием мыши.
 * @param {PointerEventType} evt - Событие.
 * @param {WindowType} ownerWindow - Объект окна.
 * @returns {boolean} Возвращает true, если событие является событием мыши, иначе false.
 */
export function isMouseEvent(
  evt: PointerEventType,
  ownerWindow: WindowType
): evt is MouseEvent {
  return (
    typeof ownerWindow.MouseEvent !== 'undefined' &&
    evt instanceof ownerWindow.MouseEvent
  )
}
