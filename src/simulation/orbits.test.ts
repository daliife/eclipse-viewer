import { describe, expect, it } from 'vitest'
import { explainKeys } from './eclipse'
import { dateAtOffset, getScale, getSimState, moonShadowRadiusBoost } from './orbits'

describe('explainKeys', () => {
  it('treats the eclipse day as aligned', () => {
    expect(explainKeys('solar', 0).hit).toBe(true)
    expect(explainKeys('solar', 0).titleKey).toBe('solarHitTitle')
    expect(explainKeys('lunar', 0).titleKey).toBe('lunarHitTitle')
  })

  it('treats a day later as a miss', () => {
    expect(explainKeys('solar', 1).hit).toBe(false)
    expect(explainKeys('solar', 1).titleKey).toBe('solarMissTitle')
    expect(explainKeys('lunar', -1).hit).toBe(false)
  })
})

describe('getSimState', () => {
  const scale = getScale('didactic')

  it('puts the Moon between Earth and the Sun on the solar keyframe', () => {
    const state = getSimState('solar', 0, scale)
    const earthDist = Math.hypot(...state.earth)
    const moonDist = Math.hypot(...state.moon)
    expect(moonDist).toBeLessThan(earthDist)
    expect(Math.abs(state.degreesFromAlignment)).toBeLessThan(0.01)
  })

  it('puts Earth between the Sun and the Moon on the lunar keyframe', () => {
    const state = getSimState('lunar', 0, scale)
    const earthDist = Math.hypot(...state.earth)
    const moonDist = Math.hypot(...state.moon)
    expect(moonDist).toBeGreaterThan(earthDist)
    expect(Math.abs(state.degreesFromAlignment)).toBeLessThan(0.01)
  })
})

describe('dateAtOffset', () => {
  it('labels the solar keyframe as 12 August 2026 UTC', () => {
    const date = dateAtOffset('solar', 0)
    expect(date.getUTCFullYear()).toBe(2026)
    expect(date.getUTCMonth()).toBe(7)
    expect(date.getUTCDate()).toBe(12)
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
