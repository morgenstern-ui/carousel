import type { LimitType } from './useLimit.ts'
import type { Vector1DType } from './useVector1D.ts'
import { arrayLast, mathAbs, mathSign } from './utils.ts'

/**
 * Представляет цель прокрутки.
 */
export type TargetType = {
  distance: number
  index: number
}

/**
 * Представляет операции с целью прокрутки.
 */
export type ScrollTargetType = ReturnType<typeof useScrollTarget>

/**
 * Создает объект цели прокрутки.
 * @param loop - Прокрутка зациклена или нет.
 * @param scrollSnaps - Позиции привязки прокрутки.
 * @param contentSize - Размер содержимого прокрутки.
 * @param limit - Ограничение прокрутки.
 * @param targetVector - Вектор цели.
 * @returns Объект цели прокрутки.
 */
export function useScrollTarget(
  loop: boolean,
  scrollSnaps: number[],
  contentSize: number,
  limit: LimitType,
  targetVector: Vector1DType
) {
  const { reachedAny, removeOffset, constrain } = limit

  /**
   * Вычисляет цель прокрутки на основе целевого индекса и направления.
   * @param index - Целевой индекс.
   * @param direction - Направление прокрутки.
   * @returns Цель прокрутки.
   */
  function byIndex(index: number, direction: number): TargetType {
    const diffToSnap = scrollSnaps[index] - targetVector.get()
    const distance = shortcut(diffToSnap, direction)

    return { index, distance }
  }

  /**
    * Вычисляет цель прокрутки на основе расстояния и опции привязки.
    * @param distance - Расстояние для прокрутки.
    * @param snap - Привязываться ли к ближайшей привязке прокрутки.
    * @returns Цель прокрутки.
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

  /**
   * Вычисляет цель прокрутки на основе целевого индекса и направления.
   * @param target - Целевой индекс.
   * @param direction - Направление прокрутки.
   * @returns Цель прокрутки.
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
   * Вычисляет минимальное расстояние из массива расстояний.
   * @param distances - Массив расстояний.
   * @returns Минимальное расстояние.
   */
  function minDistance(distances: number[]): number {
    return distances.sort((a, b) => mathAbs(a) - mathAbs(b))[0]
  }

  /**
   * Находит целевую привязку на основе целевой позиции.
   * @param target - Целевая позиция.
   * @returns Целевая привязка.
   */
  function findTargetSnap(target: number): TargetType {
    const distance = loop ? removeOffset(target) : constrain(target)
    const ascDiffsToSnaps = scrollSnaps
      .map((snap, index) => ({ diff: shortcut(snap - distance, 0), index }))
      .sort((d1, d2) => mathAbs(d1.diff) - mathAbs(d2.diff))

    const { index } = ascDiffsToSnaps[0]
    return { index, distance }
  }

  const self = {
    byIndex,
    byDistance,
    shortcut
  } as const

  return self
}
