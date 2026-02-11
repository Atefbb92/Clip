'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { auth, db } from '@/firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DiamondCard,
  DiamondCardContent,
  DiamondCardDescription,
  DiamondCardHeader,
  DiamondCardTitle,
  DiamondCardFooter,
} from '@/components/ui/diamond-card'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Calendar,
  Package,
  FileText,
  Eye,
  Activity,
  ChevronRight,
  ChevronLeft,
  Download,
  Upload,
  Image,
  XCircle,
  Clock,
  TrendingUp,
  Moon,
  MessageCircle,
  Send,
  Maximize,
  X,
  Check,
  AlertCircle,
  Smartphone,
  Camera,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import clipLogo from '@/assets/img/CliP blanc- logo.png'
import { Card, CardContent } from '@/components/ui/card'

interface Patient {
  id: string
  name: string
  surname: string
  age: string
  birthDate: string
  phone: string
  email?: string
  createdAt: unknown
  userId: string
}

const PatientDetailPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const patientId = params?.id as string | undefined

  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTPVersion, setSelectedTPVersion] = useState(0)
  const [showPhotosModal, setShowPhotosModal] = useState(false)
  const [showRadiosModal, setShowRadiosModal] = useState(false)
  const [showPatientPhotosModal, setShowPatientPhotosModal] = useState(false)
  // Viewer de galerie générique
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [galleryTitle, setGalleryTitle] = useState<string>('')
  const [galleryPhotos, setGalleryPhotos] = useState<{ id: string; url: string; date?: string }[]>(
    []
  )
  const [galleryIndex, setGalleryIndex] = useState<number>(0)
  const [activeTab, setActiveTab] = useState('overview')
  const [show3DModal, setShow3DModal] = useState(false)
  const [showCephModal, setShowCephModal] = useState(false)
  // Lien simulé inséré depuis le back office pour l'analyse céphalométrique
  const cephalometricUrl = 'https://example.com/cephalometric-analysis-frame'
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  const weeks = [
    {
      label: 'Semaine 10',
      date: '10 déc 2025',
      photos: [{}, {}, {}],
    },
    {
      label: 'Semaine 9',
      date: '3 déc 2025',
      photos: [{}, {}, {}],
    },
    {
      label: 'Semaine 8',
      date: '26 nov 2025',
      photos: [{}, {}, {}],
    },
    {
      label: 'Semaine 7',
      date: '19 nov 2025',
      photos: [
        { title: 'Vue Frontale' },
        { title: 'Arcade Supérieure' },
        { title: 'Arcade Inférieure' },
      ],
    },
  ]

  // Données simulées
  const patientData = {
    nom: 'Dubois',
    prenom: 'Marie',
    dateNaissance: '15/03/1992',
    numeroPatient: 'PT-2024-1547',
    email: 'marie.dubois@email.com',
    telephone: '+33 6 12 34 56 78',
    dateInscription: '12/01/2024',
    // Type de commande: "Totalité du pack" ou "Moitié du pack"
    commandeType: 'Totalité du pack',
  }

  const historique = [
    { date: '15/10/2024', statut: 'Treatment started', type: 'success' },
    { date: '08/10/2024', statut: 'Aligner set delivered', type: 'success' },
    { date: '01/10/2024', statut: 'TP Check validated', type: 'success' },
    { date: '25/09/2024', statut: 'TP Check ready', type: 'info' },
    { date: '18/09/2024', statut: 'Prescription submitted', type: 'info' },
  ]

  // Liste des TP Checks (exemples simulés)
  const tpChecks = [
    {
      id: 1,
      date: '01/10/2024',
      status: 'Validated',
      patientType: 'Adulte',
      pack: 'Smart',
      stepsUpper: 12,
      stepsLower: 12,
    },
    {
      id: 2,
      date: '15/10/2024',
      status: 'Revision requested',
      patientType: 'Adulte',
      pack: 'Pro',
      stepsUpper: 14,
      stepsLower: 13,
    },
    {
      id: 3,
      date: '20/10/2024',
      status: 'Validated',
      patientType: 'Adolescent',
      pack: 'Smart',
      stepsUpper: 10,
      stepsLower: 11,
    },
  ]

  // Photos envoyées par le patient depuis MyDiamond (données simulées)
  const myDiamondPhotos: { id: string; url: string; date: string }[] = [
    { id: 'md-1', url: '/images/p1.png', date: '2024-10-01' },
    { id: 'md-2', url: '/images/p2.png', date: '2024-10-01' },
    { id: 'md-3', url: '/images/p3.png', date: '2024-10-01' },
    { id: 'md-4', url: '/images/p4.png', date: '2024-10-15' },
    { id: 'md-5', url: '/images/p5.png', date: '2024-10-15' },
    { id: 'md-6', url: '/images/p6.png', date: '2024-10-15' },
  ]
  // Photos initiales et radios (simulées, vides pour l’instant)
  const initialPhotos: { id: string; url: string; label?: string }[] = []
  const radioImages: { id: string; url: string; label?: string }[] = []
  const initialPhotosCount = initialPhotos.length
  const radioCount = radioImages.length

  // Fonctions du viewer
  const openGallery = (
    photos: { id: string; url: string; date?: string }[],
    title: string,
    index = 0
  ) => {
    setGalleryPhotos(photos)
    setGalleryTitle(title)
    setGalleryIndex(index)
    setShowGalleryModal(true)
  }
  const closeGallery = () => setShowGalleryModal(false)
  const prevPhoto = () =>
    setGalleryIndex((i) => (i - 1 + galleryPhotos.length) % galleryPhotos.length)
  const nextPhoto = () => setGalleryIndex((i) => (i + 1) % galleryPhotos.length)

  useEffect(() => {
    if (!showGalleryModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGallery()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showGalleryModal, galleryPhotos.length])

  const calculateAgeFromFrenchDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number)
    const dob = new Date(year, month - 1, day)
    const diff = Date.now() - dob.getTime()
    const ageDate = new Date(diff)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  const age = calculateAgeFromFrenchDate(patientData.dateNaissance)
  const categorie = age >= 18 ? t('patients.categories.adult') : t('patients.categories.teen')
  const currentTP = tpChecks[selectedTPVersion] ?? tpChecks[0]

  // Données d'avancement (démo)
  const progressPercent = 65
  const currentAligner = 8
  const totalAligners = 24
  const remainingDays = 75
  // Démos de pourcentages pour anneaux complémentaires
  const alignerPercent = Math.round((currentAligner / totalAligners) * 100)
  const totalDays = 90 // nombre de jours total estimé (démo)
  const remainingDaysPercent = Math.round((remainingDays / totalDays) * 100)
  // Démo: jours jusqu’au prochain aligneur
  const daysBetweenAligners = 7 // intervalle standard (démo)
  const daysToNextAligner = 3 // jours restants avant prochain aligneur (démo)
  const nextAlignerPercent = Math.round((daysToNextAligner / daysBetweenAligners) * 100)
  const progressHistory = [50, 55, 57, 60, 62, 65, 66, 68]
  const sparkWidth = 200
  const sparkHeight = 60
  const sparkPoints = progressHistory
    .map((v, i) => {
      const x = (i / (progressHistory.length - 1)) * sparkWidth
      const y = sparkHeight - (v / 100) * sparkHeight
      return `${x},${y}`
    })
    .join(' ')

  // Ordre des cartes d'avancement (draggable)
  const defaultAdvOrder = ['progress', 'current', 'next', 'remaining'] as const
  type AdvCardId = (typeof defaultAdvOrder)[number]
  const allowedAdvIds: AdvCardId[] = Array.from(defaultAdvOrder)

  const [advOrder, setAdvOrder] = useState<AdvCardId[]>(Array.from(defaultAdvOrder))
  const dragAdvIdRef = useRef<AdvCardId | null>(null)
  const [dragOverAdvId, setDragOverAdvId] = useState<AdvCardId | null>(null)

  // Order / Validation dialog state
  const [openValidationDialog, setOpenValidationDialog] = useState(false)
  const [commandeType, setCommandeType] = useState<string>('Full pack')
  // Change rhythm (TP Check)
  const [rythmeChangeDays, setRythmeChangeDays] = useState<number>(7)
  const [openRhythmDialog, setOpenRhythmDialog] = useState(false)
  // Dialog: order the remaining pack
  const [openRestPackDialog, setOpenRestPackDialog] = useState(false)

  // Quote amounts (demo)
  const devisFinalTTC = 2280

  // Zod schema for validation form
  const validationSchema = z.object({
    commandeType: z.enum(['total', 'moitie'], { required_error: t('patients.detail.tp_check.order_option_error') }),
    ligneDeCoupe: z.enum(['straight', 'extended_straight', 'scalloped', 'hybrid'], {
      required_error: t('patients.detail.tp_check.trim_line_error'),
    }),
  })

  // react-hook-form with zodResolver
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: { commandeType: 'total', ligneDeCoupe: 'extended_straight' },
  })

  // Zod form for change rhythm
  const rhythmSchema = z.object({
    rhythm: z.enum(['7', '10', '14'], { required_error: t('patients.detail.tp_check.rhythm_error') }),
  })
  const rhythmForm = useForm<z.infer<typeof rhythmSchema>>({
    resolver: zodResolver(rhythmSchema),
    defaultValues: { rhythm: String(rythmeChangeDays) as '7' | '10' | '14' },
  })

  // Empty form for ordering the remaining pack
  const restPackSchema = z.object({})
  const restPackForm = useForm<z.infer<typeof restPackSchema>>({
    resolver: zodResolver(restPackSchema),
    defaultValues: {},
  })

  // Charger l'ordre depuis localStorage pour ce patient
  useEffect(() => {
    const key = `patient-${patientId ?? 'unknown'}-adv-order`
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)
        const isAdvCardId = (x: unknown): x is AdvCardId => {
          return typeof x === 'string' && (allowedAdvIds as readonly string[]).includes(x)
        }
        if (Array.isArray(parsed)) {
          const normalized: AdvCardId[] = parsed.filter(isAdvCardId)
          // Assurer que toutes les cartes existent
          for (const id of allowedAdvIds) {
            if (!normalized.includes(id)) normalized.push(id)
          }
          setAdvOrder(normalized)
        }
      }
    } catch (e) {
      // ignore parsing errors
    }
  }, [patientId])

  // Sauvegarder l'ordre
  useEffect(() => {
    const key = `patient-${patientId ?? 'unknown'}-adv-order`
    try {
      localStorage.setItem(key, JSON.stringify(advOrder))
    } catch (e) {
      // ignore quota errors
    }
  }, [advOrder, patientId])

  const onAdvDragStart = (id: AdvCardId) => {
    dragAdvIdRef.current = id
  }

  const onAdvDragOver = (id: AdvCardId, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOverAdvId(id)
  }

  const onAdvDrop = (targetId: AdvCardId) => {
    const draggedId = dragAdvIdRef.current
    setDragOverAdvId(null)
    dragAdvIdRef.current = null
    if (!draggedId || draggedId === targetId) return
    const from = advOrder.indexOf(draggedId)
    const to = advOrder.indexOf(targetId)
    if (from < 0 || to < 0) return
    const next = advOrder.slice()
    next.splice(from, 1)
    next.splice(to, 0, draggedId)
    setAdvOrder(next)
  }

  const renderAdvCard = (id: AdvCardId, opts?: { hero?: boolean }) => {
    const hero = !!opts?.hero
    const ringSize = hero ? 'w-36 h-36' : 'w-28 h-28'
    const subtitleMargin = hero ? 'mb-4' : ''
    const cardMinH = hero ? 'min-h-[260px]' : 'min-h-[220px]'
    const contentPadding = hero ? 'py-10' : 'py-8'
    switch (id) {
      case 'progress':
        return (
          <DiamondCard className={`bg-white border-slate-200 shadow-sm ${cardMinH}`}>
            <DiamondCardHeader>
              <DiamondCardTitle className="text-center text-slate-800">
                {t('patients.detail.cards.progress')}
              </DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent className={`text-center ${contentPadding}`}>
              <div
                className={`relative mx-auto mb-4 ${ringSize} rounded-full`}
                style={{
                  background: `conic-gradient(#0072B8 ${progressPercent * 3.6}deg, #e2e8f0 0)`,
                }}
                aria-label={`Progress ${progressPercent}%`}
              >
                <div className="absolute inset-2 bg-white rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-bold text-slate-800 ${hero ? 'text-2xl' : 'text-xl'}`}>
                    {progressPercent}%
                  </span>
                </div>
              </div>
              <p className={`text-sm text-slate-600 ${subtitleMargin}`}>{t('patients.detail.cards.estimated')}</p>
            </DiamondCardContent>
          </DiamondCard>
        )
      case 'current':
        return (
          <DiamondCard className={`bg-white border-slate-200 shadow-sm ${cardMinH}`}>
            <DiamondCardHeader>
              <DiamondCardTitle className="text-center text-slate-800">
                {t('patients.detail.cards.current')}
              </DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent className={`text-center ${contentPadding}`}>
              <div
                className={`relative mx-auto mb-4 ${ringSize} rounded-full`}
                style={{
                  background: `conic-gradient(#0072B8 ${alignerPercent * 3.6}deg, #e2e8f0 0)`,
                }}
                aria-label={`Current aligner ${currentAligner} out of ${totalAligners} (${alignerPercent}%)`}
              >
                <div className="absolute inset-2 bg-white rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-bold text-[#0072B8] ${hero ? 'text-2xl' : 'text-xl'}`}>
                    {currentAligner}
                  </span>
                </div>
              </div>
              <p className={`text-sm text-slate-600 ${subtitleMargin}`}>
                {t('patients.detail.cards.out_of').replace('{total}', String(totalAligners))}
              </p>
            </DiamondCardContent>
          </DiamondCard>
        )
      case 'next':
        return (
          <DiamondCard className={`bg-white border-slate-200 shadow-sm ${cardMinH}`}>
            <DiamondCardHeader>
              <DiamondCardTitle className="text-center text-slate-800">
                {t('patients.detail.cards.next')}
              </DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent className={`text-center ${contentPadding}`}>
              <div
                className={`relative mx-auto mb-4 ${ringSize} rounded-full`}
                style={{
                  background: `conic-gradient(#F59E0B ${nextAlignerPercent * 3.6}deg, #e2e8f0 0)`,
                }}
                aria-label={`Next aligner in ${daysToNextAligner} days out of ${daysBetweenAligners} (${nextAlignerPercent}%)`}
              >
                <div className="absolute inset-2 bg-white rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-semibold text-amber-500 ${hero ? 'text-2xl' : 'text-xl'}`}>
                    {daysToNextAligner}
                  </span>
                </div>
              </div>
              <p className={`text-sm text-slate-600 ${subtitleMargin}`}>
                {t('patients.detail.cards.days_remaining').replace('{total}', String(daysBetweenAligners))}
              </p>
            </DiamondCardContent>
          </DiamondCard>
        )
      case 'remaining':
        return (
          <DiamondCard className={`bg-white border-slate-200 shadow-sm ${cardMinH}`}>
            <DiamondCardHeader>
              <DiamondCardTitle className="text-center text-slate-800">
                {t('patients.detail.cards.time_remaining')}
              </DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent className={`text-center ${contentPadding}`}>
              <div
                className={`relative mx-auto mb-4 ${ringSize} rounded-full`}
                style={{
                  background: `conic-gradient(#16a34a ${remainingDaysPercent * 3.6}deg, #e2e8f0 0)`,
                }}
                aria-label={`Time remaining ${remainingDays} days out of ${totalDays} (${remainingDaysPercent}%)`}
              >
                <div className="absolute inset-2 bg-white rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-bold text-green-600 ${hero ? 'text-2xl' : 'text-xl'}`}>
                    {remainingDays}
                  </span>
                </div>
              </div>
              <p className={`text-sm text-slate-600 ${subtitleMargin}`}>
                {t('patients.detail.cards.days_remaining').replace('{total}', String(totalDays))}
              </p>
            </DiamondCardContent>
          </DiamondCard>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Redirection si l'id patient est manquant
        if (!patientId) {
          setIsLoading(false)
          router.push('/patients')
          return
        }
        try {
          const patientDoc = await getDoc(doc(db, 'patients', patientId))
          if (patientDoc.exists()) {
            setPatient({ id: patientDoc.id, ...patientDoc.data() } as Patient)
          }
        } catch (error) {
          console.error('Erreur lors du chargement du patient:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [patientId, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0072B8]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/patients')}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('patients.detail.actions.back')}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {patientData.prenom} {patientData.nom}
              </h1>
              <p className="text-slate-600">{patientData.numeroPatient}</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">{t('patients.detail.status.active')}</Badge>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                ? 'border-[#0072B8] text-[#0072B8]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              {t('patients.detail.tabs.overview')}
            </button>
            <button
              onClick={() => setActiveTab('treatment')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'treatment'
                ? 'border-[#0072B8] text-[#0072B8]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              {t('patients.detail.tabs.treatment')}
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'photos'
                ? 'border-[#0072B8] text-[#0072B8]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              {t('patients.detail.tabs.photos')}
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'progress'
                ? 'border-[#0072B8] text-[#0072B8]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              {t('patients.detail.tabs.progress')}
            </button>
          </nav>
        </div>

        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche: Actions rapides + Historique */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Actions rapides */}
              <DiamondCard className="bg-white border-slate-200 shadow-sm">
                <DiamondCardHeader>
                  <DiamondCardTitle className="flex items-center text-slate-800">
                    <Activity className="h-5 w-5 mr-2 text-[#0072B8]" />
                    {t('patients.detail.quick_actions.title')}
                  </DiamondCardTitle>
                </DiamondCardHeader>
                <DiamondCardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button className="w-full bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {t('patients.detail.actions.request_correction')}
                    </Button>
                    <Button className="w-full bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200">
                      <Check className="h-4 w-4 mr-2" />
                      {t('patients.detail.actions.finish')}
                    </Button>
                    <Button className="w-full bg-sky-100 text-sky-700 border border-sky-200 hover:bg-sky-200">
                      <Moon className="h-4 w-4 mr-2" />
                      {t('patients.detail.actions.order_eterna')}
                    </Button>
                  </div>
                </DiamondCardContent>
              </DiamondCard>

              {/* Dialog Commander le reste du pack */}
              <Dialog open={openRestPackDialog} onOpenChange={setOpenRestPackDialog}>
                <DialogContent className="bg-white sm:max-w-md md:left-[calc(50%+8rem)]">
                  <DialogHeader className="mb-3">
                    <DialogTitle>{t('patients.detail.info.order_remaining')}</DialogTitle>
                    <DialogDescription>
                      {t('patients.detail.info.order_remaining_desc')}
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...restPackForm}>
                    <form
                      onSubmit={restPackForm.handleSubmit(() => {
                        setOpenRestPackDialog(false)
                      })}
                      className="space-y-4"
                    >
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600">{t('patients.detail.tp_check.amount_to_pay')}</p>
                        <p className="font-medium text-[#0072B8]">
                          {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(Math.round(devisFinalTTC * 0.4))}
                        </p>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpenRestPackDialog(false)}
                        >
                          {t('common.cancel')}
                        </Button>
                        <Button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {t('common.confirm')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Treatment history */}
              <DiamondCard className="bg-white border-slate-200 shadow-sm h-full">
                <DiamondCardHeader>
                  <DiamondCardTitle className="flex items-center text-slate-800">
                    <Activity className="h-5 w-5 mr-2 text-[#0072B8]" />
                    {t('patients.detail.history.title')}
                  </DiamondCardTitle>
                </DiamondCardHeader>
                <DiamondCardContent>
                  <div className="space-y-4">
                    {historique.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-1 ${item.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                        ></div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{item.statut}</p>
                          <p className="text-sm text-slate-600">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DiamondCardContent>
              </DiamondCard>
            </div>

            {/* Patient information */}
            <div className="flex flex-col gap-6">
              <DiamondCard className="bg-white border-slate-200 shadow-sm">
                <DiamondCardHeader>
                  <DiamondCardTitle className="flex items-center text-slate-800">
                    <User className="h-5 w-5 mr-2 text-[#0072B8]" />
                    {t('patients.detail.info.title')}
                  </DiamondCardTitle>
                </DiamondCardHeader>
                <DiamondCardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-600">{t('patients.detail.info.full_name')}</p>
                      <p className="font-medium">
                        {patientData.prenom} {patientData.nom}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{t('patients.detail.info.dob_age')}</p>
                      <p className="font-medium">
                        {patientData.dateNaissance} - {age} {t('common.years')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Category</p>
                      <p className="font-medium">{categorie}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{t('patients.detail.info.submission_date')}</p>
                      <p className="font-medium">{patientData.dateInscription}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{t('patients.detail.info.selected_pack')}</p>
                      <p className="font-medium">{currentTP.pack}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{t('patients.detail.info.validation_date')}</p>
                      <p className="font-medium">{currentTP.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{t('patients.detail.info.order')}</p>
                      <p className="font-medium">{commandeType}</p>
                    </div>
                    <Button
                      onClick={() => setOpenRestPackDialog(true)}
                      className="w-full bg-gradient-to-r from-[#0072B8] to-[#00B4D8] text-white text-base font-semibold px-5 py-3 h-11 rounded-lg shadow-2xl ring-2 ring-[#00B4D8]/30 hover:from-[#005a94] hover:to-[#0099cc] hover:shadow-[0_10px_25px_rgba(0,114,184,0.35)] transform hover:scale-105 transition-all duration-200"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      {t('patients.detail.info.order_remaining')}
                    </Button>
                  </div>
                </DiamondCardContent>
              </DiamondCard>

              <DiamondCard className="bg-gradient-to-br from-[#0072B8] to-[#00B4D8] text-white border-0 shadow-sm">
                <DiamondCardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{t('patients.detail.progress.overall')}</h3>
                    <div className="text-3xl font-bold mb-1">65%</div>
                    <p className="text-sm opacity-90">{t('patients.detail.progress.aligner')} {currentAligner}/{totalAligners}</p>
                  </div>
                </DiamondCardContent>
              </DiamondCard>
            </div>
          </div>
        )}

        {/* TP Check */}
        {activeTab === 'treatment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations du traitement - Gauche */}
              <DiamondCard className="bg-white border-slate-200 shadow-sm">
                <DiamondCardHeader>
                  <DiamondCardTitle className="flex items-center justify-between text-slate-800">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 mr-2 text-[#0072B8]" />
                      <span className="mr-2">TP Check</span>
                      <div className="flex items-center gap-1 ml-2">
                        {tpChecks.map((tp, idx) => (
                          <button
                            key={tp.id}
                            aria-label={`TP Check ${idx + 1}`}
                            onClick={() => setSelectedTPVersion(idx)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-200 ${selectedTPVersion === idx
                              ? 'bg-[#00B4D8] text-white border-[#0072B8] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-[#00B4D8]'
                              }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => setShow3DModal(true)}
                      className="bg-gradient-to-r from-[#0072B8] to-[#00B4D8] text-white text-base font-semibold px-5 py-3 h-11 rounded-lg shadow-2xl ring-2 ring-[#00B4D8]/30 hover:from-[#005a94] hover:to-[#0099cc] hover:shadow-[0_10px_25px_rgba(0,114,184,0.35)] transform hover:scale-105 transition-all duration-200"
                    >
                      <Maximize className="h-4 w-4 mr-2" />
                      {t('patients.detail.tp_check.view_tp')}
                    </Button>
                  </DiamondCardTitle>
                </DiamondCardHeader>
                <DiamondCardContent>
                  <div className="space-y-4">
                    <DiamondCard className="bg-gradient-to-br from-[#0072B8] to-[#00B4D8] text-white border-0">
                      <DiamondCardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-semibold mb-2">{t('patients.detail.tp_check.status_title')}</h3>
                          <div className="text-lg font-bold mb-1">{currentTP.status}</div>
                          <p className="text-sm opacity-90">{currentTP.date}</p>
                        </div>
                      </DiamondCardContent>
                    </DiamondCard>

                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600">{t('patients.detail.tp_check.patient_type')}</p>
                        <p className="font-medium text-slate-800">{currentTP.patientType}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600">{t('patients.detail.info.selected_pack')}</p>
                        <p className="font-medium text-slate-800">{currentTP.pack}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600">{t('patients.detail.tp_check.upper_steps')}</p>
                        <p className="font-medium text-slate-800">
                          {currentTP.stepsUpper} {t('patients.detail.tp_check.aligners')}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600">{t('patients.detail.tp_check.lower_steps')}</p>
                        <p className="font-medium text-slate-800">
                          {currentTP.stepsLower} {t('patients.detail.tp_check.aligners')}
                        </p>
                      </div>

                      <div
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100"
                        onClick={() => setOpenRhythmDialog(true)}
                        aria-label={t('patients.detail.tp_check.change_rhythm')}
                      >
                        <p className="text-sm text-slate-600">{t('patients.detail.tp_check.change_rhythm')}</p>
                        <p className="font-medium text-slate-800">{rythmeChangeDays} {t('patients.detail.tp_check.days')}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600">{t('patients.detail.tp_check.quote')}</p>
                        <p className="font-medium text-[#0072B8]">2100 DT HT</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600">{t('patients.detail.tp_check.discount')}</p>
                        <p className="font-medium text-green-600">-10%</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600">{t('patients.detail.tp_check.final_quote_excl')}</p>
                        <p className="font-medium text-[#0072B8]">1900 DT</p>
                      </div>

                      <div className="p-3 bg-gradient-to-br from-[#0072B8] to-[#00B4D8] text-white rounded-lg border-0">
                        <p className="text-sm opacity-90">{t('patients.detail.tp_check.final_quote_incl')}</p>
                        <p className="font-bold text-lg">
                          {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(devisFinalTTC)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        className="border-slate-300 text-slate-700 hover:bg-slate-50 flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t('patients.detail.tp_check.details')}
                      </Button>
                      <Button className="bg-[#0072B8] hover:bg-[#005a94] text-white flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        {t('patients.detail.tp_check.report')}
                      </Button>
                    </div>
                  </div>
                </DiamondCardContent>
              </DiamondCard>

              <div className="space-y-4">
                {/* Decision action buttons - Above the card */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setOpenValidationDialog(true)}
                    className="w-full flex-1 bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {t('patients.detail.tp_check.approve')}
                  </Button>
                  <Button
                    onClick={() => messageInputRef.current?.focus()}
                    className="w-full flex-1 bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Request Correction
                  </Button>
                  <Button className="w-full flex-1 bg-red-100 text-red-700 border border-red-200 hover:bg-red-200">
                    <X className="h-4 w-4 mr-2" />
                    {t('patients.detail.tp_check.reject')}
                  </Button>
                </div>

                {/* Dialog Validation Commande */}
                <Dialog open={openValidationDialog} onOpenChange={setOpenValidationDialog}>
                  <DialogContent className="bg-white sm:max-w-xl md:max-w-2xl md:left-[calc(50%+8rem)]">
                    <DialogHeader className="mb-3">
                      <DialogTitle>{t('patients.detail.tp_check.order_dialog_title')}</DialogTitle>
                      <DialogDescription>
                        Choose an option. The amount due on delivery adjusts automatically.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit((values) => {
                          const isTotal = values.commandeType === 'total'
                          setCommandeType(isTotal ? 'Full pack' : 'Half pack')
                          setOpenValidationDialog(false)
                        })}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="commandeType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('patients.detail.tp_check.order_option')}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                >
                                  <div
                                    className={`flex items-center gap-2 p-3 border rounded-md ${field.value === 'total'
                                      ? 'border-[#0072B8] bg-[#00B4D8]/10'
                                      : 'border-slate-200'
                                      }`}
                                  >
                                    <RadioGroupItem
                                      className="data-[state=checked]:border-[#0072B8]"
                                      value="total"
                                      id="commande-total"
                                    />
                                    <label htmlFor="commande-total" className="cursor-pointer">
                                      {t('patients.detail.tp_check.full_pack')}
                                    </label>
                                  </div>
                                  <div
                                    className={`flex items-center gap-2 p-3 border rounded-md ${field.value === 'moitie'
                                      ? 'border-[#0072B8] bg-[#00B4D8]/10'
                                      : 'border-slate-200'
                                      }`}
                                  >
                                    <RadioGroupItem
                                      className="data-[state=checked]:border-[#0072B8]"
                                      value="moitie"
                                      id="commande-moitie"
                                    />
                                    <label htmlFor="commande-moitie" className="cursor-pointer">
                                      {t('patients.detail.tp_check.half_pack')}
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Ligne de coupe */}
                        <FormField
                          control={form.control}
                          name="ligneDeCoupe"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">{t('patients.detail.tp_check.trim_line')}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
                                >
                                  <div
                                    className={`flex items-center gap-2 p-3 border rounded-md ${field.value === 'straight'
                                      ? 'border-[#0072B8] bg-[#00B4D8]/10'
                                      : 'border-slate-200'
                                      }`}
                                  >
                                    <RadioGroupItem
                                      className="data-[state=checked]:border-[#0072B8]"
                                      value="straight"
                                      id="cut-straight"
                                    />
                                    <label
                                      htmlFor="cut-straight"
                                      className="cursor-pointer text-sm"
                                    >
                                      {t('patients.detail.tp_check.straight_cut')}
                                    </label>
                                  </div>
                                  <div
                                    className={`flex items-center gap-2 p-3 border rounded-md ${field.value === 'extended_straight'
                                      ? 'border-[#0072B8] bg-[#00B4D8]/10'
                                      : 'border-slate-200'
                                      }`}
                                  >
                                    <RadioGroupItem
                                      className="data-[state=checked]:border-[#0072B8]"
                                      value="extended_straight"
                                      id="cut-extended"
                                    />
                                    <label
                                      htmlFor="cut-extended"
                                      className="cursor-pointer text-sm"
                                    >
                                      {t('patients.detail.tp_check.extended_straight')}
                                    </label>
                                  </div>
                                  <div
                                    className={`flex items-center gap-2 p-3 border rounded-md ${field.value === 'scalloped'
                                      ? 'border-[#0072B8] bg-[#00B4D8]/10'
                                      : 'border-slate-200'
                                      }`}
                                  >
                                    <RadioGroupItem
                                      className="data-[state=checked]:border-[#0072B8]"
                                      value="scalloped"
                                      id="cut-scalloped"
                                    />
                                    <label
                                      htmlFor="cut-scalloped"
                                      className="cursor-pointer text-sm"
                                    >
                                      {t('patients.detail.tp_check.scalloped')}
                                    </label>
                                  </div>
                                  <div
                                    className={`flex items-center gap-2 p-3 border rounded-md ${field.value === 'hybrid'
                                      ? 'border-[#0072B8] bg-[#00B4D8]/10'
                                      : 'border-slate-200'
                                      }`}
                                  >
                                    <RadioGroupItem
                                      className="data-[state=checked]:border-[#0072B8]"
                                      value="hybrid"
                                      id="cut-hybrid"
                                    />
                                    <label htmlFor="cut-hybrid" className="cursor-pointer text-sm">
                                      {t('patients.detail.tp_check.hybrid')}
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600">{t('patients.detail.tp_check.amount_to_pay')}</p>
                          <p className="font-medium text-[#0072B8]">
                            {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(
                              form.watch('commandeType') === 'moitie'
                                ? Math.round(devisFinalTTC * 0.6)
                                : devisFinalTTC
                            )}
                          </p>
                        </div>

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenValidationDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {t('common.confirm')}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                {/* Dialog Rythme de changement */}
                <Dialog open={openRhythmDialog} onOpenChange={setOpenRhythmDialog}>
                  <DialogContent className="bg-white sm:max-w-md md:left-[calc(50%+8rem)]">
                    <DialogHeader className="mb-3">
                      <DialogTitle>{t('patients.detail.tp_check.rhythm_dialog_title')}</DialogTitle>
                      <DialogDescription>{t('patients.detail.tp_check.rhythm_dialog_desc')}</DialogDescription>
                    </DialogHeader>

                    <Form {...rhythmForm}>
                      <form
                        onSubmit={rhythmForm.handleSubmit((values) => {
                          const days = Number(values.rhythm)
                          setRythmeChangeDays(days)
                          setOpenRhythmDialog(false)
                        })}
                        className="space-y-4"
                      >
                        <FormField
                          control={rhythmForm.control}
                          name="rhythm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">{t('patients.detail.tp_check.selection')}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                                >
                                  <div
                                    className={`flex items-center gap-2 p-3 border rounded-md transition ${field.value === '7'
                                      ? 'border-[#0072B8] bg-[#00B4D8]/10 ring-2 ring-[#0072B8]/20 shadow'
                                      : 'border-slate-200 shadow-sm'
                                      }`}
                                  >
                                    <RadioGroupItem
                                      className="h-5 w-5 border-2 rounded-full shadow-[inset_0_-1px_0_rgba(255,255,255,0.6),0_2px_0_rgba(0,0,0,0.08)] data-[state=checked]:border-[#0072B8] data-[state=checked]:bg-[#0072B8]"
                                      value="7"
                                      id="r7"
                                    />
                                    <label
                                      htmlFor="r7"
                                      className="cursor-pointer font-medium text-slate-800"
                                    >
                                      {t('patients.detail.tp_check.day_count').replace('{count}', '7')}
                                    </label>
                                  </div>
                                  <div
                                    className={`flex items-center gap-2 p-3 border rounded-md transition ${field.value === '10'
                                      ? 'border-[#0072B8] bg-[#00B4D8]/10 ring-2 ring-[#0072B8]/20 shadow'
                                      : 'border-slate-200 shadow-sm'
                                      }`}
                                  >
                                    <RadioGroupItem
                                      className="h-5 w-5 border-2 rounded-full shadow-[inset_0_-1px_0_rgba(255,255,255,0.6),0_2px_0_rgba(0,0,0,0.08)] data-[state=checked]:border-[#0072B8] data-[state=checked]:bg-[#0072B8]"
                                      value="10"
                                      id="r10"
                                    />
                                    <label
                                      htmlFor="r10"
                                      className="cursor-pointer font-medium text-slate-800"
                                    >
                                      {t('patients.detail.tp_check.day_count').replace('{count}', '10')}
                                    </label>
                                  </div>
                                  <div
                                    className={`flex items-center gap-2 p-3 border rounded-md transition ${field.value === '14'
                                      ? 'border-[#0072B8] bg-[#00B4D8]/10 ring-2 ring-[#0072B8]/20 shadow'
                                      : 'border-slate-200 shadow-sm'
                                      }`}
                                  >
                                    <RadioGroupItem
                                      className="h-5 w-5 border-2 rounded-full shadow-[inset_0_-1px_0_rgba(255,255,255,0.6),0_2px_0_rgba(0,0,0,0.08)] data-[state=checked]:border-[#0072B8] data-[state=checked]:bg-[#0072B8]"
                                      value="14"
                                      id="r14"
                                    />
                                    <label
                                      htmlFor="r14"
                                      className="cursor-pointer font-medium text-slate-800"
                                    >
                                      {t('patients.detail.tp_check.day_count').replace('{count}', '14')}
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenRhythmDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-[#0072B8] hover:bg-[#005a94] text-white"
                          >
                            {t('common.save')}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                {/* Section Messagerie - Droite */}
                <DiamondCard className="bg-white border-slate-200 shadow-sm">
                  <DiamondCardHeader>
                    <DiamondCardTitle className="flex items-center text-slate-800">
                      <MessageCircle className="h-5 w-5 mr-2 text-[#0072B8]" />
                      {t('patients.detail.tp_check.messages_title')}
                    </DiamondCardTitle>
                  </DiamondCardHeader>
                  <DiamondCardContent>
                    <div className="space-y-4">
                      {/* Messages existants */}
                      <div className="max-h-64 overflow-y-auto space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#0072B8] flex items-center justify-center text-white text-sm font-medium">
                            Dr
                          </div>
                          <div className="flex-1">
                            <div className="bg-slate-100 rounded-lg p-3">
                              <p className="text-sm text-slate-800">
                                The treatment plan has been approved. You can proceed with
                                manufacturing the aligners.
                              </p>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">01/10/2024 at 14:30</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-medium">
                            TP
                          </div>
                          <div className="flex-1">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-sm text-slate-800">
                                Thanks for the validation. Aligners will be ready in 5-7 business
                                days.
                              </p>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">01/10/2024 at 15:45</p>
                          </div>
                        </div>
                      </div>

                      {/* Zone de saisie nouveau message */}
                      <div className="border-t border-slate-200 pt-4">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <textarea
                              ref={messageInputRef}
                              placeholder={t('patients.detail.tp_check.type_message')}
                              className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-transparent"
                              rows={3}
                            />
                          </div>
                          <Button className="bg-[#0072B8] hover:bg-[#005a94] text-white self-end">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DiamondCardContent>
                </DiamondCard>
              </div>
            </div>
          </div>
        )}

        {/* Photos & Radios */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DiamondCard className="bg-white border-slate-200 shadow-sm">
                <DiamondCardHeader>
                  <div className="flex items-center justify-between w-full">
                    <DiamondCardTitle className="flex items-center text-slate-800">
                      <Image className="h-5 w-5 mr-2 text-[#0072B8]" />
                      {t('patients.detail.photos.initial_photos')}
                    </DiamondCardTitle>
                    <Badge variant="secondary">{initialPhotosCount}</Badge>
                  </div>
                </DiamondCardHeader>
                <DiamondCardContent>
                  {initialPhotosCount === 0 ? (
                    <div className="text-center py-8 min-h-[240px] flex flex-col items-center justify-center">
                      <Image className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">{t('patients.detail.photos.no_photos')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 min-h-[240px]">
                      {initialPhotos.slice(0, 6).map((p) => (
                        <div
                          key={p.id}
                          className="rounded-md overflow-hidden border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={p.url}
                            alt={p.label ?? 'Initial photo'}
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </DiamondCardContent>
                <DiamondCardFooter>
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    disabled={initialPhotosCount === 0}
                  >
                    {t('patients.detail.photos.view_gallery')}
                  </Button>
                </DiamondCardFooter>
              </DiamondCard>

              <DiamondCard className="bg-white border-slate-200 shadow-sm">
                <DiamondCardHeader>
                  <div className="flex items-center justify-between w-full">
                    <DiamondCardTitle className="flex items-center text-slate-800">
                      <FileText className="h-5 w-5 mr-2 text-[#0072B8]" />
                      {t('patients.detail.photos.x_rays')}
                    </DiamondCardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{radioCount}</Badge>
                      <Button
                        onClick={() => setShowCephModal(true)}
                        className="bg-gradient-to-r from-[#0072B8] to-[#00B4D8] text-white text-sm px-4 py-2 h-9 rounded-md shadow-md hover:shadow-lg hover:from-[#005a94] hover:to-[#0099cc] transition-all"
                      >
                        {t('patients.detail.photos.view_ceph')}
                      </Button>
                    </div>
                  </div>
                </DiamondCardHeader>
                <DiamondCardContent>
                  {radioCount === 0 ? (
                    <div className="text-center py-8 min-h-[240px] flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">{t('patients.detail.photos.no_xrays')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 min-h-[240px]">
                      {radioImages.slice(0, 6).map((p) => (
                        <div
                          key={p.id}
                          className="rounded-md overflow-hidden border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={p.url}
                            alt={p.label ?? 'X-ray'}
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </DiamondCardContent>
                <DiamondCardFooter>
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    disabled={radioCount === 0}
                  >
                    {t('patients.detail.photos.view_gallery')}
                  </Button>
                </DiamondCardFooter>
              </DiamondCard>
            </div>

            {/* MyDiamond App – carte avec titre et icône smartphone */}
            <DiamondCard className="bg-white border-slate-200 shadow-sm">
              <DiamondCardHeader>
                <DiamondCardTitle className="flex items-center text-slate-800">
                  <Smartphone className="h-5 w-5 mr-2 text-[#0072B8]" />
                  {t('patients.detail.photos.my_diamond_title')}
                </DiamondCardTitle>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-base font-medium">
                      {t('patients.detail.photos.uploaded_photos')}
                    </div>
                  </div>
                  <Button className="bg-emerald-600 text-white hover:bg-emerald-600/90">
                    <Download /> {t('patients.detail.photos.download_all')}
                  </Button>
                </div>
                <div className="rounded-md border p-3 text-sm text-muted-foreground">
                  {t('patients.detail.photos.follow_up_desc')}
                </div>
                <div className="space-y-8">
                  {weeks.map((w, wi) => (
                    <div key={wi} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-muted-foreground" />
                        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs">
                          <Camera className="size-4" />
                          <span>
                            {w.label} • {w.date}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {w.photos.map((p, pi) => (
                          <div
                            key={pi}
                            className="relative aspect-video rounded-md overflow-hidden"
                            style={{
                              background:
                                'linear-gradient(180deg, rgba(238,242,255,1) 0%, rgba(237,233,254,1) 50%, rgba(219,234,254,1) 100%)',
                            }}
                          >
                            <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                              <Camera className="size-8" />
                            </div>
                            {('title' in p && (p as any).title) && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/25 text-white text-xs px-3 py-2">
                                {(p as any).title}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </DiamondCardContent>
            </DiamondCard>
          </div>
        )}

        {/* Avancement */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {(() => {
              const heroId = advOrder[0] ?? 'progress'
              return (
                <div
                  key={heroId}
                  draggable
                  role="listitem"
                  aria-grabbed={dragOverAdvId === heroId}
                  onDragStart={() => onAdvDragStart(heroId)}
                  onDragOver={(e) => onAdvDragOver(heroId, e)}
                  onDrop={() => onAdvDrop(heroId)}
                  className={`cursor-move ${dragOverAdvId === heroId ? 'ring-2 ring-[#00B4D8] rounded-lg' : ''
                    }`}
                >
                  {renderAdvCard(heroId, { hero: true })}
                </div>
              )
            })()}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" role="list">
              {advOrder.slice(1).map((cid) => (
                <div
                  key={cid}
                  draggable
                  role="listitem"
                  aria-grabbed={dragOverAdvId === cid}
                  onDragStart={() => onAdvDragStart(cid)}
                  onDragOver={(e) => onAdvDragOver(cid, e)}
                  onDrop={() => onAdvDrop(cid)}
                  className={`cursor-move ${dragOverAdvId === cid ? 'ring-2 ring-[#00B4D8] rounded-lg' : ''
                    }`}
                >
                  {renderAdvCard(cid)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal 3D plein écran */}
      {show3DModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <Package className="h-6 w-6 mr-2 text-[#0072B8]" />
                Visualiseur 3D - Plan de traitement
              </h2>
              <Button
                onClick={() => setShow3DModal(false)}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-6">
              <div className="bg-slate-50 rounded-lg border border-slate-200 h-full flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-24 w-24 text-slate-400 mx-auto mb-6" />
                  <p className="text-slate-600 font-medium text-lg mb-2">
                    3D Treatment Plan Viewer
                  </p>
                  <p className="text-slate-500">{t('patients.detail.tp_check.view_3d_desc')}</p>
                  <p className="text-sm text-slate-400 mt-4">• 360° rotation</p>
                  <p className="text-sm text-slate-400">• Zoom and navigation</p>
                  <p className="text-sm text-slate-400">• Step-by-step visualization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Analyse Céphalométrique (iframe) */}
      {showCephModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-[#0072B8]" />
                {t('patients.detail.photos.view_ceph')}
              </h2>
              <Button
                onClick={() => setShowCephModal(false)}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-6">
              <div className="bg-slate-50 rounded-lg border border-slate-200 h-full overflow-hidden">
                <iframe
                  title="Cephalometric analysis"
                  src={cephalometricUrl}
                  className="w-full h-full rounded-md"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Photos MyDiamond */}
      {showPatientPhotosModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <Image className="h-6 w-6 mr-2 text-[#0072B8]" />
                {t('patients.detail.photos.uploaded_photos')}
              </h2>
              <Button
                onClick={() => setShowPatientPhotosModal(false)}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-6">
              <div className="bg-slate-50 rounded-lg border border-slate-200 h-full overflow-auto p-4">
                {myDiamondPhotos.length === 0 ? (
                  <div className="text-center py-16">
                    <Image className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">
                      Aucune photo MyDiamond disponible pour ce patient
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {myDiamondPhotos.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-md overflow-hidden border border-slate-200 bg-white"
                      >
                        <img
                          src={p.url}
                          alt={`Photo ${p.id}`}
                          className="w-full h-40 object-cover"
                        />
                        <div className="px-3 py-2 border-t border-slate-200">
                          <p className="text-xs text-slate-500">{t('patients.detail.photos.imported_on')} {p.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Viewer Galerie Générique */}
      {showGalleryModal && galleryPhotos.length > 0 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">{galleryTitle}</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">
                  {galleryIndex + 1} / {galleryPhotos.length}
                </span>
                <Button
                  onClick={closeGallery}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Aperçu principal */}
              <div className="lg:col-span-3 flex items-center justify-center bg-slate-50">
                <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
                  <img
                    src={galleryPhotos[galleryIndex].url}
                    alt={`Photo ${galleryIndex + 1}`}
                    className="max-h-[70vh] max-w-full object-contain"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <Button
                      onClick={prevPhoto}
                      variant="ghost"
                      className="text-slate-700 hover:bg-white/70"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button
                      onClick={nextPhoto}
                      variant="ghost"
                      className="text-slate-700 hover:bg-white/70"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
              {/* Miniatures */}
              <div className="lg:col-span-2 p-4 overflow-auto">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {galleryPhotos.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setGalleryIndex(idx)}
                      className={`relative rounded-md overflow-hidden border ${idx === galleryIndex ? 'border-[#00B4D8]' : 'border-slate-200'
                        } bg-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]`}
                    >
                      <img
                        src={p.url}
                        alt={`Miniature ${idx + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientDetailPage
