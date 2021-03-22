import stringHash from './stringHash'
// ignore key order
const hashObjectIgnoreKeyOrderNest = (
  obj: object | any[],
  hash: number = 5381
): number => {
  if (obj.constructor === Array) {
    hash = stringHash('__len:' + obj.length + 1, hash)
    for (let i = 0; i < obj.length; i++) {
      const field = obj[i]
      const type = typeof field
      if (type === 'string') {
        hash = stringHash(i + ':' + field, hash)
      } else if (type === 'number') {
        hash = stringHash(i + 'n:' + field, hash)
      } else if (type === 'object') {
        if (field === null) {
          hash = stringHash(i + 'v:' + 'null', hash)
        } else {
          hash = stringHash(i + 'o:', hashObjectIgnoreKeyOrderNest(field, hash))
        }
      } else if (type === 'boolean') {
        hash = stringHash('b:' + (field ? 'true' : 'false'), hash) ^ i
      }
    }
  } else {
    const keys = Object.keys(obj).sort()
    hash = stringHash('__len:' + keys.length + 1, hash)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const field = obj[key]
      const type = typeof field
      if (type === 'string') {
        hash = stringHash(key + ':' + field, hash)
      } else if (type === 'number') {
        hash = stringHash(key + 'n:' + field, hash)
      } else if (type === 'object') {
        if (field === null) {
          hash = stringHash(key + 'v:' + 'null', hash)
        } else {
          hash = stringHash(
            key + 'o:',
            hashObjectIgnoreKeyOrderNest(field, hash)
          )
        }
      } else if (type === 'boolean') {
        hash = stringHash(key + 'b:' + (field ? 'true' : 'false'), hash)
      }
    }
  }
  return hash
}

export default hashObjectIgnoreKeyOrderNest
