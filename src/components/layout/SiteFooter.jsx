import { Wordmark, Bullet } from '../../brand/marks.jsx'
import { Link, useI18n } from '../../lib/i18n.jsx'

/**
 * Structure and destinations are the original site's footer, restyled to the
 * template's blue band. The template's own "Style guide →" button is not here:
 * it linked between two files inside Claude Design and was never part of the
 * product.
 */

const PLATFORM = [
  { to: '/learn', key: 'nav.learn' },
  { to: '/build', key: 'nav.build' },
  { to: '/compete', key: 'nav.compete' },
  { to: '/editorial', key: 'nav.editorial' },
]

const EFG = [
  { to: '/about', key: 'nav.about' },
  { to: '/partners', key: 'nav.partners' },
  { href: 'https://www.efghldg.com', key: 'footer.efgHolding' },
  { href: 'https://github.com/efg-hermes', key: 'footer.github' },
]

function Column({ heading, items }) {
  const { t } = useI18n()

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
              key={item.key}
              className="yn-navlink"
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t(item.key)}
            </a>
          ) : (
            <Link key={item.key} className="yn-navlink" to={item.to}>
              {t(item.key)}
            </Link>
          ),
        )}
      </div>
    </nav>
  )
}

export default function SiteFooter({ tone = 'blue' }) {
  const { t } = useI18n()
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
            {t('footer.hub')}
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
            {t('footer.mission')}
          </p>
        </div>

        <Column heading={t('footer.platform')} items={PLATFORM} />
        <Column heading={t('footer.efg')} items={EFG} />
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
          {t('footer.taglineIdea')} <Bullet /> {t('footer.taglineRule')} <Bullet />{' '}
          {t('footer.taglineStrategy')}
        </span>
        <span>{t('footer.legal')}</span>
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
      </div>
    </footer>
  )
}
