/**
 * Runs the plugin against a stand-in for Figma.
 *
 * The plugin cannot be tested inside Figma from here, and shipping it untried
 * means finding out it throws halfway through a page the client is waiting on.
 * So the editor is faked: enough of the node types, the variable API and the
 * font loader to run the real `code.js` end to end over a real snapshot. It
 * proves the code paths execute and the tree comes out the shape it should —
 * not that it looks right, which is a thing only eyes can say.
 *
 *   node tools/figma/check-plugin.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

const ROOT = new URL('../../', import.meta.url)
const code = readFileSync(new URL('figma-plugin/code.js', ROOT), 'utf8')

/* --- The stand-in ---------------------------------------------------------- */

const made = { nodes: 0, byType: {}, variables: [], paintStyles: [], textStyles: [] }
const bound = { fills: 0, sizes: 0, radii: 0 }
const warnings = []

/** Every font the plugin is willing to ask for, so the fallback never fires. */
const FONTS = new Set()
for (const family of ['Poppins', 'Anybody', 'IBM Plex Mono', 'IBM Plex Sans Arabic', 'Inter']) {
  for (const style of [
    'Light', 'Regular', 'Medium', 'SemiBold', 'Bold',
    'SemiExpanded Light', 'SemiExpanded Regular', 'SemiExpanded Medium',
    'SemiExpanded SemiBold', 'SemiExpanded Bold',
  ]) {
    FONTS.add(family + '/' + style)
  }
}

let ids = 0

function node(type) {
  made.nodes++
  made.byType[type] = (made.byType[type] || 0) + 1

  const self = {
    id: 'n' + ++ids,
    type,
    name: '',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    children: [],
    parent: null,
    fills: [],
    strokes: [],
    characters: '',
    fontName: { family: 'Inter', style: 'Regular' },
    fontSize: 16,
    resize(w, h) {
      if (!(w > 0) || !(h > 0)) throw new Error(`${type} resized to ${w}x${h}`)
      self.width = w
      self.height = h
    },
    appendChild(child) {
      if (!child) throw new Error('appended nothing')
      if (child.parent) child.parent.children = child.parent.children.filter((c) => c !== child)
      child.parent = self
      self.children.push(child)
    },
    findOne(match) {
      for (const child of self.children) {
        if (match(child)) return child
        const deeper = child.findOne && child.findOne(match)
        if (deeper) return deeper
      }
      return null
    },
    findAll(match) {
      const out = []
      for (const child of self.children) {
        if (!match || match(child)) out.push(child)
        if (child.findAll) out.push(...child.findAll(match))
      }
      return out
    },
    setBoundVariable(field, variable) {
      if (!variable) throw new Error('bound nothing to ' + field)
      if (field === 'fontSize') bound.sizes++
      else if (field.toLowerCase().includes('radius')) bound.radii++
    },
    createInstance() {
      const instance = node('INSTANCE')
      for (const child of self.children) instance.appendChild(clone(child))
      return instance
    },
  }

  // A frame hugs its children the moment it is given auto layout, before it
  // has been told its padding or its gaps. The editor does this and the
  // stand-in has to as well: the header came out as wide as its contents and
  // nothing here noticed, because a div with a width does not shrink.
  let mode = 'NONE'
  Object.defineProperty(self, 'layoutMode', {
    set(value) {
      mode = value
      if (value === 'HORIZONTAL' || value === 'VERTICAL') {
        self.primaryAxisSizingMode = 'AUTO'
        let along = 0
        let across = 0
        for (const child of self.children) {
          along += value === 'HORIZONTAL' ? child.width : child.height
          across = Math.max(across, value === 'HORIZONTAL' ? child.height : child.width)
        }
        self.width = value === 'HORIZONTAL' ? along : across
        self.height = value === 'HORIZONTAL' ? across : along
      }
    },
    get() {
      return mode
    },
  })

  // The editor refuses these unless the node is laid out by its parent, and a
  // stand-in that shrugs at them is worse than no stand-in: it passes the run
  // that Figma is about to stop. This is the check that caught setting the
  // sizing on a card's body before the card had taken it in.
  for (const axis of ['layoutSizingHorizontal', 'layoutSizingVertical']) {
    Object.defineProperty(self, axis, {
      set(value) {
        const laidOut = self.layoutMode && self.layoutMode !== 'NONE'
        const parentLaysOut = self.parent && self.parent.layoutMode && self.parent.layoutMode !== 'NONE'
        if (!laidOut && !parentLaysOut) {
          throw new Error(
            `${axis} = ${value} on <${type} ${self.name || 'unnamed'}> — ` +
              'node must be an auto-layout frame or a child of one',
          )
        }
        self['_' + axis] = value
      },
      get() {
        return self['_' + axis]
      },
    })
  }

  return self
}

