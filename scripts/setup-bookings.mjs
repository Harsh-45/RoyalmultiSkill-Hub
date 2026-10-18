import { randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { Writable } from 'node:stream'
import { createInterface } from 'node:readline'
import { validateOwnerPassword, writeOwnerCredentials } from '../lib/owner-setup.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const envFile = path.join(root, '.env.local')
const custom = process.argv.includes('--custom')
const reset = process.argv.includes('--reset')
const quiet = process.argv.includes('--quiet')

function setupError(message, code = 'OWNER_SETUP_CANCELLED') {
  return Object.assign(new Error(message), { code })
}

function hiddenQuestion(label) {
  const wasRaw = Boolean(process.stdin.isRaw)
  const muted = new Writable({ write(_chunk, _encoding, done) { done() } })
  const terminal = createInterface({ input: process.stdin, output: muted, terminal: true, historySize: 0 })
  process.stdout.write(label)
  return new Promise((resolve, reject) => {
    let settled = false
    const finish = (error, answer) => {
      if (settled) return
      settled = true
      process.removeListener('SIGINT', interrupted)
      process.removeListener('SIGTERM', interrupted)
      process.stdin.removeListener('error', inputError)
      terminal.close()
      process.stdin.setRawMode(wasRaw)
      process.stdout.write('\n')
      if (error) reject(error)
      else resolve(answer)
    }
    const interrupted = () => finish(setupError('Password change cancelled. No files were changed.'))
    const inputError = () => finish(setupError('Password entry ended. No files were changed.'))
    terminal.once('SIGINT', interrupted)
    terminal.once('close', () => { if (!settled) inputError() })
    process.once('SIGINT', interrupted)
    process.once('SIGTERM', interrupted)
    process.stdin.once('error', inputError)
    terminal.question('', (answer) => finish(null, answer))
  })
}

try {
  // Refuse before reading or writing credentials when hidden input is unavailable.
  if (custom && (!process.stdin.isTTY || !process.stdout.isTTY)) {
    throw setupError('Choose your password in an interactive terminal. No files were changed.')
  }
  if (!custom && !reset) {
    const contents = await readFile(envFile, 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return ''
      throw error
    })
    if (/^[\t ]*(?:export[\t ]+)?OWNER_(PASSWORD|PASSWORD_HASH)[\t ]*=.+/m.test(contents) &&
      /^[\t ]*(?:export[\t ]+)?OWNER_SESSION_SECRET[\t ]*=.{32,}/m.test(contents)) {
      console.log('Owner access is already configured. Open .booking-data/owner-login.txt for login instructions, or run npm run owner:password to choose a new password.')
      process.exit(0)
    }
  }
  let password
  if (custom) {
    password = await hiddenQuestion('New owner password (12–256 characters): ')
    validateOwnerPassword(password)
    const confirmation = await hiddenQuestion('Confirm new owner password: ')
    if (password !== confirmation) throw setupError('Passwords did not match. No files were changed.', 'OWNER_PASSWORD_MISMATCH')
  } else {
    password = randomBytes(18).toString('base64url')
  }
  await writeOwnerCredentials({ root, password, generated: !custom })
  console.log('Owner access updated. Dashboard: http://localhost:3000/owner')
  console.log('Private login instructions: .booking-data/owner-login.txt')
  if (!quiet) console.log(custom ? 'Use the password you selected. It was not saved as plaintext.' : 'The generated password is saved only in the private login file.')
  console.log('For the live website, update OWNER_PASSWORD_HASH and OWNER_SESSION_SECRET in Vercel, then redeploy.')
  console.log('Restart the local dev server to load the updated settings.')
} catch (error) {
  const expected = ['OWNER_SETUP_CANCELLED', 'OWNER_PASSWORD_INVALID', 'OWNER_PASSWORD_MISMATCH'].includes(error.code)
  console.error(expected ? error.message : 'Could not update owner access. Check file permissions and try again.')
  process.exitCode = 1
}
