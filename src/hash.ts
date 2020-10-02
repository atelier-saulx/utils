export const stringHash = (str: string, hash: number = 5381): number => {
  var i = str.length
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash
}

const hashKey = (key: string, hash: number = 5381): number => {
  return stringHash(key, hash) * 5381
}

const hashNumber = (nr: number, hash: number = 5381): number => {
  return ((hash * 33) ^ nr) * 5381
}

const hashBool = (val: boolean, hash: number = 5381): number => {
  return ((hash * 33) ^ (val === true ? 1 : 0)) * 5381 * 33
}

const nullHash = 5381 * 33

// ignore key order
export const hashObjectIgnoreKeyOrderNest = (
  obj: object | any[],
  hash: number = 5381
): number => {
  if (obj.constructor === Array) {
    hash = hashNumber(obj.length + 1, hash)
    for (let i = 0; i < obj.length; i++) {
      const field = obj[i]
      const type = typeof field
      if (type === 'string') {
        hash = stringHash(field, hash) ^ hashNumber(i, hash)
      } else if (type === 'number') {
        hash = hashNumber(field, hash) ^ hashNumber(i, hash)
      } else if (type === 'object') {
        if (field === null) {
          hash = nullHash ^ hashNumber(i, hash)
        } else {
          hash =
            (hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
            hashNumber(i, hash)
        }
      } else if (type === 'boolean') {
        hash = hashBool(field, hash) ^ hashNumber(i, hash)
      }
    }
  } else {
    // super slow
    const keys = Object.keys(obj).sort()
    hash = hashNumber(keys.length + 1, hash)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const field = obj[key]
      const type = typeof field
      if (type === 'string') {
        hash = stringHash(field, hash) ^ hashKey(key, hash)
      } else if (type === 'number') {
        hash = hashNumber(field, hash) ^ hashKey(key, hash)
      } else if (type === 'object') {
        if (field === null) {
          hash = nullHash ^ hashKey(key, hash)
        } else {
          hash =
            (hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
            hashKey(key, hash)
        }
      } else if (type === 'boolean') {
        hash = hashBool(field, hash) ^ hashKey(key, hash)
      }
    }
  }
  return hash
}

export const hashObjectNest = (obj: object | any[], hash = 5381): number => {
  if (obj.constructor === Array) {
    for (let i = 0; i < obj.length; i++) {
      const field = obj[i]
      const type = typeof field
      if (type === 'string') {
        hash = stringHash(field, hash) ^ hashNumber(i, hash)
      } else if (type === 'number') {
        hash = hashNumber(field, hash) ^ hashNumber(i, hash)
      } else if (type === 'object') {
        if (field === null) {
          hash = nullHash ^ hashNumber(i, hash)
        } else {
          hash =
            (hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
            hashNumber(i, hash)
        }
      } else if (type === 'boolean') {
        hash = hashBool(field, hash) ^ hashNumber(i, hash)
      }
    }
  } else {
    for (let key in obj) {
      const field = obj[key]
      const type = typeof field
      if (type === 'string') {
        hash = stringHash(field, hash) ^ hashKey(key, hash)
      } else if (type === 'number') {
        hash = hashNumber(field, hash) ^ hashKey(key, hash)
      } else if (type === 'object') {
        if (field === null) {
          hash = nullHash ^ hashKey(key, hash)
        } else {
          hash =
            (hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
            hashKey(key, hash)
        }
      } else if (type === 'boolean') {
        hash = hashBool(field, hash) ^ hashKey(key, hash)
      }
    }
  }
  return hash
}

export const hashObject = (props: object): number => {
  return hashObjectNest(props) >>> 0
}

export const hashObjectIgnoreKeyOrder = (props: object): number => {
  return hashObjectIgnoreKeyOrderNest(props) >>> 0
}

export const hash = (val: any): number => {
  if (typeof val === 'object') {
    if (val === null) {
      return 0
    } else {
      return hashObject(val) >>> 0
    }
  } else {
    if (typeof val === 'number') {
      return (nullHash ^ val) >>> 0
    } else {
      return stringHash(val) >>> 0
    }
  }
}
