const stringHash = (str: string, hash: number = 5381): number => {
  var i = str.length
  while (i) {
    const char = str.charCodeAt(--i)
    hash = (hash * 33) ^ char
  }
  return hash
}

export default stringHash
