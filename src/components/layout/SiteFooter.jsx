import { Lockup } from '../../brand/marks.jsx'
import { Link, useI18n } from '../../lib/i18n.jsx'

/**
 * Structure and destinations are the original site's footer, restyled to the
 * brand band. The template's own "Style guide →" button is not here:
 * it linked between two files inside Claude Design and was never part of the
 * product.
 */

/**
 * The three pages the top bar names, and then the FAQs — which is the page a
 * reader goes to the bottom of a site to find. It takes its name from the page
 * itself rather than from a footer string of its own, so the two cannot drift
 * apart.
 */
const PLATFORM = [
  { to: '/learn', key: 'nav.learn' },
  { to: '/build', key: 'nav.build' },
  { to: '/compete', key: 'nav.compete' },
  { to: '/faq', key: 'faq.title' },
]

/**
 * The second column is EFG Hermes ONE — the app an account is opened in, which
 * is where marketing asked this link to go — and LetsYounit!, which took
 * GitHub's place at their asking and now, at their asking again, takes
 * GitHub's address with it: the name changed, the destination did not.
 */
const EFG = [
  { href: 'https://www.efghermesone.com', key: 'footer.efgHermes' },
  { href: 'https://github.com/efg-hermes', key: 'footer.github' },
]

function Column({ heading, items }) {
  const { t } = useI18n()

  // The headings are off the footer. The name still labels the list for a
  // screen reader, which reads "Platform, navigation" and does not need it
  // printed to know one list from the other.
  return (
    <nav aria-label={heading}>
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
          ) : item.to ? (
            <Link key={item.key} className="yn-navlink" to={item.to}>
              {t(item.key)}
            </Link>
          ) : (
            <span key={item.key}>{t(item.key)}</span>
          ),
        )}
      </div>
    </nav>
  )
}

export default function SiteFooter({ tone = 'brand' }) {
  const { t } = useI18n()
  const dark = tone === 'dark'

  return (
    <footer
      style={{
        background: dark ? 'var(--yn-ink-2)' : 'var(--yn-chrome)',
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
          {/* Marketing asked for the endorsed logo here too — the footer was
              carrying the bare wordmark. */}
          {/* "LetsYounit!" stood under the logo as well as in the column on
              the right, so the footer said it twice. This one goes; the one in
              the column is the name they asked for there. */}
          <Lockup width={300} tone={dark ? "light" : "dark"} style={{ marginBottom: 18 }} />
          <p
            style={{
              fontSize: 'var(--yn-small)',
              lineHeight: 1.6,
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
        {/* "One idea · One rule · One automated strategy" stood here. Marketing
            asked for it to go, and with it the three strings it was made of. */}
        <span>{t('footer.legal')}</span>
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
      </div>
    </footer>
  )
}
