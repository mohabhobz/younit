import { NavLink, Link } from 'react-router-dom'
import { Wordmark } from '../../brand/marks.jsx'

const NAV = [
  { to: '/learn', label: 'Learn' },
  { to: '/build', label: 'Build' },
  { to: '/compete', label: 'Compete' },
  { to: '/editorial', label: 'Editorial' },
]

/**
 * The blue band from the template. `tone="dark"` is the inner-page variant on
 * ink-2; the geometry is identical either way.
 */
export default function SiteHeader({ tone = 'blue' }) {
  return (
    <header
      style={{
        background: tone === 'dark' ? 'var(--yn-ink-2)' : 'var(--yn-blue)',
        padding: '14px var(--yn-gutter)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
        flexWrap: 'wrap',
      }}
    >
      <Link to="/" style={{ display: 'block' }} aria-label="Younit — home">
        <div
          style={{
            fontSize: 6,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#fff',
            marginBottom: 3,
          }}
        >
          Powered by ⊕ EFG Hermes
        </div>
        <Wordmark width={116} tone="light" />
      </Link>

      <nav aria-label="Primary" style={{ display: 'flex', gap: 'clamp(20px, 4vw, 56px)', alignItems: 'center' }}>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="yn-navlink"
            style={({ isActive }) => ({
              fontSize: 14,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#fff',
              opacity: isActive ? 1 : 0.62,
              textDecoration: isActive ? 'underline' : 'none',
              textUnderlineOffset: 4,
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* One locale ships, so there is nothing to switch between. The layout is
          already logical-property based, so adding عربي back is a content job,
          not a refactor. See README, "Arabic". */}
      <div style={{ fontSize: 13, letterSpacing: '0.06em', color: '#fff' }}>
        <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>EN</span>
      </div>
    </header>
  )
}
