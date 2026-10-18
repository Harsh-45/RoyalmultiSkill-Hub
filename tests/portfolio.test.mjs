import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { categories, portfolioCategoryDefinitions } from '../data/portfolio-categories.mjs'
import { getPortfolioImages } from '../lib/portfolio.mjs'

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'royal-portfolio-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  async function file(relative, contents = 'fixture') {
    const target = path.join(root, relative)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, contents)
  }
  return { root, file }
}

test('only category uploads become portfolio entries and every service keeps its category', async (t) => {
  const { root, file } = await fixture(t)
  for (const definition of portfolioCategoryDefinitions) await file(`${definition.directory}/my-work.jpg`)
  await file('outside.jpg')
  await file('unlisted/work.jpg')
  await file('tattoo/nested/work.jpg')
  const photos = await getPortfolioImages({ root })
  assert.equal(photos.length, portfolioCategoryDefinitions.length)
  assert.deepEqual(categories, ['All', 'Tattoo', 'Piercing', 'Bridal', 'Makeup', 'Hair', 'Facial', 'Waxing', 'Threading'])
  for (const [index, definition] of portfolioCategoryDefinitions.entries()) {
    assert.deepEqual(photos[index], {
      src: `/portfolio/${definition.directory}/my-work.jpg`,
      title: 'My work',
      alt: `${definition.label}: My work — Royal Multiskill Hub portfolio`,
      category: definition.label,
      theme: definition.theme,
    })
  }
  assert.doesNotThrow(() => JSON.stringify(photos))
})

test('supported formats sort naturally without case sensitivity, with safely encoded filenames', async (t) => {
  const { root, file } = await fixture(t)
  for (const name of ['10-rose-tattoo.avif', '2-rose-tattoo.JPG', '01-ear & nose #1%.WebP', '3-look.jpeg', '4-look.PNG']) {
    await file(`piercing/${name}`)
  }
  const photos = await getPortfolioImages({ root })
  assert.deepEqual(photos.map(photo => photo.title), ['Ear & nose #1%', 'Rose tattoo', 'Look', 'Look', 'Rose tattoo'])
  assert.equal(photos[0].src, '/portfolio/piercing/01-ear%20%26%20nose%20%231%25.WebP')
  assert.equal(photos[1].src, '/portfolio/piercing/2-rose-tattoo.JPG')
  assert.equal(photos.at(-1).src, '/portfolio/piercing/10-rose-tattoo.avif')
})

test('hidden, unsupported, malformed and symbolic link uploads are ignored', async (t) => {
  const { root, file } = await fixture(t)
  for (const name of ['.gitkeep', '.private.jpg', 'README.md', 'phone.HEIC', 'animated.gif', 'image.svg', 'broken\nname.jpg', 'bad\ufffdname.jpg']) {
    await file(`tattoo/${name}`)
  }
  await file('outside/real.jpg')
  await symlink(path.join(root, 'outside', 'real.jpg'), path.join(root, 'tattoo', 'linked.jpg'))
  await symlink(path.join(root, 'outside'), path.join(root, 'piercing'))
  await symlink(path.join(root, 'outside'), path.join(root, 'beauty'))
  assert.deepEqual(await getPortfolioImages({ root }), [])
})

test('missing and empty folders never fall back to random photos', async (t) => {
  const { root, file } = await fixture(t)
  assert.deepEqual(await getPortfolioImages({ root }), [])
  assert.deepEqual(await getPortfolioImages({ root: path.join(root, 'missing') }), [])
  await file('not-a-directory')
  assert.deepEqual(await getPortfolioImages({ root: path.join(root, 'not-a-directory') }), [])
  const definitions = await readFile(new URL('../data/portfolio.js', import.meta.url), 'utf8')
  assert.equal(/(?:unsplash|\/gallery\/|tattoo-studio\.jpg|portfolioImages\s*=)/i.test(definitions), false)
})

test('filenames without descriptive words receive a clear category title', async (t) => {
  const { root, file } = await fixture(t)
  await file('beauty/bridal/01---.png')
  const [photo] = await getPortfolioImages({ root })
  assert.equal(photo.title, 'Bridal photo')
  assert.equal(photo.category, 'Bridal')
})
