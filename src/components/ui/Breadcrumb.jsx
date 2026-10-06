import { Micro } from './Pieces.jsx'
import { useI18n } from '../../lib/i18n.jsx'
import { Link } from '../../lib/i18n.jsx'

/**
 * `Learn › Stock Market 101 › Stock Market Basics › Session 1 of 5`, as the
 * original site sets it.
 *
 * The last two steps have never been links — they are the page you are already
 * on — but nothing said so: every step was set in the same small grey
 * uppercase, so the reviewer clicked the title, nothing happened, and he wrote
 * it up as a broken link. The steps that go somewhere are underlined now and
 * the one you are on is marked as such, so the trail says which is which
 * before you click it.
 */
export default function Breadcrumb({ trail }) {
  const { t } = useI18n()
  const last = trail.length - 1

  return (
    <nav aria-label={t('common.breadcrumb')} style={{ marginBottom: 24 }}>
      <Micro>
        {trail.map((step, i) => (
          <span key={`${step.label}-${i}`}>
            {i > 0 ? ' › ' : ''}
            {step.to ? (
              <Link className="yn-crumb__link" to={step.to}>
                {step.label}
              </Link>
            ) : (
              <span className="yn-crumb__here" aria-current={i === last ? 'page' : undefined}>
                {step.label}
              </span>
            )}
          </span>
        ))}
      </Micro>
    </nav>
  )
}
