/**
 * Renders every route and writes a snapshot of it for the Figma plugin.
 *
 * The plugin cannot do this itself. A Figma plugin can fetch a URL, but what
 * comes back from this site is `<div id="root"></div>` — the page is a React
 * app, and its design does not exist until a browser has run the script and
 * laid the result out. So a browser runs here, measures the result, and leaves
 * the measurements somewhere the plugin can read them.
 *
 *   node tools/figma/export.mjs            # the 13 templates, both languages
 *   node tools/figma/export.mjs --all      # every route
 *   node tools/figma/export.mjs --base https://younit-gray.vercel.app
 */
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { chromium } from 'playwright'
import { WALK } from './walk.js'
import { ensureServer, browserHint } from '../server.mjs'

const argv = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i === -1 ? fallback : argv[i + 1]
}

const BASE = flag('base', process.env.BASE || 'http://localhost:4173')
// Where the images will be when Figma asks for them. The pages can be measured
// against a local build, but a plugin fetching `localhost` from someone else's
// machine gets nothing, so every image address is rewritten to the published
// one on the way out.
const PUBLIC = flag('public', 'https://younit-gray.vercel.app')
const ALL = argv.includes('--all')
const OUT = new URL('../../public/figma/', import.meta.url)

/**
 * One page per template, not one per document. Thirteen layouts carry
 * seventy-seven routes; importing the other sixty-four would fill the Figma
 * file with the same design holding different words.
 */
const TEMPLATES = [
  ['/', 'home'],
  ['/learn', 'section-learn'],
  ['/learn/foundation', 'track-index'],
  ['/learn/glossary', 'glossary-index'],
  ['/learn/glossary/bid-ask-spread', 'glossary-term'],
  ['/learn/foundation/01-market-basics', 'article'],
  ['/learn/foundation/01-market-basics/deck', 'deck'],
  ['/build/showcase', 'project-index'],
  ['/build/showcase/arabic-sentiment-egx', 'project-detail'],
  ['/editorial', 'editorial-index'],
  ['/about', 'about'],
  ['/partners', 'partners'],
  ['/nope', 'not-found'],
]

/** 1440 is the width the design was drawn at; 390 is the phone it has to survive. */
const VIEWPORTS = [
  [1440, 'desktop'],
  [390, 'mobile'],
]

const routes = ALL
  ? (await import('node:fs')).readFileSync(new URL('./routes.txt', import.meta.url), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((r) => [r, r.replace(/^\//, '').replace(/\//g, '-') || 'home'])
  : TEMPLATES

// Every template exists in both languages, and the Arabic one is not the
// English one mirrored — the type is a different family with a different
// leading, so it has to be measured, not assumed.
const pages = routes.flatMap(([route, name]) => [
  [route, name, 'en'],
  [route === '/' ? '/ar' : `/ar${route}`, `${name}-ar`, 'ar'],
])

if (existsSync(OUT)) rmSync(OUT, { recursive: true })
mkdirSync(new URL('./pages/', OUT), { recursive: true })

const EXECUTABLE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium'
const stopServer = BASE.includes('localhost') ? await ensureServer(BASE) : () => {}

const browser = await chromium
  .launch(existsSync(EXECUTABLE) ? { executablePath: EXECUTABLE } : {})
  .catch((error) => {
    stopServer()
    console.error(browserHint(error) ?? error.message)
    process.exit(1)
  })

const index = []

for (const [route, name, locale] of pages) {
  for (const [width, device] of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      deviceScaleFactor: 1,
      // The hero types itself out and the sections fade in as you reach them.
      // A snapshot taken mid-animation records a page half written — the first
      // export caught the headline at "Egypt's". The site honours the reader
      // who has asked for less movement by drawing everything in its finished
      // state, which is exactly the state a design file wants.
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })

    // The reveal animations start on scroll and the images below the fold are
    // lazy. A snapshot taken at the top would record a page half drawn.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 80))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(400)

    const snapshot = await page.evaluate(WALK)
    snapshot.route = route
    snapshot.device = device
    snapshot.locale = locale

    const file = `${name}-${device}.json`
    const json = JSON.stringify(snapshot).split(BASE).join(PUBLIC)
    writeFileSync(new URL(`./pages/${file}`, OUT), json)
    index.push({
      file,
      name,
      route,
      device,
      locale,
      title: snapshot.title,
      width: snapshot.w,
      height: Math.round(snapshot.h),
    })
    console.log(`  ${route} @ ${width} → ${file}`)

    await context.close()
  }
}

await browser.close()
stopServer()

writeFileSync(
  new URL('./index.json', OUT),
  // The published address, not the one that was measured: this file is read
  // from the web, and saying `localhost` there names a machine nobody else has.
  JSON.stringify(
    { base: PUBLIC, measured: BASE, generated: index.length, pages: index },
    null,
    2,
  ),
)

console.log(`\n${index.length} snapshots → public/figma/`)
