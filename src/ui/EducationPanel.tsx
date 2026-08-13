import { explainKeys } from '../simulation/eclipse'
import { dateAtOffset, formatDate, type EclipseMode, type ScaleMode } from '../simulation/orbits'
import { dateLocale } from '../i18n/messages'
import { useI18n } from '../i18n/LocaleContext'

type Props = {
  mode: EclipseMode
  simDays: number
  degreesFromAlignment: number
  scaleMode: ScaleMode
}

export function EducationPanel({ mode, simDays, degreesFromAlignment, scaleMode }: Props) {
  const { t, locale, setLocale } = useI18n()
  const keys = explainKeys(mode, simDays)
  const date = dateAtOffset(mode, simDays)
  const dateText = formatDate(date, dateLocale(locale))
  const deg = Math.abs(degreesFromAlignment).toFixed(0)

  return (
    <aside className="panel education" aria-label={t('whyPanel')}>
      <div className="education-top">
        <time className="date" dateTime={date.toISOString()}>
          {dateText}
        </time>
        <div className="lang" role="group" aria-label={`${t('langCa')} / ${t('langEn')}`}>
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
      <h1>{t(keys.titleKey)}</h1>
      <p>{t(keys.bodyKey, { deg })}</p>
      <p className="note">{t(scaleMode === 'real' ? 'noteReal' : 'noteDidactic')}</p>
    </aside>
  )
}
