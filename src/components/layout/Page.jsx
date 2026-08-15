import { useEffect } from 'react'
import SiteHeader from './SiteHeader.jsx'
import SiteFooter from './SiteFooter.jsx'
import { BrandDefs } from '../../brand/marks.jsx'
import { Frame } from '../ui/Pieces.jsx'
import { useI18n } from '../../lib/i18n.jsx'

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
  // An article is a column of text, not a layout. The 1440 frame is right for
  // pages built of cards and grids; for one reading column plus its contents
  // it leaves half the page empty, so those pages take a narrower frame and
  // sit in the middle of the window with a margin either side.
  width,
}) {
  const { t } = useI18n()

  useEffect(() => {
    document.title = title ? `${title} — ${t('meta.titleSuffix')}` : t('meta.siteTitle')
  }, [title, t])

  return (
    <div
      style={{
        background: 'var(--yn-grey)',
        minHeight: '100vh',
        // `clip`, not `hidden`: both stop a sideways scroll, but `hidden` makes
        // this element the scroll container and nothing inside it can stick.
        overflowX: 'clip',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <BrandDefs />
      <SiteHeader tone={header} />
      {frame ? (
        <Frame
          as="main"
          style={{ flex: '1 0 auto', width: '100%', ...(width ? { maxWidth: width } : null) }}
        >
          {children}
        </Frame>
      ) : (
        <main style={{ flex: '1 0 auto', width: '100%' }}>{children}</main>
      )}
      <SiteFooter tone={footer} />
    </div>
  )
}
