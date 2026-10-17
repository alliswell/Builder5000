import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { zipSync } from 'fflate'

function toGLB(object) {
  return new Promise((resolve, reject) => {
    new GLTFExporter().parse(object, resolve, reject, { binary: true })
  })
}

function browserDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// `downloads` is the claude.ai artifact downloads capability, or null for a
// plain browser download (local dev).
export async function exportSceneAsGLB(object, downloads) {
  if (!object) {
    console.error('exportSceneAsGLB: no object provided')
    return
  }
  let buffer
  try {
    buffer = await toGLB(object)
  } catch (error) {
    console.error('GLTFExporter error:', error)
    return
  }

  if (downloads) {
    // The artifact viewer only saves allowlisted file types, so the .glb ships inside a .zip
    const zip = zipSync({ 'table.glb': new Uint8Array(buffer) }, { level: 0 })
    try {
      await downloads.save({ filename: 'table.zip', data: new Blob([zip]) })
    } catch (error) {
      if (error?.code !== 'declined') console.error('Download failed:', error)
    }
    return
  }

  browserDownload(new Blob([buffer], { type: 'model/gltf-binary' }), 'table.glb')
}
