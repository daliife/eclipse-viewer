import { useTexture } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, BackSide, Color, Group } from 'three'
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
  layer?: number
  eclipse?: number
}

export function CelestialBody({
  position,
  radius,
  textureUrl,
  emissive = false,
  rotationY = 0,
  atmosphere = false,
  layer,
  eclipse = 0,
}: BodyProps) {
  const map = useTexture(textureUrl)
  const root = useRef<Group>(null)
  const eclipseTint = useMemo(
    () => new Color().lerpColors(new Color('#ffffff'), new Color('#e8a090'), eclipse),
    [eclipse],
  )

  useLayoutEffect(() => {
    if (layer === undefined) return
    root.current?.traverse((obj) => obj.layers.set(layer))
  })

  return (
    <group ref={root} position={position}>
      <mesh
        rotation={[0, rotationY, 0]}
        onUpdate={(obj) => {
          if (layer !== undefined) obj.layers.set(layer)
        }}
      >
        <sphereGeometry args={[radius, 32, 24]} />
        {emissive ? (
          <meshBasicMaterial map={map} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            map={map}
            color={eclipseTint}
            roughness={0.92}
            metalness={0}
            emissive={eclipse > 0.001 ? '#7a220c' : '#000000'}
            emissiveIntensity={eclipse * 0.72}
          />
        )}
      </mesh>
      {emissive ? <SunCorona radius={radius} layer={layer} /> : null}
      {atmosphere ? <EarthAtmosphere radius={radius} layer={layer} /> : null}
    </group>
  )
}

function EarthAtmosphere({ radius, layer }: { radius: number; layer?: number }) {
  return (
    <mesh
      scale={1.045}
      renderOrder={2}
      onUpdate={(obj) => {
        if (layer !== undefined) obj.layers.set(layer)
      }}
    >
      <sphereGeometry args={[radius, 32, 24]} />
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

const CORONA_VERT = ATMOS_VERT

const CORONA_FRAG = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 5.2);
  gl_FragColor = vec4(1.0, 0.78, 0.38, fresnel * 0.95);
}
`

function SunCorona({ radius, layer }: { radius: number; layer?: number }) {
  return (
    <mesh
      scale={1.085}
      renderOrder={-1}
      onUpdate={(obj) => {
        if (layer !== undefined) obj.layers.set(layer)
      }}
    >
      <sphereGeometry args={[radius, 32, 24]} />
      <shaderMaterial
        vertexShader={CORONA_VERT}
        fragmentShader={CORONA_FRAG}
        transparent
        depthWrite={false}
        side={BackSide}
        blending={AdditiveBlending}
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
