import type { CreateOptionsType } from '@teleskop150750/embla-carousel/options'

export type OptionsType = CreateOptionsType<{
  rowSelector: string

  // delay: number
  // jump: boolean
  // playOnInit: boolean
  // stopOnFocusIn: boolean
  // stopOnInteraction: boolean
  // stopOnMouseEnter: boolean
  // stopOnLastSnap: boolean
  // rootNode: ((emblaRoot: HTMLElement) => HTMLElement | null) | null
}>

export const defaultOptions: OptionsType = {
  active: true,
  breakpoints: {},
  rowSelector: '.embla__container',

  // active: true,
  // breakpoints: {},
  // delay: 4000,
  // jump: false,
  // playOnInit: true,
  // stopOnFocusIn: true,
  // stopOnInteraction: true,
  // stopOnMouseEnter: false,
  // stopOnLastSnap: false,
  // rootNode: null
}
