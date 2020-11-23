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
  toEnvVar,
  readStream,
  queued,
  obscurify
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

test('hash colish', async t => {
  var d = Date.now()
  const prevs = []

  for (let i = 0; i < 1; i++) {
    const set = {}
    prevs.push(set)
    let cnt = 0
    while (cnt < 1e6) {
      const ip =
        Math.floor(Math.random() * 255) +
        1 +
        '.' +
        Math.floor(Math.random() * 255) +
        '.' +
        Math.floor(Math.random() * 255) +
        '.' +
        Math.floor(Math.random() * 255)

      const x = hash(ip)

      let prev

      for (let j = 0; j < i + 1; j++) {
        prev = prevs[j][x]
        if (prev) {
          break
        }
      }

      if (prev) {
        if (prev !== ip) {
          t.fail('Colish ' + ip + ' ' + prev + ' hash ' + x)
        }
      }
      cnt++

      set[x] = ip
    }
  }

  t.pass()
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

test('hash  hashObjectIgnoreKeyOrder large', async t => {
  const a = {
    children: [
      {
        type: 'waitingScreen',
        index: 0,
        id: 'wa4ab7e44c',
        disabled: false,
        title: 'Wait # 1'
      },
      {
        type: 'welcomeScreen',
        index: 1,
        id: 'we7e8b4bfc',
        disabled: false,
        title: 'The voting will start soon!'
      },
      {
        type: 'videoScreen',
        index: 2,
        id: 'vi6d2e21ca',
        title: 'Watch the recap first!',
        disabled: false,
        video:
          'https://based-videos-fra.s3.eu-central-1.amazonaws.com/5f9bdb334d7c7d975473bab4413f1d73/5f9bdb334d7c7d975473bab4413f1d73.m3u8'
      },
      {
        type: 'multipleChoice',
        index: 3,
        id: 'mu241ab268',
        disabled: false,
        title: 'Pick 3 of your favorite songs and submit your vote.'
      },
      {
        type: 'thankYouScreen',
        index: 4,
        id: 'thba70c809',
        disabled: false,
        title: 'Thank you for voting!'
      }
    ],
    type: 'edition',
    title: 'JESC 2020',
    ogImage: '',
    id: 'ed936c4793',
    ogTitle: '',
    ogDescription: '',
    aliases: ['jesc'],
    name: '',
    config: {
      logo:
        'https://static.junioreurovision.tv/dist/assets/images/jesc_slogan.c6c10aa7dcf40254bf08d7f7f3d65b90.png',
      borderWidth: 0,
      borderRadius: 0,
      logoLink: 'https://hotmail.com'
    },
    logo: '',
    updatedAt: 1605711695555,
    theme: {
      buttonText: 'rgb(245,245,245)',
      highlight: 'rgb(49,130,206)',
      backgroundImage:
        'https://based-images.imgix.net/c37e075134b55505f28fc28c7c21536c.png',
      background: 'rgb(17,11,87)',
      itemBackground: 'rgb(252,252,252)',
      itemText: 'rgb(0,0,0)',
      text: 'rgb(254,255,254)'
    },
    companyName: ''
  }

  const b = {
    children: [
      {
        type: 'waitingScreen',
        index: 0,
        id: 'wa4ab7e44c',
        disabled: true,
        title: 'Wait # 1'
      },
      {
        type: 'welcomeScreen',
        index: 1,
        id: 'we7e8b4bfc',
        disabled: false,
        title: 'The voting will start soon!'
      },
      {
        type: 'videoScreen',
        index: 2,
        id: 'vi6d2e21ca',
        title: 'Watch the recap first!',
        disabled: false,
        video:
          'https://based-videos-fra.s3.eu-central-1.amazonaws.com/5f9bdb334d7c7d975473bab4413f1d73/5f9bdb334d7c7d975473bab4413f1d73.m3u8'
      },
      {
        type: 'multipleChoice',
        index: 3,
        id: 'mu241ab268',
        disabled: false,
        title: 'Pick 3 of your favorite songs and submit your vote.'
      },
      {
        type: 'thankYouScreen',
        index: 4,
        id: 'thba70c809',
        disabled: false,
        title: 'Thank you for voting!'
      }
    ],
    type: 'edition',
    title: 'JESC 2020',
    ogImage: '',
    id: 'ed936c4793',
    ogTitle: '',
    ogDescription: '',
    aliases: ['jesc'],
    name: '',
    config: {
      logo:
        'https://static.junioreurovision.tv/dist/assets/images/jesc_slogan.c6c10aa7dcf40254bf08d7f7f3d65b90.png',
      borderWidth: 0,
      borderRadius: 0,
      logoLink: 'https://hotmail.com'
    },
    logo: '',
    updatedAt: 1605711695555,
    theme: {
      buttonText: 'rgb(245,245,245)',
      highlight: 'rgb(49,130,206)',
      backgroundImage:
        'https://based-images.imgix.net/c37e075134b55505f28fc28c7c21536c.png',
      background: 'rgb(17,11,87)',
      itemBackground: 'rgb(252,252,252)',
      itemText: 'rgb(0,0,0)',
      text: 'rgb(254,255,254)'
    },
    companyName: ''
  }

  const x = hashObjectIgnoreKeyOrder(a)
  const y = hashObjectIgnoreKeyOrder(b)

  t.true(x !== y)
})

test('hash  hashObjectIgnoreKeyOrder large 2', async t => {
  const a = {
    children: [
      {
        type: 'waitingScreen',
        index: 0,
        id: 'wa4ab7e44c',
        disabled: false,
        title: 'Wait # 1'
      },
      {
        type: 'welcomeScreen',
        index: 1,
        id: 'we7e8b4bfc',
        disabled: false,
        title: 'The voting will start soon!'
      },
      {
        type: 'videoScreen',
        index: 2,
        id: 'vi6d2e21ca',
        title: 'Watch the recap first!',
        disabled: false,
        video:
          'https://cdn.based.io/ef728d8a807067f2e73591d4850c5f8a/ef728d8a807067f2e73591d4850c5f8a.m3u8'
      },
      {
        type: 'multipleChoice',
        index: 3,
        id: 'mu241ab268',
        disabled: false,
        title: 'Pick 3 of your favorite songs and submit your vote.'
      },
      {
        type: 'thankYouScreen',
        index: 4,
        id: 'thba70c809',
        disabled: false,
        title: 'Thank you for voting!'
      }
    ],
    type: 'edition',
    title: 'JESC 2020',
    ogImage: '',
    id: 'ed936c4793',
    ogTitle: '',
    ogDescription: '',
    aliases: ['jesc'],
    name: '',
    config: {
      logo:
        'https://static.junioreurovision.tv/dist/assets/images/jesc_slogan.c6c10aa7dcf40254bf08d7f7f3d65b90.png',
      borderWidth: 0,
      borderRadius: 0,
      logoLink: 'https://hotmail.com'
    },
    logo: '',
    updatedAt: 1605711695555,
    theme: {
      buttonText: 'rgb(245,245,245)',
      highlight: 'rgb(49,130,206)',
      backgroundImage:
        'https://based-images.imgix.net/c37e075134b55505f28fc28c7c21536c.png',
      background: 'rgb(17,11,87)',
      itemBackground: 'rgb(252,252,252)',
      itemText: 'rgb(0,0,0)',
      text: 'rgb(254,255,254)'
    },
    companyName: ''
  }

  const b = {
    children: [
      {
        type: 'waitingScreen',
        index: 0,
        id: 'wa4ab7e44c',
        disabled: true,
        title: 'Wait # 1'
      },
      {
        type: 'welcomeScreen',
        index: 1,
        id: 'we7e8b4bfc',
        disabled: false,
        title: 'The voting will start soon!'
      },
      {
        type: 'videoScreen',
        index: 2,
        id: 'vi6d2e21ca',
        title: 'Watch the recap first!',
        disabled: false,
        video:
          'https://cdn.based.io/ef728d8a807067f2e73591d4850c5f8a/ef728d8a807067f2e73591d4850c5f8a.m3u8'
      },
      {
        type: 'multipleChoice',
        index: 3,
        id: 'mu241ab268',
        disabled: false,
        title: 'Pick 3 of your favorite songs and submit your vote.'
      },
      {
        type: 'thankYouScreen',
        index: 4,
        id: 'thba70c809',
        disabled: false,
        title: 'Thank you for voting!'
      }
    ],
    type: 'edition',
    title: 'JESC 2020',
    ogImage: '',
    id: 'ed936c4793',
    ogTitle: '',
    ogDescription: '',
    aliases: ['jesc'],
    name: '',
    config: {
      logo:
        'https://static.junioreurovision.tv/dist/assets/images/jesc_slogan.c6c10aa7dcf40254bf08d7f7f3d65b90.png',
      borderWidth: 0,
      borderRadius: 0,
      logoLink: 'https://hotmail.com'
    },
    logo: '',
    updatedAt: 1605711695555,
    theme: {
      buttonText: 'rgb(245,245,245)',
      highlight: 'rgb(49,130,206)',
      backgroundImage:
        'https://based-images.imgix.net/c37e075134b55505f28fc28c7c21536c.png',
      background: 'rgb(17,11,87)',
      itemBackground: 'rgb(252,252,252)',
      itemText: 'rgb(0,0,0)',
      text: 'rgb(254,255,254)'
    },
    companyName: ''
  }

  var d = Date.now()
  const x = hashObjectIgnoreKeyOrder(a)
  const y = hashObjectIgnoreKeyOrder(b)

  t.true(x !== y)
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
  const { PassThrough } = require('stream')
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
  let d = Date.now()
  await Promise.all(args.map(v => myFnQueud(...v)))
  const ellapsed = Date.now() - d
  t.true(ellapsed > 1000 && ellapsed < 3000)
})
