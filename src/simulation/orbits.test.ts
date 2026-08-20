import { describe, expect, it } from 'vitest'
import { ALIGNMENT_EPS, explainKeys } from './eclipse'
import {
  DATE_JUMPS,
  dateAtOffset,
  formatClock,
  formatDate,
  framingFov,
  getScale,
  getSimState,
  lunarUmbraFactor,
  moonShadowRadiusBoost,
  umbraLength,
  focusCameraOffset,
} from './orbits'

describe('explainKeys', () => {
  it('treats the eclipse day as aligned', () => {
    expect(explainKeys('solar', 0).hit).toBe(true)
    expect(explainKeys('solar', 0).bodyKey).toBe('solarHitBody')
    expect(explainKeys('solar', 0).statusKey).toBe('statusHit')
    expect(explainKeys('lunar', 0).bodyKey).toBe('lunarHitBody')
  })

  it('treats a day later as a miss', () => {
    expect(explainKeys('solar', 1).hit).toBe(false)
    expect(explainKeys('solar', 1).bodyKey).toBe('solarMissBody')
    expect(explainKeys('solar', 1).statusKey).toBe('statusMiss')
    expect(explainKeys('lunar', -1).hit).toBe(false)
  })

  it('uses a tight window around the keyframe', () => {
    expect(explainKeys('solar', ALIGNMENT_EPS - 1e-6).hit).toBe(true)
    expect(explainKeys('solar', ALIGNMENT_EPS).hit).toBe(false)
  })
})

describe('getSimState', () => {
  it('puts the Moon between Earth and the Sun on the solar keyframe', () => {
    for (const mode of ['didactic', 'real'] as const) {
      const state = getSimState('solar', 0, getScale(mode))
      const earthDist = Math.hypot(...state.earth)
      const moonDist = Math.hypot(...state.moon)
      expect(moonDist).toBeLessThan(earthDist)
      expect(Math.abs(state.degreesFromAlignment)).toBeLessThan(0.01)
    }
  })

  it('puts Earth between the Sun and the Moon on the lunar keyframe', () => {
    for (const mode of ['didactic', 'real'] as const) {
      const state = getSimState('lunar', 0, getScale(mode))
      const earthDist = Math.hypot(...state.earth)
      const moonDist = Math.hypot(...state.moon)
      expect(moonDist).toBeGreaterThan(earthDist)
      expect(Math.abs(state.degreesFromAlignment)).toBeLessThan(0.01)
    }
  })

  it('moves the Moon off the node by the next day', () => {
    const state = getSimState('solar', 1, getScale('didactic'))
    expect(Math.abs(state.degreesFromAlignment)).toBeGreaterThan(10)
  })
})

describe('dateAtOffset', () => {
  it('labels the solar keyframe as 12 August 2026, 18:30 UTC', () => {
    const date = dateAtOffset('solar', 0)
    expect(date.getUTCFullYear()).toBe(2026)
    expect(date.getUTCMonth()).toBe(7)
    expect(date.getUTCDate()).toBe(12)
    expect(date.getUTCHours()).toBe(18)
    expect(date.getUTCMinutes()).toBe(30)
    expect(formatClock(date)).toBe('18:30')
  })

  it('labels the lunar keyframe as 14 March 2025, 06:59 UTC', () => {
    const date = dateAtOffset('lunar', 0)
    expect(date.getUTCFullYear()).toBe(2025)
    expect(date.getUTCMonth()).toBe(2)
    expect(date.getUTCDate()).toBe(14)
    expect(date.getUTCHours()).toBe(6)
    expect(date.getUTCMinutes()).toBe(59)
  })

  it('formats Catalan dates with de / d’ before the month', () => {
    expect(formatDate(dateAtOffset('solar', 0), 'ca')).toBe("12 d’ag. del 2026, 18:30 UTC")
    expect(formatDate(dateAtOffset('lunar', 0), 'ca')).toBe('14 de març del 2025, 06:59 UTC')
  })
})

describe('scales', () => {
  it('keeps a 5° Moon tilt and real radius ratios', () => {
    const didactic = getScale('didactic')
    const real = getScale('real')
    expect(didactic.moonInclinationDeg).toBe(5)
    expect(real.moonInclinationDeg).toBe(5)
    expect(real.sunRadius / real.earthRadius).toBeCloseTo(109.2, 5)
    expect(real.moonRadius / real.earthRadius).toBeCloseTo(0.2727, 5)
    expect(real.earthOrbit / real.earthRadius).toBeCloseTo(23455, 0)
    expect(didactic.earthOrbit / didactic.moonOrbit).toBeLessThan(real.earthOrbit / real.moonOrbit)
  })

  it('offers day jumps around the eclipse', () => {
    expect([...DATE_JUMPS]).toEqual([-2, -1, 0, 1, 2])
  })
})

describe('moonShadowRadiusBoost', () => {
  it('inflates the Moon so the Earth-surface umbra is visible at both scales', () => {
    const classroom = moonShadowRadiusBoost(getScale('didactic'))
    const realistic = moonShadowRadiusBoost(getScale('real'))
    expect(classroom).toBeGreaterThan(1)
    expect(realistic).toBeGreaterThan(classroom)
  })
})

describe('lunarUmbraFactor', () => {
  it('puts the Moon in Earth’s umbra on the lunar keyframe', () => {
    const scale = getScale('didactic')
    expect(lunarUmbraFactor(getSimState('lunar', 0, scale), scale)).toBeGreaterThan(0.8)
  })

  it('leaves the Moon in sunlight on the solar keyframe', () => {
    const scale = getScale('didactic')
    expect(lunarUmbraFactor(getSimState('solar', 0, scale), scale)).toBe(0)
  })
})

describe('framing', () => {
  it('widens FOV on tall viewports', () => {
    expect(framingFov(1.4)).toBe(42)
    expect(framingFov(0.8)).toBe(50)
    expect(framingFov(0.5)).toBe(56)
  })

  it('pulls Earth focus far enough to keep the Sun in frame', () => {
    const scale = getScale('didactic')
    const dist = Math.hypot(...focusCameraOffset(scale, 'earth', 1.4))
    expect(dist).toBeGreaterThan(scale.earthOrbit * 0.4)
    expect(dist).toBeLessThan(scale.earthOrbit)
  })

  it('gives Earth a finite umbra', () => {
    expect(umbraLength(getScale('didactic'))).toBeGreaterThan(0)
    expect(umbraLength(getScale('real'))).toBeGreaterThan(0)
  })
})
