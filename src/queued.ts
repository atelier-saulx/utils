import { hash, hashObjectIgnoreKeyOrder } from './hash'
import isPlainObject from 'is-plain-object'

type Listener = (r: any) => any

const defaultDedup = (...args: any[]): string | number => {
  let x = ''
  for (let arg of args) {
    if (arg !== undefined) {
      if (typeof arg === 'object') {
        if (Array.isArray(arg)) {
          x += hashObjectIgnoreKeyOrder(arg)
        } else if (isPlainObject(arg)) {
          x += hashObjectIgnoreKeyOrder(arg)
        }
      } else {
        x += hash(arg)
      }
    }
  }
  if (!x) {
    // random id
    return (~~(Math.random() * 99999)).toString(16)
  }
  return x
}

function queued<K>(
  promiseFn: () => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): () => Promise<K>
function queued<A, K>(
  promiseFn: (a?: A) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): (a?: A) => Promise<K>
function queued<A, B, K>(
  promiseFn: (a?: A, b?: B) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): (a?: A, b?: B) => Promise<K>
function queued<A, B, C, K>(
  promiseFn: (a?: A, b?: B, c?: C) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): (a?: A, b?: B, c?: C) => Promise<K>
function queued<A, B, C, D, K>(
  promiseFn: (a?: A, b?: B, c?: C, d?: D) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): (a?: A, b?: B, c?: C, d?: D) => Promise<K>
function queued<A, B, C, D, E, K>(
  promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): (a?: A, b?: B, c?: C, d?: D, e?: E) => Promise<K>
function queued<A, B, C, D, E, F, G, K>(
  promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G) => Promise<K>
function queued<A, B, C, D, E, F, K>(
  promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F) => Promise<K>
function queued<A, B, C, D, E, F, G, K>(
  promiseFn: (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G) => Promise<K>
function queued<A, B, C, D, E, F, G, H, K>(
  promiseFn: (
    a?: A,
    b?: B,
    c?: C,
    d?: D,
    e?: E,
    f?: F,
    g?: G,
    h?: H
  ) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H) => Promise<K>
function queued<A, B, C, D, E, F, G, H, I, K>(
  promiseFn: (
    a?: A,
    b?: B,
    c?: C,
    d?: D,
    e?: E,
    f?: F,
    g?: G,
    h?: H,
    i?: I
  ) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H, i?: I) => Promise<K>
function queued<A, B, C, D, E, F, G, H, I, J, K>(
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
    j?: J
  ) => Promise<K>,
  opts?: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  }
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
  j?: J
) => Promise<K>
function queued(
  promiseFn,
  opts: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  } = {}
) {
  // default options
  if (!opts.dedup) {
    opts.dedup = defaultDedup
  }

  if (!opts.concurrency) {
    opts.concurrency = 1
  }

  const listeners: {
    [key: string]: { args: any[]; listeners: Listener[][] }
  } = {}

  const keysInProgress: Set<string> = new Set()
  const drain = () => {
    for (let key in listeners) {
      if (keysInProgress.size === opts.concurrency) {
        break
      }
      if (!keysInProgress.has(key)) {
        const l = listeners[key]
        keysInProgress.add(key)
        // console.log('EXEC', 'conc', keysInProgress.size, key, l.args)
        promiseFn(...l.args)
          .then(v => {
            delete listeners[key]
            keysInProgress.delete(key)
            l.listeners.forEach(([resolve]) => {
              resolve(v)
            })
            drain()
          })
          .catch(err => {
            delete listeners[key]
            keysInProgress.delete(key)
            l.listeners.forEach(([, reject]) => {
              reject(err)
            })
            drain()
          })
        if (keysInProgress.size === opts.concurrency) {
          break
        }
      }
    }
  }

  return (...args) => {
    return new Promise((resolve, reject) => {
      const id = opts.dedup(...args)
      if (!listeners[id]) {
        listeners[id] = { args, listeners: [[resolve, reject]] }
      } else {
        listeners[id].listeners.push([resolve, reject])
      }
      if (keysInProgress.size < opts.concurrency) {
        drain()
      }
    })
  }
}

export default queued
