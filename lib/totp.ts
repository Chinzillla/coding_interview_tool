import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const ISSUER = "Coding Interview Study Tool";
const PERIOD_SECONDS = 30;
const DIGITS = 6;

export function generateTotpSecret() {
  const bytes = randomBytes(20);
  let bits = "";
  let output = "";

  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, "0");
    while (bits.length >= 5) {
      output += BASE32_ALPHABET[parseInt(bits.slice(0, 5), 2)];
      bits = bits.slice(5);
    }
  }

  if (bits.length > 0) {
    output += BASE32_ALPHABET[parseInt(bits.padEnd(5, "0"), 2)];
  }

  return output;
}

export function formatTotpSecret(secret: string) {
  return secret.match(/.{1,4}/g)?.join(" ") ?? secret;
}

function decodeBase32(secret: string) {
  const normalized = secret.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  const bytes: number[] = [];

  for (const char of normalized) {
    const value = BASE32_ALPHABET.indexOf(char);
    if (value < 0) continue;
    bits += value.toString(2).padStart(5, "0");

    while (bits.length >= 8) {
      bytes.push(parseInt(bits.slice(0, 8), 2));
      bits = bits.slice(8);
    }
  }

  return Buffer.from(bytes);
}

function codeForCounter(secret: string, counter: number) {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  counterBuffer.writeUInt32BE(counter >>> 0, 4);

  const digest = createHmac("sha1", decodeBase32(secret)).update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binary % 10 ** DIGITS).padStart(DIGITS, "0");
}

export function verifyTotpCode(secret: string, code: string | null | undefined) {
  const normalizedCode = String(code ?? "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(normalizedCode)) return false;

  const currentCounter = Math.floor(Date.now() / 1000 / PERIOD_SECONDS);
  const actual = Buffer.from(normalizedCode);

  for (const drift of [-1, 0, 1]) {
    const expected = Buffer.from(codeForCounter(secret, currentCounter + drift));
    if (expected.length === actual.length && timingSafeEqual(expected, actual)) {
      return true;
    }
  }

  return false;
}

export function buildTotpUri(email: string, secret: string) {
  const label = `${ISSUER}:${email.toLowerCase()}`;
  const params = new URLSearchParams({
    secret,
    issuer: ISSUER,
    algorithm: "SHA1",
    digits: String(DIGITS),
    period: String(PERIOD_SECONDS)
  });

  return `otpauth://totp/${encodeURIComponent(label)}?${params.toString()}`;
}
