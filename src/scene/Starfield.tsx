import { useMemo } from 'react'
import { Color } from 'three'

function randomStars(count: number, radius: number, seed: number) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const tint = new Color()
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * rand()
    const phi = Math.acos(2 * rand() - 1)
    const r = radius * (0.92 + 0.08 * rand())
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
    const shade = 0.72 + rand() * 0.28
    const roll = rand()
    if (roll > 0.94) tint.setHSL(0.08, 0.45, shade)
    else if (roll > 0.88) tint.setHSL(0.62, 0.22, shade)
    else tint.setRGB(shade, shade, shade)
    colors[i * 3] = tint.r
    colors[i * 3 + 1] = tint.g
    colors[i * 3 + 2] = tint.b
  }
  return { positions, colors }
}

export function Starfield({ radius }: { radius: number }) {
  const dim = useMemo(() => randomStars(5000, radius, 13), [radius])
  const bright = useMemo(() => randomStars(400, radius * 0.98, 97), [radius])
  const dimSize = Math.max(0.7, radius * 0.001)
  const brightSize = Math.max(1.15, radius * 0.0018)

  return (
    <group>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dim.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dim.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={dimSize}
          sizeAttenuation
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </points>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bright.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[bright.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={brightSize}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </points>
    </group>
  )
}
