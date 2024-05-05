import { type EmblaOptionsType, useEmblaCarousel } from '@teleskop150750/embla-carousel-core'
import './styles/base.css'
import './styles/embla.css'
import './styles/sandbox.css'


const OPTIONS: EmblaOptionsType = { slidesToScroll: 'auto' }

const emblaNode = document.querySelector<HTMLElement>('.embla')!
const viewportNode = emblaNode.querySelector<HTMLElement>('.embla__viewport')!
// const prevBtnNode = <HTMLElement>emblaNode.querySelector('.embla__button--prev')
// const nextBtnNode = <HTMLElement>emblaNode.querySelector('.embla__button--next')
// const dotsNode = <HTMLElement>emblaNode.querySelector('.embla__dots')

const emblaApi = useEmblaCarousel(viewportNode, OPTIONS)
console.log(emblaApi)

// const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(emblaApi, prevBtnNode, nextBtnNode)
// const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(emblaApi, dotsNode)

// emblaApi.on('destroy', removePrevNextBtnsClickHandlers)
// emblaApi.on('destroy', removeDotBtnsAndClickHandlers)
