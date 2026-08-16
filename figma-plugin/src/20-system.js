/* --------------------------------------------------------------------------
   The design system: variables first, then the styles that read them, then the
   components built out of both.

   Order matters. A text style bound to a size variable follows the mode, so
   switching a frame from Desktop to Mobile resizes every heading inside it —
   but only if the variable exists before the style is made. Same for the
   components: a button whose fill is bound to `colour/white` updates when the
   palette does, and a button painted with a loose hex never will.
   -------------------------------------------------------------------------- */

/** Collections are reused across runs so a second import does not duplicate them. */
async function collection(name, modes) {
  const existing = await figma.variables.getLocalVariableCollectionsAsync()
  for (const c of existing) {
    if (c.name === name) return c
  }

  const made = figma.variables.createVariableCollection(name)
  made.renameMode(made.modes[0].modeId, modes[0])
  for (let i = 1; i < modes.length; i++) made.addMode(modes[i])
  return made
}

async function variable(collection, name, type) {
  const existing = await figma.variables.getLocalVariablesAsync()
  for (const v of existing) {
    if (v.name === name && v.variableCollectionId === collection.id) return v
  }
  return figma.variables.createVariable(name, collection, type)
}

const VARS = { colour: {}, size: {}, radius: {}, space: {} }

async function buildVariables() {
  say('Variables…')

  // Colour does not change with the width of the screen, so it gets a
  // collection of its own rather than three identical modes.
  const paint = await collection('Younit / Colour', ['Value'])
  const paintMode = paint.modes[0].modeId
  for (const name of Object.keys(TOKENS.colours)) {
    const v = await variable(paint, name, 'COLOR')
    v.setValueForMode(paintMode, hex(TOKENS.colours[name]))
    VARS.colour[name] = v
  }

  // Everything measured in pixels does change, and the stylesheet already says
  // how: three media queries, three modes, one variable each.
  const scale = await collection('Younit / Scale', TOKENS.modes)
  const modeIds = {}
  for (const mode of scale.modes) modeIds[mode.name] = mode.modeId

  const groups = [
    ['type/', TOKENS.sizes, VARS.size],
    ['radius/', TOKENS.radii, VARS.radius],
    ['space/', TOKENS.space, VARS.space],
  ]

  for (const group of groups) {
    const prefix = group[0]
    const source = group[1]
    const store = group[2]
    for (const name of Object.keys(source)) {
      const v = await variable(scale, prefix + name, 'FLOAT')
      for (const modeName of Object.keys(source[name])) {
        if (modeIds[modeName] !== undefined) v.setValueForMode(modeIds[modeName], source[name][modeName])
      }
      store[name] = v
    }
  }

  say(
    Object.keys(VARS.colour).length +
      ' colours, ' +
      Object.keys(VARS.size).length +
      ' type sizes x ' +
      TOKENS.modes.length +
      ' modes, ' +
      Object.keys(VARS.radius).length +
      ' radii, ' +
      Object.keys(VARS.space).length +
      ' spacing',
  )
}

async function buildPaintStyles() {
  const existing = await figma.getLocalPaintStylesAsync()
  const byName = {}
  for (const s of existing) byName[s.name] = s

  for (const name of Object.keys(TOKENS.colours)) {
    const styleName = 'Younit/' + name
    const style = byName[styleName] || figma.createPaintStyle()
    style.name = styleName
    const fill = solid(hex(TOKENS.colours[name]))
    style.paints = [
      VARS.colour[name]
        ? figma.variables.setBoundVariableForPaint(fill, 'color', VARS.colour[name])
        : fill,
    ]
  }
  say(Object.keys(TOKENS.colours).length + ' paint styles')
}

async function buildTextStyles() {
  const existing = await figma.getLocalTextStylesAsync()
  const byName = {}
  for (const s of existing) byName[s.name] = s

  for (const spec of TOKENS.text) {
    const family = TOKENS.families[spec.family].family
    const chosen = await font(family, spec.weight)
    const style = byName['Younit/' + spec.name] || figma.createTextStyle()
    style.name = 'Younit/' + spec.name
    style.fontName = chosen
    style.fontSize = TOKENS.sizes[spec.size] ? TOKENS.sizes[spec.size].Desktop : 16

    const lh = typeof spec.lh === 'number' ? spec.lh : 1.15
    style.lineHeight = { unit: 'PERCENT', value: Math.round(lh * 100) }
    if (spec.tracking) style.letterSpacing = { unit: 'PERCENT', value: spec.tracking * 100 }

    // The binding is the point: the number above is only what Desktop shows.
    if (VARS.size[spec.size]) {
      try {
        style.setBoundVariable('fontSize', VARS.size[spec.size])
      } catch (e) {
        /* older editors cannot bind a style; the value above still stands */
      }
    }
  }
  say(TOKENS.text.length + ' text styles')
}

