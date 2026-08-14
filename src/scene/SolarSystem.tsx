import { useLayoutEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Group, PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three'
import {
  focusCameraOffset,
  framingFov,
  lunarUmbraFactor,
  type CameraFocus,
  type EclipseMode,
  type Scale,
  type ScaleMode,
  type SimState,
} from '../simulation/orbits'
import { CelestialBody, textureUrls } from './CelestialBody'
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
  const previewHide = useRef<Group>(null)
  const controls = useRef<OrbitControlsImpl>(null)
  const focusPos = useRef(new Vector3())
  const focusDest = useRef(new Vector3())
  const lastBody = useRef(new Vector3())
  const tracking = useRef<CameraFocus>('free')
  const acquiring = useRef(false)
  const { camera, size } = useThree()
  const far = scale.earthOrbit * 6
  const aspect = size.width / Math.max(1, size.height)
  const fov = framingFov(aspect)

  useLayoutEffect(() => {
    camera.layers.enable(1)
    camera.layers.enable(2)
    camera.layers.enable(3)
  }, [camera])

  useLayoutEffect(() => {
    const p = state.earth
    const offset = focusCameraOffset(scale, 'earth', aspect)
    camera.position.set(p[0] + offset[0], p[1] + offset[1], p[2] + offset[2])
    camera.near = scaleMode === 'real' ? 0.4 : 0.1
    camera.far = far
    const cam = camera as ThreePerspectiveCamera
    if (cam.isPerspectiveCamera) cam.fov = fov
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
      // From Earth's centre so Moon and Sun stay colinear and the annular ring is visible.
      cam.position.set(state.earth[0], state.earth[1], state.earth[2])
      cam.up.set(0, 1, 0)
      cam.lookAt(target[0], target[1], target[2])
      cam.near = scaleMode === 'real' ? 0.05 : 0.02
      cam.far = far
      const dist = Math.hypot(
        target[0] - cam.position.x,
        target[1] - cam.position.y,
        target[2] - cam.position.z,
      )
      const disc = mode === 'solar' ? scale.sunRadius : scale.moonRadius
      const angDeg = (2 * Math.atan(disc / Math.max(dist, 0.01)) * 180) / Math.PI
      cam.fov = Math.min(28, Math.max(0.7, angDeg * (mode === 'solar' ? 2.05 : 1.7)))
      cam.layers.set(0)
      cam.layers.enable(2)
      cam.updateProjectionMatrix()
      cam.updateMatrixWorld()
    }

    if (focus === 'free' || !controls.current) {
      tracking.current = 'free'
      acquiring.current = false
    } else {
      const p =
        focus === 'sun' ? state.sun : focus === 'earth' ? state.earth : state.moon
      const offset = focusCameraOffset(scale, focus, aspect)
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
  const moonEclipse = mode === 'lunar' ? lunarUmbraFactor(state, scale) : 0
  const moonLit = 1 - moonEclipse * 0.92
  const introPos = useRef<[number, number, number] | null>(null)
  if (!introPos.current) {
    const startAspect =
      typeof window === 'undefined' ? 1.4 : window.innerWidth / Math.max(1, window.innerHeight)
    const offset = focusCameraOffset(scale, 'earth', startAspect)
    introPos.current = [
      state.earth[0] + offset[0],
      state.earth[1] + offset[1],
      state.earth[2] + offset[2],
    ]
  }

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight
        intensity={0.04}
        onUpdate={(light) => {
          light.layers.set(0)
          light.layers.enable(3)
        }}
      />
      <pointLight
        position={[0, 0, 0]}
        color="#fff6e8"
        intensity={5.8}
        decay={0}
        distance={0}
        onUpdate={(light) => {
          light.layers.set(0)
          light.layers.enable(3)
        }}
      />
      <pointLight
        position={[0, 0, 0]}
        color={moonEclipse > 0.04 ? '#ff7a45' : '#fff6e8'}
        intensity={5.8 * moonLit}
        decay={0}
        distance={0}
        onUpdate={(light) => light.layers.set(2)}
      />
      <Starfield radius={scale.earthOrbit * 3.2} />

      <CelestialBody position={state.sun} radius={scale.sunRadius} textureUrl={textures.sun} emissive />

      <group ref={previewHide}>
        <CelestialBody
          position={state.earth}
          radius={scale.earthRadius}
          textureUrl={textures.earth}
          rotationY={earthSpin}
          atmosphere
          layer={3}
        />
        <OrbitRings earth={state.earth} visible={showOrbits} scale={scale} />
        <EclipticPlane visible={showEcliptic} scale={scale} />
        <ShadowCones state={state} visible={showShadows} emphasize={mode === 'lunar'} scale={scale} />
      </group>
      <CelestialBody
        position={state.moon}
        radius={scale.moonRadius}
        textureUrl={textures.moon}
        layer={2}
        eclipse={moonEclipse}
      />

      <PerspectiveCamera
        makeDefault
        position={introPos.current}
        fov={fov}
        near={scaleMode === 'real' ? 0.4 : 0.1}
        far={far}
      />
      <OrbitControls
        ref={controls}
        enableDamping
        dampingFactor={0.08}
        enablePan={size.width >= 720}
        minDistance={scale.earthRadius * 1.4}
        maxDistance={scale.earthOrbit * 3.2}
        rotateSpeed={size.width < 720 ? 0.72 : 0.9}
        zoomSpeed={size.width < 720 ? 0.7 : 0.9}
      />

      <PerspectiveCamera ref={earthCam} fov={24} />
      <DualViewport insetRef={insetRef} earthCamRef={earthCam} hideRootRef={previewHide} />
    </>
  )
}

function DualViewport({
  insetRef,
  earthCamRef,
  hideRootRef,
}: {
  insetRef: RefObject<HTMLElement | null>
  earthCamRef: RefObject<ThreePerspectiveCamera | null>
  hideRootRef: RefObject<Group | null>
}) {
  const gl = useThree((s) => s.gl)

  useFrame((state) => {
    const { scene, camera, gl: renderer, size } = state
    renderer.autoClear = true
    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, size.width, size.height)
    renderer.clear()
    renderer.render(scene, camera)

    const earthCam = earthCamRef.current
    const inset = insetRef.current
    if (!earthCam || !inset) return

    const canvasRect = renderer.domElement.getBoundingClientRect()
    const rect = inset.getBoundingClientRect()
    const left = Math.round(rect.left - canvasRect.left)
    const bottom = Math.round(canvasRect.bottom - rect.bottom)
    const width = Math.round(rect.width)
    const height = Math.round(rect.height)
    if (width < 2 || height < 2) return

    earthCam.aspect = width / height
    earthCam.updateProjectionMatrix()
    earthCam.updateMatrixWorld()

    const hidden = hideRootRef.current
    const wasVisible = hidden?.visible ?? true
    if (hidden) hidden.visible = false

    renderer.setClearColor('#000000', 1)
    renderer.autoClear = false
    renderer.setScissorTest(true)
    renderer.setScissor(left, bottom, width, height)
    renderer.setViewport(left, bottom, width, height)
    renderer.clear(true, true, false)
    renderer.render(scene, earthCam)

    if (hidden) hidden.visible = wasVisible
    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, size.width, size.height)
    renderer.autoClear = true
  }, 1)

  useLayoutEffect(() => {
    return () => {
      gl.setScissorTest(false)
      gl.setViewport(0, 0, gl.domElement.clientWidth, gl.domElement.clientHeight)
      gl.autoClear = true
    }
  }, [gl])

  return null
}
