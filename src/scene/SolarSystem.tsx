import { useLayoutEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three'
import {
  focusCameraOffset,
  type CameraFocus,
  type EclipseMode,
  type Scale,
  type ScaleMode,
  type SimState,
} from '../simulation/orbits'
import { CelestialBody, Glow, textureUrls } from './CelestialBody'
import { EclipticPlane, OrbitRings, ShadowCones } from './Helpers'
import { Starfield } from './Starfield'

type Props = {
  mode: EclipseMode
  scaleMode: ScaleMode
  scale: Scale
  state: SimState
  simDays: number
  playing: boolean
  speed: number
  onSimDays: (value: number | ((prev: number) => number)) => void
  showOrbits: boolean
  showEcliptic: boolean
  showShadows: boolean
  focus: CameraFocus
  insetRef: RefObject<HTMLElement | null>
}

const textures = textureUrls()

export function SolarSystem({
  mode,
  scaleMode,
  scale,
  state,
  simDays,
  playing,
  speed,
  onSimDays,
  showOrbits,
  showEcliptic,
  showShadows,
  focus,
  insetRef,
}: Props) {
  const earthCam = useRef<ThreePerspectiveCamera>(null)
  const controls = useRef<OrbitControlsImpl>(null)
  const focusPos = useRef(new Vector3())
  const focusDest = useRef(new Vector3())
  const lastBody = useRef(new Vector3())
  const tracking = useRef<CameraFocus>('free')
  const acquiring = useRef(false)
  const { camera } = useThree()
  const far = scale.earthOrbit * 6

  useLayoutEffect(() => {
    camera.layers.enable(1)
  }, [camera])

  useLayoutEffect(() => {
    const p = state.earth
    const offset = focusCameraOffset(scale, 'earth')
    camera.position.set(p[0] + offset[0], p[1] + offset[1], p[2] + offset[2])
    camera.near = scaleMode === 'real' ? 0.4 : 0.1
    camera.far = far
    camera.updateProjectionMatrix()
    tracking.current = 'earth'
    acquiring.current = false
    lastBody.current.set(p[0], p[1], p[2])
    if (controls.current) {
      controls.current.target.set(p[0], p[1], p[2])
      controls.current.minDistance = scale.earthRadius * 1.4
      controls.current.maxDistance = scale.earthOrbit * 3.2
      controls.current.update()
    }
    // Snap only when the scale preset changes, not every simulation tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scaleMode])

  useFrame((_, dt) => {
    if (playing) {
      onSimDays((d) => {
        let next = d + dt * speed
        if (next > 2.5) next = -2.5
        if (next < -2.5) next = 2.5
        return next
      })
    }

    const cam = earthCam.current
    if (cam) {
      const target = mode === 'solar' ? state.sun : state.moon
      const dx = target[0] - state.earth[0]
      const dy = target[1] - state.earth[1]
      const dz = target[2] - state.earth[2]
      const n = Math.hypot(dx, dy, dz) || 1
      const ux = dx / n
      const uy = dy / n
      const uz = dz / n
      const r = scale.earthRadius * 1.06
      // Offset past the Moon's disc so the Sun stays visible (didactic bodies are huge on the sky).
      const shift =
        mode === 'solar'
          ? scaleMode === 'real'
            ? scale.earthRadius * 0.08
            : scale.moonRadius * 1.85
          : 0
      const tx = -uz
      const tz = ux
      const tlen = Math.hypot(tx, tz) || 1
      cam.position.set(
        state.earth[0] + ux * r + (tx / tlen) * shift,
        state.earth[1] + uy * r,
        state.earth[2] + uz * r + (tz / tlen) * shift,
      )
      cam.lookAt(target[0], target[1], target[2])
      cam.near = scaleMode === 'real' ? 0.05 : 0.02
      cam.far = far
      cam.fov = scaleMode === 'real' ? 2.2 : mode === 'solar' ? 48 : 40
      cam.updateProjectionMatrix()
      cam.updateMatrixWorld()
    }

    if (focus === 'free' || !controls.current) {
      tracking.current = 'free'
      acquiring.current = false
    } else {
      const p =
        focus === 'sun' ? state.sun : focus === 'earth' ? state.earth : state.moon
      const offset = focusCameraOffset(scale, focus)
      focusPos.current.set(p[0], p[1], p[2])

      if (tracking.current !== focus) {
        tracking.current = focus
        acquiring.current = true
        lastBody.current.copy(focusPos.current)
      }

      if (acquiring.current) {
        focusDest.current.set(p[0] + offset[0], p[1] + offset[1], p[2] + offset[2])
        camera.position.lerp(focusDest.current, 0.12)
        controls.current.target.lerp(focusPos.current, 0.12)
        lastBody.current.copy(focusPos.current)
        if (camera.position.distanceTo(focusDest.current) < Math.max(0.12, Math.hypot(...offset) * 0.04)) {
          acquiring.current = false
        }
      } else {
        camera.position.x += focusPos.current.x - lastBody.current.x
        camera.position.y += focusPos.current.y - lastBody.current.y
        camera.position.z += focusPos.current.z - lastBody.current.z
        controls.current.target.copy(focusPos.current)
        lastBody.current.copy(focusPos.current)
      }

      controls.current.minDistance = scale.earthRadius * 1.4
      controls.current.maxDistance = scale.earthOrbit * 3.2
      controls.current.update()
    }
  })

  const earthSpin = simDays * Math.PI * 2
  const introPos = useRef<[number, number, number] | null>(null)
  if (!introPos.current) {
    const offset = focusCameraOffset(scale, 'earth')
    introPos.current = [
      state.earth[0] + offset[0],
      state.earth[1] + offset[1],
      state.earth[2] + offset[2],
    ]
  }

  return (
    <>
      <color attach="background" args={['#010309']} />
      <ambientLight intensity={0.12} />
      <pointLight position={[0, 0, 0]} intensity={4} decay={0} distance={0} />
      <Starfield radius={scale.earthOrbit * 3.2} />

      <CelestialBody position={state.sun} radius={scale.sunRadius} textureUrl={textures.sun} emissive />
      <Glow position={state.sun} radius={scale.sunRadius * 1.18} color="#ffc56a" />

      <CelestialBody
        position={state.earth}
        radius={scale.earthRadius}
        textureUrl={textures.earth}
        rotationY={earthSpin}
      />
      <CelestialBody position={state.moon} radius={scale.moonRadius} textureUrl={textures.moon} />

      <OrbitRings earth={state.earth} visible={showOrbits} scale={scale} />
      <EclipticPlane visible={showEcliptic} scale={scale} />
      <ShadowCones state={state} visible={showShadows} emphasize={mode === 'lunar'} scale={scale} />

      <PerspectiveCamera
        makeDefault
        position={introPos.current}
        fov={42}
        near={scaleMode === 'real' ? 0.4 : 0.1}
        far={far}
      />
      <OrbitControls
        ref={controls}
        enableDamping
        dampingFactor={0.08}
        enablePan
        minDistance={scale.earthRadius * 1.4}
        maxDistance={scale.earthOrbit * 3.2}
      />

      <PerspectiveCamera ref={earthCam} fov={24} />
      <DualViewport insetRef={insetRef} earthCamRef={earthCam} />
    </>
  )
}

function DualViewport({
  insetRef,
  earthCamRef,
}: {
  insetRef: RefObject<HTMLElement | null>
  earthCamRef: RefObject<ThreePerspectiveCamera | null>
}) {
  const gl = useThree((s) => s.gl)

  useFrame((state) => {
    const { scene, camera, gl: renderer, size } = state
    const canvas = renderer.domElement
    renderer.autoClear = true
    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, size.width, size.height)
    renderer.clear()
    renderer.render(scene, camera)

    const earthCam = earthCamRef.current
    const inset = insetRef.current
    if (!earthCam || !inset) return

    const canvasRect = canvas.getBoundingClientRect()
    const rect = inset.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    if (width < 2 || height < 2) return

    const left = rect.left - canvasRect.left
    const bottom = canvasRect.bottom - rect.bottom

    earthCam.aspect = width / height
    earthCam.updateProjectionMatrix()
    earthCam.updateMatrixWorld()

    renderer.setScissorTest(true)
    renderer.setScissor(left, bottom, width, height)
    renderer.setViewport(left, bottom, width, height)
    renderer.autoClear = false
    renderer.clear(true, true, false)
    renderer.render(scene, earthCam)
    renderer.setScissorTest(false)
    renderer.autoClear = true
  }, 1)

  useLayoutEffect(() => {
    return () => {
      gl.setScissorTest(false)
      gl.autoClear = true
    }
  }, [gl])

  return null
}
