import test from 'ava'
import { hash, deepCopy } from '../src'

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
