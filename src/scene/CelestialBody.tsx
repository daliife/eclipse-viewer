import { useTexture } from '@react-three/drei'
import { AdditiveBlending, BackSide } from 'three'
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
        <meshStandardMaterial map={map} roughness={0.78} metalness={0} />
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

export function Glow({ position, radius }: { position: Vec3; radius: number }) {
  return (
    <>
      <mesh position={position} renderOrder={1}>
        <sphereGeometry args={[radius * 1.12, 24, 16]} />
        <meshBasicMaterial
          color="#ffd38a"
          transparent
          opacity={0.28}
          blending={AdditiveBlending}
          depthWrite={false}
          side={BackSide}
        />
      </mesh>
      <mesh position={position} renderOrder={1}>
        <sphereGeometry args={[radius * 1.7, 24, 16]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          depthWrite={false}
          side={BackSide}
        />
      </mesh>
    </>
  )
}
