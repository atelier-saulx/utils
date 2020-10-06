const merge = (target: any, source: any) => {
  if (
    target &&
    typeof target === 'object' &&
    source &&
    typeof source === 'object'
  ) {
    if (source.constructor === Array) {
      for (let i = 0; i < source.length; i++) {
        if (i in target) {
          if (
            target[i] &&
            typeof target[i] === 'object' &&
            source[i] &&
            typeof source[i] === 'object'
          ) {
            merge(target[i], source[i])
          } else {
            target[i] = source[i]
          }
        } else {
          target[i] = source[i]
        }
      }
    } else {
      for (const i in source) {
        if (i in target) {
          if (
            target[i] &&
            typeof target[i] === 'object' &&
            source[i] &&
            typeof source[i] === 'object'
          ) {
            merge(target[i], source[i])
          } else {
            target[i] = source[i]
          }
        } else {
          target[i] = source[i]
        }
      }
    }
  }
}

export function deepMergeArrays(target: any, ...sources: any[]): any {
  if (!sources.length) return target
  if (sources.length === 1) {
    merge(target, sources[0])
    return target
  }
  for (let i = 0; i < sources.length; i++) {
    merge(target, sources[i])
  }
  return target
}

const mergeExcludeArray = (target: any, source: any): any => {
  if (
    target &&
    typeof target === 'object' &&
    source &&
    typeof source === 'object'
  ) {
    if (source.constructor === Array || target.constructor === Array) {
      return source
    } else {
      for (const i in source) {
        if (i in target) {
          if (
            target[i] &&
            source[i] &&
            typeof target[i] === 'object' &&
            target[i].constructor !== Array &&
            typeof source[i] === 'object' &&
            source[i].constructor !== Array
          ) {
            const a = mergeExcludeArray(target[i], source[i])
            if (a !== target[i]) {
              target[i] = a
            }
          } else {
            target[i] = source[i]
          }
        } else {
          target[i] = source[i]
        }
      }
    }
  }
  return target
}

export function deepMerge(target: any, ...sources: any[]): any {
  if (!sources.length) return target
  if (sources.length === 1) {
    return mergeExcludeArray(target, sources[0])
  }
  for (let i = 0; i < sources.length; i++) {
    const a = mergeExcludeArray(target, sources[i])
    if (a !== target) {
      target = a
    }
  }
  return target
}
