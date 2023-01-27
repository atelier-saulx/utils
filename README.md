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

## serializeQuery

Convert an object to a query string

```javascript
import { serializeQuery } from '@saulx/utils'
const object = { bla: true, a: [1, 2, 3], b: { a: 1 }, c: ['a', 'b', 'c'] }
const queryString = serializeQuery(object)
console.log(queryString) // bla&a=[1,2,3]&b={"a":1}&c=a,b,c
```

## parseQuery

Convert a query string to an object

```javascript
import { parseQuery } from '@saulx/utils'
const result = parseQuery('bla&a=[1,2,3]&b={"a":1}&c=a,b,c')
console.log(result) // { bla:true, a:[1,2,3], b:{a:1}, c:['a','b','c'] }
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

Convert a string to an env-variable safe name

```javascript
import { toEnvVar } from '@saulx/utils'
const x = toEnvVar('@based/bla-bla-bla$_!')
console.log(x) // prints BASED_BLA_BLA_BLA
```

## queued

Pass any async function and queue it based on the arguments, also shares the function execution for the same args

Accepts 10 arguments maximum!

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

## getType

Returns a string with the operand/type of the javascrit primitive. Adds 'null' and 'array'.

```javascript
getType('') // -> "string"
getType('this is a string') // -> "string"
getType(123) // -> "number"
getType(12.3) // -> "number"
getType(-12.3) // -> "number"
getType(-123) // -> "number"
getType(BigInt('1')) // -> "bigint"
getType(true) // -> "boolean"
getType(false) // -> "boolean"
getType(undefined) // -> "undefined"
getType({ a: 'wawa' }) // -> "object"
getType(() => {}) // -> "function"
getType([1, 2, 3]) // -> "array"
getType(null) // -> "null"
```

## walker

Generic structure walker. By default walks objects.

```javascript
const result = []
await walk(objectToWalk, async (item, info) => {
  result.push({
    value: item,
    name: info.name, // property name
    path: info.path, // slash separated path in object
    type: info.type, // operand type
  })
}) // returns void
```

By configuring the options you can walk any kind of structure

```javascript
	await walk(
		objectToWalk, // starting target
		itemFn, // function to run for each matched item
		options: {
			// check types for details
			listFn, // function to list each path. Should return a list of items.
			itemMatchFn, // function to choose which items to run itemFn on
			recureseFn, // function to choose wchich items to recurse on
			targetValidationFn, // function to validate starting path
			previousPath, // prefix to add to paths
		}
	)
```
