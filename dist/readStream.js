"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
exports.default = (stream) => new Promise((resolve, reject) => {
    const s = new stream_1.PassThrough();
    s.on('error', err => {
        reject(err);
    });
    let buffers = [];
    s.on('data', s => {
        if (typeof s === 'string') {
            buffers.push(Buffer.from(s));
        }
        else {
            buffers.push(s);
        }
    });
    s.on('end', x => {
        resolve(Buffer.concat(buffers));
    });
    // @ts-ignore
    stream.pipe(s);
});
//# sourceMappingURL=readStream.js.map