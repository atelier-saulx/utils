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

export default str => {
  var i = str.length
  let s = ''
  while (i) {
    s += toString(str.charCodeAt(--i))
  }
  return s
}
