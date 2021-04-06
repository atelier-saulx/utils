# utils

Saulx utils package

## deepEqual

Compare objects

```javascript
import { stringHash } from '@saulx/utils'
console.log(deepEqual({ a: { b: true } }, { a: { b: true } })) // true
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

## readStream

Sink a read stream into a promise

```javascript
import { readStream } from '@saulx/utils'
import fs from 'fs'

const aReadStream = fs.createReadStream('somefile')
const myResult = await readStream(aReadStream)
```

## toEnvVar

Convert a string to a env variable safe name

```javascript
import { toEnvVar } from '@saulx/utils'
const x = toEnvVar('@based/bla-bla-bla$_!')
console.log(x) // prints BASED_BLA_BLA_BLA
```

## queued

Pass any async function and queue it based on the arguments, also shares the function execution for the same args

Accepts 5 arguments maximum!

```javascript
import { queued, wait } from '@saulx/utils'

const myFn = queued(async (a: string) => {
  await wait(1000)
  return a + '!'
})

// will execute bla first then x
await Promise.all([
  myFn('bla'),
  myFn('x')
  myFn('bla') // bla will be shared
])
```

```javascript
import { queued, wait } from '@saulx/utils'

const myFn = queued(async (a: string) => {
  await wait(1000)
  return a + '!'
}, {
  dedup: (a) => {
    // choose the value to use for dedup (to share results)
    return a
  },
  concurrency: 10 // max concurrency of 10
})

// will execute all at the same time (scince concurrency is 10)
// will only execute 'bla' once since it has the same arguments used in id
await Promise.all([
  myFn('bla'),
  myFn('x')
  myFn('bla') // bla will be shared
])
```
