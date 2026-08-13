import type { ReactNode } from 'react'

type IconProps = { className?: string }

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </Svg>
  )
}

export function IconMoon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
    </Svg>
  )
}

export function IconPlay(props: IconProps) {
  return (
    <Svg {...props}>
      <polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconPause(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none" />
      <rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconOrbit(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="10" ry="5" />
    </Svg>
  )
}

export function IconPlane(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 18h18M5 18 12 6l7 12" />
      <path d="M3 12h18" />
    </Svg>
  )
}

export function IconShadow(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3 4 21h16L12 3z" />
    </Svg>
  )
}

export function IconCamera(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 8h4l2-2h4l2 2h4v12H4z" />
      <circle cx="12" cy="14" r="3" />
    </Svg>
  )
}

export function IconEarth(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Svg>
  )
}

export function IconRuler(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 8h18v8H3z" />
      <path d="M7 8v4M11 8v3M15 8v4M19 8v3" />
    </Svg>
  )
}

export function IconSchool(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 10 12 4l9 6-9 6-9-6z" />
      <path d="M7 12v5c2 1.5 8 1.5 10 0v-5" />
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
