import { useLimit } from './useLimit'

const limit = useLimit(0, 10)
console.log('Hello, world!', limit.removeOffset(15))
