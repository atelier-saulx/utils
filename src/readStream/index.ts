import { Stream, PassThrough } from 'stream'

export default (stream: Stream): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const s = new PassThrough()
    s.on('error', (err) => {
      reject(err)
    })
    let buffers: Buffer[] = []
    s.on('data', (s: Buffer | string) => {
      if (typeof s === 'string') {
        buffers.push(Buffer.from(s))
      } else {
        buffers.push(s)
      }
    })
    s.on('end', () => {
      resolve(Buffer.concat(buffers))
    })
    // @ts-ignore
    stream.pipe(s)
  })
