import { deckMaps } from './sessions.js'

/**
 * Every piece of content is a Markdown file with frontmatter, loaded at build
 * time by the plugin in tools/. Nothing here fetches at runtime, so a missing
 * or malformed file fails the build rather than the page.
 */

const modules = import.meta.glob('../content/en/**/*.mdx', { eager: true })
const people = import.meta.glob('../content/people/*.json', { eager: true })

/** Directory name → the collection the route tree uses. */
function collectionFromPath(path) {
  const match = path.match(/\/content\/en\/([^/]+)\//)
  return match ? match[1] : 'unknown'
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.mdx$/, '')
}

/** ~200 words a minute, rounded up, floor of one. */
function readingMinutes(html) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export const docs = Object.entries(modules)
  .map(([path, mod]) => {
    const fm = mod.frontmatter ?? {}
    return {
      collection: collectionFromPath(path),
      slug: fm.slug || slugFromPath(path),
      title: fm.title || fm.term || slugFromPath(path),
      html: mod.html,
      excerpt: mod.excerpt,
      readingMinutes: readingMinutes(mod.html),
      ...fm,
    }
  })
  .sort((a, b) => {
    if (a.session != null && b.session != null) return a.session - b.session
    const da = a.publishedAt || ''
    const db = b.publishedAt || ''
    if (da !== db) return db.localeCompare(da)
    return a.slug.localeCompare(b.slug)
  })

export const peopleById = Object.fromEntries(
  Object.entries(people).map(([path, mod]) => [
    path.split('/').pop().replace(/\.json$/, ''),
    mod.default ?? mod,
  ]),
)

export function byCollection(collection) {
  return docs.filter((d) => d.collection === collection)
}

export function findDoc(collection, slug) {
  return docs.find((d) => d.collection === collection && d.slug === slug) ?? null
}

/** Neighbours within an ordered track, for the prev/next control. */
export function neighbours(collection, slug) {
  const list = byCollection(collection)
  const i = list.findIndex((d) => d.slug === slug)
  return {
    index: i,
    total: list.length,
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  }
}

/**
 * The standalone lesson decks in public/sessions. Both tracks are mapped —
 * the maps are the original site's, carried over verbatim.
 */
export function sessionHtmlFor(collection, slug) {
  const entry = deckMaps[collection]
  if (!entry) return null
  const file = entry.map[slug]
  return file ? `${import.meta.env.BASE_URL}sessions/${entry.dir}/${file}` : null
}

/**
 * Author records for a document. An id with no file — `editorial-team`, which
 * the content references but never defines — still yields a name rather than
 * dropping the byline the design asks for.
 */
export function authorsOf(doc) {
  return (doc.authors ?? []).map(
    (id) =>
      peopleById[id] ?? {
        name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      },
  )
}

export function formatDate(value) {
  if (!value) return ''
  // `YYYY-MM-DD` parses as UTC midnight, which formats a day early anywhere
  // west of Greenwich. Read the parts and build a local date instead.
  const iso = String(value).slice(0, 10)
  const [y, m, d] = iso.split('-').map(Number)
  const date =
    y && m && d ? new Date(y, m - 1, d) : new Date(value)
  if (Number.isNaN(date.valueOf())) return String(value)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Counts the index pages advertise, derived rather than typed by hand. */
export const counts = {
  foundation: byCollection('foundation').length,
  algoTrack: byCollection('algo-track').length,
  deepDives: byCollection('deep-dives').length,
  glossary: byCollection('glossary').length,
  editorial: byCollection('editorial').length,
  showcase: byCollection('showcase').length,
  capstones: byCollection('capstones').length,
  apps: byCollection('apps').length,
}
