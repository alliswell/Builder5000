import { useState, useRef, useCallback } from 'react'
import { WOOD_TYPES, FINISH_TYPES, DEFAULT_CONFIG } from './constants/woodTypes'
import TableScene from './components/TableScene'
import ConfigPanel from './components/ConfigPanel'
import { exportSceneAsGLB } from './utils/exportGLTF'

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(v => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, '0'))
    .join('')
}

function computeWoodColor(woodType, finish, customColor) {
  if (finish === 'custom') return customColor
  const wood = WOOD_TYPES.find(w => w.id === woodType)
  const finishType = FINISH_TYPES.find(f => f.id === finish)
  if (!wood || !finishType) return customColor
  const m = finishType.brightnessMultiplier
  const [r, g, b] = hexToRgb(wood.hex)
  return rgbToHex(r * m, g * m, b * m)
}

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const sceneRef = useRef(null)
  const modelRef = useRef(null)

  const woodColor = computeWoodColor(config.woodType, config.finish, config.customColor)

  const handleSceneReady = useCallback((scene) => {
    sceneRef.current = scene
  }, [])

  const handleExport = useCallback(() => {
    // Export only the table group (not grid/lights) for a clean file
    const target = modelRef.current ?? sceneRef.current
    exportSceneAsGLB(target)
  }, [])

  return (
    <div className="flex h-screen bg-neutral-900 text-neutral-100 overflow-hidden">
      {/* Config sidebar */}
      <div className="w-72 flex-shrink-0 bg-neutral-800 border-r border-neutral-700 flex flex-col">
        <ConfigPanel
          config={config}
          onChange={setConfig}
          onExport={handleExport}
          woodColor={woodColor}
        />
      </div>

      {/* 3D Viewport */}
      <div className="flex-1 relative">
        <TableScene
          config={config}
          woodColor={woodColor}
          onSceneReady={handleSceneReady}
          modelRef={modelRef}
        />

        {/* Dimension badge overlay */}
        <div className="absolute bottom-4 right-4 bg-neutral-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-neutral-400 font-mono">
          {config.width}" × {config.depth}" × {config.height}"
        </div>

        {/* Controls hint */}
        <div className="absolute top-4 right-4 bg-neutral-900/60 rounded-lg px-3 py-2 text-xs text-neutral-500">
          Drag to rotate · Scroll to zoom · Right-drag to pan
        </div>
      </div>
    </div>
  )
}
