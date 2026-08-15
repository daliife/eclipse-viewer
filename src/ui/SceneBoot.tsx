import { Component, useEffect, type ErrorInfo, type ReactNode } from 'react'
import { useI18n } from '../i18n/LocaleContext'

export function SceneReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}

export function SceneLoading() {
  const { t } = useI18n()
  return (
    <div className="scene-boot" role="status">
      {t('loading')}
    </div>
  )
}

type CatchProps = { children: ReactNode; fallback: ReactNode }
type CatchState = { failed: boolean }

class Catch extends Component<CatchProps, CatchState> {
  state: CatchState = { failed: false }

  static getDerivedStateFromError(): CatchState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export function SceneBoundary({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  return (
    <Catch
      fallback={
        <div className="scene-boot scene-boot-error" role="alert">
          <p>{t('sceneError')}</p>
          <button type="button" onClick={() => window.location.reload()}>
            {t('reload')}
          </button>
        </div>
      }
    >
      {children}
    </Catch>
  )
}