function clone(source) {
  const copy = node(source.type)
  copy.name = source.name
  copy.characters = source.characters
  copy.fontName = source.fontName
  for (const child of source.children) copy.appendChild(clone(child))
  return copy
}

const figma = {
  currentPage: node('PAGE'),
  viewport: { scrollAndZoomIntoView() {} },
  ui: {
    postMessage(message) {
      if (message.kind === 'error') throw new Error('plugin reported: ' + message.message)
      if (message.kind === 'log' && /Missing font/.test(message.message)) {
        warnings.push(message.message)
      }
    },
    onmessage: null,
  },
  showUI() {},
  closePlugin() {},

  async loadFontAsync(spec) {
    if (!FONTS.has(spec.family + '/' + spec.style)) {
      throw new Error('no such font: ' + spec.family + ' ' + spec.style)
    }
  },

  createFrame: () => node('FRAME'),
  createText: () => node('TEXT'),
  createRectangle: () => node('RECTANGLE'),
  createComponent: () => node('COMPONENT'),
  createNodeFromSvg: () => node('FRAME'),
  async createImageAsync() {
    return { hash: 'hash' }
  },

  combineAsVariants(variants, parent) {
    const set = node('COMPONENT_SET')
    for (const variant of variants) set.appendChild(variant)
    set.defaultVariant = variants[0]
    parent.appendChild(set)
    return set
  },

  async getLocalPaintStylesAsync() {
    return made.paintStyles
  },
  async getLocalTextStylesAsync() {
    return made.textStyles
  },
  createPaintStyle() {
    const style = { name: '', paints: [] }
    made.paintStyles.push(style)
    return style
  },
  createTextStyle() {
    const style = {
      name: '',
      setBoundVariable(field) {
        if (field === 'fontSize') bound.sizes++
      },
    }
    made.textStyles.push(style)
    return style
  },

  variables: {
    async getLocalVariableCollectionsAsync() {
      return collections
    },
    async getLocalVariablesAsync() {
      return made.variables
    },
    createVariableCollection(name) {
      const collection = {
        id: 'c' + ++ids,
        name,
        modes: [{ modeId: 'm1', name: 'Mode 1' }],
        renameMode(id, next) {
          collection.modes.find((m) => m.modeId === id).name = next
        },
        addMode(next) {
          collection.modes.push({ modeId: 'm' + ++ids, name: next })
        },
      }
      collections.push(collection)
      return collection
    },
    createVariable(name, collection, type) {
      const variable = {
        id: 'v' + ++ids,
        name,
        resolvedType: type,
        variableCollectionId: collection.id,
        values: {},
        setValueForMode(modeId, value) {
          if (value === undefined) throw new Error('no value for ' + name)
          variable.values[modeId] = value
        },
      }
      made.variables.push(variable)
      return variable
    },
    setBoundVariableForPaint(paint, field, variable) {
      if (!variable) throw new Error('bound no variable for ' + field)
      bound.fills++
      return { ...paint, boundVariables: { [field]: { id: variable.id } } }
    },
  },
}

const collections = []

/* --- Run it ---------------------------------------------------------------- */

