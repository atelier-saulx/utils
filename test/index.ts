import test from 'ava'
import {
  hash,
  hashCompact,
  deepCopy,
  hashObject,
  hashObjectIgnoreKeyOrder,
  deepMerge,
  deepMergeArrays,
  wait,
  deepEqual,
  toEnvVar
} from '../src'

test('env var', async t => {
  const x = toEnvVar('@based/bla-bla-bla$_!')
  t.is(x, 'BASED_BLA_BLA_BLA')
})

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
  console.log('    1mil keys object takes', Date.now() - d, 'ms to hash')

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

  console.log(
    '    1mil keys object takes',
    Date.now() - d,
    'ms to hash ignore key order'
  )

  t.true(typeof x === 'number')
})

test('hash test equality 1', async t => {
  const a = {
    type: 'folder',
    title: '',
    id: 'fo1',
    name: '',
    children: [
      {
        buttonText: 'my ballz',
        type: 'match',
        name: '',
        id: 'ma1',
        aliases: [],
        published: false
      }
    ],
    aliases: []
  }
  const b = {
    type: 'folder',
    title: '',
    id: 'fo1',
    name: '',
    children: [
      {
        buttonText: 'my ballzzzz',
        type: 'match',
        name: '',
        id: 'ma1',
        aliases: [],
        published: false
      }
    ],
    aliases: []
  }

  const hashA1 = hashObject(a)
  const hashB1 = hashObject(b)

  const hashA = hashObjectIgnoreKeyOrder(a)
  const hashB = hashObjectIgnoreKeyOrder(b)

  t.true(hashA1 !== hashB1)
  t.true(hashA !== hashB)
})

test('hash test equality 2', async t => {
  const a = {
    type: 'folder',
    title: '',
    id: 'fo1',
    name: '',
    children: [
      {
        buttonText: 'my b',
        type: 'match',
        name: '',
        id: 'ma1',
        aliases: [],
        published: false
      }
    ],
    aliases: []
  }
  const b = {
    type: 'folder',
    title: '',
    id: 'fo1',
    name: '',
    children: [
      {
        buttonText: 'my ba',
        type: 'match',
        name: '',
        id: 'ma1',
        aliases: [],
        published: false
      }
    ],
    aliases: []
  }

  const hashA1 = hashObject(a)
  const hashB1 = hashObject(b)

  const hashA = hashObjectIgnoreKeyOrder(a)
  const hashB = hashObjectIgnoreKeyOrder(b)

  t.true(hashA1 !== hashB1)
  t.true(hashA !== hashB)
})

test('hash test equality 3', async t => {
  const a = {
    type: 'videoScreen',
    index: 0,
    id: '309aa290aa',
    video: '',
    buttonText: 'my b',
    image: '',
    title: 'my',
    description: '',
    name: 'Video Screen',
    aliases: [],
    children: [],
    videoMandatory: false
  }
  const b = {
    type: 'videoScreen',
    index: 0,
    id: '309aa290aa',
    video: '',
    buttonText: 'my ba',
    image: '',
    title: 'my',
    description: '',
    name: 'Video Screen',
    aliases: [],
    children: [],
    videoMandatory: false
  }

  const hashA1 = hashObject(a)
  const hashB1 = hashObject(b)

  const hashA = hashObjectIgnoreKeyOrder(a)
  const hashB = hashObjectIgnoreKeyOrder(b)

  t.true(hashA1 !== hashB1)
  t.true(hashA !== hashB)
})

test('hash test equality 4', async t => {
  const a = {
    type: 'videoScreen',
    index: 0,
    id: '309aa290aa',
    video: '',
    buttonText: 'a',
    image: '',
    title: 'my',
    description: '',
    name: 'Video Screen',
    aliases: [],
    children: [],
    videoMandatory: false
  }
  const b = {
    type: 'videoScreen',
    index: 0,
    id: '309aa290aa',
    video: '',
    buttonText: 'aa',
    image: '',
    title: 'my',
    description: '',
    name: 'Video Screen',
    aliases: [],
    children: [],
    videoMandatory: false
  }

  const hashA1 = hashObject(a)
  const hashB1 = hashObject(b)

  const hashA = hashObjectIgnoreKeyOrder(a)
  const hashB = hashObjectIgnoreKeyOrder(b)

  t.true(hashA1 !== hashB1)
  t.true(hashA !== hashB)
})

