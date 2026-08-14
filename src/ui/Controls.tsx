import { useId, useState, type ReactNode } from 'react'
import { explainKeys } from '../simulation/eclipse'
import type { CameraFocus, EclipseMode, ScaleMode } from '../simulation/orbits'
import { DATE_JUMPS, dateAtOffset, formatClock, formatDate, formatJumpDate } from '../simulation/orbits'
import { dateLocale } from '../i18n/messages'
import { useI18n } from '../i18n/LocaleContext'
import {
  IconCamera,
  IconChevron,
  IconEarth,
  IconInfo,
  IconMoon,
  IconOrbit,
  IconPause,
  IconPlane,
  IconPlay,
  IconRuler,
  IconSchool,
  IconShadow,
  IconSun,
} from './Icons'

type Props = {
  mode: EclipseMode
  onMode: (mode: EclipseMode) => void
  playing: boolean
  onPlaying: (playing: boolean) => void
  speed: number
  onSpeed: (speed: number) => void
  simDays: number
  onSimDays: (days: number) => void
  focus: CameraFocus
  onFocus: (focus: CameraFocus) => void
  showOrbits: boolean
  onShowOrbits: (value: boolean) => void
  showEcliptic: boolean
  onShowEcliptic: (value: boolean) => void
  showShadows: boolean
  onShowShadows: (value: boolean) => void
  scaleMode: ScaleMode
  onScaleMode: (mode: ScaleMode) => void
  degreesFromAlignment: number
}

