/**
 * Joins figma-plugin/src/*.js into the one file a Figma plugin is allowed to
 * have.
 *
 * Figma loads exactly one script and gives it no module system, so the sources
 * are kept apart for reading and concatenated in name order for running. The
 * numeric prefixes are the order: tokens, then the helpers that use them, then
 * the builders, then the plugin's own entry.
 *
 *   node tools/figma/build-plugin.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const SRC = new URL('../../figma-plugin/src/', import.meta.url)
const OUT = new URL('../../figma-plugin/code.js', import.meta.url)

const files = readdirSync(SRC).filter((f) => f.endsWith('.js')).sort()

const parts = [
  '/* Built by tools/figma/build-plugin.mjs — edit figma-plugin/src/*.js instead. */',
  ...files.map((file) => `\n/* ===== ${file} ===== */\n${readFileSync(new URL(file, SRC), 'utf8')}`),
]

writeFileSync(OUT, parts.join('\n'))
console.log(`${files.length} sources → figma-plugin/code.js (${parts.join('\n').length} bytes)`)
