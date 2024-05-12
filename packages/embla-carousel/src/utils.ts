import type { PointerEventType } from './useDragTracker.ts'

export type WindowType = Window & typeof globalThis

/**
 * Функция для проверки, является ли переданный аргумент числом.
 * @param subject - Проверяемый аргумент.
 * @returns Возвращает true, если аргумент является числом, иначе false.
 */
export function isNumber(subject: unknown): subject is number {
  return typeof subject === 'number'
}

/**
 * Функция для проверки, является ли переданный аргумент строкой.
 * @param subject - Проверяемый аргумент.
 * @returns Возвращает true, если аргумент является строкой, иначе false.
 */
export function isString(subject: unknown): subject is string {
  return typeof subject === 'string'
}

/**
 * Функция для проверки, является ли переданный аргумент булевым значением.
 * @param subject - Проверяемый аргумент.
 * @returns Возвращает true, если аргумент является булевым значением, иначе false.
 */
export function isBoolean(subject: unknown): subject is boolean {
  return typeof subject === 'boolean'
}

/**
 * Функция для проверки, является ли переданный аргумент объектом.
 * @param subject - Проверяемый аргумент.
 * @returns Возвращает true, если аргумент является объектом, иначе false.
 */
export function isObject(subject: unknown): subject is Record<string, unknown> {
  return Object.prototype.toString.call(subject) === '[object Object]'
}

/**
 * Функция для получения абсолютного значения числа.
 * @param n - Число.
 * @returns Возвращает абсолютное значение числа.
 */
export const mathAbs = Math.abs

/**
 * Функция для получения знака числа.
 * @param n - Число.
 * @returns Возвращает 1, если число положительное, -1, если число отрицательное, и 0, если число равно нулю.
 */
export const mathSign = Math.sign

/**
 * Функция для получения абсолютного значения разности двух чисел.
 * @param valueB - Первое число.
 * @param valueA - Второе число.
 * @returns Возвращает абсолютное значение разности двух чисел.
 */
export function deltaAbs(valueB: number, valueA: number): number {
  return mathAbs(valueB - valueA)
}

/**
 * Функция для получения абсолютного значения фактора двух чисел.
 *
 * @param valueB - Первое число.
 * @param valueA - Второе число.
 * @returns Возвращает абсолютное значение фактора двух чисел.
 */
export function factorAbs(valueB: number, valueA: number): number {
  if (valueB === 0 || valueA === 0) return 0

  const absB = mathAbs(valueB)
  const absA = mathAbs(valueA)

  if (absB <= absA) return 0

  const diff = deltaAbs(absB, absA)

  return mathAbs(diff / valueB)
}

/**
 * Функция для получения ключей массива.
 *
 * @param array - Массив.
 * @returns Возвращает массив ключей.
 */
export function arrayKeys<Type>(array: Type[]): number[] {
  const result: number[] = [];
  const length = array.length;

  for (let i = 0; i < length; i++) {
    result.push(i);
  }

  return result;
}

/**
 * Функция для получения последнего элемента массива.
 *
 * @param array - Массив.
 * @returns Возвращает последний элемент массива.
 */
export function arrayLast<Type>(array: Type[]): Type {
  return array.at(-1)!
}

/**
 * Функция для получения индекса последнего элемента массива.
 *
 * @param array - Массив.
 * @returns Возвращает индекс последнего элемента массива.
 */
export function arrayLastIndex<Type>(array: Type[]): number {
  return Math.max(0, array.length - 1)
}

/**
 * Функция для проверки, является ли индекс последним в массиве.
 *
 * @param array - Массив.
 * @param index - Индекс.
 * @returns Возвращает true, если индекс является последним в массиве, иначе false.
 */
export function arrayIsLastIndex<Type>(array: Type[], index: number): boolean {
  return index === arrayLastIndex(array)
}

/**
 * Функция для создания массива из числа.
 *
 * @param n - Число.
 * @param startAt - Начальное значение (по умолчанию равно 0).
 * @returns Возвращает массив из числа.
 */
export function arrayFromNumber(n: number, startAt: number = 0): number[] {
  const result: number[] = []

  for (let i = 0; i < n; i++) {
    result[i] = startAt + i;
  }

  return result;
}

/**
 * Функция для получения ключей объекта.
 *
 * @param object - Объект.
 * @returns Возвращает массив ключей объекта.
 */
export function objectKeys<Type extends object>(object: Type): (keyof Type)[] {
  return Object.keys(object) as (keyof Type)[]
}

/**
 * Функция для глубокого слияния двух объектов.
 *
 * @param objectA - Первый объект.
 * @param objectB - Второй объект.
 * @returns Возвращает результат глубокого слияния двух объектов.
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
        ? objectsMergeDeep(valueA as Record<string, unknown>, valueB as Record<string, unknown>)
        : valueB
    }
  }

  return mergedObjects
}

/**
 * Функция для проверки, является ли событие событием мыши.
 *
 * @param evt - Событие.
 * @param ownerWindow - Объект окна.
 * @returns Возвращает true, если событие является событием мыши, иначе false.
 */
export function isMouseEvent(evt: PointerEventType, ownerWindow: WindowType): evt is MouseEvent {
  return typeof ownerWindow.MouseEvent !== 'undefined' && evt instanceof ownerWindow.MouseEvent
}
