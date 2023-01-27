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
  const str = '$100hellobla='
  const { encode, decode } = createEncoder(chars)
  const s = encode(str)
  const x = decode(s)
  t.is(x, str)
  t.true(true)
})

test('createEncoder long', async (t) => {
  const chars: string[] = []
  for (let i = 0; i < 37; i++) {
    chars.push(String.fromCharCode(i + 97))
  }
  const str = '$100hellobla='
  const { encode, decode, reverseCharMap, charMap } = createEncoder(chars)

  console.log(reverseCharMap, charMap)
  const s = encode(str)
  const x = decode(s)
  t.is(x, str)
  t.true(true)
})
