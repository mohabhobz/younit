import { useEffect, useId, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Wordmark } from '../../brand/marks.jsx'
import { Link, NavLink, useI18n, LOCALES, DEFAULT_LOCALE, swapLocale } from '../../lib/i18n.jsx'

const NAV = [
  { to: '/learn', key: 'nav.learn' },
  { to: '/build', key: 'nav.build' },
  { to: '/compete', key: 'nav.compete' },
  { to: '/editorial', key: 'nav.editorial' },
]

const LINK_STYLE = {
  fontSize: 14,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--yn-white)',
}

/**
 * Two lines that become a cross. Both states are the same two lines moved, so
 * the icon animates between them instead of swapping glyph.
 */
function MenuIcon({ open }) {
  const bar = {
    position: 'absolute',
    insetInlineStart: 0,
    width: 22,
    height: 2,
    background: 'currentColor',
    transition: 'transform 220ms var(--yn-ease), top 220ms var(--yn-ease)',
  }
  return (
    <span
      aria-hidden="true"
      style={{ position: 'relative', display: 'block', width: 22, height: 14 }}
    >
      <span
        style={{
          ...bar,
          top: open ? 6 : 0,
          transform: open ? 'rotate(45deg)' : 'none',
        }}
      />
      <span
        style={{
          ...bar,
          top: open ? 6 : 12,
          transform: open ? 'rotate(-45deg)' : 'none',
        }}
      />
    </span>
  )
}

/**
 * Both languages, side by side, as the design source draws them: the one you
 * are reading is marked, the other is a link. A switch that shows only the
 * other language makes the reader guess which one they are in.
 */
function LocaleSwitch({ style, className, brandChrome }) {
  const { locale } = useI18n()
  const { pathname, search, hash } = useLocation()

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...style }}>
      {Object.entries(LOCALES).map(([code, meta], i) => {
        const current = code === locale
        return (
          <span key={code} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {i > 0 ? <span aria-hidden="true" style={{ opacity: 0.4 }}>|</span> : null}
            {current ? (
              <span
                data-brand-chrome={brandChrome}
                aria-current="true"
                lang={meta.htmlLang}
                style={{
                  ...LINK_STYLE,
                  ...style,
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                }}
              >
                {meta.short}
              </span>
            ) : (
              <RouterLink
                // The router's own Link, not the localised one: this is the
                // single link that must not be put back into the language it
                // is leaving.
                to={swapLocale(pathname, locale, code) + search + hash}
                className="yn-navlink"
                data-brand-chrome={brandChrome}
                lang={meta.htmlLang}
                style={{
                  ...LINK_STYLE,
                  ...style,
                  opacity: 0.62,
                  // "EN" is two letters wide; a tap target is not.
                  minWidth: 32,
                  justifyContent: 'center',
                }}
              >
                {meta.short}
              </RouterLink>
            )}
          </span>
        )
      })}
    </span>
  )
}

/**
 * The homepage band is blue, and the design source sets its chrome in white on
 * it — 1.8:1, below the readable bar. That is the client's decision to change,
 * not a developer's, so the elements it applies to say so in the markup and the
 * contrast check reads the attribute rather than matching English words.
 * See the README's "Outstanding".
 */
export default function SiteHeader({ tone = 'blue' }) {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const panelId = useId()

  // A menu that survives navigation would cover the page it just opened.
  useEffect(() => setOpen(false), [pathname])

  // Widening past the breakpoint hides the panel and the button that closes
  // it. Left open, the page behind would stay locked with nothing to unlock
  // it — so the breakpoint closes it.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 861px)')
    const close = () => wide.matches && setOpen(false)
    close()
    wide.addEventListener('change', close)
    return () => wide.removeEventListener('change', close)
  }, [])

  // While the panel is over the page, the page behind it does not scroll, and
  // Escape closes it — the two things anyone expects of an overlay.
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const dark = tone === 'dark'
  const brandChrome = dark ? undefined : ''

  return (
    <header
      className="yn-header"
      style={{
        background: dark ? 'var(--yn-ink-2)' : 'var(--yn-blue)',
        padding: '14px var(--yn-gutter)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <Link to="/" style={{ display: 'block' }} aria-label={`Younit — ${t('common.home')}`}>
        <div
          data-brand-chrome=""
          style={{
            fontSize: 6,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--yn-white)',
            marginBottom: 3,
          }}
        >
          {t('footer.poweredBy')}
        </div>
        <Wordmark width={116} tone="light" />
      </Link>

      {/* Desktop: the sections in a row, the language last. */}
      {/* The sections sit in the middle of the band and the languages at the
          end, which is how the design source lays the header out. */}
      <nav
        className="yn-nav-desktop"
        aria-label={t('nav.primary')}
        style={{
          display: 'flex',
          gap: 'clamp(20px, 3.5vw, 56px)',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="yn-navlink"
            data-brand-chrome={brandChrome}
            style={({ isActive }) => ({
              ...LINK_STYLE,
              opacity: isActive ? 1 : 0.62,
              textDecoration: isActive ? 'underline' : 'none',
              textUnderlineOffset: 4,
            })}
          >
            {t(item.key)}
          </NavLink>
        ))}
      </nav>

      <LocaleSwitch className="yn-locale-desktop" brandChrome={brandChrome} />

      {/* Phone: one control, and the panel it opens. */}
      <button
        type="button"
        className="yn-menu-button"
        data-brand-chrome={brandChrome}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
        onClick={() => setOpen((was) => !was)}
        style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          padding: 0,
          background: 'none',
          border: 0,
          color: 'var(--yn-white)',
          cursor: 'pointer',
        }}
      >
        <MenuIcon open={open} />
      </button>

      <nav
        id={panelId}
        className="yn-nav-mobile"
        data-open={open ? '' : undefined}
        aria-label={t('nav.primary')}
        // Hidden from assistive technology and from the tab order while closed,
        // so a closed menu cannot be tabbed into behind the page. React 19
        // takes this as a boolean; an empty string is dropped.
        inert={!open}
        style={{ background: dark ? 'var(--yn-ink-2)' : 'var(--yn-blue)' }}
      >
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="yn-navlink"
            data-brand-chrome={brandChrome}
            style={({ isActive }) => ({
              ...LINK_STYLE,
              fontSize: 18,
              opacity: isActive ? 1 : 0.72,
              textDecoration: isActive ? 'underline' : 'none',
              textUnderlineOffset: 5,
            })}
          >
            {t(item.key)}
          </NavLink>
        ))}

        <hr className="yn-nav-mobile__rule" />
        <LocaleSwitch style={{ fontSize: 18 }} brandChrome={brandChrome} />
      </nav>
    </header>
  )
}