/* --- Components -----------------------------------------------------------

   Built rather than traced. These are the pieces the site repeats, and a
   traced copy of one of them is a picture of a button; a component is a button.
   Everything here paints from the variables above.
   -------------------------------------------------------------------------- */

function bindFill(node, token, opacity) {
  const fill = solid(hex(TOKENS.colours[token]), opacity)
  node.fills = [
    VARS.colour[token] ? figma.variables.setBoundVariableForPaint(fill, 'color', VARS.colour[token]) : fill,
  ]
}

function bindStroke(node, token, weight) {
  const fill = solid(hex(TOKENS.colours[token]))
  node.strokes = [
    VARS.colour[token] ? figma.variables.setBoundVariableForPaint(fill, 'color', VARS.colour[token]) : fill,
  ]
  node.strokeWeight = weight === undefined ? 1 : weight
  node.strokeAlign = 'INSIDE'
}

function bindRadius(node, token) {
  node.cornerRadius = TOKENS.radii[token] ? TOKENS.radii[token].Desktop : 0
  if (VARS.radius[token]) {
    try {
      node.setBoundVariable('topLeftRadius', VARS.radius[token])
      node.setBoundVariable('topRightRadius', VARS.radius[token])
      node.setBoundVariable('bottomLeftRadius', VARS.radius[token])
      node.setBoundVariable('bottomRightRadius', VARS.radius[token])
    } catch (e) {
      /* the plain value above already reads correctly */
    }
  }
}

async function label(text, family, weight, sizeToken, colourToken, tracking, upper) {
  const node = figma.createText()
  node.fontName = await font(TOKENS.families[family].family, weight)
  node.characters = upper ? text.toUpperCase() : text
  node.fontSize = TOKENS.sizes[sizeToken].Desktop
  if (VARS.size[sizeToken]) {
    try {
      node.setBoundVariable('fontSize', VARS.size[sizeToken])
    } catch (e) {
      /* value stands */
    }
  }
  if (tracking) node.letterSpacing = { unit: 'PERCENT', value: tracking * 100 }
  bindFill(node, colourToken)
  return node
}

/**
 * The pill. Every actionable thing on the site is one: a 1px ink outline, a
 * fill that carries the meaning, and an inverted state on hover. The fill and
 * the two sizes are variants, so a designer picks a button rather than drawing
 * one.
 */
async function buildButton() {
  const tones = [
    ['white', 'white', 'ink'],
    ['blue', 'blue', 'ink'],
    ['amber', 'amber', 'ink'],
    ['ink', 'ink', 'white'],
  ]
  const sizes = [['lg', 14, 30, 'small'], ['sm', 9, 22, 'micro']]

  const variants = []
  for (const tone of tones) {
    for (const size of sizes) {
      for (const state of ['default', 'hover']) {
        const frame = figma.createComponent()
        frame.name = 'Tone=' + tone[0] + ', Size=' + size[0] + ', State=' + state
        frame.layoutMode = 'HORIZONTAL'
        frame.primaryAxisSizingMode = 'AUTO'
        frame.counterAxisSizingMode = 'AUTO'
        frame.paddingTop = size[1]
        frame.paddingBottom = size[1]
        frame.paddingLeft = size[2]
        frame.paddingRight = size[2]
        frame.counterAxisAlignItems = 'CENTER'

        // On hover the pill inverts: the fill becomes the label's colour.
        const inverted = state === 'hover'
        bindFill(frame, inverted ? tone[2] : tone[1])
        bindStroke(frame, 'ink')
        bindRadius(frame, 'r-pill')

        const text = await label(
          'Button',
          'body',
          400,
          size[3],
          inverted ? tone[1] : tone[2],
          0.09,
          true,
        )
        frame.appendChild(text)
        variants.push(frame)
      }
    }
  }

  const set = figma.combineAsVariants(variants, figma.currentPage)
  set.name = 'Button'
  return set
}

/** A card: ink outline, card radius, a title and a line of copy. */
async function buildCard() {
  const variants = []
  for (const tone of ['white', 'blue', 'amber', 'purple']) {
    const frame = figma.createComponent()
    frame.name = 'Tone=' + tone
    frame.resize(360, 220)
    frame.layoutMode = 'VERTICAL'
    frame.primaryAxisSizingMode = 'FIXED'
    frame.counterAxisSizingMode = 'FIXED'
    frame.paddingTop = 28
    frame.paddingBottom = 28
    frame.paddingLeft = 28
    frame.paddingRight = 28
    frame.itemSpacing = 12
    bindFill(frame, tone)
    bindStroke(frame, 'ink')
    bindRadius(frame, 'r-card')

    const title = await label('Card title', 'display', 400, 'card-title', 'ink')
    const body = await label('One line of supporting copy.', 'body', 400, 'body-size', 'ink')
    frame.appendChild(title)
    frame.appendChild(body)
    // Only once it is inside the frame: a node has no layout sizing until it
    // has a parent that lays it out.
    body.layoutSizingHorizontal = 'FILL'
    variants.push(frame)
  }

  const set = figma.combineAsVariants(variants, figma.currentPage)
  set.name = 'Card'
  return set
}

