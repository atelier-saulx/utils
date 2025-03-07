import test from 'ava'
import { toEnvVar } from '../src/index.js'

test('env var', async (t) => {
  const x = toEnvVar('@based/bla-bla-bla$_!')
  t.is(x, 'BASED_BLA_BLA_BLA')
})
