import { lstat, readdir } from 'node:fs/promises'
import path from 'node:path'
import { portfolioCategoryDefinitions } from '../data/portfolio-categories.mjs'

const supportedImage = /\.(?:jpe?g|png|webp|avif)$/i
const naturalOrder = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })

async function isRealDirectory(directory) {
  try {
    const info = await lstat(directory)
    return info.isDirectory() && !info.isSymbolicLink()
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false
    throw error
  }
}

function photoTitle(filename, category) {
  const name = filename
    .replace(supportedImage, '')
    .replace(/^\d+[\s._-]+/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!name || !/[\p{L}\p{N}]/u.test(name)) return `${category} photo`
  return `${name[0].toLocaleUpperCase('en')}${name.slice(1)}`
}

// Reads only the known category directories. No JavaScript changes are needed
// when the owner adds photos; the next build includes them automatically.
export async function getPortfolioImages({ root = path.join(process.cwd(), 'public', 'portfolio') } = {}) {
  if (!(await isRealDirectory(root))) return []
  const photos = []

  for (const { label, directory, theme } of portfolioCategoryDefinitions) {
    const segments = directory.split('/')
    let categoryPath = root
    let exists = true
    for (const segment of segments) {
      categoryPath = path.join(categoryPath, segment)
      if (!(await isRealDirectory(categoryPath))) {
        exists = false
        break
      }
    }
    if (!exists) continue

    const files = (await readdir(categoryPath, { withFileTypes: true }))
      .filter((file) => file.isFile()
        && !file.name.startsWith('.')
        && !/[\u0000-\u001f\u007f\ufffd]/u.test(file.name)
        && supportedImage.test(file.name))
      .sort((left, right) => naturalOrder.compare(left.name, right.name)
        || (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))

    for (const file of files) {
      const title = photoTitle(file.name, label)
      photos.push({
        src: `/portfolio/${[...segments, file.name].map(encodeURIComponent).join('/')}`,
        title,
        alt: `${label}: ${title} — Royal Multiskill Hub portfolio`,
        category: label,
        theme,
      })
    }
  }

  return photos
}
