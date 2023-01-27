"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create string of random character of specified length
 * @param length length of required string
 * @param opts By default, all chars are allowed. It's possible to disable certain chars using these options.
 * Options are `specials` `lowerCase` `upperCase` `numbers`
 */
function randomString(length, opts) {
    var _a, _b, _c, _d;
    const noSpecials = ((_a = opts) === null || _a === void 0 ? void 0 : _a.noSpecials) || false;
    const noLowerCase = ((_b = opts) === null || _b === void 0 ? void 0 : _b.noLowerCase) || false;
    const noUpperCase = ((_c = opts) === null || _c === void 0 ? void 0 : _c.noUpperCase) || false;
    const noNumbers = ((_d = opts) === null || _d === void 0 ? void 0 : _d.noNumbers) || false;
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialsChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    let dictionary = '';
    if (!noSpecials) {
        dictionary += specialsChars;
    }
    if (!noLowerCase) {
        dictionary += lowerCaseChars;
    }
    if (!noUpperCase) {
        dictionary += upperCaseChars;
    }
    if (!noNumbers) {
        dictionary += numberChars;
    }
    let result = '';
    const charactersLength = dictionary.length;
    for (let i = 0; i < length; i++) {
        result += dictionary.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.default = randomString;
//# sourceMappingURL=randomString.js.map