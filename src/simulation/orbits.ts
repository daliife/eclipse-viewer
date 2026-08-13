export type EclipseMode = 'solar' | 'lunar'
export type CameraFocus = 'free' | 'sun' | 'earth' | 'moon'
export type ScaleMode = 'didactic' | 'real'
export type Vec3 = [number, number, number]

export type Scale = {
  sunRadius: number
  earthRadius: number
  moonRadius: number
  earthOrbit: number
  moonOrbit: number
  moonInclinationDeg: number
  moonDegreesPerDay: number
  earthDegreesPerDay: number
}

const SHARED = {
  moonInclinationDeg: 5,
  moonDegreesPerDay: 13.2,
  earthDegreesPerDay: 360 / 365.25,
} as const

const EARTH_R = 1.15

/** Classroom: bodies visible, 5° tilt obvious. Real: true radius/distance ratios. */
export const SCALES: Record<ScaleMode, Scale> = {
  didactic: {
    ...SHARED,
    sunRadius: 8,
    earthRadius: EARTH_R,
    moonRadius: 0.31,
    earthOrbit: 92,
    moonOrbit: 4.8,
  },
  real: {
    ...SHARED,
    earthRadius: EARTH_R,
    sunRadius: EARTH_R * 109.2,
    moonRadius: EARTH_R * 0.2727,
    earthOrbit: EARTH_R * 23455,
    moonOrbit: EARTH_R * 60.3,
  },
}

export function getScale(mode: ScaleMode): Scale {
  return SCALES[mode]
}

export const SOLAR_ECLIPSE_MS = Date.UTC(2026, 7, 12, 18, 30, 0)
export const LUNAR_ECLIPSE_MS = Date.UTC(2025, 2, 14, 6, 59, 0)

export const DATE_JUMPS = [-2, -1, 0, 1, 2] as const

const DEG = Math.PI / 180

export type SimState = {
  sun: Vec3
  earth: Vec3
  moon: Vec3
  earthAngle: number
  moonAngle: number
  degreesFromAlignment: number
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function len(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2])
}

function norm(v: Vec3): Vec3 {
  const n = len(v) || 1
  return [v[0] / n, v[1] / n, v[2] / n]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

export function getSimState(mode: EclipseMode, simDays: number, scale: Scale): SimState {
  const moonI = scale.moonInclinationDeg * DEG
  const earth0 = mode === 'solar' ? 0 : -25 * DEG
  const earthAngle = earth0 + simDays * scale.earthDegreesPerDay * DEG
  const earth: Vec3 = [
    scale.earthOrbit * Math.cos(earthAngle),
    0,
    scale.earthOrbit * Math.sin(earthAngle),
  ]

  const phase0 = mode === 'solar' ? 0 : Math.PI
  const moonAngle = phase0 + simDays * scale.moonDegreesPerDay * DEG

  const toSun = norm([-earth[0], -earth[1], -earth[2]])
  const alongTrack = norm(cross([0, 1, 0], toSun))
  const tiltedUp = cross(toSun, alongTrack)
  const ci = Math.cos(moonI)
  const si = Math.sin(moonI)
  const orbitalAlong: Vec3 = [
    alongTrack[0] * ci + tiltedUp[0] * si,
    alongTrack[1] * ci + tiltedUp[1] * si,
    alongTrack[2] * ci + tiltedUp[2] * si,
  ]

  const c = Math.cos(moonAngle)
  const s = Math.sin(moonAngle)
  const moonOff: Vec3 = [
    (toSun[0] * c + orbitalAlong[0] * s) * scale.moonOrbit,
    (toSun[1] * c + orbitalAlong[1] * s) * scale.moonOrbit,
    (toSun[2] * c + orbitalAlong[2] * s) * scale.moonOrbit,
  ]
  const moon: Vec3 = [earth[0] + moonOff[0], earth[1] + moonOff[1], earth[2] + moonOff[2]]

  const aligned = ((moonAngle - phase0 + Math.PI) % (Math.PI * 2)) - Math.PI
  const degreesFromAlignment = (aligned * 180) / Math.PI

  return {
    sun: [0, 0, 0],
    earth,
    moon,
    earthAngle,
    moonAngle,
    degreesFromAlignment,
  }
}

export function eclipseInstant(mode: EclipseMode): number {
  return mode === 'solar' ? SOLAR_ECLIPSE_MS : LUNAR_ECLIPSE_MS
}

export function dateAtOffset(mode: EclipseMode, simDays: number): Date {
  return new Date(eclipseInstant(mode) + simDays * 24 * 60 * 60 * 1000)
}

export function formatDate(date: Date, localeTag: string): string {
  return (
    date.toLocaleString(localeTag, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      hour12: false,
    }) + ' UTC'
  )
}

