/**
 * The phone menu, and the language switch.
 *
 * These are the two controls with state, and state is where a header breaks:
 * a panel that opens but cannot be closed, a menu that stays over the page
 * after you follow a link out of it, a switch that loses the page you were on.
 * So this drives them the way a reader does and checks what actually happened.
 */
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'
import { browserHint, ensureServer } from './server.mjs'

const BASE = process.env.BASE || 'http://localhost:4173'
const EXECUTABLE =
  process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const PHONE = { width: 390, height: 844 }
const DESKTOP = { width: 1440, height: 900 }

const stopServer = await ensureServer(BASE)

const browser = await chromium.launch(
  existsSync(EXECUTABLE) ? { executablePath: EXECUTABLE } : {},
).catch((error) => {
  stopServer()
  console.error(browserHint(error) ?? error.message)
  process.exit(1)
})

const failures = []
const fail = (message) => failures.push(message)

/** Is the panel actually on screen, rather than merely present in the DOM? */
const panelState = () => `(() => {
  const panel = document.querySelector('.yn-nav-mobile')
  const button = document.querySelector('.yn-menu-button')
  if (!panel || !button) return { missing: true }
  const style = getComputedStyle(panel)
  const rect = panel.getBoundingClientRect()
  return {
    open: button.getAttribute('aria-expanded') === 'true',
    visible: style.visibility !== 'hidden' && rect.height > 40,
    height: Math.round(rect.height),
    inert: panel.hasAttribute('inert'),
    controls: button.getAttribute('aria-controls') === panel.id,
    label: button.getAttribute('aria-label') || '',
    links: [...panel.querySelectorAll('a')].map((a) => a.textContent.trim()),
    bodyScroll: getComputedStyle(document.body).overflow,
    buttonBox: [
      Math.round(button.getBoundingClientRect().width),
      Math.round(button.getBoundingClientRect().height),
    ],
    // The icon is two bars; open, they cross.
    bars: [...button.querySelectorAll('span span')].map(
      (bar) => getComputedStyle(bar).transform,
    ),
  }
})()`

for (const [locale, home] of [
  ['en', '/'],
  ['ar', '/ar'],
]) {
  const context = await browser.newContext({ viewport: PHONE })
  const page = await context.newPage()
  await page.goto(`${BASE}${home}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)

  const closed = await page.evaluate(panelState())
  if (closed.missing) {
    fail(`${locale}: no menu button on a phone`)
    await context.close()
    continue
  }

  if (closed.visible) fail(`${locale}: the panel is on screen before it is opened`)
  if (closed.open) fail(`${locale}: the button reports itself expanded while closed`)
  if (!closed.inert) fail(`${locale}: a closed panel is still reachable by keyboard`)
  if (!closed.controls) fail(`${locale}: the button does not point at the panel it opens`)
  if (Math.min(...closed.buttonBox) < 32) {
    fail(`${locale}: the menu button is ${closed.buttonBox.join('x')}`)
  }
  if (closed.bars.some((bar) => bar !== 'none')) {
    fail(`${locale}: the icon is already crossed while closed`)
  }

  await page.click('.yn-menu-button')
  await page.waitForTimeout(400)
  const open = await page.evaluate(panelState())

  if (!open.visible) fail(`${locale}: the panel did not come down (height ${open.height})`)
  if (!open.open) fail(`${locale}: the button does not report itself expanded`)
  if (open.inert) fail(`${locale}: the open panel is hidden from assistive technology`)
  if (open.bodyScroll !== 'hidden') fail(`${locale}: the page still scrolls behind the panel`)
  if (open.bars.filter((bar) => bar !== 'none').length !== 2) {
    fail(`${locale}: the icon did not become a cross`)
  }
  if (open.label === closed.label) fail(`${locale}: the button's label did not change`)

  // Four sections, then the language, last.
  if (open.links.length !== 5) {
    fail(`${locale}: the panel has ${open.links.length} links, expected 5`)
  }
  // The pair shows both languages; the one you are reading is not a link, so
  // the last link is always the other one.
  const last = open.links.at(-1)
  if (locale === 'en' && last !== 'عربي') fail(`en: the last item is "${last}", not the language`)
  if (locale === 'ar' && last !== 'EN') fail(`ar: the last item is "${last}", not the language`)

  // Escape closes it.
  await page.keyboard.press('Escape')
  await page.waitForTimeout(350)
  if ((await page.evaluate(panelState())).visible) fail(`${locale}: Escape did not close the panel`)

  // Following a link closes it and lands on a page in the same language.
  await page.click('.yn-menu-button')
  await page.waitForTimeout(350)
  await page.click('.yn-nav-mobile a >> nth=0')
  await page.waitForTimeout(500)
  const after = await page.evaluate(panelState())
  if (after.visible) fail(`${locale}: the panel stayed open over the page it opened`)
  if (after.bodyScroll === 'hidden') fail(`${locale}: the page is still locked after navigating`)
  const path = new URL(page.url()).pathname
  if (locale === 'ar' && !path.startsWith('/ar/')) {
    fail(`ar: the menu navigated out of Arabic, to ${path}`)
  }
  if (locale === 'en' && path.startsWith('/ar')) {
    fail(`en: the menu navigated into Arabic, to ${path}`)
  }

  await context.close()
}

/** The switch keeps the reader on the page they were reading. */
for (const viewport of [PHONE, DESKTOP]) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const where = viewport.width === PHONE.width ? 'phone' : 'desktop'

  await page.goto(`${BASE}/learn/foundation/01-market-basics`, { waitUntil: 'networkidle' })
  if (where === 'phone') {
    await page.click('.yn-menu-button')
    await page.waitForTimeout(350)
  }
  // On a phone the language sits at the end of the menu; on a desktop it is
  // its own control beside the nav, not the last link in it. Clicking the last
  // nav link was measuring Editorial and calling it a language switch.
  await page.click(
    where === 'phone' ? '.yn-nav-mobile a >> nth=-1' : '.yn-locale-desktop a >> nth=-1',
  )
  await page.waitForTimeout(500)

  const path = new URL(page.url()).pathname
  if (path !== '/ar/learn/foundation/01-market-basics') {
    fail(`${where}: the language switch went to ${path}, not the same page in Arabic`)
  }
  const dir = await page.evaluate(() => document.documentElement.dir)
  if (dir !== 'rtl') fail(`${where}: the document is ${dir} after switching to Arabic`)

  await context.close()
}

await browser.close()
stopServer()

console.log('menu and language switch driven in both languages, on a phone and a desktop')
if (failures.length) {
  console.log(`\n${failures.length} FAILURES:`)
  for (const f of failures) console.log(`  ✗ ${f}`)
  process.exitCode = 1
} else {
  console.log('PASS — opens, crosses, locks, closes on Escape and on navigation, and keeps the page')
}
