import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
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

function moonOrbitTangent(toSun: Vec3, inclinationDeg: number): Vector3 {
  const axis = new Vector3(toSun[0], toSun[1], toSun[2]).normalize()
  const alongTrack = new Vector3(0, 1, 0).cross(axis).normalize()
  const tiltedUp = axis.clone().cross(alongTrack)
  const i = (inclinationDeg * Math.PI) / 180
  return alongTrack.multiplyScalar(Math.cos(i)).add(tiltedUp.multiplyScalar(Math.sin(i))).normalize()
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
      <torusGeometry args={[radius, tube, 8, 128]} />
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

  const earthTube = scale.earthRadius * 0.005
  const moonTube = scale.earthRadius * 0.0045

  return (
    <HelperGroup>
      <group visible={visible}>
        <OrbitTube
          radius={scale.earthOrbit}
          tube={earthTube}
          color="#7eb4d6"
          opacity={0.32}
          quaternion={earthQuat}
        />
        <OrbitTube
          radius={scale.moonOrbit}
          tube={moonTube}
          color="#c8d0da"
          opacity={0.5}
          quaternion={moonQuat}
          position={earth}
        />
        <OrbitNodes
          earth={earth}
          toSun={toSun}
          scale={scale}
          tangent={moonOrbitTangent(toSun, scale.moonInclinationDeg)}
        />
      </group>
    </HelperGroup>
  )
}

function OrbitNodes({
  earth,
  toSun,
  scale,
  tangent,
}: {
  earth: Vec3
  toSun: Vec3
  scale: Scale
  tangent: Vector3
}) {
  const r = scale.moonOrbit
  const size = Math.max(scale.earthRadius * 0.028, scale.moonOrbit * 0.006)
  const tube = Math.max(scale.earthRadius * 0.004, size * 0.12)
  const quat = quatFromNormal(tangent)
  const a: Vec3 = [earth[0] + toSun[0] * r, earth[1] + toSun[1] * r, earth[2] + toSun[2] * r]
  const b: Vec3 = [earth[0] - toSun[0] * r, earth[1] - toSun[1] * r, earth[2] - toSun[2] * r]
  return (
    <>
      <NodeMark position={a} radius={size} tube={tube} quaternion={quat} />
      <NodeMark position={b} radius={size} tube={tube} quaternion={quat} />
    </>
  )
}

function NodeMark({
  position,
  radius,
  tube,
  quaternion,
}: {
  position: Vec3
  radius: number
  tube: number
  quaternion: Quaternion
}) {
  return (
    <mesh position={position} quaternion={quaternion} renderOrder={3}>
      <torusGeometry args={[radius, tube, 8, 40]} />
      <meshBasicMaterial color="#e8b44a" transparent opacity={0.85} depthWrite={false} />
    </mesh>
  )
}

export function EclipticPlane({ visible, scale }: { visible: boolean; scale: Scale }) {
  return (
    <HelperGroup>
      <mesh rotation={[-Math.PI / 2, 0, 0]} visible={visible} renderOrder={0}>
        <circleGeometry args={[scale.earthOrbit * 1.12, 48]} />
        <meshBasicMaterial
          color="#8a9098"
          transparent
          opacity={0.028}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
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
