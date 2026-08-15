import { useEffect, useMemo, useState } from 'react'
import { Micro } from './Pieces.jsx'
import { useI18n } from '../../lib/i18n.jsx'

/**
 * The contents of a lesson, in the column beside it.
 *
 * A session runs to fifty minutes and half a dozen sections, and on a wide
 * screen the reading column leaves the other half of the frame empty. This puts
 * the sections there: where you are, what is ahead, and one click to any of it.
 *
 * The headings come from the document's own HTML — the Markdown plugin gives
 * every `<h2>` an id — so nothing has to be authored twice.
 */
export default function Contents({ html }) {
  const { t } = useI18n()
  const [active, setActive] = useState(null)

  const sections = useMemo(() => {
    const found = []
    const pattern = /<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g
    let match
    while ((match = pattern.exec(html))) {
      found.push({ id: match[1], label: match[2].replace(/<[^>]+>/g, '').trim() })
    }
    return found
  }, [html])

  // The section you are reading is the last one whose heading has passed the
  // top of the window — the same rule a reader would apply looking up.
  useEffect(() => {
    if (!sections.length) return undefined

    const headings = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)

    const read = () => {
      const passed = headings.filter((h) => h.getBoundingClientRect().top < 120)
      setActive((passed.at(-1) ?? headings[0])?.id ?? null)
    }

    read()
    window.addEventListener('scroll', read, { passive: true })
    return () => window.removeEventListener('scroll', read)
  }, [sections])

  if (sections.length < 2) return null

  return (
    <nav aria-label={t('learn.contents')} className="yn-contents">
      <Micro style={{ display: 'block', marginBottom: 14 }}>{t('learn.contents')}</Micro>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 2 }}>
        {sections.map((section, i) => {
          const current = section.id === active
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={current ? 'true' : undefined}
                className="yn-contents__link"
                data-current={current ? '' : undefined}
              >
                <span className="yn-contents__number">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {section.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
