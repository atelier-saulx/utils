# utils

Saulx utils package, hashes are non cryptographic 32 bit hashes

## hash

Create a hash for any data type

```javascript
import { hash } from '@saulx/utils'
console.log(hash({ x: true }))
```

```javascript
import { hash } from '@saulx/utils'

// pads extra zeroes
console.log(hash({ x: true }, 15))
```

## hashCompact

Create a hash for any data type, returns a base 62 string

```javascript
import { hashCompact } from '@saulx/utils'
console.log(hashCompact({ x: true })) // -> CCoj0h
```

Passing an array and specifying more chars makes a hash that uses all avaible space to make it more unique (becomes more then 32 bits)

```javascript
import { hashCompact } from '@saulx/utils'
console.log(hashCompact([{ x: true }, 'bla', 'blurp', 'snurf'], 20)) // -> CCoj0hNFgt8MovDmLkmh
```

## hashObject

Create a hash from objects or arrays

```javascript
import { hashObject } from '@saulx/utils'
console.log(hashObject({ x: true }))
```

## hashObjectIgnoreKeyOrder

Only works for objects, creates the same hash independent from object key order

```javascript
import { hashObject } from '@saulx/utils'
console.log(
  hashObjectIgnoreKeyOrder({ x: true, y: true }) ===
    hashObjectIgnoreKeyOrder({ y: true, x: true })
)
```

## stringHash

Creates a hash for strings

```javascript
import { stringHash } from '@saulx/utils'
console.log(stringHash('bla bla bla'))
```

## deepCopy

Create a deepcopy of objects

```javascript
import { deepCopy } from '@saulx/utils'
console.log(deepCopy({ x: true }))
```

## deepMerge

Merge an object into another object, arrays are treated as new values

```javascript
import { deepMerge } from '@saulx/utils'

const a = { x: { a: { c: true, x: [1, 2] } } }
const b = { y: true }
const c = { x: { a: { b: true, x: ['bla'] } } }

console.log(deepMerge(a, b))

console.log(deepMerge(a, b, c))

/*
 Logs
 {
   x: { a: { b: true, c: true, x: ['bla']}},
   y: true
 }
*/
```

## deepMergeArrays

Merge an object into another object, arrays are treated as objects

```javascript
import { deepMergeArrays } from '@saulx/utils'
const a = { x: { a: { c: true, x: [1, 2, 3] } } }
const b = { y: true }
const c = { x: { a: { b: true, x: ['bla'] } } }

console.log(deepMergeArrays(a, b))

console.log(deepMergeArrays(a, b, c))

/*
 Logs
 {
   x: { a: { b: true, c: true, x: ['bla', 2, 3]}},
   y: true
 }
*/
```

## isObject

Checks if a variable is an object and not an array

```javascript
import { isObject } from '@saulx/utils'
console.log(isObject({ x: true })) // true
console.log(isObject([1, 2, 3])) // false
```

## wait

Timeout in a promise, default is 100ms

```javascript
import { wait } from '@saulx/utils'

const somethingAsync = async () => {
  await wait() // 100ms
  console.log('after 100ms')
  await wait(1000)
  console.log('after 1100ms')
}

somethingAsync()
```
