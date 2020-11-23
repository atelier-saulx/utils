export const stringHash = (str: string, hash: number = 5381): number => {
  var i = str.length
  while (i) {
    const char = str.charCodeAt(--i)
    hash = (hash * 33) ^ char
  }
  return hash
}

const hashKey = (key: string, hash: number = 5381): number => {
  return stringHash(key, hash) * 5381
}

const hashNumber = (nr: number, hash: number = 5381): number => {
  return ((hash * 33) ^ nr) * 6521
}

const hashBool = (val: boolean, hash: number = 5381): number => {
  return ((hash * 33) ^ (val === true ? 9907 : 4729)) * 7621
}

const nullHash = 6857 * 33

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
            (33 * hashObjectIgnoreKeyOrderNest(field, hash)) ^
            hashNumber(i, hash)
        }
      } else if (type === 'boolean') {
        hash = hashBool(field, hash) ^ hashNumber(i, hash)
      }
    }
  } else {
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
            (33 * hashObjectIgnoreKeyOrderNest(field, hash)) ^
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
          hash = (33 * hashObjectNest(field, hash)) ^ hashNumber(i, hash)
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
          hash = (33 * hashObjectNest(field, hash)) ^ hashKey(key, hash)
        }
      } else if (type === 'boolean') {
        hash = hashBool(field, hash) ^ hashKey(key, hash)
      }
    }
  }
  return hash
}

export const hashObject = (props: object): number => {
  return (hashObjectNest(props) >>> 0) * 4096 + hashObjectNest(props, 52711)
}

export const hashObjectIgnoreKeyOrder = (props: object): number => {
  return (
    (hashObjectIgnoreKeyOrderNest(props) >>> 0) * 4096 +
    (hashObjectIgnoreKeyOrderNest(props, 52711) >>> 0)
  )
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const toString = (hash: number): string => {
  let result: string = ''
  let mod: number
  do {
    mod = hash % 62
    result = chars.charAt(mod) + result
    hash = Math.floor(hash / 62)
  } while (hash > 0)
  return result
}

// want bits probably
export const hash = (val: any, size?: number): number => {
  let result: number
  if (typeof val === 'object') {
    if (val === null) {
      result = 0
    } else {
      result = hashObject(val)
    }
  } else {
    if (typeof val === 'boolean') {
      result = (hashBool(val) >>> 0) * 4096
    } else if (typeof val === 'number') {
      result = (hashNumber(val) >>> 0) * 4096 + (hashNumber(val, 52711) >>> 0)
    } else {
      result = (stringHash(val) >>> 0) * 4096 + (stringHash(val, 52711) >>> 0)
    }
  }

  if (size) {
    if (size < 10) {
      throw new Error('Minimum size for 32 bits is 10 numbers')
    }
    const len = Math.ceil(Math.log10(result + 1))
    if (len < size) {
      return result * Math.pow(10, size - len)
    }
  }

  return result
}

export const hashCompact = (val: any, size?: number): string => {
  let result: number
  if (typeof val === 'object') {
    if (val === null) {
      result = 0
    } else {
      if (size && size > 9 && val.constructor === Array) {
        let str = ''
        const arraySize = val.length
        for (let i = 0; i < arraySize; i++) {
          str += toString(hash(val[i]))
        }
        const len = str.length
        if (len < size) {
          str += 'x'
          if (len + 1 < size) {
            str += new Array(size - len).join('0')
          }
        } else if (len > size) {
          return str.slice(0, size)
        }
        return str
      } else {
        result = hashObject(val) >>> 0
      }
    }
  } else {
    if (typeof val === 'boolean') {
      result = hashBool(val) >>> 0
    } else if (typeof val === 'number') {
      result = ((nullHash ^ val) * 33) >>> 0
    } else {
      result = stringHash(val) >>> 0
    }
  }
  if (size < 6) {
    throw new Error('Minimum size for 32 bits is 6 characters')
  }
  let x = toString(result)
  const len = x.length
  if (len < size) {
    x += 'x'
    if (len + 1 < size) {
      x += new Array(size - len).join('0')
    }
  }
  return x
}
