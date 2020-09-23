const deepCopy = (a: object): object => {
    const r = a.constructor === Array ? [] : {}
    for (let k in a) {
      if (a[k] !== null && typeof a[k] === 'object') {
        r[k] = deepCopy(a[k])
      } else {
        r[k] = a[k]
      }
    }
    return r
  }

  export default deepCopy