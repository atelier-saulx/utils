"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decode_1 = require("./decode");
const encode_1 = require("./encode");
const padding_1 = require("../padding");
exports.createEncoder = (chars, encodeChars = ['$']) => {
    let charLen = 1;
    const isLong = chars.length > 36;
    const realChars = [...chars, ...encodeChars];
    const replacement = realChars.map((v, i) => {
        if (v.length > charLen) {
            charLen = v.length;
        }
        if (i > 25) {
            return String(i - 26);
        }
        return String.fromCharCode(97 + i);
    });
    const charMap = {};
    const reverseCharMap = {};
    for (let i = 0; i < realChars.length; i++) {
        charMap[realChars[i]] =
            encodeChars.length === 1
                ? encodeChars[0] + replacement[i]
                : replacement[i];
        reverseCharMap[replacement[i]] = realChars[i];
    }
    let longest = 1;
    if (isLong) {
        for (const key in reverseCharMap) {
            if (key.length > longest) {
                longest = key.length;
            }
        }
        for (const key in reverseCharMap) {
            if (key.length < longest) {
                const nKey = padding_1.padLeft(key, longest, '0');
                const c = reverseCharMap[key];
                if (encodeChars.length > 1) {
                    charMap[c] = nKey;
                }
                else {
                    charMap[c] = encodeChars[0] + nKey;
                }
                delete reverseCharMap[key];
                reverseCharMap[nKey] = c;
            }
        }
    }
    return {
        charMap,
        reverseCharMap,
        encode: encode_1.createEncode(charLen, charMap, encodeChars),
        decode: decode_1.createDecode(isLong, longest, encodeChars, reverseCharMap),
    };
};
//# sourceMappingURL=index.js.map