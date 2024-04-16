import { mathSign, mathAbs } from './utils.ts'
import type { Vector1DType } from './useVector1D.ts'

export type ScrollBodyType = ReturnType<typeof useScrollBody>

/**
 * Хук, который обеспечивает поведение прокрутки для прокручиваемого тела.
 *
 * @param location - Текущее положение прокручиваемого тела.
 * @param offsetLocation - Смещенное положение прокручиваемого тела.
 * @param target - Целевое положение прокручиваемого тела.
 * @param baseDuration - Базовая продолжительность анимации прокрутки.
 * @param baseFriction - Базовое трение анимации прокрутки.
 * @returns Объект, содержащий функции и свойства, связанные с поведением прокрутки.
 */
export function useScrollBody(
  location: Vector1DType,
  offsetLocation: Vector1DType,
  target: Vector1DType,
  baseDuration: number,
  baseFriction: number
) {
  let bodyVelocity = 0
  let scrollDirection = 0
  let scrollDuration = baseDuration
  let scrollFriction = baseFriction
  let rawLocation = location.get()
  let rawLocationPrevious = 0

  /**
   * Перемещает прокручиваемое тело к целевому положению.
   *
   * @returns Текущий экземпляр прокручиваемого тела.
   */
  function seek(): ScrollBodyType {
    const diff = target.get() - location.get()
    const isInstant = !scrollDuration
    let directionDiff = 0

    if (isInstant) {
      bodyVelocity = 0
      location.set(target)

      directionDiff = diff
    } else {
      bodyVelocity += diff / scrollDuration
      bodyVelocity *= scrollFriction
      rawLocation += bodyVelocity
      location.add(bodyVelocity)

      directionDiff = rawLocation - rawLocationPrevious
    }

    scrollDirection = mathSign(directionDiff)
    rawLocationPrevious = rawLocation

    return self
  }

  /**
   * Проверяет, установилось ли прокручиваемое тело в целевом положении.
   *
   * @returns Булево значение, указывающее, установилось ли прокручиваемое тело.
   */
  function settled(): boolean {
    const diff = target.get() - offsetLocation.get()

    return mathAbs(diff) < 0.001
  }

  /**
   * Возвращает текущую продолжительность анимации прокрутки.
   *
   * @returns Текущая продолжительность анимации прокрутки.
   */
  function duration(): number {
    return scrollDuration
  }

  /**
   * Возвращает текущее направление прокручиваемого тела.
   *
   * @returns Текущее направление прокручиваемого тела.
   */
  function direction(): number {
    return scrollDirection
  }

  /**
   * Возвращает текущую скорость прокручиваемого тела.
   *
   * @returns Текущая скорость прокручиваемого тела.
   */
  function velocity(): number {
    return bodyVelocity
  }

  /**
   * Устанавливает базовую продолжительность анимации прокрутки.
   *
   * @returns Текущий экземпляр прокручиваемого тела.
   */
  function useBaseDuration(): ScrollBodyType {
    return useDuration(baseDuration)
  }

  /**
   * Устанавливает базовое трение анимации прокрутки.
   *
   * @returns Текущий экземпляр прокручиваемого тела.
   */
  function useBaseFriction(): ScrollBodyType {
    return useFriction(baseFriction)
  }

  /**
   * Устанавливает продолжительность анимации прокрутки.
   *
   * @param n - Продолжительность анимации прокрутки.
   * @returns Текущий экземпляр прокручиваемого тела.
   */
  function useDuration(n: number): ScrollBodyType {
    scrollDuration = n

    return self
  }

  /**
   * Устанавливает трение анимации прокрутки.
   *
   * @param n - Трение анимации прокрутки.
   * @returns Текущий экземпляр прокручиваемого тела.
   */
  function useFriction(n: number): ScrollBodyType {
    scrollFriction = n

    return self
  }

  const self = {
    direction,
    duration,
    velocity,
    seek,
    settled,
    useBaseFriction,
    useBaseDuration,
    useFriction,
    useDuration
  } as const

  return self
}
