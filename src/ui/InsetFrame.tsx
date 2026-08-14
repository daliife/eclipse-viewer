import { useEffect, type RefObject } from 'react'
import type { EclipseMode } from '../simulation/orbits'
import { useI18n } from '../i18n/LocaleContext'
import { IconCollapse, IconExpand } from './Icons'

type Props = {
  mode: EclipseMode
  insetRef: RefObject<HTMLDivElement | null>
  enlarged: boolean
  onToggle: () => void
}

export function InsetFrame({ mode, insetRef, enlarged, onToggle }: Props) {
  const { t } = useI18n()
  const title = mode === 'solar' ? t('insetSolar') : t('insetLunar')
  const toggleLabel = enlarged ? t('shrinkView') : t('enlargeView')

  useEffect(() => {
    if (!enlarged) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onToggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enlarged, onToggle])

  return (
    <section
      className={enlarged ? 'panel inset inset-large' : 'panel inset'}
      aria-label={title}
    >
      <div className="inset-view" ref={insetRef} />
      <div
        className="inset-bar"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <span className="inset-label">{title}</span>
        <button
          type="button"
          className="inset-toggle"
          aria-expanded={enlarged}
          aria-label={toggleLabel}
          title={toggleLabel}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation()
            onToggle()
          }}
        >
          {enlarged ? <IconCollapse /> : <IconExpand />}
        </button>
      </div>
    </section>
  )
}
