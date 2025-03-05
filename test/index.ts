import test from 'ava'
import {
  deepCopy,
  deepMerge,
  deepMergeArrays,
  wait,
  deepEqual,
  toEnvVar,
  readStream,
  queued,
  retry,
  randomString,
  getType,
  padLeft,
  padRight,
  setByPath,
  getByPath,
} from '../src/index.js'
import { createReadStream } from 'fs'
import { join } from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = fileURLToPath(dirname(import.meta.url))

test('padding', async (t) => {
  const x = padLeft('a', 4, 'b')
  t.is(x, 'bbba')
  const y = padRight('a', 4, 'b')
  t.is(y, 'abbb')
})

test('env var', async (t) => {
  const x = toEnvVar('@based/bla-bla-bla$_!')
  t.is(x, 'BASED_BLA_BLA_BLA')
})

test('deepCopy', async (t) => {
  const bla = {
    x: {
      bla: 'x',
    },
  }
  t.deepEqual(deepCopy(bla), bla)
})

test('deepMergeArrayMulti', async (t) => {
  const r = deepMergeArrays(
    {},
    {
      a: [{ a: true }],
    },
    {
      a: [{ b: true }],
    },
    {
      a: [{ c: true }],
    },
    {
      a: [{ d: true }],
    }
  )

  t.deepEqual(r, {
    a: [
      {
        a: true,
        b: true,
        c: true,
        d: true,
      },
    ],
  })
})

test('deepMergeArrayMulti2', async (t) => {
  const r = deepMergeArrays(
    {},
    {
      a: [{ a: true }],
    },
    {
      a: [{ b: [{ snurp: true }] }],
    },
    {
      a: [{ c: true, b: [{ derp: true }] }],
    }
  )
  t.deepEqual(r, {
    a: [{ a: true, b: [{ snurp: true, derp: true }], c: true }],
  })
})

test('deepMergeArrayMulti3', async (t) => {
  const r = deepMergeArrays(
    {},
    {
      a: [{ a: true }],
    },
    {
      a: [undefined, { b: [{ snurp: true }] }],
    }
  )
  t.deepEqual(r, {
    a: [{ a: true }, { b: [{ snurp: true }] }],
  })
})

test('deepMergeArrayMulti4', async (t) => {
  const r = deepMergeArrays(
    {},
    {
      a: ['a', 'b'],
    },
    {
      a: ['a'],
    }
  )
  t.deepEqual(r, {
    a: ['a'],
  })
})

test('deepMerge', async (t) => {
  const a: any = {
    b: {
      a: 'a!',
      c: [
        { x: true, y: true },
        { x: false, y: true },
      ],
      d: { x: {} },
    },
  }

  const b: any = {
    b: {
      b: 'its b!',
      c: [{ x: true, y: true }],
      d: { x: { flap: true } },
    },
  }

  const r = deepCopy(a)

  deepMergeArrays(r, deepCopy(b))

  // test fails because deepMergeArrays has an error indeed,
  // here the target const r (a) is supposed to prevail only in
  // the second array row becaus it is the target.
  // So c[0] = { x: true, y: true } from b, which is correct.
  // But c[1] should should keep the target value from
  // const r, c[1] = { x: false, y: true } so here is the error.

  t.deepEqual(
    r,
    {
      b: {
        a: 'a!',
        c: [
          { x: true, y: true },
          { x: false, y: true },
        ],
        d: { x: { flap: true } },
        b: 'its b!',
      },
    },
    'deep merge include arrays'
  )
  const r2 = deepCopy(a)

  deepMerge(r2, deepCopy(b))

  t.deepEqual(
    r2,
    {
      b: {
        a: 'a!',
        c: [{ x: true, y: true }],
        d: { x: { flap: true } },
        b: 'its b!',
      },
    },
    'deep merge exclude arrays'
  )

  const r3 = deepCopy(a)

  deepMerge(
    r3,
    {
      b: { a: 'ja' },
    },
    {
      b: { x: 'snurf' },
    },
    {
      blarf: true,
    }
  )

  t.deepEqual(
    r3,
    {
      b: {
        a: 'ja',
        c: [
          { x: true, y: false },
          { x: false, y: true },
        ],
        d: { x: {} },
        x: 'snurf',
      },
      blarf: true,
    },
    'multiple arguments'
  )
})

