import { vi } from 'vitest'

// Object.defineProperty(window, 'matchMedia', {
//   writable: true,
//   value: vi.fn().mockImplementation((query) => {
//     return {
//       matches: matchingMediaQueries.includes(query),
//       media: query,
//       onchange: null,
//       addListener: vi.fn(), // deprecated
//       removeListener: vi.fn(), // deprecated
//       addEventListener: vi.fn(),
//       removeEventListener: vi.fn(),
//       dispatchEvent: vi.fn()
//     }
//   }),
// })

const matchMediaMock = vi.fn((query) => ({
  matches: matchingMediaQueries.includes(query),
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}))

vi.stubGlobal('matchMedia', matchMediaMock)

let matchingMediaQueries: string[] = []

export function setMatchingMediaQuery(queries: string | string[]): void {
  matchingMediaQueries = Array.isArray(queries) ? queries : [queries]
}

export function resetMatchingMediaQuery(): void {
  matchingMediaQueries = []
}
