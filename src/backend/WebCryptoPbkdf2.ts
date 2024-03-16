// ---- For password hashing ----
const PBKDF2 = 'PBKDF2'
const PBKDF2_ALGORITHM = 'SHA-512'
const PBKDF2_ITERATIONS = 210000 // From OWASP
const PBKDF2_KEY_LENGTH = 256 // Bits

export async function pbkdf2(rawPassword: string): Promise<string> {
  const passphrase = new TextEncoder().encode(rawPassword);

  const importedKey = await window.crypto.subtle.importKey(
    'raw', passphrase, { name: 'PBKDF2' }, false, ['deriveBits']);
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: PBKDF2,
      hash: PBKDF2_ALGORITHM,
      salt: new TextEncoder().encode(''),
      iterations: PBKDF2_ITERATIONS
    },
    importedKey,
    PBKDF2_KEY_LENGTH
  )

  return bufferToBase64(derivedBits)
}

function bufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
}
