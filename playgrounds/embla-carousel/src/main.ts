import { type EmblaOptionsType, type EmblaCarouselType, useEmblaCarousel } from '@teleskop150750/embla-carousel'
import './styles/base.css'
import './styles/embla.css'
import './styles/sandbox.css'


const OPTIONS: EmblaOptionsType = { slidesToScroll: 'auto' }

const emblaNode = document.querySelector<HTMLElement>('.embla')!
const viewportNode = emblaNode.querySelector<HTMLElement>('.embla__viewport')!
const prevBtnNode = emblaNode.querySelector<HTMLElement>('.embla__button--prev')!
const nextBtnNode = emblaNode.querySelector<HTMLElement>('.embla__button--next')!
// const dotsNode = <HTMLElement>emblaNode.querySelector('.embla__dots')

const emblaApi = useEmblaCarousel(viewportNode, OPTIONS)
console.log(emblaApi)

// const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(emblaApi, prevBtnNode, nextBtnNode)
// const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(emblaApi, dotsNode)

// emblaApi.on('destroy', removePrevNextBtnsClickHandlers)
// emblaApi.on('destroy', removeDotBtnsAndClickHandlers)

addPrevNextBtnsClickHandlers(emblaApi, prevBtnNode, nextBtnNode)

function addTogglePrevNextBtnsActive (
  emblaApi: EmblaCarouselType,
  prevBtn: HTMLElement,
  nextBtn: HTMLElement
): (() => void)  {
  const togglePrevNextBtnsState = (): void => {
    if (emblaApi.canScrollPrev()) prevBtn.removeAttribute('disabled')
    else prevBtn.setAttribute('disabled', 'disabled')

    if (emblaApi.canScrollNext()) nextBtn.removeAttribute('disabled')
    else nextBtn.setAttribute('disabled', 'disabled')
  }

  emblaApi
    .on('select', togglePrevNextBtnsState)
    .on('init', togglePrevNextBtnsState)
    .on('reInit', togglePrevNextBtnsState)

  return (): void => {
    prevBtn.removeAttribute('disabled')
    nextBtn.removeAttribute('disabled')
  }
}

function addPrevNextBtnsClickHandlers(
  emblaApi: EmblaCarouselType,
  prevBtn: HTMLElement,
  nextBtn: HTMLElement
) {
  const scrollPrev = (): void => {
    console.log('scrollPrev')
    emblaApi.scrollPrev()
  }
  const scrollNext = (): void => {
    console.log('scrollNext')
    emblaApi.scrollNext()
  }
  prevBtn.addEventListener('click', scrollPrev, false)
  nextBtn.addEventListener('click', scrollNext, false)

  const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
    emblaApi,
    prevBtn,
    nextBtn
  )

  return (): void => {
    removeTogglePrevNextBtnsActive()
    prevBtn.removeEventListener('click', scrollPrev, false)
    nextBtn.removeEventListener('click', scrollNext, false)
  }
}
