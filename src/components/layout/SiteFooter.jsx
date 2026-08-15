import { Link } from 'react-router-dom'
import { Wordmark, Bullet } from '../../brand/marks.jsx'

/**
 * Structure and destinations are the original site's footer, restyled to the
 * template's blue band. The template's own "Style guide →" button is not here:
 * it linked between two files inside Claude Design and was never part of the
 * product.
 */

const PLATFORM = [
  { to: '/learn', label: 'Learn' },
  { to: '/build', label: 'Build' },
  { to: '/compete', label: 'Compete' },
  { to: '/editorial', label: 'Editorial' },
]

const EFG = [
  { to: '/about', label: 'About' },
  { to: '/partners', label: 'Partners' },
  { href: 'https://www.efghldg.com', label: 'EFG Holding' },
  { href: 'https://github.com/efg-hermes', label: 'GitHub' },
]

function Column({ heading, items }) {
  return (
    <nav aria-label={heading}>
      <div
        style={{
          fontSize: 'var(--yn-micro)',
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}
      >
        {heading}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 14 }}>
        {items.map((item) =>
          item.href ? (
            <a
              key={item.label}
              className="yn-navlink"
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {item.label}
            </a>
          ) : (
            <Link key={item.label} className="yn-navlink" to={item.to}>
              {item.label}
            </Link>
          ),
        )}
      </div>
    </nav>
  )
}

export default function SiteFooter({ tone = 'blue' }) {
  const dark = tone === 'dark'

  return (
    <footer
      style={{
        background: dark ? 'var(--yn-ink-2)' : 'var(--yn-blue)',
        color: dark ? 'var(--yn-white)' : 'var(--yn-ink)',
        padding: '56px var(--yn-gutter) 48px',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--yn-frame)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
          gap: 48,
        }}
      >
        <div style={{ gridColumn: 'span 1' }}>
          <Wordmark width={130} tone="light" style={{ marginBottom: 18 }} />
          <div
            style={{
              fontFamily: 'var(--yn-display)',
              fontWeight: 400,
              fontSize: 22,
              marginBottom: 8,
            }}
          >
            EFG Innovation Hub
          </div>
          <p
            style={{
              fontSize: 'var(--yn-small)',
              color: dark ? 'var(--yn-white)' : 'var(--yn-ink-2)',
              opacity: 0.75,
              maxWidth: '38ch',
              margin: 0,
            }}
          >
            Egypt&apos;s open initiative for capital markets education and infrastructure.
          </p>
        </div>

        <Column heading="Platform" items={PLATFORM} />
        <Column heading="EFG" items={EFG} />
      </div>

      <hr
        style={{
          border: 0,
          borderTop: `1px solid ${dark ? 'var(--yn-white)' : 'var(--yn-ink)'}`,
          opacity: 0.25,
          margin: '40px 0 18px',
        }}
      />

      <div
        style={{
          maxWidth: 'var(--yn-frame)',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px 24px',
          fontSize: 'var(--yn-micro)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: dark ? 'var(--yn-white)' : 'var(--yn-ink-2)',
        }}
      >
        <span>
          One idea <Bullet /> One rule <Bullet /> One automated strategy
        </span>
        <span>
          The Hub is an educational initiative. Nothing here is investment advice.
        </span>
        <span>© {new Date().getFullYear()} EFG Holding. All rights reserved.</span>
      </div>
    </footer>
  )
}
