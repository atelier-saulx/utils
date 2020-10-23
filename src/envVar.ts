export default (str: string): string => {
  str = str.replace(/[@-\\/|*&^%$#@!()\-+]/g, '_')

  str = str.replace(/^_+/, '')
  str = str.replace(/_+$/, '')

  return str.toUpperCase()
}
