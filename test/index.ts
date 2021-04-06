import test from 'ava'
import {
  deepCopy,
  deepMerge,
  deepMergeArrays,
  wait,
  deepEqual,
  toEnvVar,
  readStream,
  queued
} from '../src'

test('env var', async t => {
  const x = toEnvVar('@based/bla-bla-bla$_!')
  t.is(x, 'BASED_BLA_BLA_BLA')
})

test('deepCopy', async t => {
  const bla = {
    x: {
      bla: 'x'
    }
  }
  t.deepEqual(deepCopy(bla), bla)
})

test('deepMerge', async t => {
  const a = {
    b: {
      a: 'a!',
      c: [
        { x: true, y: false },
        { x: false, y: true }
      ],
      d: { x: {} }
    }
  }

  const b = {
    b: {
      b: 'its b!',
      c: [{ x: true, y: true }],
      d: { x: { flap: true } }
    }
  }

  const r = deepCopy(a)

  deepMergeArrays(r, deepCopy(b))

  t.deepEqual(
    r,
    {
      b: {
        a: 'a!',
        c: [
          { x: true, y: true },
          { x: false, y: true }
        ],
        d: { x: { flap: true } },
        b: 'its b!'
      }
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
        b: 'its b!'
      }
    },
    'deep merge exclude arrays'
  )

  const r3 = deepCopy(a)

  deepMerge(
    r3,
    {
      b: { a: 'ja' }
    },
    {
      b: { x: 'snurf' }
    },
    {
      blarf: true
    }
  )

  t.deepEqual(
    r3,
    {
      b: {
        a: 'ja',
        c: [
          { x: true, y: false },
          { x: false, y: true }
        ],
        d: { x: {} },
        x: 'snurf'
      },
      blarf: true
    },
    'multiple arguments'
  )
})

test('wait ', async t => {
  var d = Date.now()
  await wait(1e3)
  t.true(Date.now() - d > 999)
})

test('deepEqual ', async t => {
  const bla = { x: true, y: true, z: [1, 2, 3, 4, { x: true }] }
  const blarf = { x: true, y: true, z: [1, 2, 3, 4, { x: true }] }

  t.true(deepEqual(bla, blarf))
})

test('deepEqual 2', async t => {
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
      org: 'saulx'
    },
    specs: {
      memory: '1gb',
      cpus: 1,
      image: 'ubuntu-nodejs',
      region: 'fra1',
      cloudProvider: 'do',
      sizeName: 's-1vcpu-1gb'
    },
    price: 5
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
      org: 'saulx'
    },
    specs: {
      memory: '1gb',
      cpus: 1,
      image: 'ubuntu-nodejs',
      region: 'fra1',
      cloudProvider: 'do',
      sizeName: 's-1vcpu-1gb'
    },
    price: 5
  }

  t.true(deepEqual(bla, blarf))
})

test('deepEqual 3', async t => {
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
      org: 'saulx'
    },
    specs: {
      memory: '1gb',
      image: 'ubuntu-nodejs',
      region: 'fra1',
      cpus: 4,
      cloudProvider: 'do',
      sizeName: 's-4vcpu-8gb'
    },
    price: 5
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
      org: 'saulx'
    },
    specs: {
      memory: '8gb',
      cpus: 4,
      image: 'ubuntu-nodejs',
      region: 'fra1',
      cloudProvider: 'do',
      sizeName: 's-4vcpu-8gb'
    },
    price: 40
  }

  t.false(deepEqual(bla, blarf))
})

test('deepEqual 4', async t => {
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
      org: 'saulx'
    },
    specs: {
      memory: '1gb',
      cpus: 1,
      image: 'ubuntu-nodejs',
      region: 'ams3',
      cloudProvider: 'do',
      sizeName: 's-1vcpu-1gb'
    },
    price: 5,
    domain: 'my-special-app-for-testing-super-secret-persist.based.io'
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
      org: 'saulx'
    },
    specs: {
      memory: '1gb',
      cpus: 1,
      image: 'ubuntu-nodejs',
      region: 'ams3',
      cloudProvider: 'do',
      sizeName: 's-1vcpu-1gb'
    },
    price: 5
  }
  t.false(deepEqual(bla, blarf))
})

test.cb('readStream', t => {
  const { createReadStream } = require('fs')
  const { join } = require('path')
  readStream(createReadStream(join(__dirname, '../package.json'))).then(v => {
    const pkg = JSON.parse(v.toString())
    t.is(pkg.name, '@saulx/utils')
    t.end()
  })
})

test('queued', async t => {
  let cnt = 0
  const myFn = async (x: number, y: { x: boolean }): Promise<string> => {
    cnt++
    await wait(100)
    return x + 'blarp'
  }
  const myFnQueud = queued(myFn)
  const args = []
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }
  let d = Date.now()
  await Promise.all(args.map(v => myFnQueud(...v)))
  const ellapsed = Date.now() - d
  t.true(ellapsed > 500 && ellapsed < 1500)
  t.is(cnt, 10)
})

test('queued concurrency 2', async t => {
  const myFn = async (x: number, y: { x: boolean }): Promise<string> => {
    await wait(1000)
    return x + 'blarp'
  }
  const myFnQueud = queued(myFn, { concurrency: 5 })
  const args = []
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }
  for (let i = 0; i < 10; i++) {
    args.push([i, { x: true }])
  }
  const d = Date.now()
  await Promise.all(args.map(v => myFnQueud(...v)))
  const ellapsed = Date.now() - d
  t.true(ellapsed > 1000 && ellapsed < 3000)
})
