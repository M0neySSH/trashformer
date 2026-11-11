"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { RotateCcw, Pause, Play, Box } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModelViewer3DProps {
  src?: string
  className?: string
  autoRotateDefault?: boolean
}

export default function ModelViewer3D({
  src = "/model.glb",
  className = "",
  autoRotateDefault = true,
}: ModelViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const initialCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 3))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
    }
  }, [autoRotate])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrameId = 0
    let disposed = false

    const width = container.clientWidth || 450
    const height = container.clientHeight || 400

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setError("WebGL is not supported in this browser.")
      setIsLoading(false)
      return
    }

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)

    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    const roomEnv = new RoomEnvironment()
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04)
    scene.environment = envTarget.texture
    roomEnv.dispose()

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 10, 7.5)
    scene.add(dirLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.autoRotate = autoRotateDefault
    controls.autoRotateSpeed = 2.0
    controlsRef.current = controls

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("/draco/")

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.load(
      src,
      (gltf) => {
        if (disposed) return
        const model = gltf.scene

        // Center and normalize model scale so it always frames cleanly
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const scale = 2.2 / maxDim

        model.scale.setScalar(scale)
        model.position.sub(center.multiplyScalar(scale))

        scene.add(model)

        const camPos = new THREE.Vector3(2.2, 1.5, 2.6)
        camera.position.copy(camPos)
        initialCameraPosRef.current.copy(camPos)
        controls.target.set(0, 0, 0)
        controls.update()
        setIsLoading(false)
      },
      undefined,
      (err) => {
        if (disposed) return
        console.error("Failed to load 3D model:", err)
        setError("Failed to load 3D model.")
        setIsLoading(false)
      }
    )

    const animate = () => {
      if (disposed) return
      animationFrameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const resizeObserver = new ResizeObserver(() => {
      if (!container || disposed) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w > 0 && h > 0) {
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
    })
    resizeObserver.observe(container)

    return () => {
      disposed = true
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      dracoLoader.dispose()
      controls.dispose()
      envTarget.dispose()
      pmremGenerator.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [src, autoRotateDefault])

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.copy(initialCameraPosRef.current)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }

  return (
    <div className={`relative w-full h-full min-h-[360px] rounded-xl border bg-gradient-to-br from-secondary/40 via-background to-primary/5 overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[360px] cursor-grab active:cursor-grabbing" />

      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-xs gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading 3D Smart Bin...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 gap-2 p-4 text-center">
          <Box className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-xs border text-xs font-medium text-primary shadow-xs">
            <Box className="h-3.5 w-3.5" />
            Interactive 3D Smart Bin
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-xs border shadow-xs"
              onClick={() => setAutoRotate((prev) => !prev)}
              title={autoRotate ? "Pause rotation" : "Resume rotation"}
            >
              {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-xs border shadow-xs"
              onClick={handleResetView}
              title="Reset view"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/75 backdrop-blur-xs border text-[11px] text-muted-foreground">
            Drag to rotate • Scroll to zoom • Right-drag to pan
          </div>
        </>
      )}
    </div>
  )
}

