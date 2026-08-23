/**
 * Marketing's comments, out of Figma and into a list you can work from.
 *
 * Figma keeps comments in the file and nowhere else, and there is no export.
 * The REST API will hand them over, so this asks for them, works out which page
 * of the site each one is pinned to, and writes a checklist. When a comment is
 * done it can post the reply back on the thread, so the person who wrote it
 * sees "Done" in Figma next to what they asked for, with the address to check
 * it on.
 *
 * One thing the API cannot do is tick the box: Figma has no endpoint for
 * resolving a comment, by design — resolving stays a person's decision, in the
 * file. So the loop is: this replies, marketing resolves.
 *
 * Setup, once. Figma → your avatar → Settings → Security → Personal access
 * tokens; generate one with `file_comments:write` and `file_read`. Put it in a
 * file called `.env` in the project root, which git already ignores:
 *
 *   FIGMA_TOKEN=figd_xxxxxxxx
 *   FIGMA_FILE=AbCdEf123456
 *
 * The file key is the part after /design/ in the URL:
 *   figma.com/design/AbCdEf123456/Younit  →  AbCdEf123456
 *
 * Use:
 *
 *   node tools/figma/comments.mjs pull              # → figma-comments.md
 *   node tools/figma/comments.mjs pull --all        # resolved ones too
 *   node tools/figma/comments.mjs done <id>         # reply "Done" on a thread
 *   node tools/figma/comments.mjs done <id> --note "moved to the deck"
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'

/**
 * A token typed into one terminal is gone from the next one. `.env` is already
 * ignored by git, so it can live there and be read from here rather than being
 * exported again every morning — and it never goes near a commit.
 */
