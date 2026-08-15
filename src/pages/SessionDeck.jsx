import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Frame } from '../components/ui/Pieces.jsx'
import { findDoc, neighbours, sessionHtmlFor } from '../lib/content.js'
import { mountDeck } from '../lib/deck.js'

const TRACK = {
  foundation: { label: 'Foundation Series', path: '/learn/foundation' },
  'algo-track': { label: 'Algo Track', path: '/learn/algo-track' },
}

/**
 * The full lesson deck, rendered as a page of the site rather than framed in
 * an iframe: same header, same footer, same navigation as everywhere else. The
 * deck's own styles are scoped to `.yn-deck` so the two never collide — see
 * `tools/scope-decks.mjs`.
 */
export default function SessionDeck() {
  const { collection, slug } = useParams()
  const navigate = useNavigate()
  const host = useRef(null)
  const [state, setState] = useState('loading')

  const doc = findDoc(collection, slug)
  const src = sessionHtmlFor(collection, slug)
  const track = TRACK[collection]
  const { index, total } = neighbours(collection, slug)

  useEffect(() => {
    if (!src || !host.current) return undefined

    const controller = new AbortController()
    let teardown = null
    let cancelled = false

    setState('loading')
    mountDeck(src, host.current, controller.signal)
      .then((stop) => {
        if (cancelled) return stop()
        teardown = stop
        setState('ready')
        return undefined
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState('error')
      })

    return () => {
      cancelled = true
      controller.abort()
      if (teardown) teardown()
    }
  }, [src])

  // The decks carry plain anchors — the "next part" links, and whatever a
  // lesson links to inline. Internal ones are handed to the router so the page
  // does not reload; external ones are left alone.
  useEffect(() => {
    const node = host.current
    if (!node) return undefined

    const onClick = (event) => {
      const link = event.target.closest?.('a[href]')
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey) return
      const href = link.getAttribute('href')
      if (!href?.startsWith('/') || link.target) return
      event.preventDefault()
      navigate(href)
    }

    node.addEventListener('click', onClick)
    return () => node.removeEventListener('click', onClick)
  }, [navigate])

  if (!doc || !src) return <NotFound />

  return (
    <Page title={doc.title} frame={false}>
      <Frame style={{ paddingBlock: '28px 0' }}>
        <Breadcrumb
          trail={[
            { label: 'Learn', to: '/learn' },
            ...(track ? [{ label: track.label, to: track.path }] : []),
            { label: doc.title, to: `/learn/${collection}/${slug}` },
            ...(index >= 0 && total ? [{ label: `Session ${index + 1} of ${total}` }] : []),
          ]}
        />

        {/* The way out, under the breadcrumb and on the frame. Some decks
            pinned their own copy of this to a corner, for want of anywhere
            better to put it in a full-screen frame; that one is hidden. */}
        <Button tone="blue" size="sm" to={track?.path ?? '/learn'}>
          ← {track?.label ?? 'Learn'}
        </Button>
      </Frame>

      {state === 'error' ? (
        <Frame className="yn-prose" style={{ paddingBlock: 64 }}>
          <p style={{ margin: 0 }}>
            This session's deck could not be loaded. The written session is on the{' '}
            <Link to={`/learn/${collection}/${slug}`}>lesson page</Link>.
          </p>
        </Frame>
      ) : null}

      <div
        ref={host}
        // Reserve the fold while the deck arrives, so the footer does not flash
        // up under the breadcrumb and then jump.
        style={{ minHeight: state === 'ready' ? 0 : '60vh' }}
      />
    </Page>
  )
}
