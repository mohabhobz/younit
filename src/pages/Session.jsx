import { useParams } from 'react-router-dom'
import Article from './Article.jsx'
import SessionDeck from './SessionDeck.jsx'
import { sessionHtmlFor } from '../lib/content.js'
import { useI18n } from '../lib/i18n.jsx'

/**
 * A session is one page.
 *
 * It used to be two: the written lesson at `/learn/foundation/01-market-basics`
 * and the deck a click further on at `.../deck`. They said the same thing —
 * the deck is the lesson, drawn — so the reader met the whole session twice
 * and the second telling was the better one.
 *
 * Now the session's own address gives you the deck wherever there is one. The
 * written page is still what a lesson without a deck renders as, and it is
 * still where the titles, the descriptions and the reading times on the track
 * page come from.
 */
export default function Session() {
  const { collection, slug } = useParams()
  const { locale } = useI18n()

  return sessionHtmlFor(collection, slug, locale) ? <SessionDeck /> : <Article />
}
