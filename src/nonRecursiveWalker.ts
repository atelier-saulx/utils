export const nonRecursiveWalker = (
  obj: any,
  fn: (target: any, path: string[], type: number) => void,
  targetObjects?: boolean
) => {
  if (typeof obj !== 'object') {
    return
  }
  if (typeof fn !== 'function') {
    throw new Error('fn must be a function')
  }

  const stack = new Array<[target: any, path: string[]]>()

  stack.push([obj, []])

  while (stack.length) {
    for (const key in stack[0][0]) {
      if (typeof stack[0][0][key] === 'object') {
        stack.push([stack[0][0][key], stack[0][1].concat(key)])
        if (targetObjects) {
          fn(stack[0][0][key], stack[0][1].concat(key), 1)
        }
      } else {
        fn(stack[0][0][key], stack[0][1].concat(key), 0)
      }
    }
    stack.shift()
  }
}
