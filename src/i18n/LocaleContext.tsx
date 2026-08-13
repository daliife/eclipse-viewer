import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { detectLocale, t as translate, type Locale } from './messages'

type I18n = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18n | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem('eclipse-locale', next)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = translate(locale, 'appTitle')
    const description = translate(locale, 'metaDescription')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', translate(locale, 'appTitle'))
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', locale === 'ca' ? 'ca_ES' : 'en_GB')
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', translate(locale, 'appTitle'))
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description)
  }, [locale])

  const value = useMemo<I18n>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within LocaleProvider')
  return ctx
}
