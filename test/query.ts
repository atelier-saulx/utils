import test from 'ava'
import { parseQuery } from '../src'

test('parse query with special values', async (t) => {
  const q = 'bla=1&flap=true&q={"bla":"flap=x&v2!"}'

  const r1 = parseQuery(q)

  t.is(r1 && r1.bla, 1)
  t.is(r1 && r1.flap, true)
  t.true(
    r1 &&
      'q' in r1 &&
      typeof r1?.q === 'object' &&
      !Array.isArray(r1.q) &&
      r1?.q.bla === 'flap=x&v2!'
  )

  const d = Date.now()
  for (let i = 0; i < 100e3; i++) {
    parseQuery(q)
  }
  console.info('query parser: parse 100k objects', Date.now() - d, 'ms')

  t.true(Date.now() - d < 500, '100k takes shorter then 500ms')
})

test('parse query with arrays', async (t) => {
  const q = 'bla&a=[1,2,3]&b=1,2,3,4&c=a,b,c'

  const r1 = parseQuery(q)

  console.info(r1)

  t.deepEqual(r1, {
    bla: true,
    a: [1, 2, 3],
    b: [1, 2, 3, 4],
    c: ['a', 'b', 'c'],
  })

  t.is(r1 && r1.bla, true)

  const d = Date.now()
  for (let i = 0; i < 100e3; i++) {
    parseQuery(q)
  }
  console.info('query parser: parse 100k objects', Date.now() - d, 'ms')

  t.true(Date.now() - d < 500, '100k takes shorter then 500ms')
})
