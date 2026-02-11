'use client'
import React, { useState, useRef, useEffect } from 'react'
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
import {
  DiamondCard,
  DiamondCardContent,
  DiamondCardDescription,
  DiamondCardHeader,
  DiamondCardTitle,
} from '@/components/ui/diamond-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HeadingTitle } from '@/components/HeadingTitle'
import { Input } from '@/components/ui/input'
import {
  Activity,
  Box,
  BrainCircuit,
  Database,
  Search,
  Maximize2,
  RotateCw,
  Info,
  Layers,
  Sparkles,
  Zap,
  PlayCircle,
  X
} from 'lucide-react'

// Types
interface CaseItem {
  id: string
  title: string
  titleFr: string
  description: string
  beforeImage: string
  afterImage: string
  color: string
  category: 'malocclusion' | 'class'
  difficulty: 'Easy' | 'Medium' | 'Complex'
  duration: string
}

const DemoPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [show3D, setShow3D] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState('')
  const mountRef = useRef<HTMLDivElement | null>(null)

  // Expanded Data
  const cases: CaseItem[] = [
    {
      id: 'crowding',
      title: 'Crowding',
      titleFr: 'Encombrement',
      description: "Correction d'un encombrement sévère via expansion et IPR.",
      beforeImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=400&fit=crop',
      color: 'bg-blue-500',
      category: 'malocclusion',
      difficulty: 'Medium',
      duration: '6 mois'
    },
    {
      id: 'spacing',
      title: 'Spacing',
      titleFr: 'Espacement',
      description: 'Fermeture des diastèmes multiples avec alignement esthétique.',
      beforeImage: 'https://images.unsplash.com/photo-1609840114035-3c981407e31f?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&h=400&fit=crop',
      color: 'bg-emerald-500',
      category: 'malocclusion',
      difficulty: 'Easy',
      duration: '4 mois'
    },
    {
      id: 'openbite',
      title: 'Open Bite',
      titleFr: 'Béance',
      description: 'Correction de béance par ingression molaire et élastiques.',
      beforeImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=400&fit=crop',
      color: 'bg-amber-500',
      category: 'malocclusion',
      difficulty: 'Complex',
      duration: '12-14 mois'
    },
    {
      id: 'deepbite',
      title: 'Deep Bite',
      titleFr: 'Supraclusion',
      description: "Nivellement de la courbe de Spee et ouverture de l'occlusion.",
      beforeImage: 'https://images.unsplash.com/photo-1609840114035-3c981407e31f?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&h=400&fit=crop',
      color: 'bg-violet-500',
      category: 'malocclusion',
      difficulty: 'Medium',
      duration: '9 mois'
    },
    {
      id: 'class2',
      title: 'Class II',
      titleFr: 'Classe II',
      description: 'Correction sagittale avec distalisation séquentielle.',
      beforeImage: 'https://images.unsplash.com/photo-1609840114035-3c981407e31f?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&h=400&fit=crop',
      color: 'bg-rose-500',
      category: 'class',
      difficulty: 'Complex',
      duration: '18 mois'
    },
    {
      id: 'class3',
      title: 'Class III',
      titleFr: 'Classe III',
      description: 'Camouflage orthodontique avec IPR mandibulaire.',
      beforeImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=400&fit=crop',
      color: 'bg-cyan-500',
      category: 'class',
      difficulty: 'Medium',
      duration: '10 mois'
    },
  ]

  const filteredCases = cases.filter(c =>
    c.titleFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedCase = cases.find(c => c.id === expandedId) || null

  // 3D Logic
  useEffect(() => {
    if (!show3D || !mountRef.current || !selectedCase) return

    const scene = new Scene()
    scene.background = new Color(0xffffff)

    const camera = new PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100)
    camera.position.z = 5
    camera.position.y = 1

    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const dirLight = new DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    // Dental Arch Group
    const archGroup = new Group()

    // Jaw Base (Simple Torus)
    const jawGeo = new TorusGeometry(1.5, 0.4, 16, 50, Math.PI)
    const jawMat = new MeshStandardMaterial({ color: 0xffe5d9, roughness: 0.5 })
    const jaw = new Mesh(jawGeo, jawMat)
    jaw.rotation.x = -Math.PI / 2
    archGroup.add(jaw)

    // Teeth (Simple Boxes)
    const toothGeo = new BoxGeometry(0.3, 0.5, 0.3)
    const toothMat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })

    for (let i = 0; i < 10; i++) {
      const angle = (i / 9) * Math.PI
      const x = Math.cos(angle) * 1.5
      const z = Math.sin(angle) * 1.5
      const tooth = new Mesh(toothGeo, toothMat)
      tooth.position.set(x, 0.4, -z)

      // Simple distinct logic based on Case ID
      if (selectedCase.id === 'crowding') {
        tooth.position.x += (Math.random() - 0.5) * 0.2
        tooth.rotation.y = (Math.random() - 0.5) * 0.5
      } else if (selectedCase.id === 'spacing') {
        tooth.position.x *= 1.1
      }

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
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
      // Simple dispose if possible
      scene.clear()
      renderer.dispose()
    }
  }, [show3D, selectedCase])


  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-500 pb-12">

      {/* 1. Header & Hero Combined */}
      <div className="space-y-6">
        <HeadingTitle
          title="Galerie Clinique"
          subtitle="Explorez l'art de l'orthodontie numérique"
        />

        {/* Compact Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DiamondCard className="md:col-span-2 bg-gradient-to-br from-slate-900 to-blue-900 text-white border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-12 -mt-12"></div>
            <DiamondCardContent className="h-full flex flex-col justify-center relative z-10 p-8">
              <div className="flex items-center gap-2 text-blue-300 mb-2 font-medium">
                <Sparkles className="w-5 h-5" />
                <span>Technologie Diamond AI</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Visualisez le futur du sourire</h2>
              <p className="text-blue-100/80 max-w-lg mb-6">
                Nos algorithmes prédictifs simulent les mouvements dentaires avec une précision de 98%.
              </p>
              <div className="flex gap-4">
                <Badge variant="outline" className="text-white border-white/20 px-3 py-1">Précision 98%</Badge>
                <Badge variant="outline" className="text-white border-white/20 px-3 py-1">50k+ Cas</Badge>
              </div>
            </DiamondCardContent>
          </DiamondCard>

          <DiamondCard className="bg-white">
            <DiamondCardContent className="h-full flex flex-col justify-center p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Bibliothèque</h3>
              <p className="text-slate-500 text-sm mb-4">Accédez à plus de 50 types de malocclusions documentées.</p>
              <Button variant="outline" className="w-full">Voir Documentation</Button>
            </DiamondCardContent>
          </DiamondCard>
        </div>
      </div>

      {/* 2. Interactive Flex Gallery (Single Line) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Malocclusions Courantes
          </h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Filtrer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* The Flex Row Container */}
        <div className="flex flex-col lg:flex-row gap-4 h-[600px] w-full items-stretch perspective-1000">
          {filteredCases.map((caseItem) => {
            const isExpanded = expandedId === caseItem.id
            return (
              <div
                key={caseItem.id}
                onClick={() => {
                  if (isExpanded) {
                    setExpandedId(null)
                    setShow3D(false)
                  } else {
                    setExpandedId(caseItem.id)
                    setShow3D(false)
                  }
                }}
                className={`
                           relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-sm hover:shadow-xl border border-slate-200 bg-white
                           ${isExpanded ? 'flex-[4] lg:flex-[5]' : 'flex-1 hover:flex-[1.2]'}
                           group
                       `}
              >
                {/* Background Image (always visible but dimmed when expand) */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${isExpanded ? 'opacity-20' : 'opacity-100'}`}>
                  <img src={caseItem.beforeImage} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" alt={caseItem.title} />
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent ${isExpanded ? 'bg-white/90' : ''}`}></div>
                </div>

                {/* Collapsed Content (Label at bottom) */}
                <div className={`absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <div className={`w-10 h-1 rounded-full ${caseItem.color} mb-3 shadow-[0_0_10px_rgba(0,0,0,0.3)]`}></div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 drop-shadow-md">{caseItem.titleFr}</h3>
                  <p className="text-white/80 text-sm line-clamp-1">{caseItem.difficulty} • {caseItem.duration}</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/30 px-3 py-1 rounded-full hover:bg-white/10 backdrop-blur-sm">
                      Voir Détails
                    </span>
                  </div>
                </div>

                {/* Expanded Content (Full View) */}
                <div className={`absolute inset-0 p-8 flex flex-col transition-all duration-500 delay-100 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                  {isExpanded && (
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <Badge className={`${caseItem.color} text-white mb-2 border-none`}>{caseItem.category === 'class' ? 'Classe' : 'Malocclusion'}</Badge>
                          <h2 className="text-3xl font-bold text-slate-900">{caseItem.titleFr}</h2>
                          <p className="text-lg text-slate-500 mt-1">{caseItem.description}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                          className="rounded-full hover:bg-slate-100"
                        >
                          <X className="w-6 h-6 text-slate-400" />
                        </Button>
                      </div>

                      {/* Main Content Area: Splits into Info/3D/Photos */}
                      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-6">

                        {/* Left Col: Stats & Controls */}
                        <div className="md:col-span-4 space-y-6 overflow-y-auto pr-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                              <p className="text-xs text-slate-400 uppercase font-semibold">Durée</p>
                              <p className="text-xl font-bold text-slate-800">{caseItem.duration}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                              <p className="text-xs text-slate-400 uppercase font-semibold">Difficulté</p>
                              <p className="text-xl font-bold text-slate-800">{caseItem.difficulty}</p>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><Zap className="w-4 h-4" /> IA Insights</h4>
                            <p className="text-sm opacity-80">L&apos;IA suggère une approche par aligneurs séquentiels pour une résolution optimale en {caseItem.duration}.</p>
                          </div>

                          <div className="flex flex-col gap-3">
                            <Button
                              onClick={(e) => { e.stopPropagation(); setShow3D(true); }}
                              className={`w-full justify-start ${show3D ? 'bg-blue-600' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                            >
                              <RotateCw className="w-4 h-4 mr-2" /> Simulation 3D
                            </Button>
                            <Button
                              onClick={(e) => { e.stopPropagation(); setShow3D(false); }}
                              className={`w-full justify-start ${!show3D ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                            >
                              <Maximize2 className="w-4 h-4 mr-2" /> Photos Avant/Après
                            </Button>
                          </div>
                        </div>

                        {/* Right Col: Visuals */}
                        <div className="md:col-span-8 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 relative">
                          {show3D ? (
                            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                              <div ref={mountRef} className="w-full h-full" />
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-500 border border-slate-200">
                                Modèle 3D Interactif
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full grid grid-cols-2 gap-px bg-slate-200">
                              <div className="relative bg-white group/img overflow-hidden">
                                <img src={caseItem.beforeImage} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt="Avant" />
                                <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">Avant</div>
                              </div>
                              <div className="relative bg-white group/img overflow-hidden">
                                <img src={caseItem.afterImage} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt="Après" />
                                <div className="absolute top-4 left-4 bg-green-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-md">Après</div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default DemoPage