function Section({
  title,
  hint,
  hintLabel,
  children,
}: {
  title: string
  hint?: ReactNode
  hintLabel?: string
  children: ReactNode
}) {
  const tipId = useId()
  return (
    <section className={hint ? 'section has-help' : 'section'}>
      <div className="section-head">
        <h2 className="section-title">{title}</h2>
        {hint ? (
          <span className="section-help">
            <button
              type="button"
              className="section-info"
              aria-label={hintLabel ?? title}
              aria-describedby={tipId}
            >
              <IconInfo />
            </button>
            <span id={tipId} className="section-tip" role="tooltip">
              {hint}
            </span>
          </span>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function Hint({ items }: { items: { label: string; note: string }[] }) {
  return (
    <>
      {items.map((item) => (
        <span key={item.label}>
          <strong>{item.label}.</strong> {item.note}
        </span>
      ))}
    </>
  )
}

function formatSpeed(speed: number): string {
  const rounded = Math.round(speed * 100) / 100
  return `${rounded}×`
}

export function Controls({
  mode,
  onMode,
  playing,
  onPlaying,
  speed,
  onSpeed,
  simDays,
  onSimDays,
  focus,
  onFocus,
  showOrbits,
  onShowOrbits,
  showEcliptic,
  onShowEcliptic,
  showShadows,
  onShowShadows,
  scaleMode,
  onScaleMode,
  degreesFromAlignment,
}: Props) {
  const { t, locale, setLocale } = useI18n()
  const speedId = useId()
  const timeId = useId()
  const [moreOpen, setMoreOpen] = useState(false)
  const simDate = dateAtOffset(mode, simDays)
  const dateText = formatDate(simDate, dateLocale(locale))
  const clockText = formatClock(simDate)
  const keys = explainKeys(mode, simDays)
  const deg = Math.abs(degreesFromAlignment).toFixed(0)

  return (
    <div className="panel controls" role="toolbar" aria-label={t('controlsLabel')}>
      <Section title={t('sectionTime')}>
        <div className="time-transport">
          <time className="time-now" dateTime={simDate.toISOString()} title={t('simDate')}>
            {dateText}
          </time>
          <span className={keys.hit ? 'status status-hit' : 'status status-miss'}>
            {t(keys.statusKey, { deg })}
          </span>
          <button
            type="button"
            className="play-toggle"
            aria-pressed={playing}
            aria-label={playing ? t('pause') : t('play')}
            onClick={() => onPlaying(!playing)}
          >
            {playing ? <IconPause /> : <IconPlay />}
            <span className="play-label">{playing ? t('pause') : t('play')}</span>
          </button>
        </div>
        <div className="day-timeline" role="group" aria-label={t('dayTimeline')}>
          {DATE_JUMPS.map((offset) => {
              const date = dateAtOffset(mode, offset)
              const dateText = formatJumpDate(date, dateLocale(locale))
              const eclipse = offset === 0
              const active = Math.abs(simDays - offset) < 0.2
              return (
                <button
                  key={offset}
                  type="button"
                  className={[
                    eclipse ? 'is-eclipse' : '',
                    active ? 'active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={active}
                  aria-label={eclipse ? t('jumpEclipse', { date: dateText }) : dateText}
                  onClick={() => {
                    onPlaying(false)
                    onSimDays(offset)
                  }}
                >
                  <span className="day-mark" aria-hidden="true" />
                  <span className="day-label">{eclipse ? t('eclipse') : dateText}</span>
                </button>
              )
            })}
        </div>
        <div className="time-sliders">
          <label className="slider-label" htmlFor={speedId}>
            {t('speed')}
          </label>
          <input
            id={speedId}
            type="range"
            min={0.25}
            max={4}
            step={0.25}
            value={speed}
            aria-valuemin={0.25}
            aria-valuemax={4}
            aria-valuenow={speed}
            aria-valuetext={`${formatSpeed(speed)}`}
            onChange={(e) => onSpeed(Number(e.target.value))}
          />
          <span className="slider-value" aria-hidden="true">
            {formatSpeed(speed)}
          </span>
          <label className="slider-label" htmlFor={timeId}>
            {t('scrub')}
          </label>
          <input
            id={timeId}
            type="range"
            min={-2.5}
            max={2.5}
            step={0.01}
            value={simDays}
            aria-valuemin={-2.5}
            aria-valuemax={2.5}
            aria-valuenow={Number(simDays.toFixed(2))}
            aria-valuetext={dateText}
            onChange={(e) => {
              onPlaying(false)
              onSimDays(Number(e.target.value))
            }}
          />
          <span className="slider-value" aria-hidden="true">
            {clockText}
          </span>
        </div>
      </Section>

      <button
        type="button"
        className={moreOpen ? 'more-toggle is-open' : 'more-toggle'}
        aria-expanded={moreOpen}
        aria-controls="more-controls"
        aria-label={t('moreOptions')}
        title={t('moreOptions')}
        onClick={() => setMoreOpen((open) => !open)}
      >
        <IconChevron />
      </button>

      <div
        className={moreOpen ? 'more-panels is-open' : 'more-panels'}
        id="more-controls"
        aria-hidden={!moreOpen}
        inert={!moreOpen || undefined}
      >
        <div className="more-panels-inner">
        <Section title={t('sectionType')}>
          <div className="stack">
            <button
              type="button"
              className={mode === 'solar' ? 'active' : ''}
              aria-pressed={mode === 'solar'}
              onClick={() => onMode('solar')}
            >
              <IconSun />
              {t('solar')}
            </button>
            <button
              type="button"
              className={mode === 'lunar' ? 'active' : ''}
              aria-pressed={mode === 'lunar'}
              onClick={() => onMode('lunar')}
            >
              <IconMoon />
              {t('lunar')}
            </button>
          </div>
        </Section>

        <Section
          title={t('sectionCamera')}
          hintLabel={t('aboutSection', { title: t('sectionCamera') })}
          hint={
            <Hint
              items={[
                { label: t('freeCam'), note: t('noteFreeCam') },
                { label: t('focusSun'), note: t('noteFocusSun') },
                { label: t('focusEarth'), note: t('noteFocusEarth') },
                { label: t('focusMoon'), note: t('noteFocusMoon') },
              ]}
            />
          }
        >
          <div className="grid-2">
            <button
              type="button"
              className={focus === 'free' ? 'active' : ''}
              aria-pressed={focus === 'free'}
              onClick={() => onFocus('free')}
            >
              <IconCamera />
              {t('freeCam')}
            </button>
            <button
              type="button"
              className={focus === 'sun' ? 'active' : ''}
              aria-pressed={focus === 'sun'}
              onClick={() => onFocus('sun')}
            >
              <IconSun />
              {t('focusSun')}
            </button>
            <button
              type="button"
              className={focus === 'earth' ? 'active' : ''}
              aria-pressed={focus === 'earth'}
              onClick={() => onFocus('earth')}
            >
              <IconEarth />
              {t('focusEarth')}
            </button>
            <button
              type="button"
              className={focus === 'moon' ? 'active' : ''}
              aria-pressed={focus === 'moon'}
              onClick={() => onFocus('moon')}
            >
              <IconMoon />
              {t('focusMoon')}
            </button>
          </div>
        </Section>

        <Section
          title={t('sectionScale')}
          hintLabel={t('aboutSection', { title: t('sectionScale') })}
          hint={
            <Hint
              items={[
                { label: t('scaleDidactic'), note: t('noteDidactic') },
                { label: t('scaleReal'), note: t('noteReal') },
              ]}
            />
          }
        >
          <div className="stack">
            <button
              type="button"
              className={scaleMode === 'didactic' ? 'active' : ''}
              aria-pressed={scaleMode === 'didactic'}
              onClick={() => onScaleMode('didactic')}
            >
              <IconSchool />
              {t('scaleDidactic')}
            </button>
            <button
              type="button"
              className={scaleMode === 'real' ? 'active' : ''}
              aria-pressed={scaleMode === 'real'}
              onClick={() => onScaleMode('real')}
            >
              <IconRuler />
              {t('scaleReal')}
            </button>
          </div>
        </Section>

        <Section
          title={t('sectionGuides')}
          hintLabel={t('aboutSection', { title: t('sectionGuides') })}
          hint={
            <Hint
              items={[
                { label: t('orbits'), note: t('noteOrbits') },
                { label: t('ecliptic'), note: t('noteEcliptic') },
                { label: t('shadows'), note: t('noteShadows') },
              ]}
            />
          }
        >
          <div className="grid-2">
            <button
              type="button"
              className={showOrbits ? 'active' : ''}
              aria-pressed={showOrbits}
              onClick={() => onShowOrbits(!showOrbits)}
            >
              <IconOrbit />
              {t('orbits')}
            </button>
            <button
              type="button"
              className={showEcliptic ? 'active' : ''}
              aria-pressed={showEcliptic}
              onClick={() => onShowEcliptic(!showEcliptic)}
            >
              <IconPlane />
              {t('ecliptic')}
            </button>
            <button
              type="button"
              className={showShadows ? 'active' : ''}
              aria-pressed={showShadows}
              onClick={() => onShowShadows(!showShadows)}
            >
              <IconShadow />
              {t('shadows')}
            </button>
          </div>
        </Section>

        <Section title={t('language')}>
          <div className="stack">
            <button
              type="button"
              className={locale === 'ca' ? 'active' : ''}
              aria-pressed={locale === 'ca'}
              onClick={() => setLocale('ca')}
            >
              {t('langCa')}
            </button>
            <button
              type="button"
              className={locale === 'en' ? 'active' : ''}
              aria-pressed={locale === 'en'}
              onClick={() => setLocale('en')}
            >
              {t('langEn')}
            </button>
          </div>
        </Section>
        </div>
      </div>
    </div>
  )
}
