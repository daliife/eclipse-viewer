import type { EclipseMode } from './orbits'

export function explainKeys(
  mode: EclipseMode,
  simDays: number,
): { titleKey: string; bodyKey: string; statusKey: string; hit: boolean } {
  const hit = Math.abs(simDays) < 0.18
  if (mode === 'solar') {
    return hit
      ? { titleKey: 'solarHitTitle', bodyKey: 'solarHitBody', statusKey: 'statusHit', hit }
      : { titleKey: 'solarMissTitle', bodyKey: 'solarMissBody', statusKey: 'statusMiss', hit }
  }
  return hit
    ? { titleKey: 'lunarHitTitle', bodyKey: 'lunarHitBody', statusKey: 'statusHit', hit }
    : { titleKey: 'lunarMissTitle', bodyKey: 'lunarMissBody', statusKey: 'statusMiss', hit }
}
