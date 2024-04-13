import { mathSign, mathAbs } from './utils.ts'
import type { Vector1DType } from './Vector1d.ts'

export type ScrollBodyType = ReturnType<typeof ScrollBody>

/**
 * Функция для создания объекта прокрутки.
 * @param {Vector1DType} location - Текущее положение.
 * @param {Vector1DType} offsetLocation - Смещение положения.
 * @param {Vector1DType} target - Целевое положение.
 * @param {number} baseDuration - Базовая продолжительность прокрутки.
 * @param {number} baseFriction - Базовое трение прокрутки.
 * @returns {ScrollBodyType} Возвращает объект прокрутки.
 */
export function ScrollBody(
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
   * Функция для поиска целевого положения.
   * @returns {ScrollBodyType} Возвращает объект прокрутки.
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
   * Функция для проверки, достигнуто ли целевое положение.
   * @returns {boolean} Возвращает true, если целевое положение достигнуто, иначе false.
   */
  function settled(): boolean {
    const diff = target.get() - offsetLocation.get()

    return mathAbs(diff) < 0.001
  }

  /**
   * Функция для получения продолжительности прокрутки.
   * @returns {number} Возвращает продолжительность прокрутки.
   */
  function duration(): number {
    return scrollDuration
  }

  /**
   * Функция для получения направления прокрутки.
   * @returns {number} Возвращает направление прокрутки.
   */
  function direction(): number {
    return scrollDirection
  }

  /**
   * Функция для получения скорости прокрутки.
   * @returns {number} Возвращает скорость прокрутки.
   */
  function velocity(): number {
    return bodyVelocity
  }

  /**
   * Функция для использования базовой продолжительности прокрутки.
   * @returns {ScrollBodyType} Возвращает объект прокрутки.
   */
  function useBaseDuration(): ScrollBodyType {
    return useDuration(baseDuration)
  }

  /**
   * Функция для использования базового трения прокрутки.
   * @returns {ScrollBodyType} Возвращает объект прокрутки.
   */
  function useBaseFriction(): ScrollBodyType {
    return useFriction(baseFriction)
  }

  /**
   * Функция для установки продолжительности прокрутки.
   * @param {number} n - Новая продолжительность прокрутки.
   * @returns {ScrollBodyType} Возвращает объект прокрутки.
   */
  function useDuration(n: number): ScrollBodyType {
    scrollDuration = n

    return self
  }

  /**
   * Функция для установки трения прокрутки.
   * @param {number} n - Новое трение прокрутки.
   * @returns {ScrollBodyType} Возвращает объект прокрутки.
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
