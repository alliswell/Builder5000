import { useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import TableModel from './TableModel'

function SceneCapture({ onSceneReady }) {
  const { scene } = useThree()
  useEffect(() => {
    onSceneReady(scene)
  }, [scene, onSceneReady])
  return null
}

export default function TableScene({ config, woodColor, onSceneReady, modelRef }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ fov: 45, position: [70, 50, 90], near: 0.1, far: 10000 }}
        gl={{ preserveDrawingBuffer: true }}
        shadows
      >
        <color attach="background" args={['#1a1a1a']} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[50, 80, 50]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-30, 40, -20]} intensity={0.4} />

        {/* Table geometry */}
        <TableModel ref={modelRef} {...config} woodColor={woodColor} />

        {/* Floor grid */}
        <Grid
          args={[300, 300]}
          cellColor="#444"
          sectionColor="#555"
          sectionSize={12}
          cellSize={3}
          position={[0, 0, 0]}
          fadeDistance={500}
          infiniteGrid
        />

        {/* Orbit controls */}
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={20}
          maxDistance={400}
          target={[0, 15, 0]}
        />

        {/* Capture scene reference for export */}
        <SceneCapture onSceneReady={onSceneReady} />
      </Canvas>
    </div>
  )
}