test('hash test equality 5', async t => {
  const a = {
    type: 'videoScreen',
    index: 0,
    id: '309aa290aa',
    video: '',
    buttonText: 'aa',
    image: '',
    title: 'my',
    description: '',
    name: 'Video Screen',
    aliases: [],
    children: [],
    videoMandatory: false
  }
  const b = {
    type: 'videoScreen',
    index: 0,
    id: '309aa290aa',
    video: '',
    buttonText: 'aax',
    image: '',
    title: 'my',
    description: '',
    name: 'Video Screen',
    aliases: [],
    children: [],
    videoMandatory: false
  }

  const hashA1 = hashObject(a)
  const hashB1 = hashObject(b)

  const hashA = hashObjectIgnoreKeyOrder(a)
  const hashB = hashObjectIgnoreKeyOrder(b)

  t.true(hashA1 !== hashB1)
  t.true(hashA !== hashB)
})

test('hash test equality 6', async t => {
  const a = {
    buttonText: 'aax'
  }
  const b = {
    buttonText: 'b'
  }

  const hashA1 = hashObject(a)
  const hashB1 = hashObject(b)

  const hashA = hashObjectIgnoreKeyOrder(a)
  const hashB = hashObjectIgnoreKeyOrder(b)

  t.true(hashA1 !== hashB1)
  t.true(hashA !== hashB)
})

test('hash test equality 7', async t => {
  const a = {
    type: 'videoScreen',
    index: 0,
    id: '309aa290aa',
    video: '',
    buttonText: 'a',
    image: '',
    title: 'my',
    description: '',
    name: 'Video Screen',
    aliases: [],
    children: [],
    videoMandatory: false
  }
  const b = {
    type: 'videoScreen',
    index: 0,
    id: '309aa290aa',
    video: '',
    buttonText: '',
    image: '',
    title: 'my',
    description: '',
    name: 'Video Screen',
    aliases: [],
    children: [],
    videoMandatory: false
  }

  const hashA1 = hashObject(a)
  const hashB1 = hashObject(b)

  const hashA = hashObjectIgnoreKeyOrder(a)
  const hashB = hashObjectIgnoreKeyOrder(b)

  t.true(hashA1 !== hashB1)
  t.true(hashA !== hashB)
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

test('hash fixed length', async t => {
  const texts = []
  for (let i = 0; i < 10000; i++) {
    const nr = Math.random() * 100
    texts[i] =
      nr < 33
        ? {
            blxxxa: ~~(Math.random() * 100 * 10000).toString(16),
            bla: ~~(Math.random() * 100 * 10000).toString(16)
          }
        : nr < 66
        ? (Math.random() * 100 * 10000).toString(16)
        : (Math.random() * 100000 * 10000).toString(16)
  }

  for (let i = 0; i < 10; i++) {
    const bla = texts[i]
    const x = hash(bla, 15)
    const y = hashCompact(bla, 9)
    const a = hashCompact(
      ['x', 'bla bla', 'snurkypatbs do it', { lifestyle: true }],
      10
    )
    const z = hashCompact(bla, 6)
    const blap = hashCompact(
      ['x', 'bla bla', 'snurkypatbs do it', { lifestyle: true }],
      20
    )
    const blurp = hashCompact(['x', 'bla bla', 'snurkypatbs do it'], 10)

    t.is(x.toString().length, 15)
    t.is(y.length, 9)
    t.is(a.length, 10)
    t.is(z.length, 6)
    t.is(blap.length, 20)
    t.is(blurp.length, 10)
  }
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
