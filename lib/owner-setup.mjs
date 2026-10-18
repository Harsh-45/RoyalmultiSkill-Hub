import { randomBytes, randomUUID, scryptSync } from 'node:crypto'
import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import path from 'node:path'

export function validateOwnerPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 256 ||
    /[\p{Cc}\p{Zl}\p{Zp}]/u.test(password)) {
    throw Object.assign(new Error('Use a password of 12–256 characters without control characters or line breaks.'), { code: 'OWNER_PASSWORD_INVALID' })
  }
}

async function atomicPrivateWrite(file, contents) {
  const temporary = `${file}.${randomUUID()}.tmp`
  let handle
  try {
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 })
    handle = await open(temporary, 'wx', 0o600)
    await handle.writeFile(contents, 'utf8')
    await handle.sync()
    await handle.close()
    handle = undefined
    await rename(temporary, file)
  } catch (error) {
    if (handle) await handle.close().catch(() => {})
    await unlink(temporary).catch(() => {})
    throw error
  }
}

// Only called after password validation and confirmation. The caller supplies
// its project root; tests use temporary directories, never real credentials.
export async function writeOwnerCredentials({ root, password, generated = false }) {
  validateOwnerPassword(password)
  const envFile = path.join(root, '.env.local')
  const accessFile = path.join(root, '.booking-data', 'owner-login.txt')
  let contents = await readFile(envFile, 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return ''
    throw error
  })
  const salt = randomBytes(16).toString('hex')
  const hash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`
  const secret = randomBytes(48).toString('base64url')
  contents = contents.replace(/^[\t ]*(?:export[\t ]+)?OWNER_(PASSWORD|PASSWORD_HASH|SESSION_SECRET)[\t ]*=[^\r\n]*(?:\r?\n|$)/gm, '').trimEnd()
  const updated = `${contents}${contents ? '\n\n' : ''}# Owner booking access (server only; never commit this file)\nOWNER_PASSWORD_HASH=${hash}\nOWNER_SESSION_SECRET=${secret}\n`
  await atomicPrivateWrite(envFile, updated)
  await atomicPrivateWrite(accessFile, [
    'Royal Multiskill Hub — local owner access',
    'Dashboard: http://localhost:3000/owner',
    generated ? `Password: ${password}` : 'Password: use the password you selected. It is not saved in this file.',
    '',
    'This file and .env.local are private and excluded from Git.',
    'Keep your password private. Choose a new password with: npm run owner:password',
    'Generate a random replacement with: npm run booking:setup -- --reset',
    'For deployment copy OWNER_PASSWORD_HASH and OWNER_SESSION_SECRET from .env.local to the host environment.',
    'Remove any old OWNER_PASSWORD value from the host environment, then redeploy.',
    'The local command does not change the live website until those settings are deployed.',
    'Do not upload this directory or the development bookings file to public hosting.',
  ].join('\n') + '\n')
  return { envFile, accessFile }
}
