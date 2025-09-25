// encrypt.js
import crypto from "crypto";
import fs from "fs/promises";
import path from "node:path";

const password = process.argv[2]; // passphrase
const inFile   = process.argv[3]; // plaintext file (e.g., examples/demo-secret.html)
const outFile  = process.argv[4] || path.join("dist", "page.enc.json");

if (!password || !inFile) {
  console.error("Usage: node encrypt.js <password> <inputFile> [outFile]");
  process.exit(1);
}

const plaintext = await fs.readFile(inFile);

const salt = crypto.randomBytes(16);
const iv   = crypto.randomBytes(12);           // 96-bit IV for AES-GCM
const key  = crypto.pbkdf2Sync(password, salt, 200_000, 32, "sha256"); // 200k iters

const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
const tag = cipher.getAuthTag();

const payload = {
  alg: "AES-256-GCM",
  kdf: "PBKDF2-SHA256-200000",
  salt: salt.toString("base64"),
  iv:   iv.toString("base64"),
  ct:   ciphertext.toString("base64"),
  tag:  tag.toString("base64"),
};

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, JSON.stringify(payload));
console.log("Wrote", outFile);
