import { useEffect, useRef } from 'react'
import { useI18n } from '../../lib/i18n.jsx'

/**
 * A block of authored content.
 *
 * The Markdown plugin turns `<Callout type="note">` into an aside whose label
 * carries the kind rather than a word — "NOTE" is English, and the same file is
 * read in two languages. The word is filled in here, where the reader's
 * language is known.
 */
export default function Prose({ html, style }) {
  const { t } = useI18n()
  const host = useRef(null)

  useEffect(() => {
    const node = host.current
    if (!node) return
    node.querySelectorAll('[data-callout-label]').forEach((label) => {
      const kind = label.dataset.calloutLabel
      const word = t(`common.callout.${kind}`)
      // An unknown kind names itself rather than printing a dictionary key.
      label.setAttribute('data-label', word.startsWith('common.') ? kind : word)
    })
  }, [html, t])

  return (
    <div
      ref={host}
      className="yn-prose"
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
