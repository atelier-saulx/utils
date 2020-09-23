import test from 'ava'
import { hash, deepCopy, hashObject, hashObjectIgnoreKeyOrder } from '../src'

test('hash', async t => {
  const a = { x: true }
  t.true(hash(a) > 0)
  const bla = {
    x: {
      bla: 'x'
    }
  }
  t.true(hash(bla) > 0)
})

test('deepCopy', async t => {
  const bla = {
    x: {
      bla: 'x'
    }
  }
  t.deepEqual(deepCopy(bla), bla)
})

test('hash stress', async t => {
  const a = {}

  for (let i = 0; i < 1000000; i++) {
    a[(~~(Math.random() * 1000000)).toString(16)] = 'flurpy'
  }

  var d = Date.now()
  const x = hashObject(a)
  console.log(Date.now() - d, 'ms')

  t.true(typeof x === 'number')
})

test('hash  hashObjectIgnoreKeyOrder', async t => {
  const a = {
    a: true,
    b: true,
    c: {
      d: true,
      e: true
    }
  }
  const b = {
    c: {
      e: true,
      d: true
    },
    b: true,
    a: true
  }

  t.is(hashObjectIgnoreKeyOrder(a), hashObjectIgnoreKeyOrder(b))
})

test('hash stress hashObjectIgnoreKeyOrder', async t => {
  const a = {}

  for (let i = 0; i < 1000000; i++) {
    a[(~~(Math.random() * 1000000)).toString(16)] = 'flurpy'
  }

  var d = Date.now()
  const x = hashObjectIgnoreKeyOrder(a)
  console.log(Date.now() - d, 'ms')

  t.true(typeof x === 'number')
})
