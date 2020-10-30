import { hashObjectIgnoreKeyOrder } from './hash'

type Listener = (result: { returnValue?: any; err?: Error }) => {}

const defaultMemoize = (...args: any[]) => {
  // go trough all args

  const x = hashObjectIgnoreKeyOrder(args)
  console.log(x)
  return x
}

// function map<T, K>(list: T[], fn(x: T => K): K[]

export default function queued<T, R>(
  promiseFn: (...args: any[]) => Promise<any>,
  opts: {
    concurrency?: number
    memoize?: (...args: any[]) => any
  } = {}
): <T>(...args: any[]) => Promise<any> {
  // default options
  if (!opts.memoize) {
    opts.memoize = defaultMemoize
  }

  if (!opts.concurrency) {
    opts.concurrency = 1
  }

  const listeners: {
    [key: string]: Listener[]
  } = {}

  let inProgress: boolean = false

  const drain = () => {}

  return <T>(...args: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      // here we make the function
      console.log('yesh')
      promiseFn(...args)
        .then(resolve)
        .catch(reject)
    })
  }
}
