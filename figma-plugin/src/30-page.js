/* --------------------------------------------------------------------------
   Snapshot → frames.

   The measurements come from a real browser, so this does not have to guess at
   layout. What it does add is the part a tracing tool cannot: where a fill
   matches a token it is bound to the variable, where a size matches the type
   scale it is bound to that, and where the page said "this is a button" the
   component is used instead of a rectangle with a word on it.
   -------------------------------------------------------------------------- */

let COMPONENTS = {}

/**
 * The header and the footer are the same design on every page, so they are
 * made once and used everywhere after that — a component built from the real
 * thing rather than a redrawing of it. Change the header in the file and all
 * hundred and fifty pages change with it.
 *
 * The key carries the width and the tone because those are the versions that
 * genuinely differ: a header on a phone is not a narrower desktop header, and
 * the blue one is not the dark one.
 */
const SHARED = ['Header', 'Footer']
let BUILT = {}
let BOARD = null

let LOCALE = 'en'

function sharedKey(node) {
  const tone = node.bg ? tokenFor(node.bg) || 'plain' : 'plain'
  // The language belongs in the key: the Arabic header is not the English one
  // reversed. It carries its own wordmark from the brand PDF, its own words,
  // and it reads the other way.
  return node.cmp + ' · ' + LOCALE + ' · ' + Math.round(node.r[2]) + ' · ' + tone
}

/** Turns the frame just built into a component, and hands back an instance. */
function componentise(node, frame, key) {
  figma.currentPage.appendChild(frame)
  const component = figma.createComponentFromNode(frame)
  component.name = key
  if (BOARD) BOARD.appendChild(component)
  BUILT[key] = component
  return component.createInstance()
}

/** The nearest type size token to a measured size, if it is close enough. */
function sizeTokenFor(size) {
  for (const name of Object.keys(TOKENS.sizes)) {
    if (Math.abs(TOKENS.sizes[name].Desktop - size) < 0.6) return name
  }
  return null
}

function radiusTokenFor(value) {
  for (const name of Object.keys(TOKENS.radii)) {
    if (Math.abs(TOKENS.radii[name].Desktop - value) < 0.6) return name
  }
  return null
}

function paintFor(rgba) {
  const token = tokenFor(rgba)
  const fill = {
    type: 'SOLID',
    color: { r: rgba.r, g: rgba.g, b: rgba.b },
    opacity: rgba.a === undefined ? 1 : rgba.a,
  }
  if (token && VARS.colour[token]) {
    return figma.variables.setBoundVariableForPaint(fill, 'color', VARS.colour[token])
  }
  return fill
}

const ALIGN = {
  'flex-start': 'MIN',
  start: 'MIN',
  center: 'CENTER',
  'flex-end': 'MAX',
  end: 'MAX',
  stretch: 'MIN',
  baseline: 'MIN',
  normal: 'MIN',
}

const JUSTIFY = {
  'flex-start': 'MIN',
  start: 'MIN',
  center: 'CENTER',
  'flex-end': 'MAX',
  end: 'MAX',
  'space-between': 'SPACE_BETWEEN',
  normal: 'MIN',
}

/** A text node carrying the words, the face and the colour it was measured in. */
async function buildText(node) {
  const text = figma.createText()
  const tx = node.tx
  text.fontName = await font(familyOf(tx.f), tx.w)
  text.characters = node.str
  text.name = node.n || 'text'

  text.fontSize = Math.max(1, tx.s)
  const token = sizeTokenFor(tx.s)
  if (token && VARS.size[token]) {
    try {
      text.setBoundVariable('fontSize', VARS.size[token])
    } catch (e) {
      /* the measured value already stands */
    }
  }

  // The stylesheet shouts a lot of its small labels. The words are stored as
  // they were authored, so the shouting is a property here rather than a second
  // copy of the string in capitals.
  if (tx.tt === 'uppercase') text.textCase = 'UPPER'
  else if (tx.tt === 'lowercase') text.textCase = 'LOWER'
  else if (tx.tt === 'capitalize') text.textCase = 'TITLE'

  if (tx.lh) text.lineHeight = { unit: 'PIXELS', value: tx.lh }
  if (tx.ls) text.letterSpacing = { unit: 'PIXELS', value: tx.ls }
  if (tx.c) text.fills = [paintFor(tx.c)]
  if (tx.u) text.textDecoration = 'UNDERLINE'
  if (tx.a === 'center') text.textAlignHorizontal = 'CENTER'
  else if (tx.a === 'right' || tx.a === 'end') text.textAlignHorizontal = 'RIGHT'
  else if (tx.a === 'justify') text.textAlignHorizontal = 'JUSTIFIED'

  // A line that did not wrap in the browser must not wrap here. Figma draws
  // the same words a hair wider or narrower than the browser did — the faces
  // are not identical to the pixel — so a box measured to fit exactly can push
  // the last word onto a second line, and "03/08" arrives as "03/0" over "8".
  // A single line is left to size itself; only wrapped copy keeps its box.
  if (node.lines === 1) {
    text.textAutoResize = 'WIDTH_AND_HEIGHT'
  } else {
    text.textAutoResize = 'HEIGHT'
    text.resize(Math.max(1, node.r[2]), Math.max(1, node.r[3]))
  }
  return text
}

