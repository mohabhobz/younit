/**
 * The DOM walker, as a string of source that runs inside the page.
 *
 * It is written as a template rather than imported because it executes in the
 * browser, not in Node: Playwright hands the function to the page and there is
 * no module system on the other side.
 *
 * What it produces is a tree of boxes — position, size, paint, text — measured
 * after the layout has settled. That is the part a Figma plugin cannot work out
 * for itself: the site is a React app, so its HTML is an empty div until the
 * script has run and the browser has laid the result out.
 */

export const WALK = () => {
  const px = (v) => Math.round(v * 100) / 100

  /** `rgb(0, 0, 0)` / `rgba(…)` → `{ r, g, b, a }` in Figma's 0–1 range. */
  const colour = (value) => {
    const m = /rgba?\(([^)]+)\)/.exec(value || '')
    if (!m) return null
    const [r, g, b, a = '1'] = m[1].split(',').map((s) => s.trim())
    const alpha = Number(a)
    if (!alpha) return null
    return { r: +r / 255, g: +g / 255, b: +b / 255, a: alpha }
  }

  const radius = (s) => {
    const parse = (v) => (v.endsWith('%') ? 999 : parseFloat(v) || 0)
    const corners = [
      parse(s.borderTopLeftRadius),
      parse(s.borderTopRightRadius),
      parse(s.borderBottomRightRadius),
      parse(s.borderBottomLeftRadius),
    ]
    return corners.some(Boolean) ? corners : null
  }

  const border = (s) => {
    const width = parseFloat(s.borderTopWidth) || 0
    if (!width || s.borderTopStyle === 'none') return null
    const c = colour(s.borderTopColor)
    if (!c) return null
    // A border that differs on one side is drawn as a rule elsewhere; the ones
    // this site uses are uniform, so one width and one colour is the whole of it.
    return { c, w: px(width) }
  }

  /**
   * The component this element is an instance of, if the stylesheet names it.
   * The page builder swaps these for real Figma components instead of
   * rebuilding a pill out of a rectangle and a label every time one appears.
   */
  const componentOf = (el) => {
    const cls = typeof el.className === 'string' ? el.className : ''
    if (/\byn-btn\b/.test(cls)) return el.offsetWidth === el.offsetHeight ? 'ArrowButton' : 'Button'
    if (/\byn-callout\b/.test(cls)) return 'Callout'
    if (/\byn-contents\b/.test(cls)) return 'Contents'
    if (/\byn-header\b/.test(cls)) return 'Header'
    if (el.tagName === 'FOOTER') return 'Footer'
    if (el.tagName === 'TABLE') return 'Table'
    return null
  }

  /** Text that exists only as a pseudo-element — the callout labels do. */
  const pseudo = (el, which) => {
    const s = getComputedStyle(el, which)
    const c = s.content
    if (!c || c === 'none' || c === 'normal') return ''
    const m = /^"(.*)"$/.exec(c)
    return m ? m[1] : ''
  }

  /**
   * The words, with the line breaks the author put in them. `textContent`
   * drops `<br>`, which runs two lines of a headline into one — "Build on
   * this,The API, Two Ways" — so the child nodes are read rather than the
   * shorthand.
   */
  const readText = (el) => {
    let out = ''
    for (const child of el.childNodes) {
      if (child.nodeType === 3) out += child.nodeValue
      else if (child.tagName === 'BR') out += '\n'
      else if (child.nodeType === 1) out += readText(child)
    }
    return out
  }

  const tidy = (words) =>
    words
      .replace(/[ \t\r\f]+/g, ' ')
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      .trim()

  const inline = (el) => {
    const d = getComputedStyle(el).display
    return d === 'inline' || d === 'ruby' || d === 'contents'
  }

  /**
   * A leaf is an element whose children are all inline: its words wrap around
   * each other rather than sitting in boxes, so Figma wants one text node, not
   * a frame full of fragments.
   */
  const isLeafText = (el) => {
    if (!el.children.length) return el.textContent.trim().length > 0
    return [...el.children].every(inline) && el.textContent.trim().length > 0
  }

  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'BR', 'HEAD', 'META', 'LINK', 'TITLE'])

  const SVG_NS = 'http://www.w3.org/2000/svg'

  /**
   * An `<svg>` with everything it needs inside it.
   *
   * The brand marks are drawn once as `<symbol>`s at the top of the page and
   * pointed at with `<use href="#wm-w">` — which is the right way to write
   * them and useless to anything reading a single `<svg>` on its own. Sent as
   * they are, the wordmark arrives as an empty box, which is why the logo was
   * missing from every header.
   *
   * So each `<use>` is replaced by the thing it points at, with the transform
   * the browser would have applied: a symbol's own viewBox is fitted into the
   * box the `<use>` gives it, centred, the same way an image fits a frame.
   */
  const standalone = (svg) => {
    const copy = svg.cloneNode(true)

    for (let pass = 0; pass < 4; pass++) {
      const uses = copy.querySelectorAll('use')
      if (!uses.length) break

      for (const use of uses) {
        const href = use.getAttribute('href') || use.getAttribute('xlink:href') || ''
        const source = href.charAt(0) === '#' ? document.getElementById(href.slice(1)) : null
        if (!source) {
          use.remove()
          continue
        }

        const group = document.createElementNS(SVG_NS, 'g')
        for (const attr of use.attributes) {
          if (attr.name !== 'href' && attr.name !== 'xlink:href') {
            if (!['x', 'y', 'width', 'height'].includes(attr.name)) {
              group.setAttribute(attr.name, attr.value)
            }
          }
        }

        const vb = (source.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number)
        const x = parseFloat(use.getAttribute('x')) || 0
        const y = parseFloat(use.getAttribute('y')) || 0

        if (vb.length === 4 && vb[2] && vb[3]) {
          // Default `preserveAspectRatio`: fit inside, centred on both axes.
          const w = parseFloat(use.getAttribute('width')) || vb[2]
          const h = parseFloat(use.getAttribute('height')) || vb[3]
          const scale = Math.min(w / vb[2], h / vb[3])
          const tx = x + (w - vb[2] * scale) / 2 - vb[0] * scale
          const ty = y + (h - vb[3] * scale) / 2 - vb[1] * scale
          group.setAttribute('transform', `translate(${tx} ${ty}) scale(${scale})`)
        } else if (x || y) {
          group.setAttribute('transform', `translate(${x} ${y})`)
        }

        for (const child of source.children) group.appendChild(child.cloneNode(true))
        use.replaceWith(group)
      }
    }

    // The marks are painted with the same custom properties as the rest of the
    // site — `fill="var(--yn-white)"`. A stylesheet resolves that; a lone SVG
    // handed to Figma does not, and the wordmark comes out black on the dark
    // band. So the colours are resolved here, where the values are known.
    const root = getComputedStyle(document.documentElement)
    return copy.outerHTML
      .replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,[^)]*)?\)/g, (whole, name) => {
        const value = root.getPropertyValue(name).trim()
        return value || whole
      })
      .split('currentColor')
      .join(getComputedStyle(svg).color)
  }

  const textOf = (el, s) => {
    const weight = Number(s.fontWeight) || 400
    // Anybody is variable and the site sets its axes explicitly; without them
    // Figma draws the default width and the whole page reads wrong.
    const variation = s.fontVariationSettings
    return {
      s: px(parseFloat(s.fontSize)),
      f: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      w: weight,
      lh: s.lineHeight === 'normal' ? null : px(parseFloat(s.lineHeight)),
      ls: s.letterSpacing === 'normal' ? 0 : px(parseFloat(s.letterSpacing)),
      c: colour(s.color),
      a: s.textAlign,
      tt: s.textTransform,
      u: s.textDecorationLine.includes('underline'),
      v: variation && variation !== 'normal' ? variation : null,
      dir: s.direction,
    }
  }

  const walk = (el, depth) => {
    if (SKIP.has(el.tagName)) return null

    const s = getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden') return null
    if (el.hasAttribute('inert') || el.getAttribute('aria-hidden') === 'true') {
      // Kept when it is decorative and drawn — the arrow glyphs are — but the
      // closed mobile menu is a whole panel parked off-screen.
      if (/\byn-nav-mobile\b/.test(el.className || '')) return null
    }

    const box = el.getBoundingClientRect()
    if (box.width < 0.5 || box.height < 0.5) return null
    if (Number(s.opacity) === 0) return null

    // An <svg> is a drawing: hand Figma the source and let it make real vectors.
    if (el.tagName === 'svg') {
      return {
        t: 'V',
        n: el.getAttribute('aria-label') || 'vector',
        r: [px(box.x), px(box.y + scrollY), px(box.width), px(box.height)],
        svg: standalone(el),
      }
    }

    if (el.tagName === 'IMG') {
      return {
        t: 'I',
        n: el.alt || 'image',
        r: [px(box.x), px(box.y + scrollY), px(box.width), px(box.height)],
        src: el.currentSrc || el.src,
        fit: s.objectFit,
        br: radius(s),
      }
    }

    const node = {
      t: 'F',
      n: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
      r: [px(box.x), px(box.y + scrollY), px(box.width), px(box.height)],
      bg: colour(s.backgroundColor),
      br: radius(s),
      bd: border(s),
      op: Number(s.opacity) < 1 ? Number(s.opacity) : undefined,
      clip: s.overflowX !== 'visible' || s.overflowY !== 'visible' || undefined,
    }

    const cmp = componentOf(el)
    if (cmp) node.cmp = cmp

    if (s.display === 'flex' || s.display === 'inline-flex') {
      node.al = {
        dir: s.flexDirection.startsWith('column') ? 'V' : 'H',
        gap: px(parseFloat(s.columnGap) || parseFloat(s.rowGap) || 0),
        pad: [
          px(parseFloat(s.paddingTop)),
          px(parseFloat(s.paddingRight)),
          px(parseFloat(s.paddingBottom)),
          px(parseFloat(s.paddingLeft)),
        ],
        align: s.alignItems,
        justify: s.justifyContent,
        wrap: s.flexWrap === 'wrap' || undefined,
      }
    }

    const before = pseudo(el, '::before')
    const after = pseudo(el, '::after')

    if (isLeafText(el) || before || after) {
      const words = tidy(before + readText(el) + after)
      if (words && (isLeafText(el) || !el.children.length)) {
        const pad = [
          px(parseFloat(s.paddingTop)),
          px(parseFloat(s.paddingRight)),
          px(parseFloat(s.paddingBottom)),
          px(parseFloat(s.paddingLeft)),
        ]

        // How many lines the words actually took, measured rather than
        // counted: a range reports one rectangle per fragment, so one line
        // split across two spans reads as two. The height against the leading
        // is what a reader would say.
        const leading = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2
        const lines = Math.max(1, Math.round((box.height - pad[0] - pad[2]) / leading))

        // Where the words are, not where their box is. A pill centres its
        // label with the layout rather than with `text-align`, so taking the
        // padding box put the arrow in every round button at the edge of its
        // circle instead of the middle. A range round the contents is the
        // rectangle the browser actually drew the type in.
        let line = null
        try {
          const range = document.createRange()
          range.selectNodeContents(el)
          const rect = range.getBoundingClientRect()
          if (rect.width > 0.5 && rect.height > 0.5) line = rect
        } catch (e) {
          line = null
        }

        const text = {
          t: 'T',
          n: words.slice(0, 40),
          r: line
            ? [px(line.x), px(line.y + scrollY), px(line.width), px(line.height)]
            : [
                px(box.x + pad[3]),
                px(box.y + scrollY + pad[0]),
                px(Math.max(1, box.width - pad[1] - pad[3])),
                px(Math.max(1, box.height - pad[0] - pad[2])),
              ],
          str: words,
          lines: lines,
          tx: textOf(el, s),
        }

        // A pill is a word inside a shape. Returning only the word would drop
        // the outline and the fill that make it a button — which is what
        // happened to every button, tag and outlined label on the first pass.
        // Where a leaf carries paint of its own it stays a box, with the words
        // inside it.
        if (node.bg || node.bd || node.br) {
          node.ch = [text]
          return node
        }

        return { ...node, ...text }
      }
    }

    // Depth is capped because a few authored pages nest spans inside spans for
    // typography; past this the boxes are all the same size as each other and
    // add layers without adding a drawing.
    if (depth > 24) return node

    const kids = []
    for (const child of el.childNodes) {
      if (child.nodeType === 1) {
        const built = walk(child, depth + 1)
        if (built) kids.push(built)
        continue
      }

      // Words sitting directly in a box that also holds elements. A grid or a
      // flex container blockifies its element children, so this is not a leaf
      // and the loop over `el.children` never saw them — which is how every
      // label in the contents list went missing and left its number behind.
      if (child.nodeType !== 3 || !child.nodeValue.trim()) continue

      const range = document.createRange()
      range.selectNode(child)
      const rect = range.getBoundingClientRect()
      if (rect.width < 0.5 || rect.height < 0.5) continue

      const leading = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.2
      kids.push({
        t: 'T',
        n: child.nodeValue.trim().slice(0, 40),
        r: [px(rect.x), px(rect.y + scrollY), px(rect.width), px(rect.height)],
        str: tidy(child.nodeValue),
        lines: Math.max(1, Math.round(rect.height / leading)),
        tx: textOf(el, s),
      })
    }
    if (kids.length) node.ch = kids

    // Auto layout is only offered where it would redraw the same picture.
    // Figma positions the children itself once a frame has it, so promising it
    // on a row that wraps, or one the browser justified some other way, moves
    // things the design never moved. The measurements are right here, so the
    // claim is checked rather than assumed — and where it fails the frame keeps
    // absolute positions and still looks right.
    if (node.al && kids.length) node.al = verify(node, kids)
    return node
  }

  /** Returns the layout if Figma would reproduce it, otherwise nothing. */
  const verify = (node, kids) => {
    const { dir, pad } = node.al
    const horizontal = dir === 'H'
    const start = horizontal ? 0 : 1
    const size = horizontal ? 2 : 3
    const [x, y] = node.r
    const origin = horizontal ? x + pad[3] : y + pad[0]

    const sorted = [...kids].sort((a, b) => a.r[start] - b.r[start])
    // Fragments that sit on top of each other are not a row.
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].r[start] < sorted[i - 1].r[start] + sorted[i - 1].r[size] - 1) return undefined
    }
    if (Math.abs(sorted[0].r[start] - origin) > 1.5) return undefined

    const gaps = []
    for (let i = 1; i < sorted.length; i++) {
      gaps.push(sorted[i].r[start] - (sorted[i - 1].r[start] + sorted[i - 1].r[size]))
    }
    // One even gap, or a single child and therefore no gap to disagree about.
    if (gaps.length && Math.max(...gaps) - Math.min(...gaps) > 1.5) return undefined

    return { ...node.al, gap: gaps.length ? px(gaps[0]) : node.al.gap, ok: true }
  }

  const root = document.querySelector('#root > div') || document.body
  const page = walk(root, 0)
  return {
    w: document.documentElement.clientWidth,
    h: Math.max(document.body.scrollHeight, page ? page.r[3] : 0),
    dir: document.documentElement.dir || 'ltr',
    lang: document.documentElement.lang || 'en',
    title: document.title,
    tree: page,
  }
}
