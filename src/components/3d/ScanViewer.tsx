// @ts-nocheck
'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
// @ts-ignore
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js'
import { Loader2 } from 'lucide-react'

interface ScanViewerProps {
    file: File | string
    className?: string
    width?: number | string
    height?: number | string
    onClick?: () => void
    autoRotate?: boolean
}

export const ScanViewer = ({ file, className, width = '100%', height = '100%', onClick, autoRotate = true }: ScanViewerProps) => {
    const mountRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!mountRef.current) return

        // Clean up
        while (mountRef.current.firstChild) {
            mountRef.current.removeChild(mountRef.current.firstChild)
        }

        // Scene
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf8fafc)

        // Camera
        const w = mountRef.current.clientWidth
        const h = mountRef.current.clientHeight
        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000)
        camera.position.set(0, -10, 10)

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(w, h)
        // @ts-ignore
        renderer.setPixelRatio(window.devicePixelRatio)
        mountRef.current.appendChild(renderer.domElement)

        // Controls
        const controls = new OrbitControlsImpl(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.25
        controls.autoRotate = autoRotate
        controls.autoRotateSpeed = 2.0

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
        dirLight.position.set(10, 10, 10)
        scene.add(dirLight)

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
        dirLight2.position.set(-10, -10, -10)
        scene.add(dirLight2)

        // Loader
        const loader = new STLLoader()
        let objectUrl = ''

        if (file instanceof File) {
            objectUrl = URL.createObjectURL(file)
        } else if (typeof file === 'string') {
            objectUrl = file
        }

        loader.load(
            objectUrl,
            (geometry: any) => {
                geometry.center()
                geometry.computeVertexNormals()

                const material = new THREE.MeshStandardMaterial({
                    color: 0xe2e8f0,
                    roughness: 0.5,
                    metalness: 0.1
                })

                const mesh = new THREE.Mesh(geometry, material)
                mesh.rotation.x = -Math.PI / 2

                scene.add(mesh)

                // Adjust camera
                const box = new THREE.Box3().setFromObject(mesh)
                const size = new THREE.Vector3()
                box.getSize(size)
                const center = new THREE.Vector3()
                box.getCenter(center)

                const maxDim = Math.max(size.x, size.y, size.z)

                const fov = camera.fov * (Math.PI / 180)
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))

                // Multiply by a small factor to ensure it's just inside frustum, 
                // but "aggrandi au maximum" means we want it tight. 
                // 1.1 provides 10% padding.
                camera.position.z = cameraZ * 1.1
                camera.lookAt(center)
                camera.updateProjectionMatrix()

                controls.target.copy(center)
                controls.update()

                setLoading(false)
            },
            (xhr: ProgressEvent) => { },
            (err: ErrorEvent) => {
                console.error('Error loading STL', err)
                setError('Erreur chargement')
                setLoading(false)
            }
        )

        // Resize
        const handleResize = () => {
            if (!mountRef.current) return
            const w = mountRef.current.clientWidth
            const h = mountRef.current.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('resize', handleResize)

        // Animation
        let animationId: number
        const animate = () => {
            animationId = requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationId)
            if (file instanceof File) URL.revokeObjectURL(objectUrl)
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement)
            }
            renderer.dispose()
        }
    }, [file, autoRotate])

    return (
        <div
            className={`relative cursor-pointer ${className}`}
            style={{ width, height }}
            onClick={onClick}
        >
            <div ref={mountRef} className="w-full h-full" />
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10 rounded-lg">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs z-10">
                    {error}
                </div>
            )}
        </div>
    )
}
