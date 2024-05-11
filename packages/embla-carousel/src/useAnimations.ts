// import type { EngineType } from './useEngine.ts'
import { useEventStore } from './useEventStore.ts'
import { mathAbs, type WindowType } from './utils.ts'

export type AnimationsType = ReturnType<typeof useAnimations>

/**
 * Экспортируемая функция Animations, которая создает объект для управления анимациями.
 *
 * @param $ownerDocument - Документ, владеющий анимацией.
 * @param $ownerWindow - Окно, владеющее анимацией.
 * @param update - Функция обновления анимации.
 * @param render - Функция рендеринга анимации.
 * @returns  Возвращает объект Animations.
 */
export function useAnimations(
  $ownerDocument: Document,
  $ownerWindow: WindowType,
  update: () => void,
  render: (lagOffset: number) => void
) {
  const documentVisibleHandler = useEventStore()
  const timeStep = 1000 / 60
  let lastTimeStamp: number | null = null
  let lag = 0
  let animationFrame = 0

  let table: Array<{
    s_lag: number
    lag: number
    timeStep: number
    lastTimeStamp: number | null
    timeStamp: number
    elapsed: number
  }> = []

  /**
   * Инициализирует анимацию.
   */
  function init(): void {
    documentVisibleHandler.add($ownerDocument, 'visibilitychange', () => {
      if ($ownerDocument.hidden) reset()
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
   *
   * @param timeStamp - Временная метка анимации.
   */
  function animate(timeStamp: DOMHighResTimeStamp): void {
    if (!animationFrame) return
    if (!lastTimeStamp) lastTimeStamp = timeStamp

    const elapsed = timeStamp - lastTimeStamp
    const s_lag = lag
    lastTimeStamp = timeStamp
    lag += elapsed

    table.push({
      s_lag: s_lag,
      lag: lag,
      timeStep: timeStep,
      lastTimeStamp: lastTimeStamp,
      timeStamp: timeStamp,
      elapsed: elapsed
    })

    while (lag >= timeStep) {
      update()
      lag -= timeStep
    }

    const lagOffset = mathAbs(lag / timeStep)
    render(lagOffset)

    if (animationFrame) $ownerWindow.requestAnimationFrame(animate)
  }

  /**
   * Запускает анимацию.
   */
  function start(): void {
    if (animationFrame) return

    table = []
    animationFrame = $ownerWindow.requestAnimationFrame(animate)
  }

  /**
   * Останавливает анимацию.
   */
  function stop(): void {
    console.table(table)
    $ownerWindow.cancelAnimationFrame(animationFrame)
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
