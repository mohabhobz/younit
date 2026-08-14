import { Link } from 'react-router-dom'
import { Micro } from './Pieces.jsx'

/** `Learn › Foundation Series › Session 1 of 5`, as the original site sets it. */
export default function Breadcrumb({ trail }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
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
