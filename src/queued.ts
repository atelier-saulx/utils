import { hash, hashObjectIgnoreKeyOrder } from './hash'
import isPlainObject from 'is-plain-object'

type Listener = (result: { returnValue?: any; err?: Error }) => {}

const defaultDedup = (...args: any[]): string | number => {
  let x = ''
  for (let arg of args) {
    if (typeof arg === 'object') {
      if (isPlainObject(arg)) {
        x += hashObjectIgnoreKeyOrder(arg)
      } else {
        console.log('ignore!')
      }
    } else {
      x += hash(arg)
    }
  }
  return x
}

export default function queued<A, B, C, D, E, F, G, H, I, J, K>(
  promiseFn: (
    a?: A,
    b?: B,
    c?: C,
    d?: D,
    e?: E,
    f?: F,
    g?: G,
    h?: H,
    i?: I,
    j?: J,
    k?: K
  ) => Promise<K>,
  opts: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  } = {}
): (
  a?: A,
  b?: B,
  c?: C,
  d?: D,
  e?: E,
  f?: F,
  g?: G,
  h?: H,
  i?: I,
  j?: J,
  k?: K
) => Promise<K> {
  // default options
  if (!opts.dedup) {
    opts.dedup = defaultDedup
  }

  if (!opts.concurrency) {
    opts.concurrency = 1
  }

  const listeners: {
    [key: string]: Listener[]
  } = {}

  let inProgress: boolean = false

  const drain = () => {}

  return (a, b, c, d, e, f, g, h, i, j): Promise<any> => {
    return new Promise((resolve, reject) => {
      // here we make the function
      const id = opts.dedup(a, b, c, d, e, f, g, h, i, j)
      console.log('yesh', id)

      promiseFn(a, b, c, d, e, f, g, h, i, j)
        .then(resolve)
        .catch(reject)
    })
  }
}
