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

export default function queued<A, B, C, D, E, F, G, H>(
  promiseFn: (
    a?: A,
    b?: B,
    c?: C,
    d?: D,
    e?: E,
    f?: F,
    g?: G,
    h?: H
  ) => Promise<H>,
  opts: {
    concurrency?: number
    dedup?: (...args: any[]) => number | string
  } = {}
): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H) => Promise<H> {
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

  return (a, b, c, d, e, f, g, h): Promise<any> => {
    return new Promise((resolve, reject) => {
      let args: any[]
      // this beauty is there for type script so args.length will still be correct
      // (typescript does not support inheriting types from args directly...)
      if (h !== undefined) {
        args = [a, b, c, d, e, f, g, h]
      } else if (g !== undefined) {
        args = [a, b, c, d, e, f, g]
      } else if (f !== undefined) {
        args = [a, b, c, d, e, f]
      } else if (e !== undefined) {
        args = [a, b, c, d, e]
      } else if (d !== undefined) {
        args = [a, b, c, d]
      } else if (c !== undefined) {
        args = [a, b, c]
      } else if (b !== undefined) {
        args = [a, b]
      } else if (a !== undefined) {
        args = [a]
      } else {
        args = []
      }
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
