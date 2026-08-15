export type Locale = 'ca' | 'en'

const en = {
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
  solarHitTitle: 'Solar eclipse',
  solarHitBody:
    'A solar eclipse needs two things at once: a new Moon (between Earth and the Sun) and a pass through a node — one of the two red dots where its tilted orbit crosses the ecliptic. Today both are true. This one is total: the Moon looks a little larger than the Sun, so it covers the disc.',
  solarMissTitle: 'The Moon misses the Sun',
  solarMissBody:
    'Covering the Sun needs a new Moon at a node. The Moon is {deg}° off that crossing: it moves about 13° a day, and the 5° tilt sends it above or below the Sun.',
  lunarHitTitle: 'Lunar eclipse',
  lunarHitBody:
    'A lunar eclipse needs two things at once: a full Moon (Earth in the middle) and a pass through a node — one of the two red dots where its orbit crosses the ecliptic. Today both are true, so the Moon enters Earth’s shadow.',
  lunarMissTitle: 'The Moon misses Earth’s shadow',
  lunarMissBody:
    'Entering Earth’s shadow needs a full Moon at a node. The Moon is {deg}° off that crossing, so it misses the thin umbra.',
  statusHit: 'Aligned',
  statusMiss: '{deg}° off the node',
  metaDescription:
    'Interactive 3D viewer of solar and lunar eclipses. See why an eclipse happens only on one day: the Moon’s phase plus a pass through an orbital node.',
  noteDidactic: 'Distances are stretched so the 5° tilt is easy to see.',
  noteReal: 'Earth and Moon are tiny. That is why a perfect line-up is rare.',
  noteFreeCam: 'Orbit the scene without locking onto a body.',
  noteFocusSun: 'Keeps the Sun in frame while you orbit.',
  noteFocusEarth: 'Keeps Earth in frame while you orbit.',
  noteFocusMoon: 'Keeps the Moon in frame while you orbit.',
  noteOrbits: 'Paths of Earth and the Moon. The red dots are the nodes — where the Moon’s path crosses the ecliptic.',
  noteEcliptic: 'Earth’s orbital plane. The Moon’s path is tilted 5° to this.',
  noteShadows: 'Umbra cones, showing who covers whom.',
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
  tourBack: 'Back',
  tourNext: 'Next',
  tourStart: 'Start',
  tourStep: '{n} / {total}',
  tour1Title: 'Eclipse Viewer',
  tour1Body:
    'This is a classroom model of the Sun, Earth and Moon. An eclipse needs the right phase and a node — one of the two red dots on the Moon’s path.',
  tour2Title: 'Change the day',
  tour2Body:
    'Use the bottom controls to change the day. Jump the dates around the eclipse, drag Time, or press Play. A day later the Moon has already moved off the line.',
  tour3Title: 'Move around',
  tour3Body:
    'Click and drag to pan around the Sun, Earth and Moon. Use the scroll wheel to zoom in and out. On a phone, drag with one finger to rotate and pinch to zoom.',
  tour4Title: 'Look from Earth',
  tour4Body:
    'The small frame is the view from Earth — you can enlarge it. Open the settings icon in the bottom panel for solar or lunar eclipse, camera, scale, and guides.',
} as const

export type MessageKey = keyof typeof en

const ca: Record<MessageKey, string> = {
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
  solarHitTitle: 'Eclipsi solar',
  solarHitBody:
    'Perquè hi hagi eclipsi solar calen dues condicions alhora: lluna nova (entre la Terra i el Sol) i que passi per un node, un dels dos punts vermells on la seva òrbita inclinada creua l’eclíptica. Avui es compleixen totes dues. Aquest és total: la Lluna es veu una mica més gran que el Sol i en tapa el disc.',
  solarMissTitle: 'La Lluna no tapa el Sol',
  solarMissBody:
    'Per tapar el Sol calen lluna nova i node alhora. La Lluna és {deg}° fora del node: avança uns 13° cada dia, i l’òrbita inclinada 5° la fa passar per sobre o per sota del Sol.',
  lunarHitTitle: 'Eclipsi lunar',
  lunarHitBody:
    'Perquè hi hagi eclipsi lunar calen dues condicions alhora: lluna plena (la Terra al mig) i que passi per un node, un dels dos punts vermells on la seva òrbita creua l’eclíptica. Avui es compleixen totes dues, i la Lluna entra a l’ombra de la Terra.',
  lunarMissTitle: 'La Lluna no entra a l’ombra',
  lunarMissBody:
    'Per entrar a l’ombra calen lluna plena i node alhora. La Lluna és {deg}° fora del node, i no entra al con d’ombra de la Terra.',
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
  noteShadows: 'Els cons d’ombra: qui tapa qui.',
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
  tourBack: 'Enrere',
  tourNext: 'Següent',
  tourStart: 'Comença',
  tourStep: '{n} / {total}',
  tour1Title: 'Visualitzador d’eclipsis',
  tour1Body:
    'És un model didàctic del Sol, la Terra i la Lluna. Un eclipsi necessita la fase adequada i el pas per un node — un dels dos punts vermells del camí de la Lluna.',
  tour2Title: 'Canvia el dia',
  tour2Body:
    'El panell de sota serveix per canviar el dia. Salta pels dies de l’eclipsi, mou Temps o prem Reprodueix. Un dia després, la Lluna ja ha sortit de la línia.',
  tour3Title: 'Mou la vista',
  tour3Body:
    'Fes clic i arrossega per moure’t pel Sol, la Terra i la Lluna. Fes zoom amb la rodeta per apropar-te o allunyar-te. Al mòbil, un dit gira la vista i pessigar amplia.',
  tour4Title: 'Vista des de la Terra',
  tour4Body:
    'El requadre petit és la vista des de la Terra; el pots ampliar. Obre l’engranatge de sota per triar eclipsi solar o lunar, càmera, escala i guies.',
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
