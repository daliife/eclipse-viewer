import { useTexture } from '@react-three/drei'
import { DoubleSide, type ColorRepresentation } from 'three'
import type { Vec3 } from '../simulation/orbits'

const BASE = import.meta.env.BASE_URL

type BodyProps = {
  position: Vec3
  radius: number
  textureUrl: string
  emissive?: boolean
  rotationY?: number
}

export function CelestialBody({
  position,
  radius,
  textureUrl,
  emissive = false,
  rotationY = 0,
}: BodyProps) {
  const map = useTexture(textureUrl)

  return (
    <mesh position={position} rotation={[0, rotationY, 0]}>
      <sphereGeometry args={[radius, 64, 48]} />
      {emissive ? (
        <meshBasicMaterial map={map} />
      ) : (
        <meshStandardMaterial map={map} roughness={1} metalness={0} />
      )}
    </mesh>
  )
}

export function textureUrls() {
  return {
    sun: `${BASE}textures/sun.jpg`,
    earth: `${BASE}textures/earth.jpg`,
    moon: `${BASE}textures/moon.jpg`,
  }
}

export function Glow({
  position,
  radius,
  color,
}: {
  position: Vec3
  radius: number
  color: ColorRepresentation
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 32, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.18} side={DoubleSide} depthWrite={false} />
    </mesh>
  )
}
