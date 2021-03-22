import hashObjectIgnoreKeyOrderNest from './hashObjectIgnoreKeyOrderNest'

const hashObjectIgnoreKeyOrder = (props: object): number => {
  return (
    (hashObjectIgnoreKeyOrderNest(props) >>> 0) * 4096 +
    (hashObjectIgnoreKeyOrderNest(props, 52711) >>> 0)
  )
}

export default hashObjectIgnoreKeyOrder
