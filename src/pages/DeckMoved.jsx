import { Navigate, useParams } from 'react-router-dom'
import { localise, useI18n } from '../lib/i18n.jsx'

/**
 * `.../deck` was where the lesson deck lived while the session also had a
 * written page. The session is one page now and the deck is on it, so this
 * address sends you there rather than going missing — the old link is in
 * bookmarks, in the decks' own "next part" links, and in whatever the client
 * has already shared.
 */
export default function DeckMoved() {
  const { collection, slug } = useParams()
  const { locale } = useI18n()

  return <Navigate replace to={localise(`/learn/${collection}/${slug}`, locale)} />
}
