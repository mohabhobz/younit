import { Micro } from './Pieces.jsx'
import { useI18n } from '../../lib/i18n.jsx'
import { Link } from '../../lib/i18n.jsx'

/** `Learn › Foundation Series › Session 1 of 5`, as the original site sets it. */
export default function Breadcrumb({ trail }) {
  const { t } = useI18n()

  return (
    <nav aria-label={t('common.breadcrumb')} style={{ marginBottom: 24 }}>
      <Micro>
        {trail.map((step, i) => (
          <span key={`${step.label}-${i}`}>
            {i > 0 ? ' › ' : ''}
            {step.to ? <Link to={step.to}>{step.label}</Link> : <span>{step.label}</span>}
          </span>
        ))}
      </Micro>
    </nav>
  )
}
