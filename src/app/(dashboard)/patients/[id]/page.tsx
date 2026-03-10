'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { auth, db } from '@/firebase/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc/client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import manProfileImg from '@/assets/img/man profile.png'
import manFrontNoSmilingImg from '@/assets/img/man front no smiling.png'
import manFrontSmilingImg from '@/assets/img/man font smiling.png'
import upperScanPlaceholderImg from '@/assets/img/upper scan.png'
import lowerScanPlaceholderImg from '@/assets/img/lower scan.png'
import panoramicImg from '@/assets/img/panoramic final.png'
import lateralXrayImg from '@/assets/img/lateral x ray.png'
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
  Play,
  Scan,
  Maximize2,
  CheckCircle,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import clipLogo from '@/assets/img/CliP blanc- logo.png'
import TreatmentPlanViewer3D from '@/components/TreatmentPlanViewer3D'
import { Card, CardContent } from '@/components/ui/card'
import { ScanViewer } from '@/components/3d/ScanViewer'

interface Patient {
  id: string
  name: string
  surname: string
  age: string
  birthDate: string
  gender?: string
  phone: string
  email?: string
  createdAt: unknown
  userId: string
  photos?: any
  radiographies?: any
  scans?: any
  history?: any[]
}

const PatientDetailPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const patientId = params?.id as string | undefined

  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { data: session, isPending: sessionPending } = authClient.useSession()
  const utils = trpc.useUtils()
  const currentUserId = session?.user?.id || ''
  const updateScansMutation = trpc.patients.updateScans.useMutation()
  const addHistoryEventMutation = trpc.patients.addHistoryEvent.useMutation()

  const appendHistoryEvent = (date: string, statut: string, type: 'success' | 'info' | 'error') => {
    if (patientId) {
      addHistoryEventMutation.mutateAsync({
        id: patientId,
        event: { date, statut, type }
      }).catch(err => console.error("Failed to append history", err))

      setPatient((prev: any) => {
        if (!prev) return prev;
        const currentHistory = Array.isArray(prev.history) ? prev.history : [];
        return {
          ...prev,
          history: [{ date, statut, type }, ...currentHistory]
        }
      })
    }
  }

  const addMessageMutation = trpc.tpchecks.addMessage.useMutation()

  const { data: fetchedPatient, isLoading: trpcLoading, error: trpcError } = trpc.patients.getById.useQuery(
    { id: patientId! },
    { enabled: !!patientId && !!currentUserId, retry: 1 }
  )

  const { data: casesData } = trpc.cases.getByPatientId.useQuery(
    { patientId: patientId! },
    { enabled: !!patientId }
  )
  const currentCase = casesData?.[0] as any
  console.log("🔥 fetched case tpchecks:", currentCase?.tpCheckVersions)
  const globalStatus = currentCase?.globalStatus || 'EN_PLANIFICATION'

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
  const [activeTPTab, setActiveTPTab] = useState('initial')
  const [show3DModal, setShow3DModal] = useState(false)
  const [override3DUrl, setOverride3DUrl] = useState<string | null>(null)
  const [showCephModal, setShowCephModal] = useState(false)
  const [isCephLoading, setIsCephLoading] = useState(true)
  // Lien réel inséré par DiamondSuite via la base de données (au niveau du Case)
  const cephalometricUrl = currentCase?.cephUrl || null
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  // Eterna Scan Dialog states
  const [showEternaScanDialog, setShowEternaScanDialog] = useState(false)
  const [eternaScans, setEternaScans] = useState<{ upper: File | string | null; lower: File | string | null }>({
    upper: null,
    lower: null
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [eternaUploadTarget, setEternaUploadTarget] = useState<'upper' | 'lower' | null>(null)
  const [eternaScanMode, setEternaScanMode] = useState<'scanner' | 'link'>('scanner')
  const [eternaScanLink, setEternaScanLink] = useState('')

  // Treatment finished state
  const [isTreatmentFinished, setIsTreatmentFinished] = useState(false)

  useEffect(() => {
    if (globalStatus) {
      setTreatmentStarted(globalStatus === 'EN_TRAITEMENT' || globalStatus === 'TRAITEMENT_TERMINE')
      setIsTreatmentFinished(globalStatus === 'TRAITEMENT_TERMINE')
    }
  }, [globalStatus])
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const [previewFile, setPreviewFile] = useState<{ file: File | string, title: string } | null>(null)
  const [otherPhotosCount, setOtherPhotosCount] = useState(0)

  const handleEternaUploadClick = (target: 'upper' | 'lower') => {
    setEternaUploadTarget(target)
    if (fileInputRef.current) {
      fileInputRef.current.accept = '.stl,.ply,.obj'
      fileInputRef.current.click()
    }
  }

  const handleEternaFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['stl', 'ply', 'obj'].includes(ext || '')) {
      alert(t('patients.new.alerts.file_format'))
      event.target.value = ''
      return
    }

    if (eternaUploadTarget) {
      setEternaScans((prev) => ({
        ...prev,
        [eternaUploadTarget]: file,
      }))
    }

    event.target.value = ''
    event.target.value = ''
    setEternaUploadTarget(null)
  }

  // Refinement Dialog states
  const [showRefinementConfirm, setShowRefinementConfirm] = useState(false)
  const [showRefinementUpload, setShowRefinementUpload] = useState(false)
  const [refinementPhotos, setRefinementPhotos] = useState<Record<string, string | null>>({})
  const [refinementScans, setRefinementScans] = useState<{ upper: File | null; lower: File | null }>({
    upper: null,
    lower: null
  })
  const [refinementScanMode, setRefinementScanMode] = useState<'scanner' | 'link'>('scanner')
  const [refinementScanLink, setRefinementScanLink] = useState('')
  const [refinementUploadTarget, setRefinementUploadTarget] = useState<'upper' | 'lower' | null>(null)
  const refinementFileInputRef = useRef<HTMLInputElement>(null)

  const [refinementPhotoTarget, setRefinementPhotoTarget] = useState<string | null>(null)
  const refinementPhotoInputRef = useRef<HTMLInputElement>(null)

  const handleRefinementPhotoUploadClick = (key: string) => {
    setRefinementPhotoTarget(key)
    if (refinementPhotoInputRef.current) {
      refinementPhotoInputRef.current.accept = 'image/*'
      refinementPhotoInputRef.current.click()
    }
  }

  const handleRefinementPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert(t('patients.new.alerts.file_format'))
      event.target.value = ''
      return
    }

    if (refinementPhotoTarget) {
      setRefinementPhotos((prev) => ({
        ...prev,
        [refinementPhotoTarget]: URL.createObjectURL(file),
      }))
    }

    event.target.value = ''
    setRefinementPhotoTarget(null)
  }

  const handleRefinementUploadClick = (target: 'upper' | 'lower') => {
    setRefinementUploadTarget(target)
    if (refinementFileInputRef.current) {
      refinementFileInputRef.current.accept = '.stl,.ply,.obj'
      refinementFileInputRef.current.click()
    }
  }

  const handleRefinementFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['stl', 'ply', 'obj'].includes(ext || '')) {
      alert(t('patients.new.alerts.file_format'))
      event.target.value = ''
      return
    }

    if (refinementUploadTarget) {
      setRefinementScans((prev) => ({
        ...prev,
        [refinementUploadTarget]: file,
      }))
    }

    event.target.value = ''
    setRefinementUploadTarget(null)
  }

  const handleReject = async () => {
    if (!patientId) return
    try {
      const patientDocRef = doc(db, 'patients', patientId)
      await updateDoc(patientDocRef, {
        status: 6,
        updatedAt: new Date()
      })
      router.push('/patients')
    } catch (error) {
      console.error('Error rejecting patient:', error)
      alert(t('patients.detail.alerts.reject_error'))
    }
  }

  const followUpStages = [
    {
      label: `Étape 20`,
      date: '10/12/2025',
      photos: [
        { title: 'Photo avec aligneurs', url: '/images/p3.png' },
        { title: 'Photo sans aligneurs', url: '/images/p2.png' },
      ],
    },
    {
      label: `Étape 15`,
      date: '03/12/2025',
      photos: [
        { title: 'Photo avec aligneurs' },
        { title: 'Photo sans aligneurs' },
      ],
    },
    {
      label: `Étape 10`,
      date: '26/11/2025',
      photos: [
        { title: 'Photo avec aligneurs' },
        { title: 'Photo sans aligneurs' },
      ],
    },
    {
      label: `Étape 5`,
      date: '19/11/2025',
      photos: [
        { title: 'Photo avec aligneurs' },
        { title: 'Photo sans aligneurs' },
      ],
    },
  ]

  // Données
  const patientData = {
    nom: patient?.surname || 'Dubois',
    prenom: patient?.name || 'Marie',
    dateNaissance: patient?.birthDate ?
      (typeof patient.birthDate === 'object' && (patient.birthDate as any).day
        ? `${(patient.birthDate as any).day}/${(patient.birthDate as any).month}/${(patient.birthDate as any).year}`
        : String(patient.birthDate))
      : '15/03/1992',
    numeroPatient: patient?.id ? `PT-${patient.id.substring(0, 8).toUpperCase()}` : 'PT-2024-1547',
    email: patient?.email || 'marie.dubois@email.com',
    telephone: patient?.phone || '+33 6 12 34 56 78',
    dateInscription: patient?.createdAt ? new Date(patient.createdAt as string).toLocaleDateString('fr-FR') : '12/01/2024',
    // Type de commande: "Totalité du pack" ou "Moitié du pack"
    commandeType: 'Totalité du pack',
    sexe: patient?.gender === 'Male' ? t('patients.new.details.male') : patient?.gender === 'Female' ? t('patients.new.details.female') :
      (patient?.gender ? patient.gender : t('patients.new.details.female')),
  }

  // Injecter "Cas soumis" comme premier événement historique lors de la création
  const baseHistory = [{
    date: patientData.dateInscription,
    statut: 'Cas soumis',
    type: 'info'
  }];
  const events = (currentCase as any)?.treatmentEvents || [];
  const historique = [
    ...baseHistory,
    ...events.map((e: any) => ({
      date: new Date(e.date).toLocaleDateString('fr-TN'),
      statut: e.description || e.type,
      type: e.type.includes('APPROVED') || e.type.includes('STARTED') || e.type.includes('LIVRAISON') ? 'success' : 'info'
    }))
  ];

  const initialTpChecksList = (currentCase as any)?.tpCheckVersions?.filter((tp: any) => !tp.correctionId).map((tp: any) => ({
    id: tp.id,
    date: new Date(tp.createdAt).toLocaleDateString('fr-TN'),
    status: tp.status === 'APPROVED' ? t('patients.detail.status.validated') || 'Validé' : tp.status === 'REJECTED' ? t('patients.detail.status.rejected') || 'Rejeté' : 'En attente',
    patientType: (currentCase as any)?.patientType || 'Adulte',
    pack: tp.pack || (currentCase as any)?.pack || '',
    stepsUpper: tp.stepsUpper || 0,
    stepsLower: tp.stepsLower || 0,
    rhythm: tp.rhythm || '7',
    quoteHT: tp.quoteHT || 0,
    discount: tp.discount || 0,
    url: tp.url,
    message: tp.message,
    messages: tp.messages,
  })) || []

  // Liste des TP Checks dynamique
  const [tpChecksList, setTpChecksList] = useState<any[]>(initialTpChecksList)

  useEffect(() => {
    if (initialTpChecksList.length > 0) {
      setTpChecksList(initialTpChecksList)
    }
  }, [(currentCase as any)?.tpCheckVersions])

  const isLivred = events.some((e: any) => e.type === 'LIVRAISON_SET')

  // Un TP est considéré comme validé si le statut global est EN_PRODUCTION (ou au-delà)
  // On n'attend plus la livraison ('isLivred') pour pouvoir commencer le traitement
  const canStartTreatment = (currentCase as any)?.tpCheckVersions?.some((tp: any) => tp.status === 'APPROVED' || tp.status === 'Validé') || globalStatus === 'EN_PRODUCTION' || globalStatus === 'EN_TRAITEMENT'
  const startTreatmentMutation = trpc.cases.startTreatment.useMutation()

  // Correction events
  const correctionsTabs = (currentCase as any)?.corrections || []

  // Photos envoyées par le patient depuis MyDiamond (données simulées)
  const myDiamondPhotos: { id: string; url: string; date: string }[] = [
    { id: 'md-1', url: '/images/p1.png', date: '2024-10-01' },
    { id: 'md-2', url: '/images/p2.png', date: '2024-10-01' },
    { id: 'md-3', url: '/images/p3.png', date: '2024-10-01' },
    { id: 'md-4', url: '/images/p4.png', date: '2024-10-15' },
    { id: 'md-5', url: '/images/p5.png', date: '2024-10-15' },
    { id: 'md-6', url: '/images/p6.png', date: '2024-10-15' },
  ]
  const photoMapping: Record<string, string> = {
    face_profile: 'image1',
    face_front: 'image2',
    face_smile: 'image3',
    teeth_maxillary: 'image4',
    teeth_mandibular: 'image6',
    teeth_right: 'image7',
    teeth_front: 'image8',
    teeth_left: 'image9',
  };

  const initialPhotos: { id: string; url: string; label?: string }[] = Object.entries((patient?.photos as any) || {})
    .map(([key, val]: any) => {
      return {
        id: photoMapping[key] || key,
        url: val?.url || '',
        label: key
      }
    })
    .filter(p => p.url);

  const radioMapping: Record<string, string> = {
    panoramic: 'panoramic',
    xray_profile: 'xray_profile'
  };

  const radioImages: { id: string; url: string; label?: string }[] = Object.entries((patient?.radiographies as any) || {})
    .map(([key, val]: any) => {
      return {
        id: radioMapping[key] || key,
        url: val?.url || '',
        label: key
      }
    })
    .filter(p => p.url);

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
  const currentTP = tpChecksList[selectedTPVersion] ?? tpChecksList[0] ?? {}
  const hasValidatedTP = tpChecksList.some(tp => tp.status === t('patients.detail.status.validated') || tp.status === 'Validated' || tp.status === 'Validé')

  // Données d'avancement (démo - bloquées à 0 en planification)
  const isPlanification = globalStatus === 'EN_PLANIFICATION'

  const progressPercent = isPlanification ? 0 : 65
  const currentAligner = isPlanification ? 0 : 8
  const totalAligners = isPlanification ? 0 : 24
  const remainingDays = isPlanification ? 0 : 75
  // Démos de pourcentages pour anneaux complémentaires
  const alignerPercent = isPlanification || totalAligners === 0 ? 0 : Math.round((currentAligner / totalAligners) * 100)
  const totalDays = isPlanification ? 0 : 90 // nombre de jours total estimé (démo)
  const remainingDaysPercent = isPlanification || totalDays === 0 ? 0 : Math.round((remainingDays / totalDays) * 100)
  // Démo: jours jusqu’au prochain aligneur
  const daysBetweenAligners = isPlanification ? 0 : 7 // intervalle standard (démo)
  const daysToNextAligner = isPlanification ? 0 : 3 // jours restants avant prochain aligneur (démo)
  const nextAlignerPercent = isPlanification || daysBetweenAligners === 0 ? 0 : Math.round((daysToNextAligner / daysBetweenAligners) * 100)
  const progressHistory = isPlanification ? [0] : [50, 55, 57, 60, 62, 65, 66, 68]
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
  // Dialog: start treatment
  const [openStartTreatmentDialog, setOpenStartTreatmentDialog] = useState(false)
  const [startTreatmentDate, setStartTreatmentDate] = useState<string>(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  })
  const [treatmentStarted, setTreatmentStarted] = useState(false)

  // Dynamic Calculation of TP Check Financials
  const quoteHT = currentTP?.quoteHT || 0
  const discount = currentTP?.discount || 0
  const isDiscountPercent = discount <= 100 && discount > 0
  const finalQuoteHT = isDiscountPercent ? quoteHT * (1 - discount / 100) : Math.max(0, quoteHT - discount)
  const devisFinalTTC = finalQuoteHT * 1.19 // TVA Tunisienne: 19%
  const tpRhythm = currentTP?.rhythm || '7'

  const hasTreatmentStarted = globalStatus === 'EN_TRAITEMENT' || globalStatus === 'TRAITEMENT_TERMINE' || treatmentStarted

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
          <DiamondCard className={`bg-white border-slate-200 shadow-sm flex flex-col ${cardMinH}`}>
            <DiamondCardHeader>
              <DiamondCardTitle className="text-center text-slate-800">
                {isTreatmentFinished ? 'Traitement terminé' : t('patients.detail.cards.progress')}
              </DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent className={`text-center flex-1 flex flex-col justify-center items-center ${contentPadding}`}>
              {!hasTreatmentStarted ? (
                <div className="flex flex-col items-center justify-center space-y-3 px-2">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-snug">
                    {!hasValidatedTP
                      ? "Veuillez valider votre TP Check."
                      : "Veuillez confirmer le début de traitement."}
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className={`relative mx-auto mb-4 ${ringSize} rounded-full`}
                    style={{
                      background: isTreatmentFinished
                        ? `conic-gradient(#10b981 360deg, #e2e8f0 0)` /* Emerald green for finished */
                        : `conic-gradient(#0072B8 ${progressPercent * 3.6}deg, #e2e8f0 0)`,
                    }}
                    aria-label={isTreatmentFinished ? 'Treatment Finished 100%' : `Progress ${progressPercent}%`}
                  >
                    <div className="absolute inset-2 bg-white rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`font-bold ${isTreatmentFinished ? 'text-emerald-500' : 'text-slate-800'} ${hero ? 'text-2xl' : 'text-xl'}`}>
                        {isTreatmentFinished ? '100%' : `${progressPercent === 65 ? 0 : progressPercent}%`}
                      </span>
                    </div>
                  </div>
                  {!isTreatmentFinished && (
                    <p className={`text-sm text-slate-600 ${subtitleMargin}`}>
                      {t('patients.detail.cards.estimated')}
                    </p>
                  )}
                </>
              )}
            </DiamondCardContent>
          </DiamondCard>
        )
      case 'current':
        return (
          <DiamondCard className={`bg-white border-slate-200 shadow-sm ${cardMinH}`}>
            <DiamondCardHeader>
              <DiamondCardTitle className="text-center text-slate-800">
                {isTreatmentFinished ? 'Aligners' : t('patients.detail.cards.current')}
              </DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent className={`text-center ${contentPadding}`}>
              <div
                className={`relative mx-auto mb-4 ${ringSize} rounded-full`}
                style={{
                  background: isTreatmentFinished
                    ? `conic-gradient(#10b981 360deg, #e2e8f0 0)` /* Emerald green for finished */
                    : `conic-gradient(#0072B8 ${alignerPercent * 3.6}deg, #e2e8f0 0)`,
                }}
                aria-label={isTreatmentFinished ? `Completed ${totalAligners} out of ${totalAligners} (100%)` : `Current aligner ${currentAligner} out of ${totalAligners} (${alignerPercent}%)`}
              >
                <div className="absolute inset-2 bg-white rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-bold ${isTreatmentFinished ? 'text-emerald-500' : 'text-[#0072B8]'} ${hero ? 'text-2xl' : 'text-xl'}`}>
                    {isTreatmentFinished ? totalAligners : currentAligner}
                  </span>
                </div>
              </div>
              <p className={`text-sm ${isTreatmentFinished ? 'text-emerald-600 font-medium' : 'text-slate-600'} ${subtitleMargin}`}>
                {isTreatmentFinished ? 'Toutes les gouttières portées' : t('patients.detail.cards.out_of').replace('{total}', String(totalAligners))}
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
    if (!sessionPending && !session) {
      router.push('/signin')
    }
  }, [session, sessionPending, router])

  useEffect(() => {
    if (!patientId) {
      setIsLoading(false)
      router.push('/patients')
      return
    }

    if (!trpcLoading) {
      if (fetchedPatient) {
        setPatient({
          ...(fetchedPatient as any),
          age: String((fetchedPatient as any).birthDate ? calculateAgeFromFrenchDate(String((fetchedPatient as any).birthDate)) : 0),
          phone: '',
          email: '',
          userId: (fetchedPatient as any).userId
        } as any)
      }
      setIsLoading(false)
    }
  }, [fetchedPatient as any, trpcLoading, patientId, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0072B8]"></div>
      </div>
    )
  }

  if (trpcError || (!fetchedPatient && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-800">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Patient introuvable</h1>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          {trpcError?.message || "Désolé, nous n'avons pas pu trouver ce patient. Assurez-vous que l'URL est correcte ou que le patient n'a pas été supprimé."}
        </p>
        <Button onClick={() => router.push('/patients')} className="bg-[#0072B8]">
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {patientData.prenom} {patientData.nom}
              </h1>
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
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Actions rapides */}
              <DiamondCard className="bg-white border-slate-200 shadow-sm">
                <DiamondCardHeader>
                  <DiamondCardTitle className="flex items-center text-slate-800">
                    <Activity className="h-5 w-5 mr-2 text-[#0072B8]" />
                    {t('patients.detail.quick_actions.title')}
                  </DiamondCardTitle>
                </DiamondCardHeader>
                <DiamondCardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Button
                      onClick={() => {
                        const allTPChecks = [
                          ...(currentCase?.tpCheckVersions || []),
                          ...(currentCase?.corrections || []).flatMap((c: any) => c.tpChecks || [])
                        ];
                        const approvedTPCheck = allTPChecks.find(tp => tp.status === 'APPROVED');
                        if (approvedTPCheck?.url) {
                          setOverride3DUrl(approvedTPCheck.url);
                        }
                        setShow3DModal(true);
                      }}
                      disabled={!treatmentStarted}
                      className="w-full bg-blue-100 text-[#0072B8] border border-blue-200 hover:bg-blue-200 px-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                    >
                      <Play className="h-4 w-4 mr-2 fill-current flex-shrink-0" />
                      <span className="truncate">TP Check validé</span>
                    </Button>
                    <Button
                      onClick={() => setShowRefinementConfirm(true)}
                      disabled={!treatmentStarted || isTreatmentFinished}
                      className="w-full bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200 px-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                    >
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Demander une finition</span>
                    </Button>
                    <Button
                      onClick={() => setShowEternaScanDialog(true)}
                      disabled={!treatmentStarted}
                      className="w-full bg-sky-100 text-sky-700 border border-sky-200 hover:bg-sky-200 px-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                    >
                      <Moon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{t('patients.detail.actions.order_eterna')}</span>
                    </Button>
                    <Button
                      onClick={() => setShowFinishConfirm(true)}
                      disabled={!treatmentStarted || isTreatmentFinished}
                      className="w-full bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 px-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                    >
                      <Check className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{t('patients.detail.actions.finish')}</span>
                    </Button>
                  </div>
                </DiamondCardContent>
              </DiamondCard>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleEternaFileChange}
              />
              <input
                type="file"
                ref={refinementFileInputRef}
                className="hidden"
                onChange={handleRefinementFileChange}
              />
              <input
                type="file"
                ref={refinementPhotoInputRef}
                className="hidden"
                onChange={handleRefinementPhotoChange}
              />

              {/* Dialog Commencer le traitement */}
              <Dialog open={openStartTreatmentDialog} onOpenChange={setOpenStartTreatmentDialog}>
                <DialogContent className="bg-white sm:max-w-md md:left-[calc(50%+8rem)]">
                  <DialogHeader className="mb-3">
                    <DialogTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      Commencer le traitement
                    </DialogTitle>
                    <DialogDescription>
                      Confirmez la date de début du traitement pour ce patient.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-600 mb-2">Date de début</p>
                      <input
                        type="date"
                        value={startTreatmentDate}
                        onChange={(e) => setStartTreatmentDate(e.target.value)}
                        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0072B8]/40 focus:border-[#0072B8]"
                      />
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenStartTreatmentDialog(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={async () => {
                        setOpenStartTreatmentDialog(false)
                        setTreatmentStarted(true)
                        const [y, m, d] = startTreatmentDate.split('-')
                        const formattedDate = `${d}/${m}/${y}`
                        if (currentCase) {
                          await startTreatmentMutation.mutateAsync({ id: currentCase.id })
                          // refresh or optimistic update
                          utils.cases.getByPatientId.invalidate({ patientId: patientId! })
                          utils.patients.getById.invalidate({ id: patientId! })
                        }
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
                          className="bg-[#0072B8] hover:bg-[#005fa3] text-white"
                        >
                          Confirmer
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Treatment history */}
              <DiamondCard className="bg-white border-slate-200 shadow-sm h-full flex flex-col">
                <DiamondCardHeader className="shrink-0">
                  <DiamondCardTitle className="flex items-center text-slate-800">
                    <Activity className="h-5 w-5 mr-2 text-[#0072B8]" />
                    {t('patients.detail.history.title')}
                  </DiamondCardTitle>
                </DiamondCardHeader>
                <DiamondCardContent className="flex-1 overflow-y-auto max-h-[280px] 2xl:max-h-[450px] pr-2 custom-scrollbar">
                  <div className="space-y-4">
                    {historique.map((item: any, index: number) => (
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
            <div className="flex flex-col gap-4">
              <DiamondCard className="bg-white border-slate-200 shadow-sm">
                <DiamondCardHeader className="pb-2">
                  <div className="flex flex-col items-center">
                    <DiamondCardTitle className="flex w-full items-center text-slate-800 mb-4">
                      <User className="h-5 w-5 mr-2 text-[#0072B8]" />
                      {t('patients.detail.info.title')}
                    </DiamondCardTitle>
                    <Avatar className="h-36 w-36 border-2 border-white shadow-sm ring-1 ring-slate-100 mb-2">
                      <AvatarImage src={patient?.photos?.image2?.url || patient?.photos?.image1?.url} alt="Profile" className="object-cover" />
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-semibold text-4xl">
                        {patientData.prenom?.[0]}{patientData.nom?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DiamondCardHeader>
                <DiamondCardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                      <div>
                        <p className="text-xs text-slate-500">{t('patients.detail.info.full_name')}</p>
                        <p className="text-sm font-medium truncate" title={`${patientData.prenom} ${patientData.nom}`}>
                          {patientData.prenom} {patientData.nom}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{t('patients.detail.info.dob_age')}</p>
                        <p className="text-sm font-medium truncate">
                          {patientData.dateNaissance} ({age} {t('common.years')})
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Category</p>
                        <p className="text-sm font-medium truncate">{categorie}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{t('patients.detail.info.submission_date')}</p>
                        <p className="text-sm font-medium truncate">{patientData.dateInscription}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{t('patients.detail.info.selected_pack')}</p>
                        <p className="text-sm font-medium truncate" title={currentTP.pack}>{currentTP.pack}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{t('patients.detail.info.validation_date')}</p>
                        <p className="text-sm font-medium truncate">{currentTP.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{t('patients.detail.info.order')}</p>
                        <p className="text-sm font-medium truncate" title={commandeType}>{commandeType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Valeur jusqu'au</p>
                        <p className="text-sm font-medium truncate">30/12/2026</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Button
                        onClick={() => setOpenStartTreatmentDialog(true)}
                        disabled={treatmentStarted || !canStartTreatment}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold px-4 py-2 h-10 rounded-lg shadow-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {treatmentStarted ? 'Traitement en cours' : 'Commencer le traitement'}
                      </Button>
                      {commandeType === 'Half pack' && (
                        <Button
                          onClick={() => setOpenRestPackDialog(true)}
                          className="w-full bg-gradient-to-r from-[#0072B8] to-[#00B4D8] text-white text-sm font-semibold px-4 py-2 h-10 rounded-lg shadow-md ring-1 ring-[#00B4D8]/30 hover:from-[#005a94] hover:to-[#0099cc] hover:shadow-[0_8px_20px_rgba(0,114,184,0.30)] transform hover:scale-105 transition-all duration-200"
                        >
                          <Package className="h-4 w-4 mr-2" />
                          {t('patients.detail.info.order_remaining')}
                        </Button>
                      )}
                    </div>
                  </div>
                </DiamondCardContent>
              </DiamondCard>

              <DiamondCard className={`border-0 shadow-sm ${isTreatmentFinished ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-[#0072B8] to-[#00B4D8]'} text-white`}>
                <DiamondCardContent className="p-4 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-base font-semibold mb-1">
                      {isTreatmentFinished ? 'Traitement terminé' : t('patients.detail.progress.overall')}
                    </h3>
                    <div className="text-2xl font-bold">
                      {isTreatmentFinished ? '100%' : '65%'}
                    </div>
                    {!isTreatmentFinished && (
                      <p className="text-xs opacity-90 mt-1">{t('patients.detail.progress.aligner')} {currentAligner}/{totalAligners}</p>
                    )}
                  </div>
                </DiamondCardContent>
              </DiamondCard>
            </div>
          </div>
        )}

        {/* TP Check */}
        {activeTab === 'treatment' && globalStatus === 'EN_PLANIFICATION' && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Package className="h-16 w-16 text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">Traitement en cours de planification</h2>
            <p className="text-slate-500 text-center max-w-md">Le traitement initial et le TP Check seront disponibles une fois que DiamondSuite aura validé le plan d'aligneurs.</p>
          </div>
        )}

        {activeTab === 'treatment' && globalStatus !== 'EN_PLANIFICATION' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Informations du traitement - Gauche */}
              <DiamondCard className="bg-white border-slate-200 shadow-sm lg:col-span-3">
                <DiamondCardHeader>
                  <DiamondCardTitle className="flex items-center justify-between text-slate-800">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 mr-2 text-[#0072B8]" />
                        <span className="font-bold">TP Check</span>
                      </div>
                      <div className="flex flex-col gap-2 ml-1 mt-2">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => {
                              setActiveTPTab('initial')
                              setTpChecksList(initialTpChecksList)
                              setSelectedTPVersion(0)
                            }}
                            className={`text-sm font-semibold pb-1 transition-colors ${activeTPTab === 'initial' ? 'text-slate-700 border-b-2 border-[#0072B8]' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            Traitement initial
                          </button>
                          {correctionsTabs.map((corr: any, index: number) => (
                            <button
                              key={`corr-${corr.id}`}
                              onClick={() => {
                                setActiveTPTab(`c${corr.version}`)
                                const corrTps = corr.tpChecks?.map((tp: any) => ({
                                  id: tp.id,
                                  date: new Date(tp.createdAt).toLocaleDateString('fr-TN'),
                                  status: tp.status === 'APPROVED' ? t('patients.detail.status.validated') || 'Validé' : tp.status === 'REJECTED' ? t('patients.detail.status.rejected') || 'Rejeté' : 'En attente',
                                  patientType: currentCase?.patientType || 'Adulte',
                                  pack: currentCase?.pack || '',
                                  stepsUpper: 0,
                                  stepsLower: 0,
                                  url: tp.url,
                                  message: tp.message,
                                  messages: tp.messages,
                                })) || []
                                setTpChecksList(corrTps)
                                setSelectedTPVersion(0)
                              }}
                              className={`text-sm font-semibold pb-1 transition-colors ${activeTPTab === 'c' + corr.version ? 'text-slate-700 border-b-2 border-[#0072B8]' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                              Finition {corr.version}
                            </button>
                          ))}
                        </div>

                        <div className={`flex items-center gap-1 transition-opacity duration-200 ${activeTPTab === 'initial' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                          {tpChecksList.map((tp, idx) => (
                            <button
                              key={tp.id}
                              aria-label={`TP Check ${idx + 1}`}
                              onClick={() => setSelectedTPVersion(idx)}
                              tabIndex={activeTPTab === 'initial' ? 0 : -1}
                              className={`relative w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 border-2 ${selectedTPVersion === idx
                                ? 'bg-[#0072B8] text-white border-[#0072B8] shadow-md'
                                : 'bg-white text-[#0072B8] border-slate-200 hover:border-[#0072B8] hover:bg-blue-50'
                                }`}
                            >
                              {idx + 1}
                              {(tp.status === t('patients.detail.status.validated') || tp.status === 'Validated' || tp.status === 'Validé') && (
                                <div className="absolute -top-2 -right-2 bg-emerald-100 rounded-full p-0.5 border-2 border-white">
                                  <Check className="h-3 w-3 text-emerald-700" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
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
                    <div className="flex items-center justify-between p-6 bg-gradient-to-br from-[#0072B8] to-[#00B4D8] text-white rounded-xl shadow-md my-2">
                      <h3 className="font-semibold text-lg">{t('patients.detail.tp_check.status_title')}</h3>
                      <div className="flex items-center gap-5">
                        <span className="font-bold text-xl bg-white/20 px-5 py-2 rounded-full shadow-sm">{currentTP.status}</span>
                        <span className="text-base font-medium opacity-90">{currentTP.date}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600">{t('patients.detail.tp_check.patient_type')}</p>
                          <p className="font-medium text-slate-800">{currentTP?.patientType || '-'}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600">{t('patients.detail.info.selected_pack')}</p>
                          <p className="font-medium text-slate-800">{currentTP?.pack || '-'}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600">{t('patients.detail.tp_check.upper_steps')}</p>
                          <p className="font-medium text-slate-800">
                            {currentTP?.stepsUpper || 0} {t('patients.detail.tp_check.aligners')}
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600">{t('patients.detail.tp_check.lower_steps')}</p>
                          <p className="font-medium text-slate-800">
                            {currentTP?.stepsLower || 0} {t('patients.detail.tp_check.aligners')}
                          </p>
                        </div>

                        <div
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-default"
                        >
                          <p className="text-sm text-slate-600">{t('patients.detail.tp_check.change_rhythm')}</p>
                          <p className="font-medium text-slate-800">{tpRhythm} {t('patients.detail.tp_check.days')}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600">{t('patients.detail.tp_check.quote')}</p>
                          <p className="font-medium text-[#0072B8]">{quoteHT} DT HT</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600">{t('patients.detail.tp_check.discount')}</p>
                          <p className="font-medium text-green-600">{discount > 0 ? (isDiscountPercent ? `-${discount}%` : `-${discount} DT`) : '-'}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600">{t('patients.detail.tp_check.final_quote_excl')}</p>
                          <p className="font-medium text-[#0072B8]">{finalQuoteHT.toFixed(2)} DT</p>
                        </div>
                      </div>

                      <div className="p-5 bg-gradient-to-br from-[#0072B8] to-[#00B4D8] text-white rounded-xl border-0 text-center shadow-md my-4">
                        <p className="text-sm font-medium opacity-90 mb-1">{t('patients.detail.tp_check.final_quote_incl')}</p>
                        <p className="font-bold text-2xl tracking-wide">
                          {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(devisFinalTTC)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}

                  </div>
                </DiamondCardContent>
              </DiamondCard>

              <div className="space-y-4 lg:col-span-2">
                {/* Decision action buttons - Above the card */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setOpenValidationDialog(true)}
                    disabled={hasValidatedTP}
                    className="w-full flex-1 bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {t('patients.detail.tp_check.approve')}
                  </Button>
                  <Button
                    onClick={() => messageInputRef.current?.focus()}
                    disabled={hasValidatedTP}
                    className="w-full flex-1 bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    onClick={() => {
                      setTpChecksList(prev => prev.map((tp, i) => i === selectedTPVersion ? { ...tp, status: t('patients.detail.status.rejected') || 'Rejeté' } : tp))
                    }}
                    disabled={hasValidatedTP}
                    className="w-full flex-1 bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
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
                        onSubmit={form.handleSubmit((values: { commandeType: string }) => {
                          const isTotal = values.commandeType === 'total'
                          setCommandeType(isTotal ? 'Full pack' : 'Half pack')
                          setOpenValidationDialog(false)

                          setTpChecksList(prev => prev.map((tp, i) => i === selectedTPVersion ? { ...tp, status: t('patients.detail.status.validated') || 'Validé' } : tp))

                          const isSingleVersion = tpChecksList.length === 1;
                          const historyMessage = isSingleVersion ? 'TP Check validé' : `TP Check ${selectedTPVersion + 1} validé`;
                          const today = new Date().toLocaleDateString('fr-TN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                          appendHistoryEvent(today, historyMessage, 'success')
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
                            className="bg-[#0072B8] hover:bg-[#005fa3] text-white"
                          >
                            Confirmer
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
                        onSubmit={rhythmForm.handleSubmit((values: { rhythm: string }) => {
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
                <DiamondCard className="bg-white border-slate-200 shadow-sm lg:col-span-2 h-[calc(100%-3.5rem)] flex flex-col">
                  <DiamondCardHeader className="shrink-0">
                    <DiamondCardTitle className="flex items-center text-slate-800">
                      <MessageCircle className="h-5 w-5 mr-2 text-[#0072B8]" />
                      {t('patients.detail.tp_check.messages_title')}
                    </DiamondCardTitle>
                  </DiamondCardHeader>
                  <DiamondCardContent className="flex-1 flex flex-col min-h-[300px]">
                    <div className="flex-1 flex flex-col justify-end space-y-4 h-full relative">
                      {/* Messages existants */}
                      <div className="absolute inset-0 overflow-y-auto px-1 custom-scrollbar pb-32 flex flex-col-reverse gap-3">
                        {/* Si aucun message au total */}
                        {!(currentCase?.messages && currentCase.messages.length > 0) && !currentTP?.message ? (
                          <div className="flex items-center justify-center p-6 bg-slate-50 border border-dashed border-slate-200 rounded-lg h-full">
                            <p className="text-sm text-slate-500 italic">Aucun message pour ce traitement.</p>
                          </div>
                        ) : null}

                        {/* Mapped messages from DB, reversed so newest is bottom-most in DOM (which is visually the bottom because of flex-col-reverse) */}
                        {currentCase?.messages && currentCase.messages.length > 0 ? (
                          [...(currentCase.messages as any[])].reverse().map((msg: any) => {
                            const isDoctor = msg.sender === 'MEDECIN'
                            return (
                              <div key={msg.id} className={`flex items-start gap-3 ${isDoctor ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${isDoctor ? 'bg-[#0072B8]' : 'bg-[#00B2AF]'}`}>
                                  {isDoctor ? 'Dr' : 'DS'}
                                </div>
                                <div className={`flex flex-col max-w-[85%] ${isDoctor ? 'items-end' : 'items-start'}`}>
                                  <div className={`${isDoctor ? 'bg-[#0072B8] text-white rounded-2xl rounded-tr-sm' : 'bg-[#E5F6F6] border border-[#B3E5E4] shadow-sm rounded-2xl rounded-tl-sm'} p-3 inline-block`}>
                                    <p className={`text-sm whitespace-pre-wrap ${isDoctor ? 'text-white' : 'text-[#00605E]'}`}>
                                      {msg.text}
                                    </p>
                                  </div>
                                  <p className={`text-xs text-slate-400 mt-1 ${isDoctor ? 'mr-1' : 'ml-1'}`}>
                                    {new Date(msg.createdAt).toLocaleString('fr-FR')}
                                  </p>
                                </div>
                              </div>
                            )
                          })
                        ) : null}

                        {/* Initial system message (oldest), so it should be visually at the very top (last in DOM) */}
                        {currentTP?.message && (
                          <div className="flex items-start space-x-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-[#00B2AF] flex items-center justify-center text-white text-xs font-bold shrink-0">
                              DS
                            </div>
                            <div className="flex-1 max-w-[85%]">
                              <div className="bg-[#E5F6F6] border border-[#B3E5E4] shadow-sm rounded-2xl rounded-tl-sm p-3 inline-block">
                                <p className="text-sm text-[#00605E] whitespace-pre-wrap">
                                  {currentTP.message}
                                </p>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 ml-1">{currentTP.date}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Zone de saisie nouveau message */}
                      <div className="border-t border-slate-200 pt-4 mt-auto absolute bottom-0 w-full bg-white z-10">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <textarea
                              ref={messageInputRef}
                              placeholder={t('patients.detail.tp_check.type_message')}
                              disabled={isTreatmentFinished}
                              className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0072B8] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed hidden md:block"
                              rows={2}
                            />
                          </div>
                          <Button
                            disabled={isTreatmentFinished || addMessageMutation.isPending}
                            onClick={async () => {
                              if (!messageInputRef.current?.value || !currentCase?.id) return
                              const text = messageInputRef.current.value
                              messageInputRef.current.value = ''
                              try {
                                await addMessageMutation.mutateAsync({
                                  caseId: currentCase.id,
                                  text,
                                  sender: 'MEDECIN'
                                })
                                await utils.cases.getByPatientId.invalidate({ patientId: patientId! })
                              } catch (e) {
                                console.error('Failed to send message:', e)
                                alert("Erreur lors de l'envoi du message")
                              }
                            }}
                            className={`bg-[#0072B8] text-white self-end transition-all ${!isTreatmentFinished ? 'hover:bg-[#005a94]' : 'opacity-50 cursor-not-allowed hidden md:flex'}`}
                          >
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: 'image1', label: t('patients.new.photos.labels.portrait_profile'), required: true, placeholder: patientData?.sexe === 'Homme' ? manProfileImg.src : '/images/p1.png' },
                      { key: 'image2', label: t('patients.new.photos.labels.portrait_face'), required: true, placeholder: patientData?.sexe === 'Homme' ? manFrontNoSmilingImg.src : '/images/p2.png' },
                      { key: 'image3', label: t('patients.new.photos.labels.portrait_smile'), required: true, placeholder: patientData?.sexe === 'Homme' ? manFrontSmilingImg.src : '/images/p3.png' },
                      { key: 'image4', label: t('patients.new.photos.labels.occlusal_upper'), required: true, placeholder: '/images/p4.png' },
                      { key: 'image6', label: t('patients.new.photos.labels.occlusal_lower'), required: true, placeholder: '/images/p5.png' },
                      { key: 'image7', label: t('patients.new.photos.labels.intra_right'), required: true, placeholder: '/images/p6.png' },

                      { key: 'image8', label: t('patients.new.photos.labels.intra_face'), required: true, placeholder: '/images/p7.png' },
                      { key: 'image9', label: t('patients.new.photos.labels.intra_left'), required: true, placeholder: '/images/p8.png' },
                      // Generate "Other" photos dynamically
                      ...Array.from({ length: otherPhotosCount }).map((_, index) => ({
                        key: `other_${index}`,
                        label: t('patients.new.photos.labels.other') || 'Autre',
                        required: false,
                        placeholder: undefined,
                      })),
                    ].map((photo) => (
                      <div key={photo.key} className="border-0 bg-slate-50 rounded-lg p-2 md:p-3 text-center relative group flex flex-col h-full">
                        <div
                          className="w-full h-40 bg-white border border-slate-100 rounded mb-2 flex items-center justify-center overflow-hidden relative cursor-pointer flex-grow"
                          onClick={() => {
                            const foundPhoto = initialPhotos.find(p => p.id === photo.key)
                            if (foundPhoto) {
                              setPreviewFile({ file: foundPhoto.url, title: photo.label })
                            }
                          }}
                        >
                          {initialPhotos.find(p => p.id === photo.key) ? (
                            <>
                              <img
                                src={initialPhotos.find(p => p.id === photo.key)?.url}
                                alt={photo.label}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Button size="icon" variant="secondary" className="h-6 w-6 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewFile({ file: initialPhotos.find(p => p.id === photo.key)?.url || '', title: photo.label });
                                }}>
                                  <Maximize2 className="h-3 w-3 text-slate-700" />
                                </Button>
                              </div>
                            </>
                          ) : photo.placeholder ? (
                            <div className="w-full h-full flex items-center justify-center bg-white">
                              <img
                                src={photo.placeholder}
                                alt={photo.label}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale hover:grayscale-0"
                              />
                            </div>
                          ) : (
                            <Camera className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 leading-tight" title={photo.label}>
                          {photo.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </DiamondCardContent>
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
                        onClick={() => {
                          setIsCephLoading(true)
                          setShowCephModal(true)
                        }}
                        disabled={!cephalometricUrl}
                        title={!cephalometricUrl ? "L'analyse n'est pas encore disponible" : ""}
                        className="bg-gradient-to-r from-[#0072B8] to-[#00B4D8] text-white text-sm px-4 py-2 h-9 rounded-md shadow-md hover:shadow-lg hover:from-[#005a94] hover:to-[#0099cc] disabled:opacity-50 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all"
                      >
                        {t('patients.detail.photos.view_ceph')}
                      </Button>
                    </div>
                  </div>
                </DiamondCardHeader>
                <DiamondCardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'panoramic', label: t('patients.new.photos.panoramic') || 'Panoramique', required: true, placeholder: panoramicImg.src },
                      { key: 'xray_profile', label: t('patients.new.photos.xray_profile') || 'Téléradiographie de profil', required: true, placeholder: lateralXrayImg.src },
                    ].map((photo) => (
                      <div key={photo.key} className="border-0 bg-slate-50 rounded-lg p-2 md:p-3 text-center relative group flex flex-col h-full">
                        <div
                          className="w-full h-48 bg-[#2B3041] border border-slate-100 rounded mb-2 flex items-center justify-center overflow-hidden relative cursor-pointer flex-grow"
                          onClick={() => {
                            const foundRadio = radioImages.find(p => p.id === photo.key)
                            if (foundRadio) {
                              setPreviewFile({ file: foundRadio.url, title: photo.label })
                            }
                          }}
                        >
                          {radioImages.find(p => p.id === photo.key) ? (
                            <>
                              <img
                                src={radioImages.find(p => p.id === photo.key)?.url}
                                alt={photo.label}
                                className="w-full h-full object-contain bg-white"
                              />
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Button size="icon" variant="secondary" className="h-6 w-6 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewFile({ file: radioImages.find(p => p.id === photo.key)?.url || '', title: photo.label });
                                }}>
                                  <Maximize2 className="h-3 w-3 text-slate-700" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <img
                              src={photo.placeholder}
                              alt={photo.label}
                              className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 leading-tight" title={photo.label}>
                          {photo.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </DiamondCardContent>
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
                  {followUpStages
                    .map(stage => ({
                      ...stage,
                      photos: stage.photos.filter((p: any) => p.url)
                    }))
                    .filter(stage => stage.photos.length > 0)
                    .length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-50/50 rounded-lg border border-slate-100">
                      <Camera className="size-10 mx-auto mb-3 opacity-20" />
                      <p>{t('patients.detail.photos.no_image_yet') || 'En attente de photos du patient'}</p>
                    </div>
                  ) : (
                    followUpStages
                      .map(stage => ({
                        ...stage,
                        photos: stage.photos.filter((p: any) => p.url)
                      }))
                      .filter(stage => stage.photos.length > 0)
                      .map((stage, i) => (
                        <div key={i} className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="size-2.5 rounded-full bg-[#0072B8] shadow-sm shadow-[#0072B8]/40" />
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs text-slate-700 font-medium">
                              <Camera className="size-4 text-[#0072B8]" />
                              <span>
                                {stage.label} <span className="text-slate-400 mx-1">•</span> {stage.date}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stage.photos.map((p, pi) => (
                              <div
                                key={pi}
                                className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 group cursor-pointer"
                                style={{
                                  background: ('url' in p && (p as any).url) ? 'none' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                }}
                                onClick={() => {
                                  if ('url' in p && (p as any).url) {
                                    setPreviewFile({ file: (p as any).url, title: (p as any).title || 'Photo' })
                                  }
                                }}
                              >
                                {('url' in p && (p as any).url) ? (
                                  <img src={(p as any).url} alt={(p as any).title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-[#0072B8] transition-colors">
                                    <Camera className="size-10 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-xs font-medium text-slate-500">{t('patients.detail.photos.no_image_yet') || 'En attente'}</span>
                                  </div>
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <Button size="icon" variant="secondary" className="h-7 w-7 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm" onClick={(e) => {
                                    e.stopPropagation();
                                    if ('url' in p && (p as any).url) {
                                      setPreviewFile({ file: (p as any).url, title: (p as any).title || 'Photo' });
                                    }
                                  }}>
                                    <Maximize2 className="h-3.5 w-3.5 text-slate-700" />
                                  </Button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 text-slate-700 text-xs font-medium px-3 py-2.5 flex items-center justify-center text-center">
                                  <span>{(p as any).title}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )))
                  }
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
            {/* Conditional render: If treatment hasn't started or is finished, hide other cards */}
            {hasTreatmentStarted && !isTreatmentFinished && (
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
            )}
          </div>
        )}
      </div>

      {
        show3DModal && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => { setShow3DModal(false); setOverride3DUrl(null); }}>
              <div
                className="bg-white rounded-lg w-[95%] h-[95%] flex flex-col overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                    <Package className="h-6 w-6 mr-2 text-[#0072B8]" />
                    Visualiseur 3D - Plan de traitement
                  </h2>
                  <Button
                    onClick={() => { setShow3DModal(false); setOverride3DUrl(null); }}
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 bg-slate-50">
                  <TreatmentPlanViewer3D patientName={`${patientData.prenom} ${patientData.nom}`} versionLabel={override3DUrl ? "Version Validée" : `Version ${selectedTPVersion + 1}`} url={override3DUrl || currentTP?.url} />
                </div>
              </div>
            </div>
          </>
        )
      }

      {/* Modal Analyse Céphalométrique (iframe) - Calqué sur le design du 3D Viewer */}
      {showCephModal && cephalometricUrl && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCephModal(false)}>
          <div
            className="bg-white rounded-lg w-[95%] h-[95%] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
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
            <div className="flex-1 bg-slate-50 relative overflow-hidden">
              {/* Overlay pour cacher le logo en haut à gauche (taille réduite selon demande) */}
              <div className="absolute top-0 left-0 w-[71px] h-[53px] bg-[#2E3038] z-10 pointer-events-none"></div>

              {/* Loading Overlay Centré */}
              {isCephLoading && (
                <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center pointer-events-none">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0072B8] mb-4"></div>
                  <p className="text-sm text-slate-500 font-medium animate-pulse">Chargement de l'analyse céphalométrique...</p>
                </div>
              )}

              <iframe
                title="Cephalometric analysis"
                src={cephalometricUrl}
                className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${isCephLoading ? 'opacity-0' : 'opacity-100'}`}
                allowFullScreen
                onLoad={() => setIsCephLoading(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Photos MyDiamond */}
      {
        showPatientPhotosModal && (
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
        )
      }

      {/* Eterna Order Dialog */}
      <Dialog open={showEternaScanDialog} onOpenChange={setShowEternaScanDialog}>
        <DialogContent className="max-w-5xl md:max-w-4xl lg:max-w-5xl w-[95vw] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('patients.detail.eterna_order.title')}</DialogTitle>
            <DialogDescription>{t('patients.detail.eterna_order.desc')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {eternaScanMode === 'scanner' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300 mb-6">
                  {['upper', 'lower'].map((type) => {
                    const file = eternaScans[type as 'upper' | 'lower']
                    return (
                      <div key={type} className="border-0 bg-slate-50 rounded-lg p-4 text-center transition-colors relative group">
                        <div className="w-full h-40 bg-slate-100 rounded mb-2 flex items-center justify-center overflow-hidden relative cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => {
                          if (file) {
                            setPreviewFile({ file: file, title: t(`patients.detail.eterna_order.${type}_scan`) })
                          } else {
                            handleEternaUploadClick(type as 'upper' | 'lower')
                          }
                        }}>
                          {file ? (
                            <>
                              <div className="w-full h-full cursor-pointer">
                                <ScanViewer
                                  file={file}
                                  autoRotate={true}
                                  onClick={() => setPreviewFile({ file: file, title: t(`patients.detail.eterna_order.${type}_scan`) })}
                                />
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewFile({ file: file, title: t(`patients.detail.eterna_order.${type}_scan`) });
                                }}>
                                  <Maximize2 className="h-4 w-4 text-slate-700" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full p-2 flex items-center justify-center bg-transparent group-hover:bg-[#f8f9fa] transition-colors rounded">
                              <img
                                src={type === 'upper' ? upperScanPlaceholderImg.src : lowerScanPlaceholderImg.src}
                                alt={`${type} Scan Placeholder`}
                                className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-sm"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mb-2 font-medium">
                          {t(`patients.detail.eterna_order.${type}_scan`)} <span className="text-red-500">*</span>
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-all duration-300 bg-white"
                          onClick={() => handleEternaUploadClick(type as 'upper' | 'lower')}
                        >
                          {file ? t('patients.new.photos.modify') || 'Modifier' : t('patients.new.photos.select_plus') || 'Ajouter'}
                        </Button>
                      </div>
                    )
                  })}
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setEternaScanMode('link')}
                    className="text-sm text-[#0072B8] hover:underline font-medium"
                  >
                    {t('patients.detail.eterna_order.use_link')}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('patients.detail.eterna_order.scan_link')}</label>
                  <Input
                    value={eternaScanLink}
                    onChange={(e) => setEternaScanLink(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setEternaScanMode('scanner')}
                    className="text-sm text-[#0072B8] hover:underline font-medium"
                  >
                    {t('patients.detail.eterna_order.upload_scans')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEternaScanDialog(false)}>
              {t('patients.detail.tp_check.reject')}
            </Button>
            <Button
              className="bg-[#0072B8] text-white hover:bg-[#005a91]"
              disabled={eternaScanMode === 'scanner' ? (!eternaScans.upper || !eternaScans.lower) : !eternaScanLink}
              onClick={async () => {
                console.log('Ordering Eterna with:', { mode: eternaScanMode, scans: eternaScans, link: eternaScanLink });

                try {
                  let uploadedScans: any = {};
                  if (eternaScanMode === 'scanner') {
                    // Upload files to local storage API
                    const uploadEternaFile = async (val: File | string | null, label: string) => {
                      if (val instanceof File) {
                        const formData = new FormData();
                        formData.append('file', val);
                        formData.append('path', `patients/${patientId}/eterna`);

                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        });
                        const resData = await res.json();

                        if (resData.success) {
                          return {
                            name: val.name,
                            size: val.size,
                            type: val.type,
                            lastModified: val.lastModified,
                            url: resData.url
                          };
                        }
                      }
                      return val;
                    };

                    uploadedScans.upper = await uploadEternaFile(eternaScans.upper, 'upper');
                    uploadedScans.lower = await uploadEternaFile(eternaScans.lower, 'lower');
                  }

                  // Fallback for link mode
                  if (eternaScanMode === 'link' && eternaScanLink) {
                    uploadedScans = { link: eternaScanLink };
                  }

                  // Update via TRPC
                  await updateScansMutation.mutateAsync({
                    id: patientId as string,
                    scans: uploadedScans
                  });

                  // Update history & local state
                  const today = new Date();
                  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
                  appendHistoryEvent(formattedDate, 'Commande Eterna soumise', 'info')

                  setPatient((prev: any) => prev ? {
                    ...prev,
                    scans: uploadedScans
                  } : null);

                  // Refresh cache
                  await utils.patients.getById.invalidate({ id: patientId as string });

                  setShowEternaScanDialog(false);
                } catch (error) {
                  console.error("Error saving Eterna scans:", error);
                  alert("Erreur lors de la sauvegarde des scans Eterna.");
                }
              }}
            >
              {t('patients.detail.eterna_order.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refinement Confirmation Dialog */}
      <AlertDialog open={showRefinementConfirm} onOpenChange={setShowRefinementConfirm}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-md border-[#0072B8]/20 shadow-2xl max-w-md rounded-2xl p-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-600 w-full" />
          <div className="p-8">
            <AlertDialogHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
              </div>
              <AlertDialogTitle className="text-xl font-bold text-gray-900 text-center">
                Demander une Finition ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 text-center mt-2">
                Êtes-vous sûr de vouloir demander une Finition pour ce patient ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-3 mt-6">
              <AlertDialogCancel
                onClick={() => setShowRefinementConfirm(false)}
                className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                {t('common.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowRefinementConfirm(false)
                  setShowRefinementUpload(true)
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 border-0"
              >
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Finish Treatment Confirmation Dialog */}
      <AlertDialog open={showFinishConfirm} onOpenChange={setShowFinishConfirm}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-md border-emerald-500/20 shadow-2xl max-w-md rounded-2xl p-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 w-full" />
          <div className="p-8">
            <AlertDialogHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <AlertDialogTitle className="text-xl font-bold text-gray-900 text-center">
                Terminer le traitement ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 text-center mt-2">
                Êtes-vous sûr de vouloir marquer ce traitement comme terminé ? Le Refinement et la messagerie seront désactivés.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-3 mt-6">
              <AlertDialogCancel
                onClick={() => setShowFinishConfirm(false)}
                className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                {t('common.cancel') || 'Annuler'}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setIsTreatmentFinished(true);

                  const today = new Date();
                  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

                  appendHistoryEvent(formattedDate, 'Traitement terminé', 'success');

                  setShowFinishConfirm(false);
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 border-0 shadow-lg shadow-emerald-500/30"
              >
                Terminer
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Refinement Upload Dialog */}
      <Dialog open={showRefinementUpload} onOpenChange={setShowRefinementUpload}>
        <DialogContent className="max-w-5xl md:max-w-4xl lg:max-w-5xl w-[95vw] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              {t('patients.detail.dialogs.refinement_upload_title') || 'Fichiers de Correction'}
            </DialogTitle>
            <DialogDescription>
              {t('patients.detail.dialogs.refinement_upload_desc') || 'Veuillez télécharger les nouvelles photos et scans du patient. Les scans sont obligatoires.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {/* Scans Section (Mandatory) */}
            <div className="bg-white rounded-xl border border-[#0170B4]/20 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[#0170B4]/5 to-transparent p-4 border-b border-[#0170B4]/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#0170B4] flex items-center gap-2">
                    <Scan className="w-5 h-5" />
                    {t('patients.new.scans.title')} <span className="text-red-500">*</span>
                  </h3>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {t('patients.new.scans.mandatory') || 'Obligatoire'}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <RadioGroup
                  value={refinementScanMode}
                  onValueChange={(v: 'scanner' | 'link') => setRefinementScanMode(v)}
                  className="flex gap-6 mb-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scanner" id="ref-scanner" className="text-[#0170B4] border-[#0170B4]" />
                    <Label htmlFor="ref-scanner" className="font-medium cursor-pointer">{t('patients.new.scans.modes.file')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="link" id="ref-link" className="text-[#0170B4] border-[#0170B4]" />
                    <Label htmlFor="ref-link" className="font-medium cursor-pointer">{t('patients.new.scans.modes.link')}</Label>
                  </div>
                </RadioGroup>

                {refinementScanMode === 'link' ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex gap-4">
                      <div className="w-full">
                        <Label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('patients.new.scans.link_label')}</Label>
                        <Input
                          placeholder="https://..."
                          value={refinementScanLink}
                          onChange={(e) => setRefinementScanLink(e.target.value)}
                          className="w-full border-slate-200 focus:border-[#0170B4] focus:ring-1 focus:ring-[#0170B4] rounded-lg h-11"
                        />
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-sky-50 rounded-lg flex gap-3 text-sm text-sky-800 border border-sky-100">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-sky-600" />
                      <p>{t('patients.new.scans.link_help')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {['upper', 'lower'].map((type) => {
                      const file = refinementScans[type as 'upper' | 'lower']
                      return (
                        <div key={type} className="border-0 bg-slate-50 rounded-lg p-4 text-center transition-colors relative group">
                          <div className="w-full h-40 bg-slate-100 rounded mb-2 flex items-center justify-center overflow-hidden relative cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => {
                            if (file) {
                              setPreviewFile({ file: file as File, title: t(`patients.new.scans.${type}`) })
                            } else {
                              handleRefinementUploadClick(type as 'upper' | 'lower')
                            }
                          }}>
                            {file ? (
                              <>
                                <div className="w-full h-full cursor-pointer">
                                  <ScanViewer
                                    file={file as File}
                                    autoRotate={true}
                                    onClick={() => setPreviewFile({ file: file as File, title: t(`patients.new.scans.${type}`) })}
                                  />
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewFile({ file: file as File, title: t(`patients.new.scans.${type}`) });
                                  }}>
                                    <Maximize2 className="h-4 w-4 text-slate-700" />
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full p-2 flex items-center justify-center bg-transparent group-hover:bg-[#f8f9fa] transition-colors rounded">
                                <img
                                  src={type === 'upper' ? upperScanPlaceholderImg.src : lowerScanPlaceholderImg.src}
                                  alt={`${type} Scan Placeholder`}
                                  className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-sm"
                                />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mb-2 font-medium">
                            {t(`patients.new.scans.${type}`)} <span className="text-red-500">*</span>
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-all duration-300 bg-white"
                            onClick={() => handleRefinementUploadClick(type as 'upper' | 'lower')}
                          >
                            {file ? t('patients.new.photos.modify') || 'Modifier' : t('patients.new.photos.select_plus') || 'Ajouter'}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Photos Section */}
            <div className="bg-white rounded-xl border border-[#0170B4]/20 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[#0170B4]/5 to-transparent p-4 border-b border-[#0170B4]/10">
                <h3 className="font-semibold text-[#0170B4] flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  {t('patients.new.photos.title')}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'image1', label: t('patients.new.photos.labels.portrait_profile'), placeholder: patient?.gender === 'Male' ? manProfileImg.src : '/images/p1.png' },
                    { key: 'image2', label: t('patients.new.photos.labels.portrait_face'), placeholder: patient?.gender === 'Male' ? manFrontNoSmilingImg.src : '/images/p2.png' },
                    { key: 'image3', label: t('patients.new.photos.labels.portrait_smile'), placeholder: patient?.gender === 'Male' ? manFrontSmilingImg.src : '/images/p3.png' },
                    { key: 'image4', label: t('patients.new.photos.labels.occlusal_upper'), placeholder: '/images/p4.png' },
                    { key: 'image6', label: t('patients.new.photos.labels.occlusal_lower'), placeholder: '/images/p5.png' },
                    { key: 'image7', label: t('patients.new.photos.labels.intra_right'), placeholder: '/images/p6.png' },
                    { key: 'image8', label: t('patients.new.photos.labels.intra_face'), placeholder: '/images/p7.png' },
                    { key: 'image9', label: t('patients.new.photos.labels.intra_left'), placeholder: '/images/p8.png' },
                  ].map((photo) => (
                    <div key={photo.key} className="border-0 bg-slate-50 rounded-lg p-2 md:p-3 text-center transition-colors relative group border border-slate-100">
                      <div
                        className="w-full h-32 md:h-40 bg-white border border-slate-200 rounded mb-2 flex items-center justify-center overflow-hidden relative cursor-pointer hover:border-[#0170B4] transition-colors"
                        onClick={() => handleRefinementPhotoUploadClick(photo.key)}
                      >
                        {refinementPhotos[photo.key] ? (
                          <>
                            <img
                              src={refinementPhotos[photo.key]!}
                              alt={photo.label}
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-medium px-3 py-1 bg-black/50 rounded-full backdrop-blur-sm">
                                {t('common.change') || 'Changer'}
                              </span>
                            </div>
                          </>
                        ) : photo.placeholder ? (
                          <div className="w-full h-full flex items-center justify-center bg-white p-2">
                            <img
                              src={photo.placeholder}
                              alt={photo.label}
                              className="max-w-full max-h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                        ) : (
                          <Camera className="w-8 h-8 text-slate-300 group-hover:text-[#0170B4] transition-colors" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium line-clamp-2 px-1">
                        {photo.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 border-t pt-6 border-slate-200">
            <Button variant="outline" onClick={() => setShowRefinementUpload(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              className="bg-[#0072B8] text-white hover:bg-[#005a91]"
              disabled={refinementScanMode === 'scanner' ? (!refinementScans.upper || !refinementScans.lower) : !refinementScanLink}
              onClick={() => {
                console.log('Submitting refinement with:', { mode: refinementScanMode, scans: refinementScans, link: refinementScanLink });

                const today = new Date();
                const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

                appendHistoryEvent(formattedDate, 'Nouvelle correction demandée', 'info');

                setShowRefinementUpload(false);
                setShowGalleryModal(false);
              }}
            >
              {t('patients.detail.dialogs.submit_refinement') || 'Soumettre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Viewer Galerie Générique */}
      {
        showGalleryModal && galleryPhotos.length > 0 && (
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
        )
      }
      {/* Dialog: Preview 3D */}
      <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="w-[min(90vw,90vh)] h-[min(90vw,90vh)] !max-w-none flex flex-col p-0 overflow-hidden bg-slate-50">
          <DialogHeader className="p-4 bg-white border-b shrink-0">
            <DialogTitle>{previewFile?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 relative bg-slate-100">
            {previewFile && (
              <>
                {typeof previewFile.file === 'string' ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={previewFile.file}
                      alt={previewFile.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : previewFile.file instanceof File && (previewFile.file.type.startsWith('image/') || previewFile.file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={URL.createObjectURL(previewFile.file)}
                      alt={previewFile.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <ScanViewer
                    file={previewFile.file}
                    className="w-full h-full"
                    autoRotate={false}
                  />
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div >
  )
}

export default PatientDetailPage
