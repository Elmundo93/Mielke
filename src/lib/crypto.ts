import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGO = "aes-256-gcm";

export type EncryptedValue = { iv: string; tag: string; value: string };

function getKey(): Buffer {
  const raw = process.env.SMTP_SETTINGS_ENCRYPTION_KEY;
  if (!raw) throw new Error("SMTP_SETTINGS_ENCRYPTION_KEY ist nicht gesetzt.");
  const buf = Buffer.from(raw, "base64");
  if (buf.length !== 32)
    throw new Error("SMTP_SETTINGS_ENCRYPTION_KEY muss exakt 32 Bytes (base64-kodiert) sein.");
  return buf;
}

export function encryptSecret(plaintext: string): EncryptedValue {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    value: encrypted.toString("base64"),
  };
}

export function decryptSecret(payload: EncryptedValue): string {
  const key = getKey();
  const decipher = createDecipheriv(ALGO, key, Buffer.from(payload.iv, "base64"));
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(payload.value, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

export function isEncryptionAvailable(): boolean {
  return !!process.env.SMTP_SETTINGS_ENCRYPTION_KEY;
}
