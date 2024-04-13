import { useLimit } from './Limit'

const limit = useLimit(0, 10)
console.log('Hello, world!', limit.removeOffset(15))
