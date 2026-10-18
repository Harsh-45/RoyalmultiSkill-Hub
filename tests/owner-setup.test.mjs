import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, test } from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { createOwnerSession, passwordMatches, validOwnerSession } from '../lib/owner-auth.mjs'
import { writeOwnerCredentials } from '../lib/owner-setup.mjs'

const run = promisify(execFile)
const projectRoot = fileURLToPath(new URL('../', import.meta.url))
let root

function parseCredentials(contents) {
  return Object.fromEntries(contents.split(/\r?\n/).map((line) => line.match(/^(OWNER_PASSWORD_HASH|OWNER_SESSION_SECRET)=(.*)$/)).filter(Boolean).map((match) => [match[1], match[2]]))
}

async function copyCli() {
  await mkdir(path.join(root, 'scripts'), { recursive: true })
  await mkdir(path.join(root, 'lib'), { recursive: true })
  await copyFile(path.join(projectRoot, 'scripts/setup-bookings.mjs'), path.join(root, 'scripts/setup-bookings.mjs'))
  await copyFile(path.join(projectRoot, 'lib/owner-setup.mjs'), path.join(root, 'lib/owner-setup.mjs'))
  return path.join(root, 'scripts/setup-bookings.mjs')
}

beforeEach(async () => {
  root = await mkdtemp(path.join(os.tmpdir(), 'royal-owner-setup-'))
})

afterEach(async () => {
  await rm(root, { recursive: true, force: true })
})

test('custom password creates a valid hash and private files without storing plaintext', async () => {
  const password = randomBytes(24).toString('base64url')
  await writeOwnerCredentials({ root, password })
  const contents = await readFile(path.join(root, '.env.local'), 'utf8')
  const instructions = await readFile(path.join(root, '.booking-data/owner-login.txt'), 'utf8')
  assert.equal(passwordMatches(password, parseCredentials(contents)), true)
  assert.equal(contents.includes(password), false)
  assert.equal(instructions.includes(password), false)
  assert.ok(instructions.includes('use the password you selected'))
  for (const relative of ['.env.local', '.booking-data/owner-login.txt']) {
    assert.equal((await stat(path.join(root, relative))).mode & 0o777, 0o600)
  }
})

test('password reset rotates session signing keys and removes old owner overrides while preserving other settings', async () => {
  const oldPassword = randomBytes(24).toString('base64url')
  const newPassword = randomBytes(24).toString('base64url')
  await writeOwnerCredentials({ root, password: oldPassword, generated: true })
  const original = parseCredentials(await readFile(path.join(root, '.env.local'), 'utf8'))
  const session = createOwnerSession(original)
  await writeFile(path.join(root, '.env.local'), [
    '# Keep this comment',
    'UNRELATED_URL=https://example.invalid',
    'KEEP_QUOTED="some=value with spaces"',
    `  export OWNER_PASSWORD = ${oldPassword}`,
    `\tOWNER_PASSWORD_HASH = ${original.OWNER_PASSWORD_HASH}`,
    `export OWNER_SESSION_SECRET=${original.OWNER_SESSION_SECRET}`,
    `OWNER_PASSWORD_HASH=${original.OWNER_PASSWORD_HASH}`,
    '',
  ].join('\r\n'))
  await writeOwnerCredentials({ root, password: newPassword })
  const updated = await readFile(path.join(root, '.env.local'), 'utf8')
  const env = parseCredentials(updated)
  assert.equal(passwordMatches(newPassword, env), true)
  assert.equal(passwordMatches(oldPassword, env), false)
  assert.equal(validOwnerSession(session, env), false)
  assert.notEqual(env.OWNER_SESSION_SECRET, original.OWNER_SESSION_SECRET)
  assert.ok(updated.includes('# Keep this comment'))
  assert.ok(updated.includes('UNRELATED_URL=https://example.invalid'))
  assert.ok(updated.includes('KEEP_QUOTED="some=value with spaces"'))
  assert.equal(updated.includes(oldPassword), false)
  assert.equal(updated.match(/^OWNER_PASSWORD_HASH=/gm).length, 1)
  assert.equal(updated.match(/^OWNER_SESSION_SECRET=/gm).length, 1)
  assert.equal((await readFile(path.join(root, '.booking-data/owner-login.txt'), 'utf8')).includes(oldPassword), false)
  assert.deepEqual((await readdir(root)).filter((name) => name.endsWith('.tmp')), [])
})

test('invalid passwords leave existing credentials unchanged and create no files in a fresh directory', async () => {
  const invalid = ['short', 'a'.repeat(257), 'long-password\nwith-control', 'long-password\u007fwith-control', 'long-password\u2028with-linebreak', null]
  for (const password of invalid) await assert.rejects(writeOwnerCredentials({ root, password }), { code: 'OWNER_PASSWORD_INVALID' })
  assert.deepEqual(await readdir(root), [])
  await writeOwnerCredentials({ root, password: randomBytes(24).toString('base64url') })
  const before = await readFile(path.join(root, '.env.local'))
  await assert.rejects(writeOwnerCredentials({ root, password: 'short' }), { code: 'OWNER_PASSWORD_INVALID' })
  assert.deepEqual(await readFile(path.join(root, '.env.local')), before)
})

test('non-interactive custom CLI refuses without changing credentials', async () => {
  const script = await copyCli()
  const original = 'UNRELATED_SETTING=keep\n'
  await writeFile(path.join(root, '.env.local'), original)
  await assert.rejects(run(process.execPath, [script, '--custom', '--reset'], { cwd: root }), (error) => {
    assert.equal(error.code, 1)
    assert.ok(error.stderr.includes('interactive terminal'))
    assert.equal(error.stdout, '')
    return true
  })
  assert.equal(await readFile(path.join(root, '.env.local'), 'utf8'), original)
  await assert.rejects(stat(path.join(root, '.booking-data')), { code: 'ENOENT' })
})

test('generated setup and quiet reset keep random passwords private in the ignored login file', async () => {
  const script = await copyCli()
  const first = await run(process.execPath, [script, '--quiet'], { cwd: root })
  const firstEnv = parseCredentials(await readFile(path.join(root, '.env.local'), 'utf8'))
  const firstInstructions = await readFile(path.join(root, '.booking-data/owner-login.txt'), 'utf8')
  const password = firstInstructions.match(/^Password: (.+)$/m)[1]
  assert.equal(passwordMatches(password, firstEnv), true)
  assert.equal(first.stdout.includes(password), false)
  assert.equal(first.stdout.includes(firstEnv.OWNER_PASSWORD_HASH), false)
  assert.equal(first.stdout.includes(firstEnv.OWNER_SESSION_SECRET), false)
  const skipped = await run(process.execPath, [script], { cwd: root })
  assert.ok(skipped.stdout.includes('already configured'))
  assert.deepEqual(parseCredentials(await readFile(path.join(root, '.env.local'), 'utf8')), firstEnv)
  const reset = await run(process.execPath, [script, '--reset', '--quiet'], { cwd: root })
  const nextEnv = parseCredentials(await readFile(path.join(root, '.env.local'), 'utf8'))
  assert.notEqual(nextEnv.OWNER_PASSWORD_HASH, firstEnv.OWNER_PASSWORD_HASH)
  assert.notEqual(nextEnv.OWNER_SESSION_SECRET, firstEnv.OWNER_SESSION_SECRET)
  assert.equal(reset.stdout.includes(nextEnv.OWNER_PASSWORD_HASH), false)
  assert.equal(reset.stdout.includes(nextEnv.OWNER_SESSION_SECRET), false)
})