function fromEnvFile() {
  const path = new URL('../../.env', import.meta.url)
  if (!existsSync(path)) return {}

  const out = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = /^\s*(?:export\s+)?([A-Z_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (match) out[match[1]] = match[2].replace(/^["']|["']$/g, '').trim()
  }
  return out
}

const dotenv = fromEnvFile()

const TOKEN = process.env.FIGMA_TOKEN || dotenv.FIGMA_TOKEN
const FILE = process.env.FIGMA_FILE || dotenv.FIGMA_FILE || process.argv[3]
const LIVE = process.env.YOUNIT_URL || 'https://younit-gray.vercel.app'

const argv = process.argv.slice(2)
const command = argv[0]
const flag = (name) => {
  const i = argv.indexOf(`--${name}`)
  return i === -1 ? null : argv[i + 1]
}

if (!TOKEN) {
  console.error(
    'No FIGMA_TOKEN.\n\n' +
      'Make one at Figma → your avatar → Settings → Security → Personal access\n' +
      'tokens, with `file_comments:write` and `file_read`. Then put it in a file\n' +
      'called .env in this folder — git already ignores it:\n\n' +
      '  FIGMA_TOKEN=figd_xxxxxxxx\n' +
      '  FIGMA_FILE=xxxxxxxxxxxxxxxxxxxxxx\n',
  )
  process.exit(1)
}

if (!FILE) {
  console.error(
    'No FIGMA_FILE.\n\n' +
      'It is the part after /design/ in the file URL:\n' +
      '  figma.com/design/AbCdEf123456/Younit  →  AbCdEf123456\n\n' +
      'Put it in .env beside the token, or pass it: comments.mjs pull <key>\n',
  )
  process.exit(1)
}

const api = async (path, options) => {
  const response = await fetch(`https://api.figma.com/v1${path}`, {
    ...options,
    headers: { 'X-Figma-Token': TOKEN, 'Content-Type': 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`${path} — HTTP ${response.status} ${await response.text()}`)
  }
  return response.json()
}

/* --- Which page is this comment about? --------------------------------------

   A comment is pinned either to a node or to a point on the canvas. The frames
   are named after the routes they were imported from, so either way the answer
   is a page of the site rather than a coordinate — which is the whole reason
   the list is worth reading.
   -------------------------------------------------------------------------- */

async function frames() {
  // Two levels is pages and the frames on them, with their boxes — enough to
  // name a pin, and far less than the whole document.
  const file = await api(`/files/${FILE}?depth=2`)
  const out = []

  for (const page of file.document.children || []) {
    for (const node of page.children || []) {
      out.push({
        id: node.id,
        name: node.name,
        page: page.name,
        box: node.absoluteBoundingBox,
      })
    }
  }
  return out
}

const holds = (frame, x, y) => {
  const box = frame.box
  return box && x >= box.x && y >= box.y && x <= box.x + box.width && y <= box.y + box.height
}

function whereIs(comment, list) {
  const meta = comment.client_meta || {}

  if (meta.node_id) {
    const exact = list.find((f) => f.id === meta.node_id)
    if (exact) return exact
    // Pinned to something inside a frame: the offset is relative to the node,
    // so fall through to the point below when there is one.
  }

  const x = meta.x ?? meta.node_offset?.x
  const y = meta.y ?? meta.node_offset?.y
  if (typeof x === 'number' && typeof y === 'number') {
    const found = list.find((f) => holds(f, x, y))
    if (found) return found
  }

  return null
}

/** `/learn/foundation · desktop · en` → the address to check it on. */
function liveUrl(frameName) {
  const route = String(frameName || '').split('·')[0].trim()
  return route.startsWith('/') ? LIVE + (route === '/' ? '' : route) : null
}

/* --- Pull -------------------------------------------------------------------- */

async function pull() {
  const all = argv.includes('--all')
  const [{ comments }, list] = await Promise.all([
    api(`/files/${FILE}/comments`),
    frames().catch(() => []),
  ])

  // Replies hang off their parent; a thread is one item of work, not two.
  const threads = comments.filter((c) => !c.parent_id)
  const repliesOf = (id) => comments.filter((c) => c.parent_id === id)

  const open = threads.filter((c) => all || !c.resolved_at)
  const rows = open
    .map((c) => {
      const frame = whereIs(c, list)
      const replies = repliesOf(c.id)
      return {
        id: c.id,
        author: c.user?.handle || 'unknown',
        at: (c.created_at || '').slice(0, 10),
        page: frame ? frame.name : '—',
        board: frame ? frame.page : '—',
        url: frame ? liveUrl(frame.name) : null,
        message: (c.message || '').replace(/\s+/g, ' ').trim(),
        replies: replies.length,
        answered: replies.some((r) => /^done\b/i.test((r.message || '').trim())),
        resolved: Boolean(c.resolved_at),
        link: `https://figma.com/design/${FILE}?node-id=${(c.client_meta?.node_id || '').replace(':', '-')}#${c.id}`,
      }
    })
    .sort((a, b) => (a.page + a.at).localeCompare(b.page + b.at))

  writeFileSync('figma-comments.json', JSON.stringify(rows, null, 2))

  const lines = [
    '# Comments from Figma',
    '',
    `${rows.length} open thread${rows.length === 1 ? '' : 's'}` +
      `${all ? ' (resolved included)' : ''}. Pulled from the file, newest last.`,
    '',
    'Tick nothing here — ticking happens in Figma. When one is finished run',
    '`node tools/figma/comments.mjs done <id>` and it replies on the thread.',
    '',
  ]

  let current = null
  for (const row of rows) {
    if (row.page !== current) {
      current = row.page
      lines.push('', `## ${row.page}`, '')
      if (row.url) lines.push(`Live: ${row.url}`, '')
    }
    lines.push(
      `- [${row.answered ? 'x' : ' '}] **${row.author}** · ${row.at} · \`${row.id}\``,
      `      ${row.message}`,
      row.replies ? `      ${row.replies} repl${row.replies === 1 ? 'y' : 'ies'}` : '',
    )
  }

  writeFileSync('figma-comments.md', lines.filter((l) => l !== '').join('\n') + '\n')

  console.log(
    `${rows.length} open of ${threads.length} threads → figma-comments.md, figma-comments.json`,
  )
  const unplaced = rows.filter((r) => r.page === '—').length
  if (unplaced) console.log(`${unplaced} could not be matched to a frame — see the file`)
}

/* --- Done -------------------------------------------------------------------- */

async function done() {
  const id = argv[1]
  if (!id) {
    console.error('Which comment? node tools/figma/comments.mjs done <id>')
    process.exit(1)
  }

  const note = flag('note')
  const url = flag('url')
  const message =
    'Done' +
    (note ? ` — ${note}` : '') +
    (url ? `\nLive: ${url}` : '') +
    '\n\nChecked on production. Resolve this when you are happy with it.'

  await api(`/files/${FILE}/comments`, {
    method: 'POST',
    body: JSON.stringify({ message, comment_id: id }),
  })

  console.log(`Replied on ${id}. Figma has no way to resolve a comment through`)
  console.log('the API, so marketing ticks it themselves — which is the point.')
}

const run = { pull, done }[command]
if (!run) {
  console.error('Usage: comments.mjs pull [--all] | done <id> [--note "..."] [--url "..."]')
  process.exit(1)
}

await run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
