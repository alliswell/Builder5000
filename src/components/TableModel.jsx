import { useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'

const APRON_HEIGHT = 4
const APRON_THICKNESS = 1
const BREADBOARD_THICKNESS = 1.5

const TableModel = forwardRef(function TableModel(props, ref) {
  const {
    width, depth, height, thickness, legSize,
    woodColor, apronStyle, legStyle,
  } = props

  const groupRef = useRef()
  useImperativeHandle(ref, () => groupRef.current)

  const legHeight = height - thickness

  // Material — recreated when woodColor changes
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(woodColor),
      roughness: 0.75,
      metalness: 0.05,
    })
    return mat
  }, [woodColor])

  useEffect(() => () => material.dispose(), [material])

  // Tabletop geometry
  const topGeom = useMemo(() => new THREE.BoxGeometry(width, thickness, depth), [width, thickness, depth])
  useEffect(() => () => topGeom.dispose(), [topGeom])

  // Leg geometry (one shared geometry for all 4 legs)
  const legGeom = useMemo(() => {
    if (legStyle === 'turned') {
      return new THREE.CylinderGeometry(legSize / 2 * 0.75, legSize / 2, legHeight, 16)
    }
    if (legStyle === 'tapered') {
      // Custom tapered box: full size at bottom, 60% at top
      const geom = new THREE.BufferGeometry()
      const s = legSize / 2
      const t = legSize * 0.3   // top half-size (60% of full)
      const y0 = 0, y1 = legHeight
      const verts = new Float32Array([
        // bottom face (y=0) — larger
        -s, y0, -s,   s, y0, -s,   s, y0,  s,  -s, y0,  s,
        // top face (y=legHeight) — smaller
        -t, y1, -t,   t, y1, -t,   t, y1,  t,  -t, y1,  t,
      ])
      geom.setAttribute('position', new THREE.BufferAttribute(verts, 3))
      // 6 faces × 2 triangles × 3 indices
      const idx = new Uint16Array([
        // bottom
        0, 2, 1,  0, 3, 2,
        // top
        4, 5, 6,  4, 6, 7,
        // front (z+)
        3, 7, 6,  3, 6, 2,
        // back (z-)
        0, 1, 5,  0, 5, 4,
        // right (x+)
        1, 2, 6,  1, 6, 5,
        // left (x-)
        0, 4, 7,  0, 7, 3,
      ])
      geom.setIndex(new THREE.BufferAttribute(idx, 1))
      geom.computeVertexNormals()
      return geom
    }
    // square
    return new THREE.BoxGeometry(legSize, legHeight, legSize)
  }, [legStyle, legSize, legHeight])
  useEffect(() => () => legGeom.dispose(), [legGeom])

  // 4 leg corner positions (center of each leg in XZ)
  const legPositions = useMemo(() => {
    const ox = width / 2 - legSize / 2
    const oz = depth / 2 - legSize / 2
    return [
      [ ox,  oz],
      [ ox, -oz],
      [-ox,  oz],
      [-ox, -oz],
    ]
  }, [width, depth, legSize])

  // Standard apron geometries
  const longApronGeom = useMemo(() => {
    if (apronStyle !== 'standard') return null
    return new THREE.BoxGeometry(width - 2 * legSize, APRON_HEIGHT, APRON_THICKNESS)
  }, [apronStyle, width, legSize])
  useEffect(() => () => longApronGeom?.dispose(), [longApronGeom])

  const shortApronGeom = useMemo(() => {
    if (apronStyle !== 'standard') return null
    return new THREE.BoxGeometry(APRON_THICKNESS, APRON_HEIGHT, depth - 2 * legSize)
  }, [apronStyle, depth, legSize])
  useEffect(() => () => shortApronGeom?.dispose(), [shortApronGeom])

  // Breadboard geometry
  const breadboardGeom = useMemo(() => {
    if (apronStyle !== 'breadboard') return null
    return new THREE.BoxGeometry(BREADBOARD_THICKNESS, thickness, depth + 2)
  }, [apronStyle, thickness, depth])
  useEffect(() => () => breadboardGeom?.dispose(), [breadboardGeom])

  const topY = height - thickness / 2
  const apronY = height - thickness - APRON_HEIGHT / 2
  const apronZOffset = depth / 2 - legSize - APRON_THICKNESS / 2
  const apronXOffset = width / 2 - legSize - APRON_THICKNESS / 2

  return (
    <group ref={groupRef}>
      {/* Tabletop */}
      <mesh geometry={topGeom} material={material} position={[0, topY, 0]} castShadow receiveShadow />

      {/* Legs */}
      {legPositions.map(([x, z], i) => (
        <mesh
          key={i}
          geometry={legGeom}
          material={material}
          position={[x, legHeight / 2, z]}
          castShadow
        />
      ))}

      {/* Standard aprons */}
      {apronStyle === 'standard' && longApronGeom && shortApronGeom && (
        <>
          {/* Front apron */}
          <mesh geometry={longApronGeom} material={material} position={[0, apronY,  apronZOffset]} castShadow />
          {/* Back apron */}
          <mesh geometry={longApronGeom} material={material} position={[0, apronY, -apronZOffset]} castShadow />
          {/* Right apron */}
          <mesh geometry={shortApronGeom} material={material} position={[ apronXOffset, apronY, 0]} castShadow />
          {/* Left apron */}
          <mesh geometry={shortApronGeom} material={material} position={[-apronXOffset, apronY, 0]} castShadow />
        </>
      )}

      {/* Breadboard ends */}
      {apronStyle === 'breadboard' && breadboardGeom && (
        <>
          <mesh geometry={breadboardGeom} material={material} position={[ width / 2 + BREADBOARD_THICKNESS / 2, topY, 0]} castShadow />
          <mesh geometry={breadboardGeom} material={material} position={[-width / 2 - BREADBOARD_THICKNESS / 2, topY, 0]} castShadow />
        </>
      )}
    </group>
  )
})

export default TableModel
