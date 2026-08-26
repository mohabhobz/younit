/**
 * What marketing renamed, and what they asked to be taken away.
 *
 * The renames are checked everywhere a name is written or read — breadcrumbs,
 * deck headers, tab titles and the footer, in both languages — and the removals
 * are checked twice over: the page must not open, and the thing must not be
 * left showing somewhere else.
 *
 *   node tools/check-renames.mjs
 */
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'
import { ensureServer } from './server.mjs'

const BASE = process.env.BASE || 'http://localhost:4173'
const stop = await ensureServer(BASE)
const EXECUTABLE = '/opt/pw-browsers/chromium'
const browser = await chromium.launch(existsSync(EXECUTABLE) ? { executablePath: EXECUTABLE } : {})
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

/** Nothing on the site may say any of these again. */
const GONE = [
  'Foundation Series',
  'Algo Track',
  'EFG Innovation Hub',
  'Innovation Hub',
  'One automated strategy',
  'One idea',
  'سلسلة الأساسيات',
  'مسار الخوارزميات',
  'مركز الابتكار',
  'استراتيجية آلية واحدة',
]

const ROUTES = [
  ['/learn', ['Stock Market 101', 'What is Algo Trading'], ['Deep Dives']],
  // The timings came off every session, and the Build page is one row now.
  ['/learn/foundation', [], ['45 min', '50 min', 'min read']],
  ['/ar/learn/foundation', [], ['45', 'دقيقة']],
  ['/build', ['Repositories'], ['Templates', 'Showcase', 'Capstones', 'Apps']],
  ['/build/repositories', ['Explore the startup kit to get started', 'Link coming soon'], ['Clone, fork, build']],
  ['/ar/build/repositories', ['استكشف حزمة البداية لتبدأ'], ['انسخها']],
  ['/ar/learn', ['سوق الأسهم 101', 'ما هو التداول الخوارزمي'], ['تحليلات معمّقة']],
  ['/learn/foundation', ['Stock Market 101'], []],
  ['/ar/learn/foundation', ['سوق الأسهم 101'], []],
  ['/learn/algo-track', ['What is Algo Trading'], []],
  ['/ar/learn/algo-track', ['ما هو التداول الخوارزمي'], []],
  ['/learn/foundation/01-market-basics', ['Stock Market 101'], []],
  ['/learn/algo-track/00-intro', ['What is Algo Trading'], []],
  ['/ar/learn/algo-track/00-intro', ['ما هو التداول الخوارزمي'], []],
  ['/ar/learn/foundation/01-market-basics', ['سوق الأسهم 101'], []],
  ['/about', ['Younit'], []],
  ['/ar/about', ['يونِت'], []],
  ['/partners', ['Younit'], []],
  ['/', ['LetsYounit!', 'EFG Hermes'], ['Editorial', 'Partners']],
  // Compete is one line and a waiting sign; the four section links are gone.
  ['/compete', ['Stay tuned for the next competition'], ['Leaderboard', 'Seasons', 'Hackathons', 'Wall of Fame']],
  ['/ar/compete', ['ترقّبوا المنافسة القادمة'], []],
  ['/ar', ['LetsYounit!', 'إي إف چي هيرميس'], []],
]

const problems = []

for (const [route, wanted, unwanted] of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
  const text = await page.evaluate(() => document.body.innerText)
  const title = await page.title()
  // The chrome sets some of these in capitals through CSS, and `innerText`
  // reports what is drawn — so the comparison is made in one case.
  const both = `${text}\n${title}`.toLowerCase()

  for (const word of GONE) {
    if (both.includes(word.toLowerCase())) problems.push(`${route} still says "${word}"`)
  }
  for (const word of wanted) {
    if (!both.includes(word.toLowerCase())) problems.push(`${route} is missing "${word}"`)
  }
  for (const word of unwanted) {
    if (both.includes(word.toLowerCase())) problems.push(`${route} still shows "${word}"`)
  }
}

// The pages marketing asked to be taken away, and everything that lived under
// them. Nothing else on the site linked to any of these, so they are gone
// rather than orphaned.
const REMOVED = [
  '/learn/deep-dives',
  '/learn/deep-dives/efg-api-what-you-can-build',
  '/ar/learn/deep-dives',
  '/build/templates',
  '/build/showcase',
  '/build/showcase/arabic-sentiment-egx',
  '/build/showcase/egx-momentum-screener',
  '/build/showcase/sector-rotation-tracker',
  '/build/capstones/arabic-financial-nlp-corpus',
  '/build/capstones/egx-volatility-ml',
  '/build/apps/egx-daily-snapshot',
  '/learn/deep-dives/egx-real-estate-primer',
  '/ar/build/showcase/arabic-sentiment-egx',
  '/ar/learn/deep-dives/egx-real-estate-primer',
  '/build/capstones',
  '/build/apps',
  '/ar/build/showcase',
  '/compete/leaderboard',
  '/compete/seasons',
  '/compete/hackathons',
  '/compete/wall-of-fame',
  '/ar/compete/leaderboard',
  '/editorial',
  '/editorial/why-we-built-this',
  '/ar/editorial',
  '/partners',
  '/ar/partners',
]
for (const route of REMOVED) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
  const text = await page.evaluate(() => document.body.innerText)
  if (!/not found|غير موجودة/i.test(text)) problems.push(`${route} still opens — it was removed`)
}

// The photograph that stood with the editorial section is off the homepage.
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
const photos = await page.evaluate(() =>
  [...document.querySelectorAll('main img')].map((img) => img.currentSrc || img.src),
)
if (photos.some((src) => /compete-team/.test(src))) {
  problems.push('the homepage still carries the photograph that came with Editorial')
}

await browser.close()
stop()

console.log(`${ROUTES.length + REMOVED.length + 1} pages read in both languages`)
if (problems.length) {
  console.error('FAIL')
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}
console.log('PASS — the new names are everywhere, the old ones nowhere, and what was removed is gone')
