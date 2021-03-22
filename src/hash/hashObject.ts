import hashObjectNest from './hashObjectNest'

const hashObject = (props: object): number => {
  return (hashObjectNest(props) >>> 0) * 4096 + hashObjectNest(props, 52711)
}

export default hashObject