test('wait ', async (t) => {
  const d = Date.now()
  await wait(1e3)
  t.true(Date.now() - d > 999)
})

test('deepEqual ', async (t) => {
  const bla = { x: true, y: true, z: [1, 2, 3, 4, { x: true }] }
  const blarf = { x: true, y: true, z: [1, 2, 3, 4, { x: true }] }

  t.true(deepEqual(bla, blarf))

  const a = { x: 'x', y: undefined }
  const b = { x: 'x', y: undefined }

  t.true(deepEqual(a, b))
})

test('deepEqual 2', async (t) => {
  const bla = {
    id: 213891765,
    privateIp: '10.114.0.21',
    publicIp: '159.89.17.141',
    name: 'my-special-app-for-testing-super-secret-0-fra1',
    tags: {
      app: 'my_special_app_for_testing_super_secret',
      env: 'production',
      net: 'private',
      project: 'supersecretspecialtestproject',
      org: 'saulx',
    },
    specs: {
      memory: '1gb',
      cpus: 1,
      image: 'ubuntu-nodejs',
      region: 'fra1',
      cloudProvider: 'do',
      sizeName: 's-1vcpu-1gb',
    },
    price: 5,
  }
  const blarf = {
    id: 213891765,
    privateIp: '10.114.0.21',
    publicIp: '159.89.17.141',
    name: 'my-special-app-for-testing-super-secret-0-fra1',
    tags: {
      app: 'my_special_app_for_testing_super_secret',
      env: 'production',
      net: 'private',
      project: 'supersecretspecialtestproject',
      org: 'saulx',
    },
    specs: {
      memory: '1gb',
      cpus: 1,
      image: 'ubuntu-nodejs',
      region: 'fra1',
      cloudProvider: 'do',
      sizeName: 's-1vcpu-1gb',
    },
    price: 5,
  }

  t.true(deepEqual(bla, blarf))
})

test('deepEqual 3', async (t) => {
  const bla = {
    id: 213906207,
    privateIp: '10.114.0.20',
    publicIp: '167.99.139.137',
    name: 'fra1-my-special-app-for-testing-super-secret-5c44610-0',
    tags: {
      app: 'my_special_app_for_testing_super_secret',
      env: 'production',
      net: 'private',
      project: 'supersecretspecialtestproject',
      org: 'saulx',
    },
    specs: {
      memory: '1gb',
      image: 'ubuntu-nodejs',
      region: 'fra1',
      cpus: 4,
      cloudProvider: 'do',
      sizeName: 's-4vcpu-8gb',
    },
    price: 5,
  }
  const blarf = {
    id: 213906207,
    privateIp: '10.114.0.20',
    publicIp: '167.99.139.137',
    name: 'fra1-my-special-app-for-testing-super-secret-5c44610-0',
    tags: {
      app: 'my_special_app_for_testing_super_secret',
      env: 'production',
      net: 'private',
      project: 'supersecretspecialtestproject',
      org: 'saulx',
    },
    specs: {
      memory: '8gb',
      cpus: 4,
      image: 'ubuntu-nodejs',
      region: 'fra1',
      cloudProvider: 'do',
      sizeName: 's-4vcpu-8gb',
    },
    price: 40,
  }

  t.false(deepEqual(bla, blarf))
})

