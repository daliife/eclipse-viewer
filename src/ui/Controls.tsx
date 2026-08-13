import { useState, type ReactNode } from 'react'
import type { CameraFocus, EclipseMode, ScaleMode } from '../simulation/orbits'
import { DATE_JUMPS, formatDayOffset } from '../simulation/orbits'
import { useI18n } from '../i18n/LocaleContext'
import {
  IconCamera,
  IconChevron,
  IconEarth,
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
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  )
}

function formatSpeed(speed: number): string {
  const rounded = Math.round(speed * 100) / 100
  return `${rounded}×`
}

function formatScrub(days: number): string {
  const rounded = Math.round(days * 10) / 10
  if (Math.abs(rounded) < 0.05) return '0.0d'
  const sign = rounded > 0 ? '+' : ''
  return `${sign}${rounded.toFixed(1)}d`
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
}: Props) {
  const { t } = useI18n()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div className="panel controls" role="toolbar" aria-label={t('controlsLabel')}>
      <Section title={t('sectionTime')}>
        <div className="time-transport">
          <button
            type="button"
            className="play-toggle"
            aria-pressed={playing}
            onClick={() => onPlaying(!playing)}
          >
            {playing ? <IconPause /> : <IconPlay />}
            {playing ? t('pause') : t('play')}
          </button>
          <div className="row wrap day-jumps">
            {DATE_JUMPS.map((offset) => (
              <button
                key={offset}
                type="button"
                className={Math.abs(simDays - offset) < 0.2 ? 'active' : ''}
                aria-pressed={Math.abs(simDays - offset) < 0.2}
                onClick={() => {
                  onPlaying(false)
                  onSimDays(offset)
                }}
              >
                {offset === 0 ? t('eclipse') : t('dayOffset', { n: formatDayOffset(offset) })}
              </button>
            ))}
          </div>
        </div>
        <div className="time-sliders">
          <label className="slider-row">
            <span className="slider-label">{t('speed')}</span>
            <input
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
          </label>
          <label className="slider-row">
            <span className="slider-label">{t('scrub')}</span>
            <input
              type="range"
              min={-2.5}
              max={2.5}
              step={0.01}
              value={simDays}
              aria-valuemin={-2.5}
              aria-valuemax={2.5}
              aria-valuenow={Number(simDays.toFixed(2))}
              aria-valuetext={formatScrub(simDays)}
              onChange={(e) => {
                onPlaying(false)
                onSimDays(Number(e.target.value))
              }}
            />
            <span className="slider-value" aria-hidden="true">
              {formatScrub(simDays)}
            </span>
          </label>
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

        <Section title={t('sectionCamera')}>
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

        <Section title={t('sectionScale')}>
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

        <Section title={t('sectionGuides')}>
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
        </div>
      </div>
    </div>
  )
}
