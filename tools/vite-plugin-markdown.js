import { readFileSync } from 'node:fs'
import matter from 'gray-matter'
import { marked } from 'marked'

/**
 * Turns a .mdx file into a JS module exporting { frontmatter, html, excerpt }.
 *
 * The content authored for the previous site is plain Markdown plus exactly two
 * inline components — <Term> and <Callout>. Rather than pulling in the whole MDX
 * toolchain for two tags, both are rewritten to semantic HTML the stylesheet
 * already knows how to render. If a third component ever appears, it will show
 * up in the build log rather than silently rendering as literal angle brackets.
 */

const KNOWN_TAGS = new Set(['Term', 'Callout'])

function preprocess(body, id) {
  const seen = new Set()
  for (const match of body.matchAll(/<([A-Z][A-Za-z0-9]*)/g)) {
    if (!KNOWN_TAGS.has(match[1])) seen.add(match[1])
  }
  if (seen.size) {
    console.warn(
      `[markdown] ${id}: unhandled component(s) ${[...seen].join(', ')} — ` +
        'they will render as literal text. Add them to tools/vite-plugin-markdown.js.',
    )
  }

  return (
    body
      // <Callout type="note">…</Callout> — block level, may span lines.
      .replace(
        /<Callout(?:\s+type="([^"]*)")?\s*>\s*([\s\S]*?)\s*<\/Callout>/g,
        (_, type, inner) =>
          `\n<aside class="yn-callout" data-kind="${type || 'note'}">` +
          // The label is left to the page to name: it is one of a handful of
          // fixed kinds, and it has to read in the reader's language.
          `<p class="yn-callout__label" data-callout-label="${type || 'note'}"></p>` +
          `<p>${inner.trim()}</p></aside>\n`,
      )
      // <Term>Bull Market</Term> — inline.
      .replace(
        /<Term>([\s\S]*?)<\/Term>/g,
        (_, inner) => `<b class="yn-term">${inner.trim()}</b>`,
      )
  )
}

export default function markdown() {
  return {
    name: 'younit-markdown',
    enforce: 'pre',
    async transform(_code, id) {
      const [file] = id.split('?')
      if (!file.endsWith('.mdx') && !file.endsWith('.md')) return null

      // Strip the BOM some of the source files carry — gray-matter will not
      // recognise the frontmatter fence behind one.
      const raw = readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
      const { data, content } = matter(raw)
      const html = marked.parse(preprocess(content, file), {
        async: false,
        gfm: true,
        breaks: false,
      })

      // A table wider than the viewport scrolls inside its own box rather than
      // pushing the page sideways.
      const withScrollers = html.replace(
        /<table>([\s\S]*?)<\/table>/g,
        (m) => `<div class="yn-scroll">${m}</div>`,
      )

      const excerpt = content
        .replace(/<[^>]+>/g, '')
        .replace(/[#*_`>[\]()-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 240)

      return {
        code:
          `export const frontmatter = ${JSON.stringify(data)};\n` +
          `export const html = ${JSON.stringify(withScrollers)};\n` +
          `export const excerpt = ${JSON.stringify(excerpt)};\n` +
          `export default { frontmatter, html, excerpt };\n`,
        map: null,
      }
    },
  }
}
