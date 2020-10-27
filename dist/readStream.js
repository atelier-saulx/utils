"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
exports.default = (stream) => new Promise((resolve, reject) => {
    let pipit = false;
    let s = stream;
    if (stream instanceof stream_1.Readable || stream instanceof stream_1.PassThrough) {
        s = stream;
    }
    else if (stream instanceof stream_1.Writable || stream instanceof stream_1.Duplex) {
        s = new stream_1.PassThrough();
        pipit = true;
    }
    else {
        console.warn('not an instance of stream - trying writable');
        // @ts-ignore
        s = new stream_1.PassThrough(stream);
    }
    s.on('error', err => {
        reject(err);
    });
    let buffers = [];
    s.on('data', s => {
        buffers.push(s);
    });
    s.on('end', () => {
        resolve(Buffer.from(buffers));
    });
    if (pipit) {
        // @ts-ignore
        stream.pipe(s);
    }
});
//# sourceMappingURL=readStream.js.map