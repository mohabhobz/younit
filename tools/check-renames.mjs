/**
 * Marketing renamed three things. This walks every page that shows a name, in
 * both languages, and fails if the old one is still written anywhere or the new
 * one is missing where it belongs — including the places a name is not typed by
 * hand: breadcrumbs, deck headers, tab titles and the footer.
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
  ['/ar/learn', ['سوق الأسهم 101', 'ما هو التداول الخوارزمي'], ['تحليلات معمّقة']],
  ['/learn/foundation', ['Stock Market 101'], []],
  ['/ar/learn/foundation', ['سوق الأسهم 101'], []],
  ['/learn/algo-track', ['What is Algo Trading'], []],
  ['/ar/learn/algo-track', ['ما هو التداول الخوارزمي'], []],
  ['/learn/foundation/01-market-basics', ['Stock Market 101'], []],
  ['/ar/learn/foundation/01-market-basics', ['سوق الأسهم 101'], []],
  ['/about', ['Younit'], []],
  ['/ar/about', ['يونِت'], []],
  ['/partners', ['Younit'], []],
  ['/', ['LetsYounit!', 'EFG Hermes'], []],
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

// The addresses the removed card used to point at still answer, so anything
// that linked to them anywhere else does not fall over.
for (const route of ['/learn/deep-dives', '/ar/learn/deep-dives']) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
  const text = await page.evaluate(() => document.body.innerText)
  if (/not found|غير موجودة/i.test(text)) problems.push(`${route} is a 404 — it should still open`)
}

await browser.close()
stop()

console.log(`${ROUTES.length + 2} pages read in both languages`)
if (problems.length) {
  console.error('FAIL')
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}
console.log('PASS — every renamed thing reads its new name, and nothing keeps the old one')
