import { deckMaps } from './sessions.js'
import { DEFAULT_LOCALE } from './i18n.jsx'

/**
 * Every piece of content is a Markdown file with frontmatter, loaded at build
 * time by the plugin in tools/. Nothing here fetches at runtime, so a missing
 * or malformed file fails the build rather than the page.
 */

const modules = import.meta.glob('../content/{en,ar}/**/*.mdx', { eager: true })
const people = import.meta.glob('../content/people/*.json', { eager: true })

/** `../content/ar/foundation/01.mdx` → `ar` and `foundation`. */
function localeFromPath(path) {
  const match = path.match(/\/content\/([^/]+)\//)
  return match ? match[1] : DEFAULT_LOCALE
}

function collectionFromPath(path) {
  const match = path.match(/\/content\/[^/]+\/([^/]+)\//)
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

const byPublishedThenSlug = (a, b) => {
  if (a.session != null && b.session != null) return a.session - b.session
  const da = a.publishedAt || ''
  const db = b.publishedAt || ''
  if (da !== db) return db.localeCompare(da)
  return a.slug.localeCompare(b.slug)
}

/** Every document of every language, keyed by locale. */
const byLocale = Object.entries(modules).reduce((acc, [path, mod]) => {
  const fm = mod.frontmatter ?? {}
  const locale = localeFromPath(path)
  const doc = {
    locale,
    collection: collectionFromPath(path),
    slug: fm.slug || slugFromPath(path),
    title: fm.title || fm.term || slugFromPath(path),
    html: mod.html,
    excerpt: mod.excerpt,
    readingMinutes: readingMinutes(mod.html),
    ...fm,
  }
  ;(acc[locale] ||= []).push(doc)
  return acc
}, {})

for (const list of Object.values(byLocale)) list.sort(byPublishedThenSlug)

/**
 * The documents of one language. A document that has not been translated yet
 * falls back to its English original rather than disappearing from the index —
 * a half-translated site should still be a whole site.
 */
export function docsFor(locale = DEFAULT_LOCALE) {
  const base = byLocale[DEFAULT_LOCALE] ?? []
  if (locale === DEFAULT_LOCALE) return base

  const translated = byLocale[locale] ?? []
  const have = new Set(translated.map((d) => `${d.collection}/${d.slug}`))
  return [...translated, ...base.filter((d) => !have.has(`${d.collection}/${d.slug}`))].sort(
    byPublishedThenSlug,
  )
}

export const peopleById = Object.fromEntries(
  Object.entries(people).map(([path, mod]) => [
    path.split('/').pop().replace(/\.json$/, ''),
    mod.default ?? mod,
  ]),
)

export function byCollection(collection, locale = DEFAULT_LOCALE) {
  return docsFor(locale).filter((d) => d.collection === collection)
}

export function findDoc(collection, slug, locale = DEFAULT_LOCALE) {
  return (
    docsFor(locale).find((d) => d.collection === collection && d.slug === slug) ?? null
  )
}

/** Neighbours within an ordered track, for the prev/next control. */
export function neighbours(collection, slug, locale = DEFAULT_LOCALE) {
  const list = byCollection(collection, locale)
  const i = list.findIndex((d) => d.slug === slug)
  return {
    index: i,
    total: list.length,
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  }
}

/**
 * The lesson decks in public/sessions. Both tracks are mapped — the maps are
 * the original site's, carried over verbatim — and each deck has a translation
 * beside it under `sessions/ar/`, same filename.
 */
export function sessionHtmlFor(collection, slug, locale = DEFAULT_LOCALE) {
  const entry = deckMaps[collection]
  if (!entry) return null
  const file = entry.map[slug]
  if (!file) return null
  const prefix = locale === DEFAULT_LOCALE ? '' : `${locale}/`
  return `${import.meta.env.BASE_URL}sessions/${prefix}${entry.dir}/${file}`
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

export function formatDate(value, locale = DEFAULT_LOCALE) {
  if (!value) return ''
  // `YYYY-MM-DD` parses as UTC midnight, which formats a day early anywhere
  // west of Greenwich. Read the parts and build a local date instead.
  const iso = String(value).slice(0, 10)
  const [y, m, d] = iso.split('-').map(Number)
  const date =
    y && m && d ? new Date(y, m - 1, d) : new Date(value)
  if (Number.isNaN(date.valueOf())) return String(value)
  // Arabic month names, Western digits. `t()` interpolates plain numbers, so a
  // page set in Arabic-Indic digits would show two numeral systems at once —
  // which reads as a mistake rather than a choice.
  return date.toLocaleDateString(locale === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US', {
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

/**
 * "1 min read" is not "1 mins read", and Arabic marks one differently again.
 * One string for a single minute, one for the rest — which is as much plural
 * grammar as this site needs.
 */
export function readingTime(t, minutes) {
  return minutes === 1
    ? t('learn.readingTimeOne')
    : t('learn.readingTime', { minutes })
}
