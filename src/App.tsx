import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState } from 'react'
import { SolarSystem } from './scene/SolarSystem'
import {
  getScale,
  getSimState,
  type CameraFocus,
  type EclipseMode,
  type ScaleMode,
} from './simulation/orbits'
import { Controls } from './ui/Controls'
import { EducationPanel } from './ui/EducationPanel'
import { InsetFrame } from './ui/InsetFrame'
import { WelcomeTour } from './ui/WelcomeTour'
import './App.css'

export default function App() {
  const insetRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<EclipseMode>('solar')
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(0.5)
  const [simDays, setSimDays] = useState(0)
  const [focus, setFocus] = useState<CameraFocus>('earth')
  const [showOrbits, setShowOrbits] = useState(true)
  const [showEcliptic, setShowEcliptic] = useState(true)
  const [showShadows, setShowShadows] = useState(false)
  const [scaleMode, setScaleMode] = useState<ScaleMode>('didactic')
  const [insetLarge, setInsetLarge] = useState(false)

  const scale = getScale(scaleMode)
  const state = useMemo(() => getSimState(mode, simDays, scale), [mode, simDays, scale])

  return (
    <div className="app">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, stencil: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000')
        }}
      >
        <Suspense fallback={null}>
          <SolarSystem
            mode={mode}
            scaleMode={scaleMode}
            scale={scale}
            state={state}
            simDays={simDays}
            playing={playing}
            speed={speed}
            onSimDays={setSimDays}
            showOrbits={showOrbits}
            showEcliptic={showEcliptic}
            showShadows={showShadows}
            focus={focus}
            insetRef={insetRef}
          />
        </Suspense>
      </Canvas>

      <EducationPanel
        mode={mode}
        simDays={simDays}
        degreesFromAlignment={state.degreesFromAlignment}
      />
      <Controls
        mode={mode}
        onMode={(next) => {
          setMode(next)
          setSimDays(0)
          setFocus('earth')
        }}
        playing={playing}
        onPlaying={setPlaying}
        speed={speed}
        onSpeed={setSpeed}
        simDays={simDays}
        onSimDays={setSimDays}
        focus={focus}
        onFocus={setFocus}
        showOrbits={showOrbits}
        onShowOrbits={setShowOrbits}
        showEcliptic={showEcliptic}
        onShowEcliptic={setShowEcliptic}
        showShadows={showShadows}
        onShowShadows={setShowShadows}
        scaleMode={scaleMode}
        onScaleMode={(next) => {
          setScaleMode(next)
          setFocus('earth')
        }}
      />
      <InsetFrame
        mode={mode}
        insetRef={insetRef}
        enlarged={insetLarge}
        onToggle={() => setInsetLarge((open) => !open)}
      />
      <WelcomeTour />
    </div>
  )
}
