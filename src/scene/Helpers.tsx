import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { Line } from '@react-three/drei'
import { Group, Quaternion, Vector3, DoubleSide } from 'three'
import {
  type Scale,
  type SimState,
  type Vec3,
  sunDirectionFromEarth,
  umbraLength,
} from '../simulation/orbits'

function HelperGroup({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null)
  useLayoutEffect(() => {
    ref.current?.traverse((obj) => {
      obj.layers.set(1)
    })
  })
  return <group ref={ref}>{children}</group>
}

function quatFromNormal(normal: Vector3): Quaternion {
  return new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), normal.clone().normalize())
}

function moonOrbitNormal(toSun: Vec3, inclinationDeg: number): Vector3 {
  const axis = new Vector3(toSun[0], toSun[1], toSun[2]).normalize()
  return new Vector3(0, 1, 0).applyAxisAngle(axis, (inclinationDeg * Math.PI) / 180)
}

function OrbitTube({
  radius,
  tube,
  color,
  opacity,
  quaternion,
  position,
}: {
  radius: number
  tube: number
  color: string
  opacity: number
  quaternion?: Quaternion
  position?: Vec3
}) {
  return (
    <mesh position={position} quaternion={quaternion} renderOrder={2}>
      <torusGeometry args={[radius, tube, 8, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-2}
      />
    </mesh>
  )
}

function circlePoints(radius: number, segments: number): [number, number, number][] {
  const pts: [number, number, number][] = []
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push([Math.cos(a) * radius, Math.sin(a) * radius, 0])
  }
  return pts
}

function orbitSegments(radius: number) {
  if (radius > 1000) return 768
  if (radius > 40) return 256
  return 192
}

function OrbitLine({
  radius,
  color,
  lineWidth,
  quaternion,
  position,
}: {
  radius: number
  color: string
  lineWidth: number
  quaternion?: Quaternion
  position?: Vec3
}) {
  const points = useMemo(() => circlePoints(radius, orbitSegments(radius)), [radius])
  return (
    <group position={position} quaternion={quaternion} renderOrder={2}>
      <Line
        points={points}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
        depthWrite={false}
        transparent={false}
      />
    </group>
  )
}

export function OrbitRings({
  earth,
  visible,
  scale,
}: {
  earth: Vec3
  visible: boolean
  scale: Scale
}) {
  const toSun = sunDirectionFromEarth(earth)
  const moonQuat = useMemo(
    () => quatFromNormal(moonOrbitNormal(toSun, scale.moonInclinationDeg)),
    [toSun[0], toSun[1], toSun[2], scale.moonInclinationDeg],
  )
  const earthQuat = useMemo(() => quatFromNormal(new Vector3(0, 1, 0)), [])
  const realistic = isRealisticScale(scale)

  return (
    <HelperGroup>
      <group visible={visible}>
        <OrbitLine
          radius={scale.earthOrbit}
          color={realistic ? '#6ea6d4' : '#5d8aaa'}
          lineWidth={realistic ? 2.4 : 1.7}
          quaternion={earthQuat}
        />
        <OrbitLine
          radius={scale.moonOrbit}
          color={realistic ? '#cfd8e2' : '#8b959f'}
          lineWidth={realistic ? 2.6 : 2}
          quaternion={moonQuat}
          position={earth}
        />
        <OrbitNodes earth={earth} toSun={toSun} scale={scale} realistic={realistic} />
      </group>
    </HelperGroup>
  )
}

function isRealisticScale(scale: Scale) {
  return scale.earthOrbit > scale.earthRadius * 200
}

function nodeRadius(scale: Scale, realistic: boolean) {
  // Classroom: easy to spot on the compressed Moon orbit.
  // Realistic: a pin next to Earth/Moon, not a second planet.
  return realistic ? scale.moonRadius * 0.22 : scale.earthRadius * 0.085
}

function OrbitNodes({
  earth,
  toSun,
  scale,
  realistic,
}: {
  earth: Vec3
  toSun: Vec3
  scale: Scale
  realistic: boolean
}) {
  const r = scale.moonOrbit
  const size = nodeRadius(scale, realistic)
  const a: Vec3 = [earth[0] + toSun[0] * r, earth[1] + toSun[1] * r, earth[2] + toSun[2] * r]
  const b: Vec3 = [earth[0] - toSun[0] * r, earth[1] - toSun[1] * r, earth[2] - toSun[2] * r]
  return (
    <>
      <NodeMark position={a} radius={size} />
      <NodeMark position={b} radius={size} />
    </>
  )
}

function NodeMark({ position, radius }: { position: Vec3; radius: number }) {
  return (
    <mesh position={position} renderOrder={3}>
      <sphereGeometry args={[radius, 20, 16]} />
      <meshBasicMaterial color="#e44545" depthWrite={false} />
    </mesh>
  )
}

export function EclipticPlane({ visible, scale }: { visible: boolean; scale: Scale }) {
  const radius = scale.earthOrbit * 1.12
  const rim = Math.max(scale.earthRadius * 0.007, scale.earthOrbit * 0.0014)
  const discQuat = useMemo(() => quatFromNormal(new Vector3(0, 1, 0)), [])

  return (
    <HelperGroup>
      <group visible={visible}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={0}>
          <circleGeometry args={[radius, 72]} />
          <meshBasicMaterial
            color="#93a6bb"
            transparent
            opacity={0.075}
            side={DoubleSide}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>
        <OrbitTube radius={radius * 0.62} tube={rim * 0.55} color="#9aadc0" opacity={0.16} quaternion={discQuat} />
        <OrbitTube radius={radius} tube={rim} color="#c5d4e2" opacity={0.45} quaternion={discQuat} />
      </group>
    </HelperGroup>
  )
}

export function ShadowCones({
  state,
  visible,
  emphasize,
  scale,
}: {
  state: SimState
  visible: boolean
  emphasize: boolean
  scale: Scale
}) {
  const dist = Math.hypot(state.earth[0], state.earth[2]) || 1
  const dir: Vec3 = [state.earth[0] / dist, 0, state.earth[2] / dist]
  const umbraLen = umbraLength(scale)
  const opacity = emphasize ? 0.22 : 0.08

  return (
    <HelperGroup>
      <group visible={visible}>
        <ConeAlong
          origin={state.earth}
          direction={dir}
          length={umbraLen}
          radius={scale.earthRadius * 0.95}
          color="#5b8cff"
          opacity={opacity}
        />
        <ConeAlong
          origin={state.earth}
          direction={dir}
          length={umbraLen * 1.6}
          radius={scale.earthRadius * 1.55}
          color="#9bb7ff"
          opacity={opacity * 0.5}
        />
      </group>
    </HelperGroup>
  )
}

function ConeAlong({
  origin,
  direction,
  length,
  radius,
  color,
  opacity,
}: {
  origin: Vec3
  direction: Vec3
  length: number
  radius: number
  color: string
  opacity: number
}) {
  const pos: Vec3 = [
    origin[0] + direction[0] * (length / 2),
    origin[1] + direction[1] * (length / 2),
    origin[2] + direction[2] * (length / 2),
  ]
  const quaternion = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    new Vector3(direction[0], direction[1], direction[2]).normalize(),
  )
  return (
    <mesh position={pos} quaternion={quaternion}>
      <coneGeometry args={[radius, length, 24, 1, true]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={DoubleSide} depthWrite={false} />
    </mesh>
  )
}
