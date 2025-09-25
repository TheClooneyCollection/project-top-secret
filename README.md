# Eleventy Passphrase Gate

A starter template for Eleventy projects that reveal their real content only after visitors solve custom questions. Correct answers combine into a passphrase that decrypts an encrypted HTML payload in the browser via WebCrypto.

## What You Get
- Lock screen rendered from `src/index.njk`, fully customizable through data and styles.
- Client-side unlock flow that fetches `page.enc.json`, derives a key with PBKDF2, and swaps in the decrypted markup.
- Node-based encryptor (`encrypt.js`) to package your own HTML reveal.
- Demo secret page (`examples/demo-secret.html`) you can replace with your own content.

## Prerequisites
- Node.js 18+ (Eleventy 3 requires an active LTS release).
- npm (bundled with Node).

## Quick Start
Install dependencies:

```bash
npm install
```

## Customize the Secret Page
1. Open `examples/demo-secret.html` and replace the placeholder content with your private message.
2. Keep an unencrypted copy somewhere safe—you need it whenever you regenerate the encrypted payload.

## Encrypt Your Content
Use the Node encryptor after finalizing your passphrase answers:
```bash
node encrypt.js "open sesame-1234" examples/demo-secret.html dist/page.enc.json
```
The command arguments are `password` (the exact passphrase string readers must assemble), `input` (your HTML file), and optional `output`. Run it any time the secret page changes so `dist/page.enc.json` stays current before building or serving.

## Build & Preview
1. Ensure `dist/page.enc.json` is up to date from the previous step.
2. Run Eleventy in dev/watch mode:
   ```bash
      npm run dev
   ```
   Edit files in `src/` or `src/_data/` to see live reloads of the lock screen.

## Configure the Unlock Flow
- Update `src/_data/unlock.yml`:
  - Customize the hero copy, helper notes, and button labels.
  - Define each question with `prompt`, `answer`, and optional fields such as `accept`, `stripCharacters`, or `description`.
  - Control passphrase assembly with `passphrase.order` (an ordered list of question IDs) and `passphrase.joiner` (string used to join segments). In the sample config the answers for `origin` and `code` become `open sesame-1234`.
  - Set `passphraseValue` when you want the passphrase segment to differ from the accepted display answer.
- Tweak layout or styling directly in `src/index.njk` if desired.

## Deploy
Deploy the contents of `dist/` to your static host (Netlify, Vercel, GitHub Pages, etc.). Verify that both `index.html` and `page.enc.json` are published together so the unlock flow can fetch the encrypted payload.

## Security Notes
- Share the passphrase out-of-band and rotate it when needed.
- Strong, high-entropy passphrases increase protection. The template derives a 256-bit AES key using PBKDF2-SHA256 with 200,000 iterations.
- Once the page decrypts in a visitor's browser, its HTML is visible. Avoid placing sensitive data you would not otherwise publish.

## Housekeeping
- `page.enc.json` and `dist/` stay out of version control; regenerate them whenever content or answers change.
- Adjust `.gitignore` or Eleventy passthrough settings if you add additional static assets.
