export default (str): number => {
  var i = str.length
  let s = ''
  while (i) {
    s += str.charCodeAt(--i)
  }
  return Number(s)
}
