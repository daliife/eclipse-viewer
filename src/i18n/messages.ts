export type Locale = 'ca' | 'en'

export const en = {
  appTitle: 'Eclipse Viewer',
  solar: 'Solar',
  lunar: 'Lunar',
  play: 'Play',
  pause: 'Pause',
  speed: 'Speed',
  scrub: 'Time',
  eclipse: 'Eclipse',
  dayTimeline: 'Days around the eclipse',
  jumpEclipse: 'Eclipse, {date}',
  freeCam: 'Free',
  focusSun: 'Sun',
  focusEarth: 'Earth',
  focusMoon: 'Moon',
  orbits: 'Orbits',
  ecliptic: 'Ecliptic',
  shadows: 'Shadows',
  scaleDidactic: 'Classroom',
  scaleReal: 'Realistic',
  sectionType: 'Eclipse',
  sectionTime: 'Controls',
  sectionCamera: 'Camera',
  sectionGuides: 'Guides',
  sectionScale: 'Scale',
  insetSolar: 'Earth → Sun',
  insetLunar: 'Earth → Moon',
  solarHitBody:
    'Two things line up: a new Moon (between Earth and the Sun) and a pass through a node — one of the two red dots where its tilted orbit crosses the ecliptic. This one is total: the Moon looks a little larger than the Sun.',
  solarMissBody:
    'Covering the Sun needs a new Moon at a node. The Moon is {deg}° off that crossing: it moves about 13° a day, and the 5° tilt sends it above or below the Sun.',
  lunarHitBody:
    'Two things line up: a full Moon (Earth in the middle) and a pass through a node — one of the two red dots where its orbit crosses the ecliptic. Earth’s umbra falls on the Moon.',
  lunarMissBody:
    'Entering Earth’s shadow needs a full Moon at a node. The Moon is {deg}° off that crossing, so it misses the thin umbra.',
  statusHit: 'Aligned',
  statusMiss: '{deg}° off the node',
  metaDescription:
    'Interactive 3D viewer of solar and lunar eclipses. See why an eclipse happens only on one day: the Moon’s phase plus a pass through an orbital node.',
  noteDidactic: 'Distances are stretched so the 5° tilt is easy to see.',
  noteReal: 'Earth and the Moon are tiny. That is why a perfect line-up is rare.',
  noteFreeCam: 'Orbit the scene without locking onto a body.',
  noteFocusSun: 'Keeps the Sun in frame while you orbit.',
  noteFocusEarth: 'Keeps Earth in frame while you orbit.',
  noteFocusMoon: 'Keeps the Moon in frame while you orbit.',
  noteOrbits: 'Paths of Earth and the Moon. The red dots are the nodes — where the Moon’s path crosses the ecliptic.',
  noteEcliptic: 'Earth’s orbital plane. The Moon’s path is tilted 5° to this.',
  noteShadows: 'Umbra cones, plus the Moon’s shadow on Earth during totality.',
  langCa: 'Català',
  langEn: 'English',
  enlargeView: 'Enlarge Earth view',
  shrinkView: 'Shrink Earth view',
  whyPanel: 'Why this day',
  controlsLabel: 'Viewer controls',
  skipToControls: 'Skip to controls',
  simDate: 'Simulation date',
  language: 'Language',
  moreOptions: 'Options',
  aboutSection: 'About {title}',
  whyHide: 'Hide explanation',
  loading: 'Loading the sky…',
  sceneError: 'The 3D view failed to load.',
  reload: 'Reload',
  tourSkip: 'Skip',
  tourHide: 'Don’t show this tutorial again',
  tourReplay: 'Show tutorial',
  tourBack: 'Back',
  tourNext: 'Next',
  tourStart: 'Start',
  tourStep: '{n} / {total}',
  tour1Title: 'Welcome!',
  tour1Body:
    'On this site you’ll find a 3D scene of eclipses. Explore the Sun, Earth, and Moon, solar or lunar, from space or from Earth. You’ll see why they happen, and why they only line up for one day.',
  tour2Title: 'Why is it so rare?',
  tour2Body:
    'Because it needs two things at once: the right Moon phase, and a pass through a node — one of the two red dots where its tilted orbit crosses the Sun–Earth plane.',
  tour3Title: 'Move through time',
  tour3Body:
    'The bottom panel is the clock. Jump the dates around the eclipse, drag Time, or press Play. A day later the Moon has already left the line.',
  tour4Title: 'Find your view',
  tour4Body:
    'Drag to rotate, scroll or pinch to zoom. The small frame is the view from Earth — you can enlarge it. The gear switches Solar or Lunar, plus camera, scale, and guides.',
} as const

export type MessageKey = keyof typeof en

