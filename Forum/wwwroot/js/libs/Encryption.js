var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class EncryptionData {
}
class CryptoWarper {
    /*
    Get some key material to use as input to the deriveKey method.
    The key material is a password supplied by the user.
    */
    static getKeyMaterial(password) {
        let enc = new TextEncoder();
        return window.crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
    }
    /*
    Given some key material and some random salt
    derive an AES-GCM key using PBKDF2.
    */
    static getKey(keyMaterial, salt) {
        return window.crypto.subtle.deriveKey({
            "name": "PBKDF2",
            salt: salt,
            "iterations": 100000,
            "hash": "SHA-256"
        }, keyMaterial, { "name": "AES-GCM", "length": 256 }, true, ["encrypt", "decrypt"]);
    }
    static arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    static base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    static bytesArrToBase64(arr) {
        const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; // base64 alphabet
        const bin = n => n.toString(2).padStart(8, 0); // convert num to 8-bit binary string
        const l = arr.length;
        let result = '';
        for (let i = 0; i <= (l - 1) / 3; i++) {
            let c1 = i * 3 + 1 >= l; // case when "=" is on end
            let c2 = i * 3 + 2 >= l; // case when "=" is on end
            let chunk = bin(arr[3 * i]) + bin(c1 ? 0 : arr[3 * i + 1]) + bin(c2 ? 0 : arr[3 * i + 2]);
            let r = chunk.match(/.{1,6}/g).map((x, j) => j == 3 && c2 ? '=' : (j == 2 && c1 ? '=' : abc[+('0b' + x)]));
            result += r.join('');
        }
        return result;
    }
    static Int8toBase64(u8) {
        return btoa(String.fromCharCode.apply(null, u8));
    }
    static Base64ToInt8(b64encoded) {
        return new Uint8Array(atob(b64encoded).split('').map(function (c) { return c.charCodeAt(0); }));
    }
    static randomString(length) {
        let iv = window.crypto.getRandomValues(new Uint8Array(length));
        return CryptoWarper.Int8toBase64(iv);
    }
    static encrypt(password, json) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = new EncryptionData();
            if (password.length > 0) {
                let salt = window.crypto.getRandomValues(new Uint8Array(16));
                data.salt = CryptoWarper.Int8toBase64(salt);
                let iv = window.crypto.getRandomValues(new Uint8Array(12));
                data.iv = CryptoWarper.Int8toBase64(iv);
                let keyMaterial = yield CryptoWarper.getKeyMaterial(password);
                let key = yield CryptoWarper.getKey(keyMaterial, salt);
                //const keyMaterialJson = crypto.subtle.exportKey("jwk", keyMaterial);
                //const keyJson = crypto.subtle.exportKey("jwk", key);
                //console.log("keyMaterial ", keyMaterialJson)
                //console.log("key ", keyJson)
                let enc = new TextEncoder();
                let encoded = enc.encode(json);
                var ciphertext = yield window.crypto.subtle.encrypt({
                    name: "AES-GCM",
                    iv: iv
                }, key, encoded);
                data.encStr = CryptoWarper.arrayBufferToBase64(ciphertext);
            }
            else {
                console.log("data not encrypted");
                data.encStr = json;
            }
            console.log("encripting data");
            console.log(json);
            //console.log(JSON.stringify(data));
            //console.log("password ", password)
            //console.log("json ", json)
            console.log(" encrypted  string");
            console.log(data.encStr);
            console.log("===");
            //console.log("data.ivJsonString ", data.ivJsonString)
            //console.log("data.saltJson ", data.saltJson)
            //console.log("data.encryptedString", data.encryptedString)
            return data;
        });
    }
    /*
    Derive a key from a password supplied by the user, and use the key
    to decrypt the ciphertext.
    */
    static decrypt(password, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var iv = CryptoWarper.Base64ToInt8(data.iv);
            var salt = CryptoWarper.Base64ToInt8(data.salt);
            var ciphertext = CryptoWarper.base64ToArrayBuffer(data.encStr);
            //console.log("ciphertext " + data.encryptedString);
            let keyMaterial = yield CryptoWarper.getKeyMaterial(password);
            let key = yield CryptoWarper.getKey(keyMaterial, salt);
            try {
                let decrypted = yield window.crypto.subtle.decrypt({
                    name: "AES-GCM",
                    iv: iv
                }, key, ciphertext);
                let dec = new TextDecoder();
                return dec.decode(decrypted);
            }
            catch (e) {
                console.log("decript error ");
                alert("Вероятно вы ввели неправильный ключ");
                return "[]";
            }
        });
    }
}
//# sourceMappingURL=Encryption.js.map