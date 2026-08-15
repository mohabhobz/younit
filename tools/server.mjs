/**
 * The checkers need the built site on a port. Rather than assume someone
 * remembered to start one, they ask for it here.
 *
 * If something already answers on the address, it is used as-is — that is the
 * dev-server case, and whoever started it owns it. If nothing answers, the site
 * is built and a preview server is started for the length of the run, then
 * stopped. A checker should never report a failure that only means "no server".
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

/** Resolve as soon as the address responds at all — any status will do. */
async function answers(base) {
  try {
    await fetch(base, { signal: AbortSignal.timeout(1500) })
    return true
  } catch {
    return false
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: ROOT, stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)),
    )
  })
}

/**
 * Returns a function that stops whatever this started — safe to call even if
 * it started nothing.
 */
export async function ensureServer(base) {
  if (await answers(base)) return () => {}

  const port = new URL(base).port || '4173'
  const vite = join(ROOT, 'node_modules/.bin/vite')
  if (!existsSync(vite)) {
    throw new Error('vite is not installed — run `npm install` first')
  }

  console.log(`nothing on ${base} — building and starting a preview server`)
  await run(vite, ['build'])

  const server = spawn(vite, ['preview', '--port', port, '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
  })

  // A checker that throws half way through must not leave a server behind.
  const stop = () => {
    if (!server.killed) server.kill()
  }
  process.on('exit', stop)
  process.on('SIGINT', () => {
    stop()
    process.exit(130)
  })

  for (let attempt = 0; attempt < 40; attempt++) {
    if (await answers(base)) return stop
    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  stop()
  throw new Error(`the preview server never came up on ${base}`)
}

/**
 * Playwright ships without browsers on a fresh clone. Saying so plainly beats a
 * stack trace about a missing executable.
 */
export function browserHint(error) {
  if (/Executable doesn't exist|browserType.launch/.test(String(error))) {
    return 'no browser for Playwright — run `npx playwright install chromium` once, then try again'
  }
  return null
}
