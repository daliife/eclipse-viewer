import type { MessageKey } from '../i18n/messages'
import type { EclipseMode } from './orbits'

export const ALIGNMENT_EPS = 0.18

export function explainKeys(mode: EclipseMode, simDays: number): {
  bodyKey: MessageKey
  statusKey: MessageKey
  hit: boolean
} {
  const hit = Math.abs(simDays) < ALIGNMENT_EPS
  if (mode === 'solar') {
    return hit
      ? { bodyKey: 'solarHitBody', statusKey: 'statusHit', hit }
      : { bodyKey: 'solarMissBody', statusKey: 'statusMiss', hit }
  }
  return hit
    ? { bodyKey: 'lunarHitBody', statusKey: 'statusHit', hit }
    : { bodyKey: 'lunarMissBody', statusKey: 'statusMiss', hit }
}
