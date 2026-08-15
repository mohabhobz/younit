import { Tag } from './Pieces.jsx'
import { FILLS } from '../../styles/tokens.js'
import { Link } from '../../lib/i18n.jsx'

/**
 * The snapshot card — a coloured fill, ink outline, 20px radius, 22px padding.
 * Contents stack with a 16px gap and the CTA is pushed to the bottom.
 */
export function SnapshotCard({ tone, children, style }) {
  return (
    <div
      style={{
        background: FILLS[tone] ?? FILLS.white,
        border: '1px solid var(--yn-ink)',
        borderRadius: 'var(--yn-r-card)',
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** The panel that holds the code block and the transcript. */
export function Panel({ tone, children, seq, style }) {
  return (
    <div
      data-seq={seq ? '' : undefined}
      style={{
        background: FILLS[tone] ?? FILLS.white,
        border: '1px solid var(--yn-ink)',
        borderRadius: 'var(--yn-r-card)',
        padding: '26px 24px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/**
 * The editorial card — white, 12px radius, purple outline, with a tag that
 * overlaps the top edge. Lifts and darkens its outline on hover.
 */
export function EditorialCard({ to, tag, tagTone = 'purple', title, meta }) {
  const body = (
    <>
      <div
        className="yn-display"
        style={{ fontSize: 'var(--yn-card-title)', lineHeight: 1.15, marginBottom: 12 }}
      >
        {title}
      </div>
      {meta ? <div style={{ fontSize: 12, color: 'var(--yn-grey-dark)' }}>{meta}</div> : null}
    </>
  )

  const style = {
    display: 'block',
    height: '100%',
    background: 'var(--yn-white)',
    border: '1px solid var(--yn-purple)',
    borderRadius: 'var(--yn-r-editorial)',
    padding: '32px 26px 22px',
  }

  return (
    <div style={{ position: 'relative', paddingTop: 16 }}>
      {tag ? (
        <span style={{ position: 'absolute', top: 0, insetInlineStart: 20, zIndex: 1 }}>
          <Tag tone={tagTone} size="sm">
            {tag}
          </Tag>
        </span>
      ) : null}

      <Link className="yn-card-hover" to={to} style={style}>
        {body}
      </Link>
    </div>
  )
}

/**
 * The project-track card — a meta row, a hairline, the title, and one mono line
 * showing the SHAPE of the output. Never a concrete value: nothing has run yet.
 */
export function TrackCard({ to, metaStart, metaEnd, title, shape }) {
  return (
    <Link
      className="yn-card-hover"
      to={to}
      style={{
        display: 'block',
        height: '100%',
        background: 'var(--yn-white)',
        border: '1px solid var(--yn-purple)',
        borderRadius: 'var(--yn-r-editorial)',
        padding: '22px 24px 26px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          fontSize: 9,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--yn-grey-dark)',
          lineHeight: 1.5,
        }}
      >
        <span>{metaStart}</span>
        <span style={{ textAlign: 'end' }}>{metaEnd}</span>
      </div>

      <hr style={{ border: 0, borderTop: '1px solid var(--yn-purple)', margin: '14px 0 18px' }} />

      <div
        className="yn-display"
        style={{ fontSize: 'var(--yn-track-title)', lineHeight: 1.15, marginBottom: 14 }}
      >
        {title}
      </div>

      <div style={{ fontFamily: 'var(--yn-mono)', fontSize: 'var(--yn-micro)', color: 'var(--yn-grey-dark)' }}>
        {shape}
      </div>
    </Link>
  )
}

/** A plain outlined container. */
export function Card({ tone = 'white', outline = 'purple', radius = 'tile', children, style }) {
  return (
    <div
      style={{
        background: FILLS[tone] ?? FILLS.white,
        border: `1px solid ${outline === 'ink' ? 'var(--yn-ink)' : FILLS[outline]}`,
        borderRadius: `var(--yn-r-${radius})`,
        padding: 32,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Three-up grid at desktop, collapsing on the way down. */
export function Grid({ cols = 3, gap = 36, children, style, ...rest }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${Math.round(1100 / cols)}px, 100%), 1fr))`,
        gap,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
