"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fillEmpty = (str, len) => {
    const l = str.length;
    for (let i = 0; i < len - l; i++) {
        str = '0' + str;
    }
    return str;
};
exports.createEncoder = (chars, char = '$') => {
    const isLong = chars.length > 36;
    const realChars = [...chars, char];
    const replacement = realChars.map((v, i) => {
        if (i > 25) {
            return char + (i - 26);
        }
        return char + String.fromCharCode(97 + i);
    });
    const charMap = {};
    const reverseCharMap = {};
    for (let i = 0; i < realChars.length; i++) {
        charMap[realChars[i]] = replacement[i];
        reverseCharMap[replacement[i].slice(1)] = realChars[i];
    }
    let longest = 0;
    if (isLong) {
        for (const key in reverseCharMap) {
            if (key.length > longest) {
                longest = key.length;
            }
        }
        for (const key in reverseCharMap) {
            if (key.length < longest) {
                const nKey = fillEmpty(key, longest);
                const c = reverseCharMap[key];
                charMap[c] = char + nKey;
                delete reverseCharMap[key];
                reverseCharMap[nKey] = c;
            }
        }
    }
    return {
        charMap,
        reverseCharMap,
        encode: (input) => {
            let str = '';
            for (let i = 0; i < input.length; i++) {
                const c = input[i];
                if (charMap[c]) {
                    str += charMap[c];
                }
                else {
                    str += c;
                }
            }
            return str;
        },
        decode: isLong
            ? (input) => {
                let str = '';
                for (let i = 0; i < input.length; i++) {
                    const c = input[i];
                    if (c === char) {
                        let fInput = '';
                        for (let j = 0; j < longest; j++) {
                            fInput += input[i + j + 1];
                        }
                        const f = reverseCharMap[fInput];
                        str += f;
                        i += longest;
                    }
                    else {
                        str += c;
                    }
                }
                return str;
            }
            : (input) => {
                let str = '';
                for (let i = 0; i < input.length; i++) {
                    const c = input[i];
                    if (c === char) {
                        const f = reverseCharMap[input[i + 1]];
                        str += f;
                        i++;
                    }
                    else {
                        str += c;
                    }
                }
                return str;
            },
    };
};
//# sourceMappingURL=encoder.js.map