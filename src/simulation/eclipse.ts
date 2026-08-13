import type { EclipseMode } from './orbits'

export function explainKeys(
  mode: EclipseMode,
  simDays: number,
): { titleKey: string; bodyKey: string } {
  const hit = Math.abs(simDays) < 0.18
  if (mode === 'solar') {
    return hit
      ? { titleKey: 'solarHitTitle', bodyKey: 'solarHitBody' }
      : { titleKey: 'solarMissTitle', bodyKey: 'solarMissBody' }
  }
  return hit
    ? { titleKey: 'lunarHitTitle', bodyKey: 'lunarHitBody' }
    : { titleKey: 'lunarMissTitle', bodyKey: 'lunarMissBody' }
}