const sandbox = { figma, __html__: '<html></html>', console }
runInNewContext(code, sandbox)

if (typeof figma.ui.onmessage !== 'function') {
  console.error('the plugin never registered a message handler')
  process.exit(1)
}

await figma.ui.onmessage({ kind: 'system' })

const modes = collections.map((c) => `${c.name} [${c.modes.map((m) => m.name).join(', ')}]`)
console.log('variables:', made.variables.length, '—', modes.join('  '))
console.log('paint styles:', made.paintStyles.length, ' text styles:', made.textStyles.length)
console.log('components:', made.byType.COMPONENT_SET || 0, 'sets,', made.byType.COMPONENT || 0, 'variants')

const everyVariableHasEveryMode = made.variables.every((v) => {
  const collection = collections.find((c) => c.id === v.variableCollectionId)
  return collection.modes.every((m) => v.values[m.modeId] !== undefined)
})
if (!everyVariableHasEveryMode) {
  console.error('✗ a variable is missing a value in one of its modes')
  process.exit(1)
}

/* Then a real page, the biggest and the most awkward one. */
const dir = new URL('public/figma/pages/', ROOT)
const files = readdirSync(dir).filter((f) => f.endsWith('.json'))

// A spread rather than a list of names: the export is run at two scopes and
// the files are named after whichever routes it covered. The biggest page is
// the one most likely to break, so it is always in.
const biggest = files
  .map((f) => [f, statSync(new URL(f, dir)).size])
  .sort((a, b) => b[1] - a[1])[0][0]

const pick = (match) => files.find((f) => match(f) && f !== biggest)
const sample = [
  biggest,
  pick((f) => f.startsWith('home') && f.endsWith('desktop.json')),
  pick((f) => f.includes('-ar-') && f.endsWith('desktop.json')),
  pick((f) => f.endsWith('mobile.json')),
].filter(Boolean)

let drift = 0

/**
 * Every frame has to come out the size the browser measured it at. This is the
 * check that would have caught the header: it was given auto layout, hugged
 * its three children, and kept that width — so the band stopped short and the
 * language switch sat outside it on the grey.
 */
function compare(built, node, file, path) {
  if (!built || !node) return
  const wanted = node.r
  if (built.type === 'FRAME' || built.type === 'COMPONENT') {
    const off = Math.abs(built.width - wanted[2]) + Math.abs(built.height - wanted[3])
    if (off > 1.5) {
      drift++
      if (drift < 6) {
        console.error(
          `  ✗ ${file} ${path}<${node.n}> is ${Math.round(built.width)}x${Math.round(built.height)}, ` +
            `measured ${Math.round(wanted[2])}x${Math.round(wanted[3])}`,
        )
      }
    }
  }
  const kids = node.ch || []
  for (let i = 0; i < kids.length && i < built.children.length; i++) {
    compare(built.children[i], kids[i], file, path + node.n + ' › ')
  }
}

for (const file of sample) {
  const before = made.nodes
  const pageCount = figma.currentPage.children.length
  const snapshot = JSON.parse(readFileSync(new URL(file, dir), 'utf8'))
  await figma.ui.onmessage({
    kind: 'pages',
    pages: [{ route: snapshot.route, device: snapshot.device, snapshot }],
  })

  const built = figma.currentPage.children[pageCount]
  const kids = snapshot.tree.ch || []
  for (let i = 0; i < kids.length && i < built.children.length; i++) {
    compare(built.children[i], kids[i], file, '')
  }

  console.log(`${file}: ${made.nodes - before} nodes built`)
}

if (drift) {
  console.error(`\n✗ ${drift} frames came out a different size than the page they came from`)
  process.exit(1)
}

console.log(
  `\nbound: ${bound.fills} fills, ${bound.sizes} type sizes, ${bound.radii} radii ` +
    'tied to variables',
)
if (warnings.length) console.log('warnings:', warnings.join(' | '))
console.log('PASS — the plugin runs end to end')
