import { PassThrough } from 'stream';
export default (stream) => new Promise((resolve, reject) => {
    const s = new PassThrough();
    s.on('error', (err) => {
        reject(err);
    });
    let buffers = [];
    s.on('data', (s) => {
        if (typeof s === 'string') {
            buffers.push(Buffer.from(s));
        }
        else {
            buffers.push(s);
        }
    });
    s.on('end', () => {
        resolve(Buffer.concat(buffers));
    });
    // @ts-ignore
    stream.pipe(s);
});
//# sourceMappingURL=readStream.js.map