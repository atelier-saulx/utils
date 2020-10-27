import { Stream, Readable, PassThrough, Writable, Duplex } from 'stream'

export default (stream: Stream): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    let pipit = false
    let s = stream
    if (stream instanceof Readable || stream instanceof PassThrough) {
      s = stream
    } else if (stream instanceof Writable || stream instanceof Duplex) {
      s = new PassThrough()
      pipit = true
    } else {
      console.warn('not an instance of stream - trying writable')
      // @ts-ignore
      s = new PassThrough(stream)
    }
    s.on('error', err => {
      reject(err)
    })
    let buffers = []
    s.on('data', s => {
      buffers.push(s)
    })
    s.on('end', () => {
      resolve(Buffer.from(buffers))
    })

    if (pipit) {
      // @ts-ignore
      stream.pipe(s)
    }
  })
