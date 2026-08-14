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
export default function Page({ children, header = 'dark', footer = 'blue', title }) {
  useEffect(() => {
    document.title = title
      ? `${title} — Younit`
      : "Younit — Egypt's open initiative for capital markets"
  }, [title])

  return (
    <div style={{ background: 'var(--yn-grey)', minHeight: '100vh', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <BrandDefs />
      <SiteHeader tone={header} />
      <Frame as="main" style={{ flex: '1 0 auto', width: '100%' }}>
        {children}
      </Frame>
      <SiteFooter tone={footer} />
    </div>
  )
}
