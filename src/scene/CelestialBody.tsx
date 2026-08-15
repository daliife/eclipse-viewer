import { useTexture } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, BackSide, Color, Group, Vector3 } from 'three'
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

type SolarShadow = {
  moon: Vec3
  moonRadius: number
  sunRadius: number
}

type BodyProps = {
  position: Vec3
  radius: number
  textureUrl: string
  emissive?: boolean
  rotationY?: number
  atmosphere?: boolean
  layer?: number
  eclipse?: number
  solarShadow?: SolarShadow
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
  solarShadow,
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
      {solarShadow ? (
        <EarthSolarShadow
          earthRadius={radius}
          moon={solarShadow.moon}
          moonRadius={solarShadow.moonRadius}
          sunRadius={solarShadow.sunRadius}
          layer={layer}
        />
      ) : null}
    </group>
  )
}

const SHADOW_VERT = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const SHADOW_FRAG = /* glsl */ `
uniform vec3 uMoonPos;
uniform float uMoonRadius;
uniform float uSunRadius;
varying vec3 vWorldPos;
varying vec3 vNormal;
void main() {
  vec3 P = vWorldPos;
  vec3 sunDir = normalize(-P);
  if (dot(normalize(vNormal), sunDir) < 0.04) discard;

  vec3 toMoon = uMoonPos - P;
  float moonDist = length(toMoon);
  float sunDist = length(P);
  if (moonDist < 1e-4 || moonDist > sunDist) discard;

  vec3 moonDir = toMoon / moonDist;
  if (dot(moonDir, sunDir) < 0.12) discard;

  float moonAng = asin(clamp(uMoonRadius / moonDist, 0.0, 0.999));
  float sunAng = asin(clamp(uSunRadius / sunDist, 0.0, 0.999));
  float sep = acos(clamp(dot(moonDir, sunDir), -1.0, 1.0));
  float outer = sunAng + moonAng;
  if (sep > outer) discard;

  float inner = abs(moonAng - sunAng);
  float umbra = 1.0 - smoothstep(0.0, inner * 0.9 + 0.01, sep);
  float penumbra = 1.0 - smoothstep(inner, outer, sep);
  float shade = max(umbra * 0.9, penumbra * 0.4);
  if (shade < 0.03) discard;
  gl_FragColor = vec4(0.01, 0.03, 0.08, shade);
}
`

function EarthSolarShadow({
  earthRadius,
  moon,
  moonRadius,
  sunRadius,
  layer,
}: {
  earthRadius: number
  moon: Vec3
  moonRadius: number
  sunRadius: number
  layer?: number
}) {
  const uniforms = useMemo(
    () => ({
      uMoonPos: { value: new Vector3() },
      uMoonRadius: { value: 1 },
      uSunRadius: { value: 1 },
    }),
    [],
  )
  uniforms.uMoonPos.value.set(moon[0], moon[1], moon[2])
  uniforms.uMoonRadius.value = moonRadius
  uniforms.uSunRadius.value = sunRadius

  return (
    <mesh
      scale={1.006}
      renderOrder={1}
      onUpdate={(obj) => {
        if (layer !== undefined) obj.layers.set(layer)
      }}
    >
      <sphereGeometry args={[earthRadius, 48, 32]} />
      <shaderMaterial
        vertexShader={SHADOW_VERT}
        fragmentShader={SHADOW_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-2}
      />
    </mesh>
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
