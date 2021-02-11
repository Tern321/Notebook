// LICENSE: https://github.com/scttcper/ts-base32/blob/master/LICENSE
// Copyright (c) Scott Cooper <scttcper@gmail.com>
const RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV';
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

type Variant = 'RFC3548' | 'RFC4648' | 'RFC4648-HEX' | 'Crockford';
class Base32
{
    static base16Encode(str): string {
        const byteArray = new TextEncoder().encode(str);
        var result: string = "";
        byteArray.forEach(val => result += val.toString(16));
        return result;
    }

    static base16Decode(str): string {
        var byteArray = new Uint8Array(str.length / 2);

        for (var i = 0; i < str.length; i = i + 2) {
            byteArray[i / 2] = parseInt(str.substring(i, i + 2), 16);
        }

        return new TextDecoder().decode(byteArray);;
    }
    //static test()
    //{
    //    const encoded = new TextEncoder().encode(str);

    //    console.log(encoded, decoded);
    //    var result: string = "";
    //    //g.toString(16)
    //    encoded.forEach(val => result += val.toString(16));
    //    console.log(result);
    //    var fixedArray = new Uint8Array(result.length / 2);

    //    for (var i = 0; i < result.length; i = i + 2) {
    //        fixedArray[i / 2] = parseInt(result.substring(i, i + 2), 16);
    //    }

    //    var fixedString = new TextDecoder().decode(fixedArray);
    //    console.log(fixedString);
    //}
    static encode_utf8(s) {
        return unescape(encodeURIComponent(s));
    }

    static decode_utf8(s) {
        return decodeURIComponent(escape(s));
    }

    static ab2str(buf: ArrayBuffer): string {
        var s = String.fromCharCode.apply(null, new Uint8Array(buf));
        return Base32.decode_utf8(Base32.decode_utf8(s))
    }

    static str2ab(str): ArrayBuffer {
        var s = Base32.encode_utf8(str)
        var buf = new ArrayBuffer(s.length);
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = s.length; i < strLen; i++) {
            bufView[i] = s.charCodeAt(i);
        }
        return bufView;
    }


    static base32Encode(str: string, variant: Variant = 'RFC4648', options: Partial<{ padding: boolean }> = {},): string {

        var buffer = Base32.str2ab(str);

        let alphabet: string;
        let defaultPadding: boolean;

        switch (variant) {
            case 'RFC3548':
            case 'RFC4648':
                alphabet = RFC4648;
                defaultPadding = true;
                break;
            case 'RFC4648-HEX':
                alphabet = RFC4648_HEX;
                defaultPadding = true;
                break;
            case 'Crockford':
                alphabet = CROCKFORD;
                defaultPadding = false;
                break;
            default:
                throw new Error(`Unknown base32 variant: ${variant as string}`);
        }

        const padding = options.padding === undefined ? defaultPadding : options.padding;
        const length = buffer.byteLength;
        const view = new Uint8Array(buffer);

        let bits = 0;
        let value = 0;
        let output = '';

        for (let i = 0; i < length; i++) {
            value = (value << 8) | view[i];
            bits += 8;

            while (bits >= 5) {
                output += alphabet[(value >>> (bits - 5)) & 31];
                bits -= 5;
            }
        }

        if (bits > 0) {
            output += alphabet[(value << (5 - bits)) & 31];
        }

        if (padding) {
            while (output.length % 8 !== 0) {
                output += '=';
            }
        }

        return output;
    }


    static readChar(alphabet: string, char: string): number {
        const idx = alphabet.indexOf(char);

        if (idx === -1) {
            throw new Error('Invalid character found: ' + char);
        }

        return idx;
    }


    static base32Decode(input: string, variant: Variant = 'RFC4648'): string {
        let alphabet: string;
        let cleanedInput: string;

        switch (variant) {
            case 'RFC3548':
            case 'RFC4648':
                alphabet = RFC4648;
                // eslint-disable-next-line no-useless-escape
                cleanedInput = input.toUpperCase().replace(/\=+$/, '');
                break;
            case 'RFC4648-HEX':
                alphabet = RFC4648_HEX;
                // eslint-disable-next-line no-useless-escape
                cleanedInput = input.toUpperCase().replace(/\=+$/, '');
                break;
            case 'Crockford':
                alphabet = CROCKFORD;
                cleanedInput = input.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1');
                break;
            default:
                throw new Error(`Unknown base32 variant: ${variant as string}`);
        }

        const { length } = cleanedInput;

        let bits = 0;
        let value = 0;

        let index = 0;
        const output = new Uint8Array(((length * 5) / 8) | 0);

        for (let i = 0; i < length; i++) {
            value = (value << 5) | Base32.readChar(alphabet, cleanedInput[i]);
            bits += 5;

            if (bits >= 8) {
                output[index++] = (value >>> (bits - 8)) & 255;
                bits -= 8;
            }
        }
        return Base32.ab2str(output.buffer);
    }

    /**
     * Turn a string of hexadecimal characters into an ArrayBuffer
     */

    static hexToArrayBuffer(hex: string): ArrayBuffer {
        if (hex.length % 2 !== 0) {
            throw new RangeError('Expected string to be an even number of characters');
        }

        const view = new Uint8Array(hex.length / 2);

        for (let i = 0; i < hex.length; i += 2) {
            view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }

        return view.buffer;
    }
}