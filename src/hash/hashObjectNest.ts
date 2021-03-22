import stringHash from './stringHash'

const hashObjectNest = (obj: object | any[], hash = 5381): number => {
  if (obj.constructor === Array) {
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
          hash = stringHash(i + 'o:', hashObjectNest(field, hash))
        }
      } else if (type === 'boolean') {
        hash = stringHash(i + 'b:' + (field ? 'true' : 'false'), hash)
      }
    }
  } else {
    for (let key in obj) {
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
          hash = stringHash(key + 'o:', hashObjectNest(field, hash))
        }
      } else if (type === 'boolean') {
        hash = stringHash(key + 'b:' + (field ? 'true' : 'false'), hash)
      }
    }
  }
  return hash
}

export default hashObjectNest
