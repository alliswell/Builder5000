import { useState, useRef, useCallback, useEffect } from 'react'
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

// Inside a claude.ai artifact, saving a file goes through the viewer's
// downloads capability; elsewhere a plain browser download works.
const inArtifact = !!window.claude?.use

function exportHintFor(downloads) {
  if (!inArtifact) return 'Import in SketchUp 2021+ via File > Import'
  if (downloads) return 'Saves table.zip. Unzip it, then import table.glb in SketchUp 2021+ via File > Import'
  return 'Downloads aren’t available in this view'
}

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [downloads, setDownloads] = useState(null)
  const sceneRef = useRef(null)
  const modelRef = useRef(null)

  const woodColor = computeWoodColor(config.woodType, config.finish, config.customColor)

  useEffect(() => {
    if (inArtifact) window.claude.use('downloads').then(setDownloads)
  }, [])

  const handleSceneReady = useCallback((scene) => {
    sceneRef.current = scene
  }, [])

  const handleExport = useCallback(() => {
    // Export only the table group (not grid/lights) for a clean file
    const target = modelRef.current ?? sceneRef.current
    exportSceneAsGLB(target, downloads)
  }, [downloads])

  return (
    <div className="flex flex-col md:flex-row h-full bg-neutral-900 text-neutral-100 overflow-hidden">
      {/* Config sidebar (below the viewport on narrow screens) */}
      <div className="order-2 md:order-1 flex-1 min-h-0 md:flex-none md:w-72 bg-neutral-800 border-t md:border-t-0 md:border-r border-neutral-700 flex flex-col">
        <ConfigPanel
          config={config}
          onChange={setConfig}
          onExport={handleExport}
          canExport={!inArtifact || !!downloads}
          exportHint={exportHintFor(downloads)}
          woodColor={woodColor}
        />
      </div>

      {/* 3D Viewport */}
      <div className="order-1 md:order-2 h-[45%] flex-shrink-0 md:h-auto md:flex-1 relative">
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
        <div className="hidden md:block absolute top-4 right-4 bg-neutral-900/60 rounded-lg px-3 py-2 text-xs text-neutral-500">
          Drag to rotate · Scroll to zoom · Right-drag to pan
        </div>
      </div>
    </div>
  )
}
