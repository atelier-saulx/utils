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

  console.log(r1)

  //   const d = Date.now()
  //   for (let i = 0; i < 100e3; i++) {
  //     parseQuery(q)
  //   }
  //   console.log(Date.now() - d, 'ms')
})
