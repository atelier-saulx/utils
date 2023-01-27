import test from 'ava'
import { stringToUtf8, uft8ToString, decodeBase64, encodeBase64 } from '../src'

test('base64', async (t) => {
  const str = 'this is a nice string'
  const b64 = encodeBase64(stringToUtf8(str))
  t.is(b64, 'dGhpcyBpcyBhIG5pY2Ugc3RyaW5n')
  t.true(str !== b64)
  const strAgain = uft8ToString(decodeBase64(b64))
  t.is(strAgain, str)

  const utf8 = new Uint8Array([104, 101, 108, 108, 111])
  console.info(encodeBase64(utf8))
})

test('stringToUtf8', async (t) => {
  const str = 'hello'
  const utf = stringToUtf8(str)
  console.info(utf)
  const strAgain = uft8ToString(utf)
  t.is(strAgain, str)
})