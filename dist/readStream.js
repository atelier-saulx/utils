"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (stream) => new Promise((resolve, reject) => {
    stream.on('error', err => {
        reject(err);
    });
    let buffers = [];
    stream.on('data', s => {
        buffers.push(s);
    });
    stream.on('end', () => {
        resolve(Buffer.from(buffers));
    });
});
//# sourceMappingURL=readStream.js.map