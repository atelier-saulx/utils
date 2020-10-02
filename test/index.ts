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

  const hashStrA = hash('my ballz')
  const hashStrB = hash('my ballzzzz')

  t.true(hashStrA !== hashStrB)
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

  const hashStrA = hash('my b')
  const hashStrB = hash('my ba')

  t.true(hashStrA !== hashStrB)
  t.true(hashA1 !== hashB1)
  t.true(hashA !== hashB)
})

test.only('hash test equality 3', async t => {
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

  const hashStrA = hash('my b')
  const hashStrB = hash('my ba')

  t.true(hashStrA !== hashStrB)
  t.true(hashA1 !== hashB1)
  t.true(hashA !== hashB)
})
