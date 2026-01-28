import type { CreateOptionsType } from '@teleskop150750/embla-carousel/options'

export type OptionsType = CreateOptionsType<{
  rowSelector: string
}>

export const defaultOptions: OptionsType = {
  active: true,
  breakpoints: {},
  rowSelector: '.embla__container',
}
