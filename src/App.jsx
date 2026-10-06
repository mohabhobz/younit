import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { I18nProvider, LOCALES, DEFAULT_LOCALE } from './lib/i18n.jsx'

import Home from './pages/Home.jsx'
import Learn from './pages/Learn.jsx'
import TrackIndex from './pages/TrackIndex.jsx'
import Article from './pages/Article.jsx'
import Session from './pages/Session.jsx'
import DeckMoved from './pages/DeckMoved.jsx'
import Glossary from './pages/Glossary.jsx'
import GlossaryTerm from './pages/GlossaryTerm.jsx'
import Build from './pages/Build.jsx'
import Compete from './pages/Compete.jsx'
import NotFound from './pages/NotFound.jsx'

/** Every navigation starts at the top of the new page, as a document should. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

/**
 * Everything under a locale renders inside that locale's provider, keyed by it.
 *
 * The key matters: switching language keeps the same route element, so React
 * would reuse the same DOM nodes and only swap their text. The motion hook
 * reads that text out once and types it back in, and its cleanup writes the old
 * sentence back over the new one — so the page ended up in Arabic with the
 * English hero typing itself in. A fresh key mounts a fresh subtree, and the
 * old one is torn down where nothing can see it.
 */
function Locale({ locale }) {
  return (
    <I18nProvider key={locale} locale={locale}>
      <Outlet />
    </I18nProvider>
  )
}

/**
 * The pages of one language. The same tree is mounted once per locale — at the
 * root for English and under `/ar` for Arabic — so a path is the path, and the
 * only difference between the two is the prefix.
 */
function pages() {
  return (
    <>
      <Route index element={<Home />} />

      <Route path="learn" element={<Learn />} />
      <Route path="learn/glossary" element={<Glossary />} />
      <Route path="learn/glossary/:term" element={<GlossaryTerm />} />
      <Route path="learn/:collection" element={<TrackIndex />} />
      <Route path="learn/:collection/:slug" element={<Session />} />
      <Route path="learn/:collection/:slug/deck" element={<DeckMoved />} />

      {/* Repositories is the only Build page for now. Templates, Showcase,
          Capstones and Apps were asked for by marketing to go, and with them
          the project pages that lived under Showcase, Capstones and Apps —
          nothing else on the site linked to any of them. Their writing is
          still in the repository. */}
      <Route path="build" element={<Build />} />

      {/* Compete is one page now: Leaderboard, Seasons, Hackathons and Wall of
          Fame were asked for by marketing to go, and so were Editorial,
          Partners and About — About's two new sections are on the homepage
          instead. Nothing on the site opens any of them any more — the footer
          lost its two links with them. Their writing is still here. */}
      <Route path="compete" element={<Compete />} />


      <Route path="*" element={<NotFound />} />
    </>
  )
}

/** Every locale except the default one is reachable at a prefix of its name. */
const PREFIXED = Object.keys(LOCALES).filter((code) => code !== DEFAULT_LOCALE)

/**
 * The route tree mirrors the original site's, one for one. `:collection` and
 * `:section` stand in where the original had a page per entry that differed only
 * in its copy.
 */
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {PREFIXED.map((code) => (
          <Route key={code} path={`/${code}`} element={<Locale locale={code} />}>
            {pages()}
          </Route>
        ))}
        <Route path="/" element={<Locale locale={DEFAULT_LOCALE} />}>
          {pages()}
        </Route>
      </Routes>
    </>
  )
}
