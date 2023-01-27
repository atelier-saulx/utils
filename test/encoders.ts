import test from 'ava'
import {
  stringToUtf8,
  uft8ToString,
  decodeBase64,
  encodeBase64,
  createEncoder,
} from '../src'

test('base64', async (t) => {
  const str = 'this is a nice string'
  const b64 = encodeBase64(stringToUtf8(str))
  t.is(b64, 'dGhpcyBpcyBhIG5pY2Ugc3RyaW5n')
  t.true(str !== b64)
  const strAgain = uft8ToString(decodeBase64(b64))
  t.is(strAgain, str)
})

test('stringToUtf8', async (t) => {
  const str = 'hello'
  const utf = stringToUtf8(str)
  const strAgain = uft8ToString(utf)
  t.is(strAgain, str)
})

test('createEncoder', async (t) => {
  const chars = [
    '(',
    ')',
    '<',
    '>',
    '@',
    ',',
    ';',
    ':',
    '\\',
    '"',
    '/',
    '[',
    ']',
    '?',
    '=',
    '{',
    '}',
    ' ',
  ]
  const str = '$100he*llo*bla=*'
  const { encode, decode } = createEncoder(chars, '*')
  const s = encode(str)
  const x = decode(s)
  t.true(s !== str)
  t.is(x, str)
  t.true(true)
})

test('createEncoder long', async (t) => {
  const chars: string[] = []
  for (let i = 0; i < 200; i++) {
    chars.push(String.fromCharCode(i + 97))
  }
  const str = '$100hellobla='
  const { encode, decode } = createEncoder(chars)
  const s = encode(str)
  t.true(s !== str)
  const x = decode(s)
  t.is(x, str)
  t.true(true)
})

test('createEncoder 🥹', async (t) => {
  const chars: string[] = ['🥹']
  const str = '1🥹flapfl*ap!*'
  const { encode, decode } = createEncoder(chars, '*')
  const s = encode(str)
  t.true(s !== str)
  const x = decode(s)
  t.is(x, str)
  t.true(true)
})

test('createEncoder compressor', async (t) => {
  const chars: string[] = [
    'wow',
    'this',
    'and',
    'nice',
    'little',
    'Hello',
    'great',
    'write',
    'about',
    'thing',
  ]
  const str =
    'wow this is nice little thing to write about! wow Hello and this is great'
  const { encode, decode } = createEncoder(chars, '*')
  const s = encode(str)
  console.info('    ', s)
  t.true(s !== str)
  const x = decode(s)
  t.is(x, str)
  t.true(s.length < str.length)
  t.true(true)
})
