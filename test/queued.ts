import test from 'ava'
import { wait, queued } from '../src/index.js'

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