export function formatDayOffset(offset: number): string {
  if (offset === 0) return '0'
  return offset > 0 ? `+${offset}` : String(offset)
}

export function sunDirectionFromEarth(earth: Vec3): Vec3 {
  return norm(sub([0, 0, 0], earth))
}

export function umbraLength(scale: Scale): number {
  return (scale.earthRadius * scale.earthOrbit) / (scale.sunRadius - scale.earthRadius)
}

/** 0 = full sunlight, 1 = deep in Earth’s umbra (lunar eclipse). */
export function lunarUmbraFactor(state: SimState, scale: Scale): number {
  const { earth, moon } = state
  const dist = Math.hypot(earth[0], earth[1], earth[2]) || 1
  const ax = earth[0] / dist
  const ay = earth[1] / dist
  const az = earth[2] / dist
  const mx = moon[0] - earth[0]
  const my = moon[1] - earth[1]
  const mz = moon[2] - earth[2]
  const along = mx * ax + my * ay + mz * az
  if (along <= scale.earthRadius) return 0

  const radial = Math.hypot(mx - ax * along, my - ay * along, mz - az * along)
  const uLen = umbraLength(scale)
  const umbraR = Math.max(0, scale.earthRadius * (1 - along / uLen))
  const penumbraR =
    scale.earthRadius + (along * (scale.sunRadius + scale.earthRadius)) / scale.earthOrbit
  const mr = scale.moonRadius
  if (radial + mr < umbraR) return 1
  if (radial - mr > penumbraR) return 0
  const inner = Math.max(0, umbraR - mr)
  const outer = penumbraR + mr
  return Math.min(1, Math.max(0, (outer - radial) / Math.max(1e-4, outer - inner)))
}

/** Tighter portrait FOV would clip the Earth–Moon pair; widen vertical FOV instead. */
export function framingFov(aspect: number): number {
  if (aspect < 0.7) return 56
  if (aspect < 1) return 50
  return 42
}

export function framingDistanceBoost(aspect: number): number {
  if (aspect >= 1) return 1
  return 1 + (1 - Math.max(0.48, aspect)) * 0.65
}

export function focusCameraOffset(scale: Scale, focus: CameraFocus, aspect = 1.4): Vec3 {
  const boost = framingDistanceBoost(aspect)
  if (focus === 'sun') {
    const d = scale.sunRadius * 3.6 * boost
    return [d * 0.7, d * 0.45, d]
  }
  if (focus === 'moon') {
    const d = Math.max(scale.moonRadius * 12, scale.earthRadius * 2.4) * boost
    return [d * 0.55, d * 0.35, d * 0.85]
  }
  // Close side view so Earth and the Moon share the frame.
  const d = scale.moonOrbit * 1.22 * boost
  return [d * 0.1, d * 0.36, d * 0.92]
}

export function focusRadius(scale: Scale, focus: CameraFocus): number {
  const o = focusCameraOffset(scale, focus)
  return Math.hypot(o[0], o[1], o[2])
}
