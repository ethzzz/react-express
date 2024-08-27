import CryptoJs from "crypto-js";

const key = CryptoJs.enc.Utf8.parse("1234123412ABCDEF");
const iv = CryptoJs.enc.Utf8.parse("ABCDEF1234123412");

// 加密
export const aesEncrypt = (word: string) => {
    if(!word) return ''
    const encrypted = CryptoJs.AES.encrypt(word, key, {
        iv,
        mode: CryptoJs.mode.CBC,
        padding: CryptoJs.pad.Pkcs7
    });
    return encrypted.toString();
}

// 解密
export const aesDecrypt = (word: string) => {
    if(!word) return ''
    const decrypted = CryptoJs.AES.decrypt(word, key, {
        iv,
        mode: CryptoJs.mode.CBC,
        padding: CryptoJs.pad.Pkcs7
    });
    return decrypted.toString(CryptoJs.enc.Utf8);
}

// md5加密
export const md5Encrypt = (word: string) => {
    if(!word) return ''
    return CryptoJs.MD5(word).toString();
}

// 3des加密
export const tripleDesDecrypt = (word: string) => {
    if(!word) return ''
    const encrypted = CryptoJs.TripleDES.encrypt(word, key, {
        iv,
        mode: CryptoJs.mode.CBC,
        padding: CryptoJs.pad.Pkcs7
    });
    return encrypted.toString();
}

// 3des解密
export const tripleAesDecrypt = (word: string) => {
    if(!word) return ''
    const decrypted = CryptoJs.TripleDES.decrypt(word, key, {
        iv,
        mode: CryptoJs.mode.CBC,
        padding: CryptoJs.pad.Pkcs7
    });
    return decrypted.toString(CryptoJs.enc.Utf8);
}