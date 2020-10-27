import { Stream, PassThrough } from 'stream'

export default (stream: Stream): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const s = new PassThrough()
    s.on('error', err => {
      reject(err)
    })
    let buffers = []
    s.on('data', s => {
      if (typeof s === 'string') {
        buffers.push(Buffer.from(s))
      } else {
        buffers.push(s)
      }
    })
    s.on('end', x => {
      resolve(Buffer.concat(buffers))
    })
    // @ts-ignore
    stream.pipe(s)
  })
