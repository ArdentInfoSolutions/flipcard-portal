// import crypto from "crypto";

// const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET!; // 32 chars
// const IV_LENGTH = 16;

// export function encrypt(text: string) {
//     const iv = crypto.randomBytes(IV_LENGTH);
//     const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
//     const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
//     return iv.toString("hex") + ":" + encrypted.toString("hex");
// }

// export function decrypt(text: string) {
//     const [ivHex, encryptedHex] = text.split(":");
//     const iv = Buffer.from(ivHex, "hex");
//     const encrypted = Buffer.from(encryptedHex, "hex");
//     const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
//     const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
//     return decrypted.toString();
// }
