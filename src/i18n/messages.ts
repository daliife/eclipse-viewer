export type Locale = 'ca' | 'en'

type Dict = Record<string, string>

const en: Dict = {
  appTitle: 'Eclipse Viewer',
  solar: 'Solar',
  lunar: 'Lunar',
  play: 'Play',
  pause: 'Pause',
  speed: 'Speed',
  scrub: 'Time',
  eclipse: 'Eclipse',
  dayOffset: 'Day {n}',
  freeCam: 'Free',
  focusSun: 'Sun',
  focusEarth: 'Earth',
  focusMoon: 'Moon',
  orbits: 'Orbits',
  ecliptic: 'Ecliptic',
  shadows: 'Shadows',
  scaleDidactic: 'Classroom',
  scaleReal: 'True scale',
  sectionType: 'Eclipse',
  sectionTime: 'Time',
  sectionCamera: 'Camera',
  sectionGuides: 'Guides',
  sectionScale: 'Scale',
  insetSolar: 'Earth → Sun',
  insetLunar: 'Earth → Moon',
  solarHitTitle: 'This is the day',
  solarHitBody: 'Need two things: new Moon, and the Moon at a node. Today: both.',
  solarMissTitle: 'Not this day',
  solarMissBody: 'The Moon is {deg}° off. It moves ~13° per day, and its orbit is tilted 5°, so it misses the Sun.',
  lunarHitTitle: 'This is the day',
  lunarHitBody: 'Need two things: full Moon, and the Moon at a node. Today it enters Earth’s shadow.',
  lunarMissTitle: 'Not this day',
  lunarMissBody: 'The Moon is {deg}° off. Earth’s shadow is a thin cone, so one day later the Moon misses it.',
  noteDidactic: 'Classroom scale: stretched so the 5° tilt is easy to see.',
  noteReal: 'True scale: Earth and Moon are tiny. That is why a perfect line-up is rare.',
  langCa: 'Català',
  langEn: 'English',
  enlargeView: 'Enlarge Earth view',
  shrinkView: 'Shrink Earth view',
  whyPanel: 'Why this day',
  controlsLabel: 'Viewer controls',
}

const ca: Dict = {
  appTitle: 'Visualitzador d’eclipsis',
  solar: 'Solar',
  lunar: 'Lunar',
  play: 'Reprodueix',
  pause: 'Pausa',
  speed: 'Velocitat',
  scrub: 'Temps',
  eclipse: 'Eclipsi',
  dayOffset: 'Dia {n}',
  freeCam: 'Lliure',
  focusSun: 'Sol',
  focusEarth: 'Terra',
  focusMoon: 'Lluna',
  orbits: 'Òrbites',
  ecliptic: 'Eclíptica',
  shadows: 'Ombres',
  scaleDidactic: 'Didàctica',
  scaleReal: 'Escala real',
  sectionType: 'Eclipsi',
  sectionTime: 'Temps',
  sectionCamera: 'Càmera',
  sectionGuides: 'Guies',
  sectionScale: 'Escala',
  insetSolar: 'Terra → Sol',
  insetLunar: 'Terra → Lluna',
  solarHitTitle: 'Avui sí',
  solarHitBody: 'Calen dues coses: lluna nova i la Lluna al node. Avui: totes dues.',
  solarMissTitle: 'Avui no',
  solarMissBody: 'La Lluna va {deg}° desviada. Es mou ~13° cada dia i l’òrbita està inclinada 5°, així que no tapa el Sol.',
  lunarHitTitle: 'Avui sí',
  lunarHitBody: 'Calen dues coses: lluna plena i la Lluna al node. Avui entra a l’ombra de la Terra.',
  lunarMissTitle: 'Avui no',
  lunarMissBody: 'La Lluna va {deg}° desviada. L’ombra de la Terra és un con prim: un dia després, no hi entra.',
  noteDidactic: 'Escala didàctica: exagerada perquè es vegi la inclinació de 5°.',
  noteReal: 'Escala real: Terra i Lluna són minúscules. Per això l’alineació perfecta és rara.',
  langCa: 'Català',
  langEn: 'English',
  enlargeView: 'Amplia la vista des de la Terra',
  shrinkView: 'Redueix la vista des de la Terra',
  whyPanel: 'Per què aquest dia',
  controlsLabel: 'Controls del visualitzador',
}

export const dictionaries: Record<Locale, Dict> = { en, ca }

export function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem('eclipse-locale')
    if (saved === 'ca' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  const nav = navigator.language.toLowerCase()
  return nav.startsWith('ca') ? 'ca' : 'en'
}

export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const raw = dictionaries[locale][key] ?? dictionaries.en[key] ?? key
  if (!vars) return raw
  return raw.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ''))
}

export function dateLocale(locale: Locale): string {
  return locale === 'ca' ? 'ca-ES' : 'en-GB'
}
