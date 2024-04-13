import type { EngineType } from './Engine.ts'
import { EventStore } from './EventStore.ts'
import { mathAbs, type WindowType } from './utils.ts'

export type AnimationsUpdateType = (engine: EngineType) => void
export type AnimationsRenderType = (engine: EngineType, lagOffset: number) => void

export type AnimationsType = ReturnType<typeof Animations>
/**
 * Экспортируемая функция Animations, которая создает объект для управления анимациями.
 * @param {Document} ownerDocument - Документ, владеющий анимацией.
 * @param {WindowType} ownerWindow - Окно, владеющее анимацией.
 * @param {AnimationsType['update']} update - Функция обновления анимации.
 * @param {AnimationsType['render']} render - Функция рендеринга анимации.
 * @returns {AnimationsType} Возвращает объект Animations.
 */
export function Animations(
  ownerDocument: Document,
  ownerWindow: WindowType,
  update: () => void,
  render: (lagOffset: number) => void
) {
  const documentVisibleHandler = EventStore()
  const timeStep = 1000 / 60
  let lastTimeStamp: number | null = null
  let lag = 0
  let animationFrame = 0

  /**
   * Инициализирует анимацию.
   */
  function init(): void {
    documentVisibleHandler.add(ownerDocument, 'visibilitychange', () => {
      if (ownerDocument.hidden) reset()
    })
  }

  /**
   * Уничтожает анимацию.
   */
  function destroy(): void {
    stop()
    documentVisibleHandler.clear()
  }

  /**
   * Выполняет анимацию.
   * @param {DOMHighResTimeStamp} timeStamp - Временная метка анимации.
   */
  function animate(timeStamp: DOMHighResTimeStamp): void {
    if (!animationFrame) return
    if (!lastTimeStamp) lastTimeStamp = timeStamp

    const elapsed = timeStamp - lastTimeStamp
    lastTimeStamp = timeStamp
    lag += elapsed

    while (lag >= timeStep) {
      update()
      lag -= timeStep
    }

    const lagOffset = mathAbs(lag / timeStep)
    render(lagOffset)

    if (animationFrame) ownerWindow.requestAnimationFrame(animate)
  }

  /**
   * Запускает анимацию.
   */
  function start(): void {
    if (animationFrame) return

    animationFrame = ownerWindow.requestAnimationFrame(animate)
  }

  /**
   * Останавливает анимацию.
   */
  function stop(): void {
    ownerWindow.cancelAnimationFrame(animationFrame)
    lastTimeStamp = null
    lag = 0
    animationFrame = 0
  }

  /**
   * Сбрасывает анимацию.
   */
  function reset(): void {
    lastTimeStamp = null
    lag = 0
  }

  const self = {
    init,
    destroy,
    start,
    stop,
    update,
    render
  } as const

  return self
}
