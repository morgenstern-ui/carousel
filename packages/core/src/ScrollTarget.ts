import type { LimitType } from './Limit.ts'
import type { Vector1DType } from './Vector1d.ts'
import { arrayLast, mathAbs, mathSign } from './utils.ts'

export type TargetType = {
  distance: number
  index: number
}

export type ScrollTargetType = {
  byIndex: (target: number, direction: number) => TargetType
  byDistance: (force: number, snap: boolean) => TargetType
  shortcut: (target: number, direction: number) => number
}

/**
 * Функция для создания объекта цели прокрутки.
 * @param {boolean} loop - Флаг цикличности.
 * @param {number[]} scrollSnaps - Массив снимков прокрутки.
 * @param {number} contentSize - Размер содержимого.
 * @param {LimitType} limit - Объект ограничения.
 * @param {Vector1DType} targetVector - Объект вектора цели.
 * @returns {ScrollTargetType} Возвращает объект цели прокрутки.
 */
export function ScrollTarget(
  loop: boolean,
  scrollSnaps: number[],
  contentSize: number,
  limit: LimitType,
  targetVector: Vector1DType
): ScrollTargetType {
  const { reachedAny, removeOffset, constrain } = limit

  /**
   * Функция для нахождения минимального расстояния.
   * @param {number[]} distances - Массив расстояний.
   * @returns {number} Возвращает минимальное расстояние.
   */
  function minDistance(distances: number[]): number {
    return distances.concat().sort((a, b) => mathAbs(a) - mathAbs(b))[0]
  }
  /**
   * Функция для нахождения целевого снимка.
   * @param {number} target - Целевое значение.
   * @returns {TargetType} Возвращает объект цели.
   */
  function findTargetSnap(target: number): TargetType {
    const distance = loop ? removeOffset(target) : constrain(target)
    const ascDiffsToSnaps = scrollSnaps
      .map((snap, index) => ({ diff: shortcut(snap - distance, 0), index }))
      .sort((d1, d2) => mathAbs(d1.diff) - mathAbs(d2.diff))

    const { index } = ascDiffsToSnaps[0]
    return { index, distance }
  }

  /**
   * Функция для определения кратчайшего пути до цели.
   * @param {number} target - Целевое значение.
   * @param {number} direction - Направление.
   * @returns {number} Возвращает кратчайшее расстояние до цели.
   */
  function shortcut(target: number, direction: number): number {
    const targets = [target, target + contentSize, target - contentSize]

    if (!loop) return targets[0]
    if (!direction) return minDistance(targets)

    const matchingTargets = targets.filter((t) => mathSign(t) === direction)
    if (matchingTargets.length) return minDistance(matchingTargets)
    return arrayLast(targets) - contentSize
  }

  /**
   * Функция для определения цели по индексу.
   * @param {number} index - Индекс.
   * @param {number} direction - Направление.
   * @returns {TargetType} Возвращает объект цели.
   */
  function byIndex(index: number, direction: number): TargetType {
    const diffToSnap = scrollSnaps[index] - targetVector.get()
    const distance = shortcut(diffToSnap, direction)
    return { index, distance }
  }

  /**
   * Функция для определения цели по расстоянию.
   * @param {number} distance - Расстояние.
   * @param {boolean} snap - Флаг снимка.
   * @returns {TargetType} Возвращает объект цели.
   */
  function byDistance(distance: number, snap: boolean): TargetType {
    const target = targetVector.get() + distance
    const { index, distance: targetSnapDistance } = findTargetSnap(target)
    const reachedBound = !loop && reachedAny(target)

    if (!snap || reachedBound) return { index, distance }

    const diffToSnap = scrollSnaps[index] - targetSnapDistance
    const snapDistance = distance + shortcut(diffToSnap, 0)

    return { index, distance: snapDistance }
  }

  const self: ScrollTargetType = {
    byDistance,
    byIndex,
    shortcut
  } as const

  return self
}