/**
 * Where a line that sizes itself has to sit.
 *
 * A text node left to size itself is exactly as wide as its words, so it can no
 * longer be centred by its own box — and the arrow inside every round button
 * ended up in a corner of it. The box is still known, so the words are placed
 * in it the way the browser placed them.
 */
function offsetIn(node, text) {
  if (node.lines !== 1) return [0, 0]

  const [, , width, height] = node.r
  const align = node.tx.a
  const rtl = node.tx.dir === 'rtl'
  const toEnd =
    align === 'right' ||
    align === 'end' ||
    (rtl && (align === 'start' || align === 'left' || align === 'justify' || align === 'normal'))

  let dx = 0
  if (align === 'center') dx = (width - text.width) / 2
  else if (toEnd) dx = width - text.width

  // A line of body copy is as tall as its leading, so this is nothing most of
  // the time. It is the glyph in a 44px circle that needs it.
  return [dx, (height - text.height) / 2]
}

async function buildImage(node) {
  const rect = figma.createRectangle()
  rect.name = node.n || 'image'
  rect.resize(Math.max(1, node.r[2]), Math.max(1, node.r[3]))
  if (node.br) rect.cornerRadius = node.br[0]

  try {
    const image = await figma.createImageAsync(node.src)
    rect.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: node.fit === 'contain' ? 'FIT' : 'FILL' }]
  } catch (e) {
    // A picture that will not load is drawn as the grey it sat on, named, so
    // the page still reads and the gap is obvious rather than invisible.
    rect.fills = [solid(hex(TOKENS.colours['grey-dark']), 0.25)]
    rect.name = 'missing image — ' + (node.n || node.src)
  }
  return rect
}

function buildVector(node) {
  try {
    const made = figma.createNodeFromSvg(node.svg)
    made.name = node.n || 'vector'
    made.resize(Math.max(1, node.r[2]), Math.max(1, node.r[3]))
    return made
  } catch (e) {
    return null
  }
}

/** An instance of the component this element is, sized as it was measured. */
function instanceFor(node) {
  const set = COMPONENTS[node.cmp]
  if (!set) return null
  try {
    const component = set.type === 'COMPONENT_SET' ? set.defaultVariant : set
    const instance = component.createInstance()
    // The component hugs its label; this one has to be the size the browser
    // drew, and a frame that hugs refuses to be resized until it is told to
    // stop.
    try {
      instance.primaryAxisSizingMode = 'FIXED'
      instance.counterAxisSizingMode = 'FIXED'
    } catch (e) {
      /* not an auto-layout component; it resizes freely */
    }
    instance.resize(Math.max(1, node.r[2]), Math.max(1, node.r[3]))
    return instance
  } catch (e) {
    return null
  }
}

