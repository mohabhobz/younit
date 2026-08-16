/* --------------------------------------------------------------------------
   Small shared things: colour, fonts, and talking to the panel.
   -------------------------------------------------------------------------- */

/** Where the snapshots are published. The panel can point this somewhere else. */
let BASE = 'https://younit-gray.vercel.app'

const say = (message) => figma.ui.postMessage({ kind: 'log', message })
const step = (done, total, label) =>
  figma.ui.postMessage({ kind: 'progress', done, total, label })

/** `#a3c6d7` → Figma's 0–1 triple. */
function hex(value) {
  const s = value.replace('#', '')
  const full = s.length === 3 ? s.split('').map((c) => c + c).join('') : s
  return {
    r: parseInt(full.slice(0, 2), 16) / 255,
    g: parseInt(full.slice(2, 4), 16) / 255,
    b: parseInt(full.slice(4, 6), 16) / 255,
  }
}

const solid = (rgb, opacity) => ({
  type: 'SOLID',
  color: { r: rgb.r, g: rgb.g, b: rgb.b },
  opacity: opacity === undefined ? 1 : opacity,
})

/**
 * The site's palette, indexed by the colour Figma would compute, so a fill
 * measured off the page can be recognised as a token rather than pasted as a
 * loose hex. This is what keeps the imported pages tied to the design system:
 * change `--yn-blue` in Figma later and every card that used it follows.
 */
const PALETTE = []
for (const name of Object.keys(TOKENS.colours)) {
  PALETTE.push({ name, rgb: hex(TOKENS.colours[name]) })
}

const near = (a, b) => Math.abs(a - b) < 0.012

function tokenFor(rgb) {
  for (const entry of PALETTE) {
    if (near(entry.rgb.r, rgb.r) && near(entry.rgb.g, rgb.g) && near(entry.rgb.b, rgb.b)) {
      return entry.name
    }
  }
  return null
}

/* --- Fonts ----------------------------------------------------------------

   Anybody is a variable font pinned to `wdth 117, wght 348` on the site.
   Figma reaches a variable font through its named instances, and the instance
   names differ between the static and variable releases, so each family is
   given a list of candidates and the first one the file has is the one used.
   If none load the family is reported once, by name, rather than failing the
   import halfway through.
   -------------------------------------------------------------------------- */

const FONT_CANDIDATES = {
  Poppins: {
    300: ['Light'],
    400: ['Regular'],
    500: ['Medium'],
    600: ['SemiBold'],
    700: ['Bold'],
  },
  Anybody: {
    300: ['SemiExpanded Light', 'Light', 'Regular'],
    348: ['SemiExpanded Light', 'SemiExpanded Regular', 'Light', 'Regular'],
    400: ['SemiExpanded Regular', 'Regular'],
    500: ['SemiExpanded Medium', 'Medium', 'Regular'],
    600: ['SemiExpanded SemiBold', 'SemiBold', 'Regular'],
    700: ['SemiExpanded Bold', 'Bold', 'Regular'],
  },
  'IBM Plex Mono': { 400: ['Regular'], 500: ['Medium'], 600: ['SemiBold'], 700: ['Bold'] },
  'IBM Plex Sans Arabic': { 300: ['Light'], 400: ['Regular'], 500: ['Medium'], 700: ['Bold'] },
}

const FALLBACK = { family: 'Inter', style: 'Regular' }
const loaded = {}
const missing = {}

async function font(family, weight) {
  const key = family + '/' + weight
  if (loaded[key]) return loaded[key]

  const table = FONT_CANDIDATES[family] || {}
  const names = table[weight] || table[400] || ['Regular']
  for (const style of names) {
    try {
      await figma.loadFontAsync({ family: family, style: style })
      loaded[key] = { family: family, style: style }
      return loaded[key]
    } catch (e) {
      /* try the next name */
    }
  }

  if (!missing[family]) {
    missing[family] = true
    say('Missing font: ' + family + ' — install it and run again for correct type.')
  }
  await figma.loadFontAsync(FALLBACK)
  loaded[key] = FALLBACK
  return FALLBACK
}

/** Which of the four families a measured font-family string belongs to. */
function familyOf(name) {
  const n = (name || '').toLowerCase()
  if (n.indexOf('poppins') === 0) return 'Poppins'
  if (n.indexOf('anybody') === 0) return 'Anybody'
  if (n.indexOf('ibm plex mono') === 0) return 'IBM Plex Mono'
  if (n.indexOf('ibm plex sans arabic') === 0) return 'IBM Plex Sans Arabic'
  return 'Anybody'
}
