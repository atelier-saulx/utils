"use strict";
// Faster in some browsers e.g. chrome then native textEncoder (dont use in nodejs!)
Object.defineProperty(exports, "__esModule", { value: true });
exports.uft8ToString = (aBytes) => {
    let sView = '';
    let nPart;
    const nLen = aBytes.length;
    for (let nIdx = 0; nIdx < nLen; nIdx++) {
        nPart = aBytes[nIdx];
        sView += String.fromCodePoint(nPart > 251 && nPart < 254 && nIdx + 5 < nLen
            ? (nPart - 252) * 1073741824 +
                ((aBytes[++nIdx] - 128) << 24) +
                ((aBytes[++nIdx] - 128) << 18) +
                ((aBytes[++nIdx] - 128) << 12) +
                ((aBytes[++nIdx] - 128) << 6) +
                aBytes[++nIdx] -
                128
            : nPart > 247 && nPart < 252 && nIdx + 4 < nLen
                ? ((nPart - 248) << 24) +
                    ((aBytes[++nIdx] - 128) << 18) +
                    ((aBytes[++nIdx] - 128) << 12) +
                    ((aBytes[++nIdx] - 128) << 6) +
                    aBytes[++nIdx] -
                    128
                : nPart > 239 && nPart < 248 && nIdx + 3 < nLen
                    ? ((nPart - 240) << 18) +
                        ((aBytes[++nIdx] - 128) << 12) +
                        ((aBytes[++nIdx] - 128) << 6) +
                        aBytes[++nIdx] -
                        128
                    : nPart > 223 && nPart < 240 && nIdx + 2 < nLen
                        ? ((nPart - 224) << 12) +
                            ((aBytes[++nIdx] - 128) << 6) +
                            aBytes[++nIdx] -
                            128
                        : nPart > 191 && nPart < 224 && nIdx + 1 < nLen
                            ? ((nPart - 192) << 6) + aBytes[++nIdx] - 128
                            : nPart);
    }
    return sView;
};
exports.stringToUtf8 = (str) => {
    let nChr;
    const nStrLen = str.length;
    let nArrLen = 0;
    for (let nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
        nChr = str.codePointAt(nMapIdx);
        if (nChr >= 0x10000) {
            nMapIdx++;
        }
        nArrLen +=
            nChr < 0x80
                ? 1
                : nChr < 0x800
                    ? 2
                    : nChr < 0x10000
                        ? 3
                        : nChr < 0x200000
                            ? 4
                            : nChr < 0x4000000
                                ? 5
                                : 6;
    }
    const aBytes = new Uint8Array(nArrLen);
    let nIdx = 0;
    let nChrIdx = 0;
    while (nIdx < nArrLen) {
        nChr = str.codePointAt(nChrIdx);
        if (nChr < 128) {
            aBytes[nIdx++] = nChr;
        }
        else if (nChr < 0x800) {
            aBytes[nIdx++] = 192 + (nChr >>> 6);
            aBytes[nIdx++] = 128 + (nChr & 63);
        }
        else if (nChr < 0x10000) {
            aBytes[nIdx++] = 224 + (nChr >>> 12);
            aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
        }
        else if (nChr < 0x200000) {
            aBytes[nIdx++] = 240 + (nChr >>> 18);
            aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
            aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
            nChrIdx++;
        }
        else if (nChr < 0x4000000) {
            aBytes[nIdx++] = 248 + (nChr >>> 24);
            aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63);
            aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
            aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
            nChrIdx++;
        }
        else {
            // dont support more then 7 byte chars...
            aBytes[nIdx++] = 252 + (nChr >>> 30);
            aBytes[nIdx++] = 128 + ((nChr >>> 24) & 63);
            aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63);
            aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
            aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
            aBytes[nIdx++] = 128 + (nChr & 63);
            nChrIdx++;
        }
        nChrIdx++;
    }
    return aBytes;
};
//# sourceMappingURL=utf8.js.map