export const ca: Record<MessageKey, string> = {
  appTitle: 'Visualitzador d’eclipsis',
  solar: 'Solar',
  lunar: 'Lunar',
  play: 'Reprodueix',
  pause: 'Pausa',
  speed: 'Velocitat',
  scrub: 'Temps',
  eclipse: 'Eclipsi',
  dayTimeline: 'Dies al voltant de l’eclipsi',
  jumpEclipse: 'Eclipsi, {date}',
  freeCam: 'Lliure',
  focusSun: 'Sol',
  focusEarth: 'Terra',
  focusMoon: 'Lluna',
  orbits: 'Òrbites',
  ecliptic: 'Eclíptica',
  shadows: 'Ombres',
  scaleDidactic: 'Didàctica',
  scaleReal: 'Realista',
  sectionType: 'Eclipsi',
  sectionTime: 'Controls',
  sectionCamera: 'Càmera',
  sectionGuides: 'Guies',
  sectionScale: 'Escala',
  insetSolar: 'Terra → Sol',
  insetLunar: 'Terra → Lluna',
  solarHitBody:
    'S’alineen dues coses: lluna nova (entre la Terra i el Sol) i el pas per un node, un dels dos punts vermells on l’òrbita inclinada creua l’eclíptica. Aquest és total: la Lluna es veu una mica més gran que el Sol.',
  solarMissBody:
    'Per tapar el Sol calen lluna nova i node alhora. La Lluna és {deg}° fora del node: avança uns 13° cada dia, i la inclinació de 5° la fa passar per sobre o per sota del Sol.',
  lunarHitBody:
    'S’alineen dues coses: lluna plena (la Terra al mig) i el pas per un node, un dels dos punts vermells on l’òrbita creua l’eclíptica. L’umbra de la Terra cau sobre la Lluna.',
  lunarMissBody:
    'Per entrar a l’ombra calen lluna plena i node alhora. La Lluna és {deg}° fora del node, i no entra al con d’umbra.',
  statusHit: 'Alineats',
  statusMiss: '{deg}° del node',
  metaDescription:
    'Visualitzador 3D d’eclipsis solars i lunars. Entén per què un eclipsi només passa un dia: la fase de la Lluna i el pas per un node de l’òrbita.',
  noteDidactic: 'Les distàncies estan exagerades perquè es vegi la inclinació de 5°.',
  noteReal: 'La Terra i la Lluna són minúscules. Per això l’alineació perfecta és rara.',
  noteFreeCam: 'Mou l’escena lliurement, sense bloquejar cap astre.',
  noteFocusSun: 'Manté el Sol al centre mentre orbites.',
  noteFocusEarth: 'Manté la Terra al centre mentre orbites.',
  noteFocusMoon: 'Manté la Lluna al centre mentre orbites.',
  noteOrbits: 'Els camins de la Terra i la Lluna. Els punts vermells són els nodes, on l’òrbita de la Lluna creua l’eclíptica.',
  noteEcliptic: 'El pla de l’òrbita de la Terra. L’òrbita de la Lluna està inclinada 5°.',
  noteShadows: 'Els cons d’umbra, i l’ombra de la Lluna sobre la Terra durant la totalitat.',
  langCa: 'Català',
  langEn: 'English',
  enlargeView: 'Amplia la vista des de la Terra',
  shrinkView: 'Redueix la vista des de la Terra',
  whyPanel: 'Per què aquest dia',
  controlsLabel: 'Controls del visualitzador',
  skipToControls: 'Salta als controls',
  simDate: 'Data de la simulació',
  language: 'Idioma',
  moreOptions: 'Opcions',
  aboutSection: 'Sobre {title}',
  whyHide: 'Amaga l’explicació',
  loading: 'Carregant el cel…',
  sceneError: 'La vista 3D no s’ha pogut carregar.',
  reload: 'Torna a carregar',
  tourSkip: 'Omet',
  tourHide: 'No mostris més el tutorial',
  tourReplay: 'Torna a veure el tutorial',
  tourBack: 'Enrere',
  tourNext: 'Següent',
  tourStart: 'Comença',
  tourStep: '{n} / {total}',
  tour1Title: 'Benvingut!',
  tour1Body:
    'En aquest web trobaràs una escena 3D dels eclipsis. Explora el Sol, la Terra i la Lluna, de solar a lunar, des de l’espai o des de la Terra. Així veus per què passen i per què només s’alineen un dia.',
  tour2Title: 'Per què és tan rar?',
  tour2Body:
    'Perquè calen dues coses alhora: la fase adequada de la Lluna i el pas per un node, un dels dos punts vermells on l’òrbita inclinada creua el pla Sol–Terra.',
  tour3Title: 'Mou el temps',
  tour3Body:
    'El panell de sota és el rellotge. Salta pels dies de l’eclipsi, arrossega Temps o prem Reprodueix. Un dia després, la Lluna ja ha sortit de la línia.',
  tour4Title: 'Tria la vista',
  tour4Body:
    'Arrossega per girar, i fes zoom amb la rodeta o pessigant. El requadre petit és la vista des de la Terra; el pots ampliar. L’engranatge canvia Solar o Lunar, i també càmera, escala i guies.',
}

const dictionaries: Record<Locale, Record<MessageKey, string>> = { en, ca }

export const LOCALE_KEY = 'eclipse-lang'

export function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved === 'ca' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  const langs =
    typeof navigator === 'undefined'
      ? []
      : navigator.languages?.length
        ? navigator.languages
        : navigator.language
          ? [navigator.language]
          : []
  if (langs.some((tag) => tag.toLowerCase().startsWith('ca'))) return 'ca'
  return 'en'
}

export function t(locale: Locale, key: MessageKey, vars?: Record<string, string | number>): string {
  const raw = dictionaries[locale][key] ?? dictionaries.en[key]
  if (!vars) return raw
  return raw.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ''))
}

export function dateLocale(locale: Locale): string {
  return locale === 'ca' ? 'ca-ES' : 'en-GB'
}
