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
  const { t } = useI18n()
  const [whyOpen, setWhyOpen] = useState(false)
  const keys = explainKeys(mode, simDays)
  const deg = Math.abs(degreesFromAlignment).toFixed(0)

  return (
    <aside
      className={whyOpen ? 'panel education is-open' : 'panel education'}
      aria-label={t('appTitle')}
    >
      <div className="education-heading">
        <h1>
          {t('appTitle')}{' '}
          <span className="education-kind">({t(mode)})</span>
        </h1>
        <button
          type="button"
          className="education-toggle is-why"
          aria-expanded={whyOpen}
          aria-controls="education-more"
          aria-label={whyOpen ? t('whyHide') : t('whyPanel')}
          onClick={() => setWhyOpen((open) => !open)}
        >
          <IconChevron />
        </button>
      </div>
      <div className="education-more" id="education-more">
        <h2 className="education-why-title">{t(keys.titleKey)}</h2>
        <p>{t(keys.bodyKey, { deg })}</p>
      </div>
    </aside>
  )
}
