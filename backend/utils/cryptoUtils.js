// utils/cryptoUtils.js
import fs from "fs";
import path from "path";
import crypto from "crypto";

const PRIVATE_KEY = fs.readFileSync(path.join(process.cwd(), "private.pem"), "utf8");

export const b64 = (buf) => Buffer.from(buf).toString("base64");
export const fromB64 = (s) => Buffer.from(s, "base64");

// Decrypt RSA-wrapped AES key
export function decryptAesKey(encryptedKeyB64) {
    return crypto.privateDecrypt(
        {
            key: PRIVATE_KEY,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        fromB64(encryptedKeyB64)
    );
}

// Decrypt AES-GCM payload
export function decryptAesPayload(aesKeyBuf, ivB64, ciphertextB64, tagB64) {
    const iv = fromB64(ivB64);
    const ctBuf = fromB64(ciphertextB64);
    const tag = fromB64(tagB64);

    const decipher = crypto.createDecipheriv("aes-256-gcm", aesKeyBuf, iv);
    decipher.setAuthTag(tag);

    const part = decipher.update(ctBuf);
    const final = decipher.final();
    return Buffer.concat([part, final]).toString("utf8");
}

// Encrypt AES-GCM response
export function encryptAesPayload(aesKeyBuf, obj) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", aesKeyBuf, iv);
    const plain = Buffer.from(JSON.stringify(obj), "utf8");

    const part = cipher.update(plain);
    const final = cipher.final();
    const ciphertext = Buffer.concat([part, final]);
    const tag = cipher.getAuthTag();

    return {
        ciphertext: ciphertext.toString("base64"),
        iv: iv.toString("base64"),
        tag: tag.toString("base64"),
    };
}
