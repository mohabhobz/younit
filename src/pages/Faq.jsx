import { useState } from 'react'
import Page from '../components/layout/Page.jsx'
import { PageHeading, Section } from '../components/ui/Pieces.jsx'
import { useI18n } from '../lib/i18n.jsx'

/**
 * The questions the client is asked, and their answers.
 *
 * The writing is the client's own FAQ document, carried over question by
 * question in both languages; nothing here is ours. The one thing the document
 * has that the site cannot yet honour is its second onboarding step — "click
 * here to generate your Younit API Key". There is no such page: the homepage's
 * own key button points at the three tracks for exactly that reason. So the
 * step is written as a step and marked as waiting rather than linked at a
 * guess.
 *
 * One answer is open at a time. A reader arrives with one question, and eleven
 * answers all showing is the wall of text the list is meant to spare them —
 * but every answer is in the markup either way, so a reader who cannot work
 * the buttons still meets the whole document and a search engine reads it.
 */
function Answer({ item, id, open }) {
  const { t } = useI18n()

  return (
    <div className="yn-faq__a" id={id} hidden={!open}>
      {item.a.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}

      {item.list ? (
        <ul>
          {item.list.map((entry) => (
            <li key={entry.label}>
              <strong>{entry.label}</strong>
              {': '}
              {entry.text}
            </li>
          ))}
        </ul>
      ) : null}

      {item.steps ? (
        <>
          <p className="yn-faq__steps-title">{item.stepsTitle}</p>
          <ol>
            {item.steps.map((step) => (
              <li key={step.text}>
                {step.text}
                {step.pending ? (
                  <span className="yn-faq__pending">{t('faq.linkPending')}</span>
                ) : null}
              </li>
            ))}
          </ol>
        </>
      ) : null}

      {item.link ? (
        <p style={{ marginTop: 14 }}>
          <a href={item.link.href} target="_blank" rel="noreferrer noopener">
            {item.link.label}
          </a>
        </p>
      ) : null}
    </div>
  )
}

export default function Faq() {
  const { t } = useI18n()
  const items = t('faq.items')
  const [open, setOpen] = useState(0)

  return (
    <Page title={t('faq.title')}>
      <Section>
        <PageHeading sub={t('faq.sub')} measure>
          {t('faq.title')}
        </PageHeading>

        <dl className="yn-faq">
          {items.map((item, i) => {
            const id = `yn-faq-${i}`
            const isOpen = open === i

            return (
              <div className="yn-faq__row" key={item.q}>
                <dt>
                  <button
                    type="button"
                    className="yn-faq__q"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="yn-display yn-faq__label">{item.q}</span>
                    <span className="yn-faq__sign" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </dt>
                <dd style={{ margin: 0 }}>
                  <Answer item={item} id={id} open={isOpen} />
                </dd>
              </div>
            )
          })}
        </dl>
      </Section>
    </Page>
  )
}
