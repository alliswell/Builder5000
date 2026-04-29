import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

export function exportSceneAsGLB(object) {
  if (!object) {
    console.error('exportSceneAsGLB: no object provided')
    return
  }
  const exporter = new GLTFExporter()
  exporter.parse(
    object,
    (buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'table.glb'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    (error) => {
      console.error('GLTFExporter error:', error)
    },
    { binary: true }
  )
}