/** The note beside a lesson: a label in the corner and a paragraph under it. */
async function buildCallout() {
  const frame = figma.createComponent()
  frame.name = 'Callout'
  frame.resize(680, 100)
  frame.layoutMode = 'VERTICAL'
  frame.primaryAxisSizingMode = 'AUTO'
  frame.counterAxisSizingMode = 'FIXED'
  frame.paddingTop = 20
  frame.paddingBottom = 20
  frame.paddingLeft = 24
  frame.paddingRight = 24
  frame.itemSpacing = 6
  bindFill(frame, 'blue')
  bindStroke(frame, 'ink')
  bindRadius(frame, 'r-editorial')

  const kind = await label('NOTE', 'mono', 400, 'micro', 'ink', 0.08, true)
  const body = await label('The note itself.', 'body', 400, 'body-size', 'ink')
  frame.appendChild(kind)
  frame.appendChild(body)
  body.layoutSizingHorizontal = 'FILL'
  return frame
}

/** The full-width row that carries you to the next session. */
async function buildPillRow() {
  const frame = figma.createComponent()
  frame.name = 'PillRow'
  frame.resize(1000, 92)
  frame.layoutMode = 'HORIZONTAL'
  frame.primaryAxisSizingMode = 'FIXED'
  frame.counterAxisSizingMode = 'FIXED'
  frame.counterAxisAlignItems = 'CENTER'
  frame.primaryAxisAlignItems = 'SPACE_BETWEEN'
  frame.paddingLeft = 32
  frame.paddingRight = 20
  bindFill(frame, 'white')
  bindStroke(frame, 'ink')
  bindRadius(frame, 'r-pill')

  const title = await label('Next session', 'display', 300, 'h3', 'ink')

  const arrow = figma.createFrame()
  arrow.name = 'Arrow'
  arrow.resize(44, 44)
  arrow.layoutMode = 'HORIZONTAL'
  arrow.primaryAxisAlignItems = 'CENTER'
  arrow.counterAxisAlignItems = 'CENTER'
  bindFill(arrow, 'white')
  bindStroke(arrow, 'ink')
  bindRadius(arrow, 'r-pill')
  const glyph = await label('→', 'body', 400, 'body-size', 'ink')
  arrow.appendChild(glyph)

  frame.appendChild(title)
  frame.appendChild(arrow)
  return frame
}

/** The trail above a page title. */
async function buildBreadcrumb() {
  const frame = figma.createComponent()
  frame.name = 'Breadcrumb'
  frame.layoutMode = 'HORIZONTAL'
  frame.primaryAxisSizingMode = 'AUTO'
  frame.counterAxisSizingMode = 'AUTO'
  frame.itemSpacing = 10
  frame.counterAxisAlignItems = 'CENTER'
  frame.fills = []

  const parts = ['Learn', '/', 'Foundation', '/', 'Session 1 of 5']
  for (const part of parts) {
    frame.appendChild(
      await label(part, 'mono', 400, 'micro', part === '/' ? 'purple' : 'grey-dark', 0.08, true),
    )
  }
  return frame
}

async function buildComponents() {
  say('Components…')

  const page = figma.currentPage
  const made = []
  made.push(await buildButton())
  made.push(await buildCard())
  made.push(await buildCallout())
  made.push(await buildPillRow())
  made.push(await buildBreadcrumb())

  // Laid out in a column on the canvas so the library reads as a sheet rather
  // than a pile at the origin.
  const board = figma.createFrame()
  board.name = 'Younit — components'
  board.layoutMode = 'VERTICAL'
  board.primaryAxisSizingMode = 'AUTO'
  board.counterAxisSizingMode = 'AUTO'
  board.itemSpacing = 64
  board.paddingTop = 64
  board.paddingBottom = 64
  board.paddingLeft = 64
  board.paddingRight = 64
  bindFill(board, 'grey')
  board.x = -1800
  board.y = 0
  page.appendChild(board)

  for (const node of made) board.appendChild(node)

  // The page builder adds to this: the header and the footer become components
  // the first time a page brings one in, and land here beside the rest.
  BOARD = board

  say(made.length + ' components')
  return board
}
