import { Stream, Writable } from 'stream'

export const readStream = (
  stream: Stream,
  opts?: { throttle?: number; maxCunkSize?: number }
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const maxCunkSize = opts?.maxCunkSize ?? 0
    const throttle = opts?.throttle ?? 0
    const buffers: Buffer[] = []

    const processChunk = (c, next) => {
      buffers.push(c.slice(0, maxCunkSize))
      const chunkP = c.slice(maxCunkSize)
      if (chunkP.byteLength > maxCunkSize) {
        if (throttle) {
          setTimeout(() => {
            processChunk(chunkP, next)
          }, throttle)
        } else {
          processChunk(chunkP, next)
        }
      } else {
        if (throttle) {
          setTimeout(() => {
            next()
          }, throttle)
        } else {
          next()
        }
      }
    }

    const s = new Writable({
      write: (c, _encoding, next) => {
        if (maxCunkSize && c.byteLength > maxCunkSize) {
          processChunk(c, next)
        } else {
          if (typeof c === 'string') {
            buffers.push(Buffer.from(c))
          } else {
            buffers.push(c)
          }
          if (throttle) {
            setTimeout(() => {
              next()
            }, throttle)
          } else {
            next()
          }
        }
      },
    })

    s.on('error', (err) => {
      reject(err)
    })

    s.on('finish', () => {
      resolve(Buffer.concat(buffers))
    })

    stream.pipe(s)
  })
