import { Stream } from 'stream'

export default (stream: Stream): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    stream.on('error', err => {
      reject(err)
    })
    let buffers = []
    stream.on('data', s => {
      buffers.push(s)
    })
    stream.on('end', () => {
      resolve(Buffer.from(buffers))
    })
  })
