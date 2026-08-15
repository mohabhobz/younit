/**
 * Loading a lesson deck into the page.
 *
 * A deck is a fragment of scoped HTML sitting in `public/sessions/` (see
 * `tools/scope-decks.mjs`). Dropping it in with `innerHTML` gets the markup and
 * the styles, but not the behaviour: a `<script>` set that way never runs, and
 * a `<link>` has to be hoisted to the head to be honoured reliably. So the
 * fragment is parsed, its assets are loaded once and cached, and its own
 * scripts are re-created in order.
 *
 * The decks were written as standalone pages, so their scripts set intervals
 * and listen on `window` without ever expecting to be torn down. Leaving those
 * running after the reader navigates away would throw on every scroll, against
 * elements that no longer exist — so anything registered while a deck's script
 * runs is recorded and undone when the deck unmounts.
 */

const assetPromises = new Map()

/** Load a stylesheet or a script once per document, and remember it. */
function loadAsset(tag) {
  const isScript = tag.tagName === 'SCRIPT'
  const url = isScript ? tag.src : tag.href
  if (!url) return Promise.resolve()
  if (assetPromises.has(url)) return assetPromises.get(url)

  const promise = new Promise((resolve) => {
    const el = document.createElement(isScript ? 'script' : 'link')
    if (isScript) {
      el.src = url
      el.async = false
    } else {
      el.rel = 'stylesheet'
      el.href = url
    }
    // A deck that fails to fetch its chart library should still render its
    // text, so a failure resolves rather than rejects.
    el.addEventListener('load', resolve, { once: true })
    el.addEventListener('error', resolve, { once: true })
    document.head.appendChild(el)
  })

  assetPromises.set(url, promise)
  return promise
}

/**
 * Run the deck's own inline scripts, recording what they leave behind.
 * Returns a function that undoes it.
 */
function runInlineScripts(scripts) {
  const intervals = []
  const timeouts = []
  const listeners = []

  const realSetInterval = window.setInterval
  const realSetTimeout = window.setTimeout
  const realAddEventListener = window.addEventListener

  window.setInterval = (...args) => {
    const id = realSetInterval.apply(window, args)
    intervals.push(id)
    return id
  }
  window.setTimeout = (...args) => {
    const id = realSetTimeout.apply(window, args)
    timeouts.push(id)
    return id
  }
  window.addEventListener = (...args) => {
    listeners.push(args)
    return realAddEventListener.apply(window, args)
  }

  try {
    for (const original of scripts) {
      const script = document.createElement('script')
      script.textContent = original.textContent
      // Appending runs it synchronously, in document scope — which is what the
      // decks' inline `onclick` handlers need to find their functions.
      document.body.appendChild(script)
      script.remove()
    }
  } finally {
    window.setInterval = realSetInterval
    window.setTimeout = realSetTimeout
    window.addEventListener = realAddEventListener
  }

  return () => {
    intervals.forEach((id) => clearInterval(id))
    timeouts.forEach((id) => clearTimeout(id))
    listeners.forEach((args) => window.removeEventListener(...args))
  }
}

/**
 * Render `url` into `container`. Resolves to a teardown function.
 * `signal` lets a navigation that happens mid-fetch cancel the render.
 */
export async function mountDeck(url, container, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`deck ${url}: ${response.status}`)
  const html = await response.text()

  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const root = parsed.querySelector('.yn-deck')
  if (!root) throw new Error(`deck ${url}: no .yn-deck root`)

  const assets = [...parsed.querySelectorAll('link[href], script[src]')]
  await Promise.all(assets.map(loadAsset))
  if (signal?.aborted) return () => {}

  // The deck's own <style> travels with the markup: a style element inserted
  // this way is honoured, and keeping it with the deck means it leaves when the
  // deck leaves.
  const style = parsed.querySelector('style')
  container.innerHTML = ''
  if (style) container.appendChild(style.cloneNode(true))
  container.appendChild(root)

  const scripts = [...container.querySelectorAll('script')]
  scripts.forEach((s) => s.remove())
  const stop = runInlineScripts(scripts)

  return () => {
    stop()
    container.innerHTML = ''
  }
}
