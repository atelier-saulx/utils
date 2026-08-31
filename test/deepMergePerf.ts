import test from 'ava'
import { deepMerge } from '../src/index.js'

// Same merge without the dangerous key guard, to price the guard on this machine.
const unguarded = (target: any, source: any): any => {
  if (source.constructor === Array || target.constructor === Array) {
    return source
  }
  for (const i in source) {
    if (i in target) {
      if (
        target[i] &&
        source[i] &&
        typeof target[i] === 'object' &&
        target[i].constructor !== Array &&
        typeof source[i] === 'object' &&
        source[i].constructor !== Array
      ) {
        const a = unguarded(target[i], source[i])
        if (a !== target[i]) {
          target[i] = a
        }
      } else {
        target[i] = source[i]
      }
    } else {
      target[i] = source[i]
    }
  }
  return target
}

const makeTarget = () => ({
  name: 'x',
  id: 1,
  enabled: true,
  ratio: 0.5,
  tags: ['a', 'b', 'c'],
  nested: { a: 1, b: 'two', c: { d: true, e: [1, 2, 3], f: { g: 'deep', h: 9 } } },
  other: { p: 1, q: 2, r: 3, s: 4, t: 5, u: 6, v: 7, w: 8 },
})

const source = {
  name: 'y',
  id: 2,
  extra: 'new',
  ratio: 1.5,
  tags: ['z'],
  nested: { b: 'three', c: { d: false, f: { g: 'deeper', i: 10 } }, x: 1 },
  other: { p: 9, z: 0 },
}

const AMOUNT = 5e4
const ROUNDS = 10

const opsPerSec = (fn: (target: any, source: any) => any) => {
  const pool: any[] = new Array(AMOUNT)
  let best = 0
  for (let round = 0; round < ROUNDS; round++) {
    for (let i = 0; i < AMOUNT; i++) {
      pool[i] = makeTarget()
    }
    const start = performance.now()
    for (let i = 0; i < AMOUNT; i++) {
      fn(pool[i], source)
    }
    const ops = AMOUNT / ((performance.now() - start) / 1000)
    if (ops > best) {
      best = ops
    }
  }
  return best
}

test('deepMerge perf', async (t) => {
  opsPerSec(deepMerge)
  opsPerSec(unguarded)

  const guarded = opsPerSec(deepMerge)
  const plain = opsPerSec(unguarded)
  const ratio = guarded / plain

  console.info(
    `deepMerge ${(guarded / 1e6).toFixed(2)}M ops/s vs unguarded ${(
      plain / 1e6
    ).toFixed(2)}M ops/s (${((ratio - 1) * 100).toFixed(1)}%)`
  )

  t.true(guarded > 5e5, `at least 500k merges/s, got ${guarded.toFixed(0)}`)
  t.true(ratio > 0.85, `guard costs less than 15%, got ${ratio.toFixed(3)}`)
})