test('deepEqual 4', async (t) => {
  const bla = {
    id: 213913182,
    privateIp: '10.110.0.2',
    publicIp: '128.199.41.139',
    name: 'ams3-my-special-app-for-testing-super-secret-persist-33057c3-0',
    tags: {
      app: 'my_special_app_for_testing_super_secret_persist',
      env: 'production',
      net: 'private',
      project: 'supersecretspecialtestproject',
      org: 'saulx',
    },
    specs: {
      memory: '1gb',
      cpus: 1,
      image: 'ubuntu-nodejs',
      region: 'ams3',
      cloudProvider: 'do',
      sizeName: 's-1vcpu-1gb',
    },
    price: 5,
    domain: 'my-special-app-for-testing-super-secret-persist.based.io',
  }
  const blarf = {
    id: 213913182,
    privateIp: '10.110.0.2',
    publicIp: '128.199.41.139',
    name: 'ams3-my-special-app-for-testing-super-secret-persist-33057c3-0',
    tags: {
      app: 'my_special_app_for_testing_super_secret_persist',
      env: 'production',
      net: 'private',
      project: 'supersecretspecialtestproject',
      org: 'saulx',
    },
    specs: {
      memory: '1gb',
      cpus: 1,
      image: 'ubuntu-nodejs',
      region: 'ams3',
      cloudProvider: 'do',
      sizeName: 's-1vcpu-1gb',
    },
    price: 5,
  }
  t.false(deepEqual(bla, blarf))
})

test('deepEqual _keys', async (t) => {
  const bla = {
    hello: 'super cool',
    what: {
      nested: 'yes',
      _yeah: true,
    },
    _niceKey: 1,
  }
  const blarf = {
    hello: 'super cool',
    what: {
      nested: 'yes',
      _yeah: true,
    },
    _niceKey: 1,
  }
  t.true(deepEqual(bla, blarf), 'same object with _key')
  blarf._niceKey = 2
  t.false(deepEqual(bla, blarf), 'change _key value')
})

test('readStream', async (t) => {
  const v = await readStream(
    createReadStream(join(__dirname, '../../package.json'))
  )
  const pkg = JSON.parse(v.toString())
  t.is(pkg.name, '@saulx/utils')
  t.pass()
})

test('readStreamLarger', async (t) => {
  const v = await readStream(createReadStream(join(__dirname, './index.js')), {
    throttle: 10,
    maxChunkSize: 100,
  })
  const pkg = v.toString()
  t.true(pkg.includes('readStreamLarger'))
  t.pass()
})

test('queued', async (t) => {
  let cnt = 0
  const myFn = async (x: number, y: { x: boolean }): Promise<string> => {
    cnt++
    await wait(100)
    return x + 'blarp' + y.x
  }
  const myFnQueud = queued(myFn)
  const args: any = []
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }
  const d = Date.now()
  // @ts-ignore
  await Promise.all(args.map((v) => myFnQueud(...v)))
  const ellapsed = Date.now() - d
  t.true(ellapsed > 500 && ellapsed < 1500)
  t.is(cnt, 10)
})

test('queued concurrency 2', async (t) => {
  const myFn = async (x: number, y?: { x: boolean }): Promise<string> => {
    await wait(1000)
    return x + 'blarp' + y?.x
  }
  const myFnQueud = queued(myFn, { concurrency: 5 })

  const args: [number, { x: true }][] = []
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }
  const d = Date.now()
  // @ts-ignore
  await Promise.all(args.map((v) => myFnQueud(...v)))
  const ellapsed = Date.now() - d
  t.true(ellapsed > 1000 && ellapsed < 3000)
})

test('queued retry concurrency', async (t) => {
  let cnt = 0

  const myFn = async (x: number, y?: { x: boolean }): Promise<string> => {
    await wait(10)
    cnt++
    if (cnt % 2) {
      throw new Error('bla')
    }
    return x + 'blarp' + y?.x
  }

  let errs = 0

  const myFnQueud = queued(myFn, {
    concurrency: 5,
    retry: {
      max: 100,
      minTime: 10,
      maxTime: 500,
      logError: (_x, args) => {
        errs++
        console.info('Retrying!', args)
      },
    },
  })

  const args: [number, { x: true }][] = []
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }

  await Promise.all(args.map((v) => myFnQueud(...v)))

  t.is(cnt, 20)
  t.is(errs, 10)

  t.true(true)
})

