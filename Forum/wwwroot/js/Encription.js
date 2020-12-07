var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class EncriptionData {
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
    static encrypt(password, json) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = new EncriptionData();
            //console.log("encripting data");
            if (password.length > 0) {
                let salt = window.crypto.getRandomValues(new Uint8Array(16));
                data.saltJson = JSON.stringify(Array.from(salt));
                let iv = window.crypto.getRandomValues(new Uint8Array(12));
                data.ivJsonString = JSON.stringify(Array.from(iv));
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
                data.encriptedString = CryptoWarper.arrayBufferToBase64(ciphertext);
            }
            else {
                console.log("data not encripted");
                data.encriptedString = json;
            }
            //console.log("password ", password)
            //console.log("json ", json)
            //console.log("data.ivJsonString ", data.ivJsonString)
            //console.log("data.saltJson ", data.saltJson)
            //console.log("data.encriptedString", data.encriptedString)
            return data;
        });
    }
    /*
    Derive a key from a password supplied by the user, and use the key
    to decrypt the ciphertext.
    */
    static decrypt(password, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var iv = new Uint8Array(JSON.parse(data.ivJsonString));
            var salt = new Uint8Array(JSON.parse(data.saltJson));
            var ciphertext = CryptoWarper.base64ToArrayBuffer(data.encriptedString);
            //console.log("ciphertext " + data.encriptedString);
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
//# sourceMappingURL=Encription.js.map