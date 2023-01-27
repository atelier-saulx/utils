// UTF-8 array to JS string and vice versa
export const uft8ToString = (aBytes: Uint8Array): string => {
  let sView = ''
  let nPart: number
  const nLen = aBytes.length
  for (let nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = aBytes[nIdx]
    sView += String.fromCodePoint(
      nPart > 251 && nPart < 254 && nIdx + 5 < nLen /* six bytes */
        ? /* (nPart - 252 << 30) may be not so safe in ECMAScript! So…: */
          (nPart - 252) * 1073741824 +
            ((aBytes[++nIdx] - 128) << 24) +
            ((aBytes[++nIdx] - 128) << 18) +
            ((aBytes[++nIdx] - 128) << 12) +
            ((aBytes[++nIdx] - 128) << 6) +
            aBytes[++nIdx] -
            128
        : nPart > 247 && nPart < 252 && nIdx + 4 < nLen /* five bytes */
        ? ((nPart - 248) << 24) +
          ((aBytes[++nIdx] - 128) << 18) +
          ((aBytes[++nIdx] - 128) << 12) +
          ((aBytes[++nIdx] - 128) << 6) +
          aBytes[++nIdx] -
          128
        : nPart > 239 && nPart < 248 && nIdx + 3 < nLen /* four bytes */
        ? ((nPart - 240) << 18) +
          ((aBytes[++nIdx] - 128) << 12) +
          ((aBytes[++nIdx] - 128) << 6) +
          aBytes[++nIdx] -
          128
        : nPart > 223 && nPart < 240 && nIdx + 2 < nLen /* three bytes */
        ? ((nPart - 224) << 12) +
          ((aBytes[++nIdx] - 128) << 6) +
          aBytes[++nIdx] -
          128
        : nPart > 191 && nPart < 224 && nIdx + 1 < nLen /* two bytes */
        ? ((nPart - 192) << 6) + aBytes[++nIdx] - 128
        : /* nPart < 127 ? */ /* one byte */
          nPart
    )
  }
  return sView
}

export const stringToUtf8 = (str: string): Uint8Array => {
  let nChr: number
  const nStrLen = str.length
  let nArrLen = 0

  /* mapping… */
  for (let nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
    nChr = str.codePointAt(nMapIdx)

    if (nChr >= 0x10000) {
      nMapIdx++
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
        : 6
  }

  const aBytes = new Uint8Array(nArrLen)

  /* transcription… */
  let nIdx = 0
  let nChrIdx = 0
  while (nIdx < nArrLen) {
    nChr = str.codePointAt(nChrIdx)
    if (nChr < 128) {
      /* one byte */
      aBytes[nIdx++] = nChr
    } else if (nChr < 0x800) {
      /* two bytes */
      aBytes[nIdx++] = 192 + (nChr >>> 6)
      aBytes[nIdx++] = 128 + (nChr & 63)
    } else if (nChr < 0x10000) {
      /* three bytes */
      aBytes[nIdx++] = 224 + (nChr >>> 12)
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63)
      aBytes[nIdx++] = 128 + (nChr & 63)
    } else if (nChr < 0x200000) {
      /* four bytes */
      aBytes[nIdx++] = 240 + (nChr >>> 18)
      aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63)
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63)
      aBytes[nIdx++] = 128 + (nChr & 63)
      nChrIdx++
    } else if (nChr < 0x4000000) {
      /* five bytes */
      aBytes[nIdx++] = 248 + (nChr >>> 24)
      aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63)
      aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63)
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63)
      aBytes[nIdx++] = 128 + (nChr & 63)
      nChrIdx++
    } /* if (nChr <= 0x7fffffff) */ else {
      /* six bytes */
      aBytes[nIdx++] = 252 + (nChr >>> 30)
      aBytes[nIdx++] = 128 + ((nChr >>> 24) & 63)
      aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63)
      aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63)
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63)
      aBytes[nIdx++] = 128 + (nChr & 63)
      nChrIdx++
    }
    nChrIdx++
  }

  return aBytes
}
