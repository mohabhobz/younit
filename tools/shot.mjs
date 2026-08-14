import { chromium } from 'playwright'
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const b = await chromium.launch({ executablePath: EXE })
const c = await b.newContext({ viewport:{width:1440,height:1000}, deviceScaleFactor:1 })
const p = await c.newPage()
await p.goto('http://localhost:4173/', { waitUntil:'networkidle' })
// let the hero type in and every reveal fire
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await p.waitForTimeout(2500)
await p.evaluate(() => window.scrollTo(0, 0))
await p.waitForTimeout(3500)
await p.screenshot({ path:'/home/claude/younit-web/tools/shots/home-final.png', fullPage:true })
await b.close()
console.log('shot taken')
