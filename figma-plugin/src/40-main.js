/* --------------------------------------------------------------------------
   The plugin itself: one button, and what happens behind it.

   The panel does the fetching — a Figma plugin's main thread has no network —
   and hands the JSON over. Everything else happens here.
   -------------------------------------------------------------------------- */

figma.showUI(__html__, { width: 380, height: 520, themeColors: true })

/** Components made this run, or found from a previous one. */
async function findComponents() {
  const found = {}
  const nodes = figma.currentPage.findAll(
    (n) => n.type === 'COMPONENT_SET' || n.type === 'COMPONENT',
  )
  for (const node of nodes) {
    if (node.parent && node.parent.type === 'COMPONENT_SET') continue
    found[node.name] = node
  }
  return found
}

async function runSystem() {
  await buildVariables()
  await buildPaintStyles()
  await buildTextStyles()
  const board = await buildComponents()
  COMPONENTS = await findComponents()
  return board
}

/** Variables have to exist before a page can be bound to them. */
async function ensureSystem() {
  if (Object.keys(VARS.colour).length) return
  await buildVariables()
  COMPONENTS = await findComponents()
}

figma.ui.onmessage = async (message) => {
  try {
    if (message.kind === 'base') {
      BASE = message.base
      return
    }

    if (message.kind === 'system') {
      const board = await runSystem()
      figma.viewport.scrollAndZoomIntoView([board])
      figma.ui.postMessage({ kind: 'done', message: 'Design system built.' })
      return
    }

    if (message.kind === 'pages') {
      await ensureSystem()
      COMPONENTS = await findComponents()

      const list = message.pages
      const made = []
      let x = 0
      let y = 0
      let tallest = 0

      for (let i = 0; i < list.length; i++) {
        const entry = list[i]
        step(i, list.length, entry.route + ' · ' + entry.device)

        const page = await buildPage(entry.snapshot, x, y)
        made.push(page)

        // Laid out in rows of five, each page a column of its own width, so a
        // hundred frames still read as a contact sheet rather than a stack.
        x += page.width + 160
        tallest = Math.max(tallest, page.height)
        if ((i + 1) % 5 === 0) {
          x = 0
          y += tallest + 200
          tallest = 0
        }
      }

      step(list.length, list.length, 'done')
      if (made.length) figma.viewport.scrollAndZoomIntoView(made)
      figma.ui.postMessage({
        kind: 'done',
        message: made.length + ' page' + (made.length === 1 ? '' : 's') + ' imported.',
      })
      return
    }

    if (message.kind === 'close') figma.closePlugin()
  } catch (error) {
    figma.ui.postMessage({ kind: 'error', message: String((error && error.message) || error) })
  }
}
