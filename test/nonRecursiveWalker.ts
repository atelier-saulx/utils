import test from 'ava'
import { nonRecursiveWalker } from '../src/nonRecursiveWalker.js'
import { getByPath } from '../src/path.js'

test('non recursive walker', (t) => {
  let result: string[] = []
  const obj = {
    a1: {
      a1b1: {
        a1b1c1: 'a1b1c1',
        a1b1c2: {
          a1b1c2d1: 'a1b1c2d1',
        },
      },
    },
    a2: 'a2',
    a3: {
      a3b1: 'a3b1',
    },
  }
  nonRecursiveWalker(
    obj,
    (target, path, type) => {
      result.push(path.join('.'))
      t.is(getByPath(obj, path), target)
      if (path.join('.') === 'a1.a1b1') {
        t.is(type, 1)
      }
      if (path.join('.') === 'a2') {
        t.is(type, 0)
      }
    },
    true
  )
  t.deepEqual(
    result.sort(),
    [
      'a1',
      'a1.a1b1',
      'a1.a1b1.a1b1c1',
      'a1.a1b1.a1b1c2',
      'a1.a1b1.a1b1c2.a1b1c2d1',
      'a2',
      'a3',
      'a3.a3b1',
    ].sort()
  )

  result = []
  nonRecursiveWalker(obj, (_target, path, _type) => {
    result.push(path.join('.'))
  })
  t.deepEqual(
    result.sort(),
    ['a1.a1b1.a1b1c1', 'a1.a1b1.a1b1c2.a1b1c2d1', 'a2', 'a3.a3b1'].sort()
  )

  t.notThrows(() => {
    nonRecursiveWalker(
      {
        a1: 'a1',
        a2: null,
        a3: {
          a3b1: 'a3b1',
          a3b2: {
            a3b2c1: null,
          },
        },
      },
      (_target, _path, _type) => {}
    )
  })
  t.notThrows(() => {
    nonRecursiveWalker({}, (_target, _path, _type) => {
      t.fail()
    })
  })
  t.notThrows(() => {
    nonRecursiveWalker(undefined, (_target, _path, _type) => {
      t.fail()
    })
  })
  t.notThrows(() => {
    nonRecursiveWalker(null, (_target, _path, _type) => {
      t.fail()
    })
  })
  t.notThrows(() => {
    nonRecursiveWalker('string', (_target, _path, _type) => {
      t.fail()
    })
  })
  t.throws(
    () => {
      // @ts-ignore
      nonRecursiveWalker({}, 'string')
    },
    {
      message: 'fn must be a function',
    }
  )
})
