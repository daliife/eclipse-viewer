import { useState } from 'react'
import { explainKeys } from '../simulation/eclipse'
import type { EclipseMode } from '../simulation/orbits'
import { useI18n } from '../i18n/LocaleContext'
import { IconChevron } from './Icons'

type Props = {
  mode: EclipseMode
  simDays: number
  degreesFromAlignment: number
}

export function EducationPanel({ mode, simDays, degreesFromAlignment }: Props) {
  const { t, locale, setLocale } = useI18n()
  const [whyOpen, setWhyOpen] = useState(false)
  const keys = explainKeys(mode, simDays)
  const deg = Math.abs(degreesFromAlignment).toFixed(0)

  return (
    <aside
      className={whyOpen ? 'panel education is-open' : 'panel education'}
      aria-label={t('appTitle')}
    >
      <div className="education-heading">
        <h1>{t('appTitle')}</h1>
        <span className={keys.hit ? 'status status-hit' : 'status status-miss'}>
          {t(keys.statusKey, { deg })}
        </span>
        <div className="lang" role="group" aria-label={t('language')}>
          <button
            type="button"
            className={locale === 'ca' ? 'active' : ''}
            aria-pressed={locale === 'ca'}
            aria-label={t('langCa')}
            onClick={() => setLocale('ca')}
          >
            CA
          </button>
          <button
            type="button"
            className={locale === 'en' ? 'active' : ''}
            aria-pressed={locale === 'en'}
            aria-label={t('langEn')}
            onClick={() => setLocale('en')}
          >
            EN
          </button>
        </div>
        <button
          type="button"
          className="education-toggle"
          aria-expanded={whyOpen}
          aria-controls="education-more"
          aria-label={whyOpen ? t('whyHide') : t('whyPanel')}
          onClick={() => setWhyOpen((open) => !open)}
        >
          <IconChevron />
        </button>
      </div>
      <div className="education-more" id="education-more">
        <p className="education-kicker">{t(keys.titleKey)}</p>
        <p>{t(keys.bodyKey, { deg })}</p>
      </div>
    </aside>
  )
}