test('retry', async (t) => {
  const fnFail = async () => {
    throw new Error('failed')
  }
  let d = Date.now()
  await t.throwsAsync(retry(fnFail, { timeout: 200, maxRetries: 3 }))
  let elapsed = Date.now() - d
  t.assert(elapsed >= 600)

  const fnSuccess = async () => {
    return 'flurp'
  }
  const res = await retry(fnSuccess, { timeout: 200, maxRetries: 3 })
  t.assert(res === 'flurp')

  let i = 0
  const fnFailTwice = async () => {
    if (i < 2) {
      i++
      throw new Error('no')
    } else {
      return 'yes'
    }
  }
  d = Date.now()
  const res2 = await retry(fnFailTwice, { timeout: 100, maxRetries: -1 })
  elapsed = Date.now() - d
  t.assert(res2 === 'yes')
  t.assert(elapsed > 200 && elapsed < 250)

  i = 0
  async function failsTwiceWithArgs(v: string) {
    if (i < 2) {
      i++
      throw new Error('no')
    } else {
      return v
    }
  }
  await t.throwsAsync(
    retry(failsTwiceWithArgs, { timeout: 100, maxRetries: 1 }, 'hello')
  )

  i = 0
  const res3 = await retry(
    failsTwiceWithArgs,
    { timeout: 100, maxRetries: -1 },
    'hello'
  )
  t.assert(res3 === 'hello')

  i = 0
  d = Date.now()
  const res4 = await retry(fnFailTwice, { maxRetries: -1 })
  elapsed = Date.now() - d
  t.assert(res4 === 'yes')
  t.assert(elapsed > 200 && elapsed < 250)
})

test('randomString', (t) => {
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const specialsChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'

  const l = 2000

  const one = randomString(l)
  const two = randomString(l, { noSpecials: true })
  const three = randomString(l, { noLowerCase: true })
  const four = randomString(l, { noUpperCase: true })
  const five = randomString(l, { noNumbers: true })

  t.assert(one.length === l)
  t.assert(two.length === l)
  t.assert(three.length === l)
  t.assert(four.length === l)
  t.assert(five.length === l)

  t.assert(
    upperCaseChars.split('').some((v) => {
      return (
        one.indexOf(v) >= 0 &&
        two.indexOf(v) >= 0 &&
        three.indexOf(v) >= 0 &&
        four.indexOf(v) < 0 &&
        five.indexOf(v) >= 0
      )
    })
  )

  t.assert(
    lowerCaseChars.split('').some((v) => {
      return (
        one.indexOf(v) >= 0 &&
        two.indexOf(v) >= 0 &&
        three.indexOf(v) < 0 &&
        four.indexOf(v) >= 0 &&
        five.indexOf(v) >= 0
      )
    })
  )

  t.assert(
    numberChars.split('').some((v) => {
      return (
        one.indexOf(v) >= 0 &&
        two.indexOf(v) >= 0 &&
        three.indexOf(v) >= 0 &&
        four.indexOf(v) >= 0 &&
        five.indexOf(v) < 0
      )
    })
  )

  t.assert(
    specialsChars.split('').some((v) => {
      return (
        one.indexOf(v) >= 0 &&
        two.indexOf(v) < 0 &&
        three.indexOf(v) >= 0 &&
        four.indexOf(v) >= 0 &&
        five.indexOf(v) >= 0
      )
    })
  )
})

test('getType', (t) => {
  t.is(getType(''), 'string')
  t.is(getType('this is a string'), 'string')
  t.is(getType(123), 'number')
  t.is(getType(12.3), 'number')
  t.is(getType(-12.3), 'number')
  t.is(getType(-123), 'number')
  t.is(getType(BigInt('1')), 'bigint')
  t.is(getType(true), 'boolean')
  t.is(getType(false), 'boolean')
  t.is(getType(undefined), 'undefined')
  t.is(getType({}), 'object')
  t.is(getType({ a: 'wawa' }), 'object')
  t.is(
    getType(() => {}),
    'function'
  )
  t.is(getType([]), 'array')
  t.is(getType([1, 2, 3]), 'array')
  t.is(getType(null), 'null')
})

test('setPath', (t) => {
  const bla = {
    a: {
      b: {
        c: {
          bla: true,
        },
      },
    },
  }

  t.deepEqual(setByPath(bla, ['a', 'b', 'c', 'x', 0], 'snurp'), {
    a: {
      b: { c: { bla: true, x: ['snurp'] } },
    },
  })

  t.is(getByPath(bla, ['a', 'b', 'c', 'x', 0]), 'snurp')
  t.true(true)
})
