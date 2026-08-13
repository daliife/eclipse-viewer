import { useState } from 'react'
import { explainKeys } from '../simulation/eclipse'
import { dateAtOffset, formatDate, type EclipseMode, type ScaleMode } from '../simulation/orbits'
import { dateLocale } from '../i18n/messages'
import { useI18n } from '../i18n/LocaleContext'
import { IconChevron, IconClock, IconInfo } from './Icons'

type Props = {
  mode: EclipseMode
  simDays: number
  degreesFromAlignment: number
  scaleMode: ScaleMode
}

export function EducationPanel({ mode, simDays, degreesFromAlignment, scaleMode }: Props) {
  const { t, locale, setLocale } = useI18n()
  const [whyOpen, setWhyOpen] = useState(false)
  const keys = explainKeys(mode, simDays)
  const date = dateAtOffset(mode, simDays)
  const dateText = formatDate(date, dateLocale(locale))
  const deg = Math.abs(degreesFromAlignment).toFixed(0)
  const didactic = scaleMode === 'didactic'

  return (
    <aside
      className={whyOpen ? 'panel education is-open' : 'panel education'}
      aria-label={t('whyPanel')}
    >
      <div className="education-top">
        <div className="date-line" title={t('simDate')}>
          <IconClock />
          <time className="date" dateTime={date.toISOString()}>
            {dateText}
          </time>
        </div>
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
      </div>
      <div className="education-heading">
        <h1>{t(keys.titleKey)}</h1>
        <span className={keys.hit ? 'status status-hit' : 'status status-miss'}>
          {t(keys.statusKey, { deg })}
        </span>
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
        <p>{t(keys.bodyKey, { deg })}</p>
        <div
          className={didactic ? 'banner' : 'banner banner-real'}
          role="status"
        >
          <IconInfo />
          <div className="banner-copy">
            <strong>{t(didactic ? 'bannerDidacticTitle' : 'bannerRealTitle')}</strong>
            <span>{t(didactic ? 'noteDidactic' : 'noteReal')}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
