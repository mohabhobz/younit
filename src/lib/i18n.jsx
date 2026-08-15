import { createContext, useContext, useEffect, useMemo } from 'react'
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  useNavigate as useRouterNavigate,
} from 'react-router-dom'
import en from '../content/ui/en.json'
import ar from '../content/ui/ar.json'

/**
 * Two languages, one route tree.
 *
 * English lives at the root and Arabic under `/ar`, so every English URL the
 * client already has keeps working and the Arabic one is the same path with a
 * prefix. Nothing in a page has to know which it is: the `Link` exported here
 * adds the prefix, and `t` reads the string.
 *
 * The Arabic wording is the client's own, carried over from the original site's
 * `messages/ar.json` wherever it had a string for something; the rest is
 * translated in the same voice — plain, unadorned, no marketing register.
 */

export const LOCALES = {
  en: { dir: 'ltr', label: 'English', short: 'EN', htmlLang: 'en' },
  ar: { dir: 'rtl', label: 'عربي', short: 'عربي', htmlLang: 'ar' },
}

export const DEFAULT_LOCALE = 'en'

const DICTIONARIES = { en, ar }

const I18nContext = createContext(null)

/** `learn.title` → the string, or the key itself if it is missing. */
function lookup(dictionary, key) {
  return key.split('.').reduce((node, part) => (node == null ? node : node[part]), dictionary)
}

/**
 * Prefix a site-absolute path with the locale. `/learn` becomes `/ar/learn`;
 * anything already prefixed, external, or an anchor is left alone.
 */
export function localise(path, locale) {
  if (locale === DEFAULT_LOCALE) return path
  if (typeof path !== 'string' || !path.startsWith('/')) return path
  if (path === `/${locale}` || path.startsWith(`/${locale}/`)) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/** The same path in the other language, for the language switch. */
export function swapLocale(pathname, from, to) {
  const bare =
    from === DEFAULT_LOCALE ? pathname : pathname.replace(new RegExp(`^/${from}`), '') || '/'
  return localise(bare, to)
}

export function I18nProvider({ locale, children }) {
  const value = useMemo(() => {
    const dictionary = DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE]
    const fallback = DICTIONARIES[DEFAULT_LOCALE]

    /**
     * `t('learn.sessionOf', { session: 2, total: 5 })`. A missing Arabic string
     * falls back to English rather than rendering a key at the reader.
     */
    const t = (key, values) => {
      const raw = lookup(dictionary, key) ?? lookup(fallback, key) ?? key
      if (!values) return raw
      return Object.entries(values).reduce(
        (text, [name, replacement]) => text.replaceAll(`{${name}}`, replacement),
        raw,
      )
    }

    return { locale, ...LOCALES[locale], t }
  }, [locale])

  // The document itself carries the language and the direction, so the browser
  // hyphenates, quotes and mirrors correctly without any component asking.
  useEffect(() => {
    const root = document.documentElement
    root.lang = value.htmlLang
    root.dir = value.dir
    return () => {
      root.lang = LOCALES[DEFAULT_LOCALE].htmlLang
      root.dir = LOCALES[DEFAULT_LOCALE].dir
    }
  }, [value])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside an I18nProvider')
  return value
}

/** A `Link` that stays in the reader's language. Use this, not the router's. */
export function Link({ to, ...rest }) {
  const { locale } = useI18n()
  return <RouterLink to={localise(to, locale)} {...rest} />
}

export function NavLink({ to, ...rest }) {
  const { locale } = useI18n()
  return <RouterNavLink to={localise(to, locale)} {...rest} />
}

/** `navigate('/learn')` lands on `/ar/learn` when the reader is in Arabic. */
export function useNavigate() {
  const navigate = useRouterNavigate()
  const { locale } = useI18n()
  return useMemo(
    () => (to, options) => navigate(typeof to === 'string' ? localise(to, locale) : to, options),
    [navigate, locale],
  )
}
