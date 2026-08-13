import { useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import { BackSide, Color } from 'three'
import type { Vec3 } from '../simulation/orbits'

const BASE = import.meta.env.BASE_URL

const ATMOS_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const ATMOS_FRAG = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.35);
  gl_FragColor = vec4(0.28, 0.55, 1.0, fresnel * 0.78);
}
`

type BodyProps = {
  position: Vec3
  radius: number
  textureUrl: string
  emissive?: boolean
  rotationY?: number
  atmosphere?: boolean
  moonLayer?: number
  eclipse?: number
}

export function CelestialBody({
  position,
  radius,
  textureUrl,
  emissive = false,
  rotationY = 0,
  atmosphere = false,
  moonLayer,
  eclipse = 0,
}: BodyProps) {
  const map = useTexture(textureUrl)
  const eclipseColor = useMemo(
    () => new Color().lerpColors(new Color('#ffffff'), new Color('#4a2a22'), eclipse),
    [eclipse],
  )

  return (
    <group
      position={position}
      onUpdate={(obj) => {
        if (moonLayer === undefined) return
        obj.traverse((child) => child.layers.set(moonLayer))
      }}
    >
      <mesh rotation={[0, rotationY, 0]}>
        <sphereGeometry args={[radius, 64, 48]} />
        {emissive ? (
          <meshBasicMaterial map={map} />
        ) : eclipse > 0.04 ? (
          <meshStandardMaterial
            map={map}
            color={eclipseColor}
            roughness={0.9}
            metalness={0}
            emissive="#7a220c"
            emissiveIntensity={0.18 + eclipse * 0.5}
          />
        ) : (
          <meshStandardMaterial map={map} roughness={0.9} metalness={0} />
        )}
      </mesh>
      {atmosphere ? <EarthAtmosphere radius={radius} /> : null}
    </group>
  )
}

function EarthAtmosphere({ radius }: { radius: number }) {
  return (
    <mesh scale={1.045} renderOrder={2}>
      <sphereGeometry args={[radius, 48, 32]} />
      <shaderMaterial
        vertexShader={ATMOS_VERT}
        fragmentShader={ATMOS_FRAG}
        transparent
        depthWrite={false}
        side={BackSide}
        toneMapped={false}
      />
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
