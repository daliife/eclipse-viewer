import { useEffect, useId, useRef, useState, type ComponentType } from 'react'
import { useI18n } from '../i18n/LocaleContext'
import {
  IconChevron,
  IconClock,
  IconClose,
  IconEarth,
  IconOrbit,
  IconPlay,
  IconSun,
  type IconProps,
} from './Icons'

const STEP_ICONS: ComponentType<IconProps>[] = [
  IconSun,
  IconClock,
  IconOrbit,
  IconEarth,
]

const STORAGE_KEY = 'eclipse-hide-tour'
const STEPS = 4

function hideTourForever(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function rememberHideTour() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function WelcomeTour() {
  const { t, locale, setLocale } = useI18n()
  const [open, setOpen] = useState(() => !hideTourForever())
  const [step, setStep] = useState(0)
  const [hideNext, setHideNext] = useState(false)
  const hideNextRef = useRef(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const first = step === 0
  const last = step === STEPS - 1
  hideNextRef.current = hideNext

  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (hideNextRef.current) rememberHideTour()
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function dismiss() {
    if (hideNext) rememberHideTour()
    setOpen(false)
  }

  function back() {
    setStep((n) => Math.max(0, n - 1))
  }

  function next() {
    if (last) {
      dismiss()
      return
    }
    setStep((n) => n + 1)
  }

  if (!open) return null

  const n = String(step + 1)
  const title = t(`tour${n}Title`)
  const body = t(`tour${n}Body`)
  const StepIcon = STEP_ICONS[step] ?? IconSun

  return (
    <div className="welcome-overlay">
      <div
        ref={dialogRef}
        className="panel welcome"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="welcome-top">
          <span className="welcome-index">
            {t('tourStep', { n, total: String(STEPS) })}
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
        </div>

        <h2 id={titleId} className="welcome-title">
          <StepIcon />
          {title}
        </h2>
        <p className="welcome-body">{body}</p>

        <div className="welcome-meta">
          <div className="welcome-dots">
            {Array.from({ length: STEPS }, (_, i) => (
              <button
                key={i}
                type="button"
                className={i === step ? 'is-on' : i < step ? 'is-done' : undefined}
                aria-label={t('tourStep', { n: String(i + 1), total: String(STEPS) })}
                aria-current={i === step ? 'step' : undefined}
                onClick={() => setStep(i)}
              />
            ))}
          </div>
          <label className="welcome-hide">
            <input
              type="checkbox"
              checked={hideNext}
              onChange={(e) => setHideNext(e.target.checked)}
            />
            {t('tourHide')}
          </label>
        </div>

        <div className="welcome-nav">
          <button type="button" className="welcome-skip" onClick={dismiss}>
            <IconClose />
            {t('tourSkip')}
          </button>
          <div className="welcome-nav-end">
            {!first ? (
              <button type="button" className="welcome-back" onClick={back}>
                <IconChevron />
                {t('tourBack')}
              </button>
            ) : null}
            <button type="button" className="welcome-next" onClick={next}>
              {last ? t('tourStart') : t('tourNext')}
              {last ? <IconPlay /> : <IconChevron />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
