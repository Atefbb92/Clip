'use client'

import React, { useRef, useEffect } from 'react'
import {
    Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
    Mesh,
    BoxGeometry,
    // @ts-ignore
    Group,
    // @ts-ignore
    TorusGeometry,
    // @ts-ignore
    MeshStandardMaterial,
} from 'three'

interface TreatmentPlanViewer3DProps {
    patientName?: string
}

const TreatmentPlanViewer3D: React.FC<TreatmentPlanViewer3DProps> = ({ patientName }) => {
    const mountRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!mountRef.current) return

        const scene = new Scene()
        scene.background = new Color(0xf8fafc) // Slate 50 to match app style

        const camera = new PerspectiveCamera(
            50,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            100
        )
        camera.position.z = 5
        camera.position.y = 1

        const renderer = new WebGLRenderer({ antialias: true, alpha: true } as any)
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
        mountRef.current.appendChild(renderer.domElement)

        // Lighting
        const ambientLight = new AmbientLight(0xffffff, 0.7)
        scene.add(ambientLight)

        const dirLight = new DirectionalLight(0xffffff, 0.8)
        dirLight.position.set(5, 5, 5)
        scene.add(dirLight)

        // Dental Arch Group
        // @ts-ignore
        const archGroup = new Group()

        // Jaw Base (Simple Torus)
        // @ts-ignore
        const jawGeo = new TorusGeometry(1.5, 0.4, 16, 50, Math.PI)
        // @ts-ignore
        const jawMat = new MeshStandardMaterial({ color: 0xffe5d9, roughness: 0.5 })
        const jaw = new Mesh(jawGeo, jawMat)
        jaw.rotation.x = -Math.PI / 2
        archGroup.add(jaw)

        // Teeth (Simple Boxes)
        const toothGeo = new BoxGeometry(0.3, 0.5, 0.3)
        // @ts-ignore
        const toothMat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })

        for (let i = 0; i < 10; i++) {
            const angle = (i / 9) * Math.PI
            const x = Math.cos(angle) * 1.5
            const z = Math.sin(angle) * 1.5
            const tooth = new Mesh(toothGeo, toothMat)
            tooth.position.set(x, 0.4, -z)

            // Randomize slightly for "natural" look
            tooth.position.x += (Math.random() - 0.5) * 0.05
            tooth.rotation.y = (Math.random() - 0.5) * 0.2

            archGroup.add(tooth)
        }

        scene.add(archGroup)

        let animationId: number
        const animate = () => {
            animationId = requestAnimationFrame(animate)
            archGroup.rotation.y += 0.005
            renderer.render(scene, camera)
        }
        animate()

        const handleResize = () => {
            if (!mountRef.current) return
            // @ts-ignore
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
            // @ts-ignore
            camera.updateProjectionMatrix()
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationId)
            if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
                mountRef.current.removeChild(renderer.domElement)
            }
            scene.clear()
            renderer.dispose()
        }
    }, [])

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg overflow-hidden relative border border-slate-200 shadow-inner">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-500 border border-slate-200 z-10">
                Visuel 3D : {patientName || 'Plan de traitement'}
            </div>
        </div>
    )
}

export default TreatmentPlanViewer3D
