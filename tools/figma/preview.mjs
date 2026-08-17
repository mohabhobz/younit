/**
 * Draws a snapshot the way the plugin would, so it can be looked at without
 * Figma.
 *
 * The plugin builds frames from these files; this builds divs from them, by the
 * same rules — absolute boxes, auto layout where the snapshot claims it, text
 * sized as measured. If the picture here is wrong the plugin's is wrong too,
 * and the fix is one run away instead of one round trip through Figma.
 *
 *   node tools/figma/preview.mjs home-desktop
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

const name = process.argv[2] || 'home-desktop'
const snapshot = JSON.parse(
  readFileSync(new URL(`../../public/figma/pages/${name}.json`, import.meta.url), 'utf8'),
)

const rgba = (c) => (c ? `rgba(${c.r * 255},${c.g * 255},${c.b * 255},${c.a === undefined ? 1 : c.a})` : 'transparent')

function draw(node, parentX, parentY) {
  const [x, y, w, h] = node.r
  const left = x - parentX
  const top = y - parentY

  if (node.t === 'T') {
    const t = node.tx
    const style = [
      `position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px`,
      `font-family:'${t.f}'`,
      `font-size:${t.s}px`,
      `font-weight:${t.w}`,
      t.lh ? `line-height:${t.lh}px` : '',
      t.ls ? `letter-spacing:${t.ls}px` : '',
      `color:${rgba(t.c)}`,
      `text-align:${t.a}`,
      t.v ? `font-variation-settings:${t.v}` : '',
      t.u ? 'text-decoration:underline' : '',
      `direction:${t.dir}`,
      t.tt && t.tt !== 'none' ? `text-transform:${t.tt}` : '',
      'white-space:pre-wrap',
      // The same promise the plugin makes: a line that did not wrap in the
      // browser does not wrap here, and it stays where its box put it.
      node.lines === 1 ? 'white-space:pre;display:flex;align-items:center' : '',
      node.lines === 1 && t.a === 'center' ? 'justify-content:center' : '',
      node.lines === 1 && (t.a === 'right' || t.a === 'end') ? 'justify-content:flex-end' : '',
      'overflow:visible',
    ]
      .filter(Boolean)
      .join(';')
    return `<div style="${style}">${node.str.replace(/[<&]/g, (c) => (c === '<' ? '&lt;' : '&amp;'))}</div>`
  }

  if (node.t === 'I') {
    return `<img src="${node.src}" style="position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px;object-fit:${node.fit || 'cover'}">`
  }

  if (node.t === 'V') {
    return `<div style="position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px">${node.svg}</div>`
  }

  const box = [
    `position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px`,
    `background:${rgba(node.bg)}`,
    node.bd ? `box-shadow:inset 0 0 0 ${node.bd.w}px ${rgba(node.bd.c)}` : '',
    node.br ? `border-radius:${node.br[0]}px ${node.br[1]}px ${node.br[2]}px ${node.br[3]}px` : '',
    node.op !== undefined ? `opacity:${node.op}` : '',
    node.clip ? 'overflow:hidden' : '',
  ]
    .filter(Boolean)
    .join(';')

  const kids = (node.ch || []).map((c) => draw(c, x, y)).join('')

  // The same promise the plugin makes: where the snapshot says auto layout is
  // safe, lay the children out rather than placing them.
  if (node.al && node.al.ok && (node.ch || []).length) {
    const al = node.al
    const flex = [
      box,
      'display:flex',
      `flex-direction:${al.dir === 'V' ? 'column' : 'row'}`,
      `gap:${Math.max(0, al.gap)}px`,
      `padding:${al.pad[0]}px ${al.pad[1]}px ${al.pad[2]}px ${al.pad[3]}px`,
      `align-items:${al.align}`,
      `justify-content:${al.justify}`,
      'box-sizing:border-box',
    ].join(';')

    const laid = (node.ch || [])
      .map((c) => {
        const inner = draw(c, c.r[0], c.r[1])
        return inner.replace('position:absolute;left:0px;top:0px;', 'position:relative;flex:0 0 auto;')
      })
      .join('')
    return `<div style="${flex}">${laid}</div>`
  }

  return `<div style="${box}">${kids}</div>`
}

const html = `<!doctype html>
<html dir="${snapshot.dir}" lang="${snapshot.lang}">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&family=Anybody:wdth,wght@117,300..400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Arabic:wght@400&display=swap">
<style>body{margin:0;background:#d7d7d7;position:relative}*{box-sizing:content-box}</style>
</head>
<body style="width:${snapshot.w}px;height:${Math.round(snapshot.h)}px">
${(snapshot.tree.ch || []).map((c) => draw(c, snapshot.tree.r[0], snapshot.tree.r[1])).join('')}
</body>
</html>`

const out = new URL(`../../tools/figma/preview-${name}.html`, import.meta.url)
writeFileSync(out, html)

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: snapshot.w, height: 1200 } })
await page.goto('file://' + out.pathname, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.screenshot({ path: `/tmp/preview-${name}.png`, fullPage: false })
await page.screenshot({ path: `/tmp/preview-${name}-full.png`, fullPage: true })
await browser.close()

console.log(`preview-${name}.png — what the plugin builds`)
