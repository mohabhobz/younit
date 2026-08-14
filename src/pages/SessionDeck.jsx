import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import NotFound from './NotFound.jsx'
import { findDoc, sessionHtmlFor } from '../lib/content.js'

const TRACK_LABEL = { foundation: 'Foundation Series', 'algo-track': 'Algo Track' }

/**
 * The full lesson deck, shown the way the original site showed it: the standalone
 * HTML file filling the viewport, with one back control over it. The decks carry
 * their own dark styling and their own scripts, so they are framed rather than
 * restyled — and the frame's own back button is hidden so only ours shows.
 */
export default function SessionDeck() {
  const { collection, slug } = useParams()
  const doc = findDoc(collection, slug)
  const src = sessionHtmlFor(collection, slug)

  useEffect(() => {
    if (!src || !doc) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.title = doc?.title ? `${doc.title} — Younit` : 'Session — Younit'
    return () => {
      document.body.style.overflow = previous
    }
  }, [src, doc])

  if (!doc || !src) return <NotFound />

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--yn-ink-2)' }}>
      <Link
        to={`/learn/${collection}/${slug}`}
        style={{
          position: 'absolute',
          insetBlockStart: 24,
          insetInlineStart: 24,
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 22px',
          background: 'var(--yn-blue)',
          border: '1px solid #000',
          borderRadius: 'var(--yn-r-pill)',
          color: 'var(--yn-ink)',
          fontSize: 11,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
        }}
      >
        ← {TRACK_LABEL[collection] ?? 'Back'}
      </Link>

      <iframe
        src={src}
        title={doc.title}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  )
}
