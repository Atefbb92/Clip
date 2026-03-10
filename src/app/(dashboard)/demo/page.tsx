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
import { useTranslation } from '@/hooks/useTranslation'
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
  const { t } = useTranslation()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [show3D, setShow3D] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const mountRef = useRef<HTMLDivElement | null>(null)

  // Expanded Data
  const cases: CaseItem[] = [
    {
      id: 'crowding',
      title: t('demo.cases.crowding.title'),
      titleFr: t('demo.cases.crowding.title'), // Using same key as requested
      description: t('demo.cases.crowding.description'),
      beforeImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=400&fit=crop',
      color: 'bg-blue-500',
      category: 'malocclusion',
      difficulty: 'Medium',
      duration: '6 mois'
    },
    {
      id: 'spacing',
      title: t('demo.cases.spacing.title'),
      titleFr: t('demo.cases.spacing.title'),
      description: t('demo.cases.spacing.description'),
      beforeImage: 'https://images.unsplash.com/photo-1609840114035-3c981407e31f?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&h=400&fit=crop',
      color: 'bg-emerald-500',
      category: 'malocclusion',
      difficulty: 'Easy',
      duration: '4 mois'
    },
    {
      id: 'openbite',
      title: t('demo.cases.openbite.title'),
      titleFr: t('demo.cases.openbite.title'),
      description: t('demo.cases.openbite.description'),
      beforeImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=400&fit=crop',
      color: 'bg-amber-500',
      category: 'malocclusion',
      difficulty: 'Complex',
      duration: '12-14 mois'
    },
    {
      id: 'deepbite',
      title: t('demo.cases.deepbite.title'),
      titleFr: t('demo.cases.deepbite.title'),
      description: t('demo.cases.deepbite.description'),
      beforeImage: 'https://images.unsplash.com/photo-1609840114035-3c981407e31f?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&h=400&fit=crop',
      color: 'bg-violet-500',
      category: 'malocclusion',
      difficulty: 'Medium',
      duration: '9 mois'
    },
    {
      id: 'class2',
      title: t('demo.cases.class2.title'),
      titleFr: t('demo.cases.class2.title'),
      description: t('demo.cases.class2.description'),
      beforeImage: 'https://images.unsplash.com/photo-1609840114035-3c981407e31f?w=500&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&h=400&fit=crop',
      color: 'bg-rose-500',
      category: 'class',
      difficulty: 'Complex',
      duration: '18 mois'
    },
    {
      id: 'class3',
      title: t('demo.cases.class3.title'),
      titleFr: t('demo.cases.class3.title'),
      description: t('demo.cases.class3.description'),
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

    // @ts-ignore
    const camera = new PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100) as any
    camera.position.z = 5
    camera.position.y = 1

    // @ts-ignore
    const renderer = new WebGLRenderer({ antialias: true, alpha: true }) as any
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
    <div className="min-h-screen space-y-8 animate-in fade-in duration-500 pb-12 p-8">

      {/* 1. Header & Hero Combined */}
      <div className="space-y-6">
        <HeadingTitle
          title={t('demo.hero.title')}
          subtitle={t('demo.hero.description')}
        />

        {/* Compact Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DiamondCard className="md:col-span-2 bg-gradient-to-br from-slate-900 to-blue-900 text-white border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-12 -mt-12"></div>
            <DiamondCardContent className="h-full flex flex-col justify-center relative z-10 p-8">
              <div className="flex items-center gap-2 text-blue-300 mb-2 font-medium">
                <Sparkles className="w-5 h-5" />
                <span>{t('demo.hero.techno_ai')}</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{t('demo.hero.title')}</h2>
              <p className="text-blue-100/80 max-w-lg mb-6">
                {t('demo.hero.description')}
              </p>
              <div className="flex gap-4">
                <Badge variant="outline" className="text-white border-white/20 px-3 py-1">{t('demo.hero.precision')}</Badge>
                <Badge variant="outline" className="text-white border-white/20 px-3 py-1">{t('demo.hero.cases_count')}</Badge>
              </div>
            </DiamondCardContent>
          </DiamondCard>

          <DiamondCard className="bg-white">
            <DiamondCardContent className="h-full flex flex-col justify-center p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{t('demo.library.title')}</h3>
              <p className="text-slate-500 text-sm mb-4">{t('demo.library.description')}</p>
              <Button variant="outline" className="w-full">{t('demo.library.button')}</Button>
            </DiamondCardContent>
          </DiamondCard>
        </div>
      </div>

      {/* 2. Interactive Flex Gallery (Single Line) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            {t('demo.gallery.title')}
          </h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder={t('demo.gallery.filter_placeholder')}
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
                      {t('demo.gallery.view_details')}
                    </span>
                  </div>
                </div>

                {/* Expanded Content (Full View) */}
                <div className={`absolute inset-0 p-8 flex flex-col transition-all duration-500 delay-100 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                  {isExpanded && (
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <Badge className={`${caseItem.color} text-white mb-2 border-none`}>{caseItem.category === 'class' ? t('demo.gallery.class') : t('demo.gallery.malocclusion')}</Badge>
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
                              <p className="text-xs text-slate-400 uppercase font-semibold">{t('demo.gallery.duration')}</p>
                              <p className="text-xl font-bold text-slate-800">{caseItem.duration}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                              <p className="text-xs text-slate-400 uppercase font-semibold">{t('demo.gallery.difficulty')}</p>
                              <p className="text-xl font-bold text-slate-800">{caseItem.difficulty}</p>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><Zap className="w-4 h-4" /> {t('demo.gallery.ai_insights')}</h4>
                            <p className="text-sm opacity-80">{t('demo.gallery.ai_suggestion', { duration: caseItem.duration })}</p>
                          </div>

                          <div className="flex flex-col gap-3">
                            <Button
                              onClick={(e) => { e.stopPropagation(); setShow3D(true); }}
                              className={`w-full justify-start ${show3D ? 'bg-blue-600' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                            >
                              <RotateCw className="w-4 h-4 mr-2" /> {t('demo.gallery.simulation_3d')}
                            </Button>
                            <Button
                              onClick={(e) => { e.stopPropagation(); setShow3D(false); }}
                              className={`w-full justify-start ${!show3D ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                            >
                              <Maximize2 className="w-4 h-4 mr-2" /> {t('demo.gallery.before_after')}
                            </Button>
                          </div>
                        </div>

                        {/* Right Col: Visuals */}
                        <div className="md:col-span-8 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200 relative">
                          {show3D ? (
                            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                              <div ref={mountRef} className="w-full h-full" />
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-500 border border-slate-200">
                                {t('demo.gallery.interactive_model')}
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full grid grid-cols-2 gap-px bg-slate-200">
                              <div
                                className="relative bg-white group/img overflow-hidden cursor-zoom-in"
                                onClick={(e) => { e.stopPropagation(); setSelectedImage(caseItem.beforeImage); }}
                              >
                                <img src={caseItem.beforeImage} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt="Avant" />
                                <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">{t('demo.gallery.before')}</div>
                              </div>
                              <div
                                className="relative bg-white group/img overflow-hidden cursor-zoom-in"
                                onClick={(e) => { e.stopPropagation(); setSelectedImage(caseItem.afterImage); }}
                              >
                                <img src={caseItem.afterImage} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt="Après" />
                                <div className="absolute top-4 left-4 bg-green-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-md">{t('demo.gallery.after')}</div>
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <Button
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full h-12 w-12 z-50"
              variant="ghost"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </Button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default DemoPage