async function buildNode(node, parentX, parentY) {
  // A button is a button, whatever shape the snapshot recorded it in. This is
  // checked before the type, because a pill with nothing inside it but a word
  // arrives as a box holding one line of text.
  if (node.cmp === 'Button' || node.cmp === 'ArrowButton') {
    const instance = instanceFor(node)
    if (instance) {
      const words = firstText(node)
      if (words) {
        try {
          const target = instance.findOne((n) => n.type === 'TEXT')
          if (target) {
            await figma.loadFontAsync(target.fontName)
            target.characters = words
          }
        } catch (e) {
          /* the default label stays */
        }
      }
      instance.x = node.r[0] - parentX
      instance.y = node.r[1] - parentY
      return instance
    }
  }

  if (node.t === 'T') {
    const text = await buildText(node)
    const offset = offsetIn(node, text)
    text.x = node.r[0] - parentX + offset[0]
    text.y = node.r[1] - parentY + offset[1]
    return text
  }

  if (node.t === 'I') {
    const image = await buildImage(node)
    image.x = node.r[0] - parentX
    image.y = node.r[1] - parentY
    return image
  }

  if (node.t === 'V') {
    const vector = buildVector(node)
    if (!vector) return null
    vector.x = node.r[0] - parentX
    vector.y = node.r[1] - parentY
    return vector
  }

  // A header already made is not rebuilt: the instance is placed and the two
  // hundred nodes inside it are never walked again.
  const shared = SHARED.indexOf(node.cmp) !== -1 ? sharedKey(node) : null
  if (shared && BUILT[shared]) {
    const instance = BUILT[shared].createInstance()
    instance.x = node.r[0] - parentX
    instance.y = node.r[1] - parentY
    return instance
  }

  const frame = figma.createFrame()
  frame.name = node.n || 'frame'
  frame.resize(Math.max(1, node.r[2]), Math.max(1, node.r[3]))
  frame.x = node.r[0] - parentX
  frame.y = node.r[1] - parentY
  frame.fills = node.bg ? [paintFor(node.bg)] : []
  frame.clipsContent = node.clip === true

  if (node.bd) {
    frame.strokes = [paintFor(node.bd.c)]
    frame.strokeWeight = node.bd.w
    frame.strokeAlign = 'INSIDE'
  }

  if (node.br) {
    const token = radiusTokenFor(node.br[0])
    if (token && node.br[0] === node.br[1] && node.br[0] === node.br[2] && node.br[0] === node.br[3]) {
      bindRadius(frame, token)
    } else {
      frame.topLeftRadius = node.br[0]
      frame.topRightRadius = node.br[1]
      frame.bottomRightRadius = node.br[2]
      frame.bottomLeftRadius = node.br[3]
    }
  }

  if (node.op !== undefined) frame.opacity = node.op

  const children = node.ch || []
  for (const child of children) {
    const built = await buildNode(child, node.r[0], node.r[1])
    if (built) frame.appendChild(built)
  }

  // Auto layout last: the exporter has already checked that Figma would put
  // the children back where the browser had them, and setting it before they
  // are appended would move them on the way in.
  if (node.al && node.al.ok && frame.children.length) {
    const sizes = []
    for (const child of frame.children) sizes.push([child.width, child.height])

    frame.layoutMode = node.al.dir === 'V' ? 'VERTICAL' : 'HORIZONTAL'
    frame.primaryAxisSizingMode = 'FIXED'
    frame.counterAxisSizingMode = 'FIXED'
    // A frame given auto layout hugs its children the moment it gets it —
    // before it has been told the padding and the gaps that make up the rest of
    // its width. Freezing it there leaves it as wide as its contents and the
    // last child hanging outside, which is what happened to the header. So it
    // is put back to the size the browser drew it at, now that the sizing is
    // fixed and the number will hold.
    frame.resize(Math.max(1, node.r[2]), Math.max(1, node.r[3]))
    frame.itemSpacing = Math.max(0, node.al.gap)
    frame.paddingTop = node.al.pad[0]
    frame.paddingRight = node.al.pad[1]
    frame.paddingBottom = node.al.pad[2]
    frame.paddingLeft = node.al.pad[3]
    frame.counterAxisAlignItems = ALIGN[node.al.align] || 'MIN'
    frame.primaryAxisAlignItems = JUSTIFY[node.al.justify] || 'MIN'

    // Auto layout resizes what it takes in; the measured sizes are the design.
    for (let i = 0; i < frame.children.length; i++) {
      const child = frame.children[i]
      try {
        child.layoutSizingHorizontal = 'FIXED'
        child.layoutSizingVertical = 'FIXED'
        child.resize(sizes[i][0], sizes[i][1])
      } catch (e) {
        /* a vector group cannot always be resized; it keeps its own size */
      }
    }
  }

  if (shared) {
    const instance = componentise(node, frame, shared)
    instance.x = node.r[0] - parentX
    instance.y = node.r[1] - parentY
    return instance
  }

  return frame
}

/** The first words inside a node, for labelling an instance. */
function firstText(node) {
  if (node.t === 'T') return node.str
  for (const child of node.ch || []) {
    const found = firstText(child)
    if (found) return found
  }
  return null
}

async function buildPage(snapshot, x, y) {
  LOCALE = snapshot.locale || 'en'

  const page = figma.createFrame()
  page.name = snapshot.route + '  ·  ' + snapshot.device + '  ·  ' + snapshot.locale
  page.resize(Math.max(1, snapshot.w), Math.max(1, Math.round(snapshot.h)))
  page.x = x
  page.y = y
  bindFill(page, 'grey')
  page.clipsContent = true
  figma.currentPage.appendChild(page)

  const tree = snapshot.tree
  if (tree) {
    for (const child of tree.ch || []) {
      const built = await buildNode(child, tree.r[0], tree.r[1])
      if (built) page.appendChild(built)
    }
    // A page whose whole body is one box still has to be drawn.
    if (!tree.ch || !tree.ch.length) {
      const built = await buildNode(tree, tree.r[0], tree.r[1])
      if (built) page.appendChild(built)
    }
  }

  return page
}
