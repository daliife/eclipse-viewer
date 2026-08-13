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
  solarHitTitle: 'Solar eclipse',
  solarHitBody:
    'A solar eclipse needs two things at once: a new Moon (between Earth and the Sun) and a pass through a node — one of the two gold rings where its tilted orbit crosses the ecliptic. Today both are true, so the Moon covers the Sun.',
  solarMissTitle: 'The Moon misses the Sun',
  solarMissBody:
    'An eclipse still needs a new Moon at a node. The Moon is {deg}° off that line: it moves ~13° per day, and the 5° tilt lifts it away from the Sun.',
  lunarHitTitle: 'Lunar eclipse',
  lunarHitBody:
    'A lunar eclipse needs two things at once: a full Moon (Earth in the middle) and a pass through a node — one of the two gold rings where its orbit crosses the ecliptic. Today both are true, so the Moon enters Earth’s shadow.',
  lunarMissTitle: 'The Moon misses Earth’s shadow',
  lunarMissBody:
    'An eclipse still needs a full Moon at a node. The Moon is {deg}° off that line-up, so it does not enter Earth’s thin shadow.',
  statusHit: 'In alignment',
  statusMiss: '{deg}° off the node',
  metaDescription:
    'Interactive 3D viewer of solar and lunar eclipses. See why an eclipse happens only on one day: the Moon’s phase plus a pass through an orbital node.',
  noteDidactic: 'Distances are stretched so the 5° tilt is easy to see.',
  noteReal: 'Earth and Moon are tiny. That is why a perfect line-up is rare.',
  bannerDidacticTitle: 'Classroom scale',
  bannerRealTitle: 'True scale',
  langCa: 'Català',
  langEn: 'English',
  enlargeView: 'Enlarge Earth view',
  shrinkView: 'Shrink Earth view',
  whyPanel: 'Why this day',
  controlsLabel: 'Viewer controls',
  simDate: 'Simulation date',
  language: 'Language',
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
  solarHitTitle: 'Eclipsi solar',
  solarHitBody:
    'Perquè hi hagi eclipsi solar calen dues condicions alhora: lluna nova (entre la Terra i el Sol) i que passi per un node, un dels dos anells daurats on la seva òrbita inclinada creua l’eclíptica. Avui es compleixen totes dues, i la Lluna tapa el Sol.',
  solarMissTitle: 'La Lluna no tapa el Sol',
  solarMissBody:
    'Encara cal lluna nova i node alhora. La Lluna va {deg}° desviada: es mou ~13° cada dia i l’òrbita està inclinada 5°, així que ja no tapa el Sol.',
  lunarHitTitle: 'Eclipsi lunar',
  lunarHitBody:
    'Perquè hi hagi eclipsi lunar calen dues condicions alhora: lluna plena (la Terra al mig) i que passi per un node, un dels dos anells daurats on la seva òrbita creua l’eclíptica. Avui es compleixen totes dues, i la Lluna entra a l’ombra de la Terra.',
  lunarMissTitle: 'La Lluna no entra a l’ombra',
  lunarMissBody:
    'Encara cal lluna plena i node alhora. La Lluna va {deg}° desviada d’aquesta alineació, i no entra al con d’ombra de la Terra.',
  statusHit: 'Alineats',
  statusMiss: '{deg}° del node',
  metaDescription:
    'Visualitzador 3D d’eclipsis solars i lunars. Entén per què un eclipsi només passa un dia: la fase de la Lluna i el pas per un node de l’òrbita.',
  noteDidactic: 'Les distàncies estan exagerades perquè es vegi la inclinació de 5°.',
  noteReal: 'La Terra i la Lluna són minúscules. Per això l’alineació perfecta és rara.',
  bannerDidacticTitle: 'Escala didàctica',
  bannerRealTitle: 'Escala real',
  langCa: 'Català',
  langEn: 'English',
  enlargeView: 'Amplia la vista des de la Terra',
  shrinkView: 'Redueix la vista des de la Terra',
  whyPanel: 'Per què aquest dia',
  controlsLabel: 'Controls del visualitzador',
  simDate: 'Data de la simulació',
  language: 'Idioma',
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
