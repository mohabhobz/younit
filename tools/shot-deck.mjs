import { chromium } from 'playwright'

/**
 * A few frames of a re-themed deck, straight out of the dev server, so the
 * brand can be judged on the page rather than on a description of it.
 */
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const BASE = 'http://localhost:5173'

const SHOTS = [
  ['/sessions/foundation/session4_reading_charts.html', 'deck-charts'],
  ['/sessions/foundation/session1_stock_market_basics.html', 'deck-basics'],
  ['/sessions/algo-track/session3_anatomy_of_a_trade_and_a_strategy.html', 'deck-algo'],
]

const b = await chromium.launch({ executablePath: EXE })
const c = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
const p = await c.newPage()

for (const [path, name] of SHOTS) {
  await p.goto(BASE + path, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1800)
  await p.screenshot({ path: `/home/claude/younit-web/tools/shots/${name}.png`, fullPage: true })
  console.log(name)
}

await b.close()
