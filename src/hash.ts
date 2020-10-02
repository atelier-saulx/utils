export const stringHash = (str, hash = 5381): number => {
  var i = str.length
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash
}

// ignore key order

export const hashObjectIgnoreKeyOrderNest = (obj, hash = 5381): number => {
  if (obj.constructor === Array) {
    for (let key in obj) {
      const field = obj[key]
      const type = typeof field
      if (type === 'string') {
        hash = (stringHash(field, hash) * 33) ^ (stringHash(key, hash) * 33)
      } else if (type === 'number') {
        hash = (((hash * 33) ^ field) * 33) ^ (stringHash(key, hash) * 33)
      } else if (type === 'object') {
        if (field === null) {
          hash = 5381 ^ (stringHash(key, hash) * 33)
        } else {
          hash =
            (hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
            (stringHash(key, hash) * 33)
        }
      } else if (type === 'boolean') {
        hash =
          (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^
          (stringHash(key, hash) * 33)
      }
    }
  } else {
    // super slow
    const keys = Object.keys(obj).sort()
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const field = obj[key]
      const type = typeof field
      if (type === 'string') {
        hash = (stringHash(field, hash) * 33) ^ (stringHash(key, hash) * 33)
      } else if (type === 'number') {
        hash = (((hash * 33) ^ field) * 33) ^ (stringHash(key, hash) * 33)
      } else if (type === 'object') {
        if (field === null) {
          hash = 5381 ^ (stringHash(key, hash) * 33)
        } else {
          hash =
            (hashObjectIgnoreKeyOrderNest(field, hash) * 33) ^
            (stringHash(key, hash) * 33)
        }
      } else if (type === 'boolean') {
        hash =
          (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^
          (stringHash(key, hash) * 33)
      }
    }
  }
  return hash
}

export const hashObjectNest = (obj, hash = 5381): number => {
  for (let key in obj) {
    const field = obj[key]
    const type = typeof field
    if (type === 'string') {
      hash = (stringHash(field, hash) * 33) ^ (stringHash(key, hash) * 33)
    } else if (type === 'number') {
      hash = (((hash * 33) ^ field) * 33) ^ (stringHash(key, hash) * 33)
    } else if (type === 'object') {
      if (field === null) {
        hash = 5381 ^ (stringHash(key, hash) * 33)
      } else {
        hash = (hashObjectNest(field, hash) * 33) ^ (stringHash(key, hash) * 33)
      }
    } else if (type === 'boolean') {
      hash =
        (((hash * 33) ^ (field === true ? 1 : 0)) * 33) ^
        (stringHash(key, hash) * 33)
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
      return ((5381 * 33) ^ val) >>> 0
    } else {
      return stringHash(val) >>> 0
    }
  }
}
