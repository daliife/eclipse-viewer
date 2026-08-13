import type { ReactNode } from 'react'

export type IconProps = { className?: string }

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function IconSun(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
    </Svg>
  )
}

export function IconMoon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M20 14.2A8.2 8.2 0 1 1 9.8 4 6.6 6.6 0 0 0 20 14.2z"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  )
}

export function IconPlay(props: IconProps) {
  return (
    <Svg {...props}>
      <polygon points="7 5 19 12 7 19" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconPause(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconOrbit(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.6" />
    </Svg>
  )
}

export function IconPlane(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="12" rx="10" ry="4.5" />
      <path d="M2 12h20" />
    </Svg>
  )
}

export function IconShadow(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3 21 21H3z" fill="currentColor" fillOpacity="0.22" />
      <path d="M12 3 21 21H3z" />
      <path d="M12 9v12" />
    </Svg>
  )
}

export function IconCamera(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8 9.6 5.5h4.8L16 8" />
      <circle cx="12" cy="14" r="3" />
    </Svg>
  )
}

export function IconEarth(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
    </Svg>
  )
}

export function IconRuler(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 15 15 5l4 4-10 10-4-4z" />
      <path d="M8 12l2 2M11 9l2 2M14 6l2 2" />
    </Svg>
  )
}

export function IconSchool(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 11 12 6l9 5-9 5-9-5z" fill="currentColor" fillOpacity="0.22" />
      <path d="M3 11 12 6l9 5-9 5-9-5z" />
      <path d="M7 13.2V17c2.2 1.4 7.8 1.4 10 0v-3.8" />
    </Svg>
  )
}

export function IconExpand(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 3H3v6M15 3h6v6M21 15v6h-6M3 15v6h6" />
    </Svg>
  )
}

export function IconCollapse(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 3v6H3M15 3v6h6M21 15h-6v6M3 15h6v6" />
    </Svg>
  )
}

export function IconInfo(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 8h.01" />
    </Svg>
  )
}

export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </Svg>
  )
}

export function IconChevron(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 5l7 7-7 7" />
    </Svg>
  )
}
