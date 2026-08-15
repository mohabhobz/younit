import { useEffect } from 'react'
import SiteHeader from './SiteHeader.jsx'
import SiteFooter from './SiteFooter.jsx'
import { BrandDefs } from '../../brand/marks.jsx'
import { Frame } from '../ui/Pieces.jsx'

/**
 * Page shell for everything except the homepage, which composes its own so it
 * can match the template's markup exactly. Owns the header/footer variants,
 * the brand symbol defs, and the document title.
 */
export default function Page({
  children,
  header = 'dark',
  footer = 'blue',
  title,
  // A lesson deck draws its own full-bleed bands and its own sticky nav, so it
  // sits outside the 1440 frame and manages its own gutters.
  frame = true,
}) {
  useEffect(() => {
    document.title = title
      ? `${title} — Younit`
      : "Younit — Egypt's open initiative for capital markets"
  }, [title])

  return (
    <div style={{ background: 'var(--yn-grey)', minHeight: '100vh', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <BrandDefs />
      <SiteHeader tone={header} />
      {frame ? (
        <Frame as="main" style={{ flex: '1 0 auto', width: '100%' }}>
          {children}
        </Frame>
      ) : (
        <main style={{ flex: '1 0 auto', width: '100%' }}>{children}</main>
      )}
      <SiteFooter tone={footer} />
    </div>
  )
}
