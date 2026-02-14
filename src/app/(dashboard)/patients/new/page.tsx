'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, X, User, FileText, Camera, Scan, Stethoscope, CheckCircle, Maximize2, ClipboardCheck, Plus } from 'lucide-react'
import { HeadingTitle } from '@/components/HeadingTitle'
import {
  DiamondCard,
  DiamondCardHeader,
  DiamondCardTitle,
  DiamondCardDescription,
  DiamondCardContent,
} from '@/components/ui/diamond-card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTranslation } from '@/hooks/useTranslation'
// @ts-ignore
import Prescription from '@/components/prescription/prescription'
import { ScanViewer } from '@/components/3d/ScanViewer'

// Types
type CbctFormValues = {
  url: string
}
type ScanSendFormValues = {
  mode: 'link' | 'scanner'
  link?: string
}
type Pack = {
  id: string
  name: string
  description: string
  price: number
  features: string[]
}
type PatientTypeFormValues = {
  type: 'Adulte' | 'Adolescent' | undefined
  pack: string
}
type PatientDetailsFormValues = {
  nom: string
  prenom: string
  genre: 'Male' | 'Female' | 'Autre' | undefined
  birthDate: {
    day: string
    month: string
    year: string
  }
  conditions?: string[]
}

// getSteps helper
const getSteps = (t: any) => [
  {
    label: t('patients.new.steps.product.label'),
    icon: User,
    description: t('patients.new.steps.product.desc'),
  },
  {
    label: t('patients.new.steps.details.label'),
    icon: FileText,
    description: t('patients.new.steps.details.desc'),
  },
  {
    label: t('patients.new.steps.photos.label'),
    icon: Camera,
    description: t('patients.new.steps.photos.desc'),
  },
  {
    label: t('patients.new.steps.scans.label'),
    icon: Scan,
    description: t('patients.new.steps.scans.desc'),
  },
  {
    label: t('patients.new.steps.prescription.label'),
    icon: Stethoscope,
    description: t('patients.new.steps.prescription.desc'),
  },
  {
    label: t('patients.new.steps.submit.label'),
    icon: ClipboardCheck,
    description: t('patients.new.steps.submit.desc'),
  },
]

interface PatientData {
  type?: 'Adulte' | 'Adolescent'
  pack?: string
  nom: string
  prenom: string
  genre: 'Male' | 'Female' | 'Autre' | ''
  birthDate: {
    day: string
    month: string
    year: string
  }
  age?: number
  conditions: string[]
  photos: { [key: string]: File | null }
  radiographies: { [key: string]: File | null }
  scans: { [key: string]: File | null }
  prescription?: string | null
  cbctUrl?: string
  scanMode?: 'link' | 'scanner'
  scanLink?: string
}

export default function AjouterPatient() {
  const { t } = useTranslation()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedPatientType, setSelectedPatientType] = useState<string | null>(null)
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [age, setAge] = useState<number | null>(null)
  const [ageError, setAgeError] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadTarget, setUploadTarget] = useState<{ type: 'photos' | 'radiographies' | 'scans'; key: string } | null>(null)
  const [previewFile, setPreviewFile] = useState<{ file: File | string, title: string } | null>(null)
  const [otherPhotosCount, setOtherPhotosCount] = useState(0)

  const handleUploadClick = (type: 'photos' | 'radiographies' | 'scans', key: string) => {
    setUploadTarget({ type, key })
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'scans' ? '.stl,.ply,.obj' : 'image/*'
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 15MB limit for photos/radiographies
    if (uploadTarget?.type === 'photos' || uploadTarget?.type === 'radiographies') {
      if (file.size > 15 * 1024 * 1024) {
        alert("Le fichier dépasse la limite de 15 Mo.")
        event.target.value = ''
        return
      }
    }

    // Validation for scans
    if (uploadTarget?.type === 'scans') {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (!['stl', 'ply', 'obj'].includes(ext || '')) {
        alert("Format de fichier non supporté. Utilisez .stl, .ply ou .obj")
        event.target.value = ''
        return
      }
    }

    if (uploadTarget) {
      setPatientData((prev) => ({
        ...prev,
        [uploadTarget.type]: {
          ...prev[uploadTarget.type],
          [uploadTarget.key]: file,
        },
      }))
    }

    // Reset
    event.target.value = ''
    setUploadTarget(null)
    if (fileInputRef.current) fileInputRef.current.accept = 'image/*'
  }
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [openCbctDialog, setOpenCbctDialog] = useState(false)
  const [openScanDialog, setOpenScanDialog] = useState(false)
  const [initialSection, setInitialSection] = useState<string | undefined>(undefined)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prescriptionRef = useRef<any>(null)

  const handleEditPrescription = (sectionId: string) => {
    setInitialSection(sectionId)
    setCurrentStep(4) // Step 4 is the prescription step (0-indexed)
  }

  const mockPacks: Pack[] = useMemo(() => {
    const getFeatures = (key: string): string[] => {
      const val = t(key)
      return Array.isArray(val) ? val : []
    }
    return [
      {
        id: '1',
        name: t('patients.new.product.packs.light.name'),
        description: t('patients.new.product.packs.light.desc'),
        price: 2500,
        features: getFeatures('patients.new.product.packs.light.features'),
      },
      {
        id: '2',
        name: t('patients.new.product.packs.medium.name'),
        description: t('patients.new.product.packs.medium.desc'),
        price: 3500,
        features: getFeatures('patients.new.product.packs.medium.features'),
      },
      {
        id: '3',
        name: t('patients.new.product.packs.full.name'),
        description: t('patients.new.product.packs.full.desc'),
        price: 4500,
        features: getFeatures('patients.new.product.packs.full.features'),
      },
    ]
  }, [t])

  const conditions = useMemo(() => {
    const list = t('patients.new.details.conditions_list')
    return list && typeof list === 'object' ? Object.values(list) as string[] : []
  }, [t])

  const steps = useMemo(() => getSteps(t), [t])

  const patientTypeSchema = useMemo(() => z.object({
    type: z.enum(['Adulte', 'Adolescent'], {
      required_error: t('patients.new.validation.patient_type'),
    }),
    pack: z.string().min(1, t('patients.new.validation.pack')),
  }), [t])

  const patientDetailsSchema = useMemo(() => z.object({
    nom: z.string().min(2, t('patients.new.validation.last_name_min')),
    prenom: z.string().min(2, t('patients.new.validation.first_name_min')),
    genre: z.enum(['Male', 'Female', 'Autre'], {
      required_error: t('patients.new.validation.gender'),
    }),
    birthDate: z.object({
      day: z.string().min(1, t('patients.new.validation.day_req')),
      month: z.string().min(1, t('patients.new.validation.month_req')),
      year: z.string().min(4, t('patients.new.validation.year_req')),
    }),
    conditions: z.array(z.string()).optional(),
  }), [t])

  const cbctSchema = useMemo(() => z.object({
    url: z.string().url(t('patients.new.validation.url_invalid')),
  }), [t])

  const scanSendSchema = useMemo(() => z.discriminatedUnion('mode', [
    z.object({
      mode: z.literal('link'),
      link: z
        .string({ required_error: t('patients.new.validation.scan_link_req') })
        .url(t('patients.new.validation.url_invalid'))
        .min(1, t('patients.new.validation.scan_link_req')),
    }),
    z.object({
      mode: z.literal('scanner'),
      link: z.string().optional(),
    }),
  ]), [t])

  const [patientData, setPatientData] = useState<PatientData>({
    nom: '',
    prenom: '',
    genre: '',
    birthDate: {
      day: '',
      month: '',
      year: '',
    },
    conditions: [],
    photos: {},
    radiographies: {},
    scans: {},
    cbctUrl: undefined,
  })

  const patientTypeForm = useForm<PatientTypeFormValues>({
    resolver: zodResolver(patientTypeSchema),
    defaultValues: {
      type: undefined,
      pack: '',
    },
  })

  const patientDetailsForm = useForm<PatientDetailsFormValues>({
    resolver: zodResolver(patientDetailsSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      genre: undefined,
      birthDate: {
        day: '',
        month: '',
        year: '',
      },
      conditions: [],
    },
  })

  // CBCT form (URL)
  const cbctForm = useForm<CbctFormValues>({
    resolver: zodResolver(cbctSchema),
    defaultValues: {
      url: '',
    },
  })

  // Scan sending form (mode selection)
  const scanSendForm = useForm<ScanSendFormValues>({
    resolver: zodResolver(scanSendSchema),
    defaultValues: { mode: 'link', link: '' },
  })

  // Age calculation effect
  useEffect(() => {
    const { day, month, year } = patientData.birthDate
    if (year && year.length === 4) {
      const today = new Date()
      const birthMonth = month || (today.getMonth() + 1).toString()
      const birthDay = day || today.getDate().toString()

      const birth = new Date(parseInt(year), parseInt(birthMonth) - 1, parseInt(birthDay))
      let calculatedAge = today.getFullYear() - birth.getFullYear()

      const monthDiff = today.getMonth() - (parseInt(birthMonth) - 1)
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parseInt(birthDay))) {
        calculatedAge--
      }

      setAge(calculatedAge)

      // Check age restrictions
      if (selectedPatientType) {
        if (
          (selectedPatientType === 'Adulte' && calculatedAge < 18) ||
          (selectedPatientType === 'Adolescent' && (calculatedAge < 12 || calculatedAge >= 18))
        ) {
          setAgeError(true)
          setError(
            selectedPatientType === 'Adulte'
              ? "L'âge doit être supérieur ou égal à 18 ans pour un patient adulte"
              : "L'âge doit être entre 12 et 17 ans pour un patient adolescent"
          )
        } else {
          setAgeError(false)
          setError(null)
        }
      }
    }
  }, [patientData.birthDate, selectedPatientType])

  // Function to check if a step is completed
  const isStepCompleted = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Choisir un produit
        return selectedPatientType !== null && selectedPack !== null
      case 1: // Détails du patient
        return (
          patientData.nom !== '' &&
          patientData.prenom !== '' &&
          patientData.genre !== '' &&
          patientData.birthDate.day !== '' &&
          patientData.birthDate.month !== '' &&
          patientData.birthDate.year !== ''
        )
      case 2: // Photos/Radiographies
        const requiredPhotos = ['image1', 'image2', 'image3', 'image4', 'image6', 'image7', 'image8', 'image9']
        const hasAllPhotos = requiredPhotos.every(key => patientData.photos && patientData.photos[key])
        const hasPanoramic = patientData.radiographies && patientData.radiographies['panoramic']
        return hasAllPhotos && !!hasPanoramic

      case 3: // Scans
        if (patientData.scanMode === 'link') {
          return !!patientData.scanLink
        }
        // If scanner mode (default), require both upper and lower
        return (
          patientData.scans &&
          !!patientData.scans['upper'] &&
          !!patientData.scans['lower']
        )
      case 4: // Prescription
        return patientData.prescription !== undefined && patientData.prescription !== null
      case 5: // Vérifier et soumettre
        return areAllStepsCompleted()
      default:
        return false
    }
  }

  // Function to check if all steps are completed
  const areAllStepsCompleted = (): boolean => {
    for (let i = 0; i < steps.length - 1; i++) {
      // Exclude the last step (submit)
      if (!isStepCompleted(i)) {
        return false
      }
    }
    return true
  }

  // Function to navigate to a specific step
  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const handleNext = () => {
    // Save prescription data if we are leaving step 4
    if (currentStep === 4 && prescriptionRef.current) {
      const prescriptionData = prescriptionRef.current.getPrescriptionData()
      console.log('Saving prescription data:', prescriptionData)
      setPatientData(prev => ({ ...prev, prescription: prescriptionData }))
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Ensure we have the latest prescription data
    if (prescriptionRef.current) {
      const prescriptionData = prescriptionRef.current.getPrescriptionData()
      setPatientData(prev => ({ ...prev, prescription: prescriptionData }))
    }

    if (areAllStepsCompleted()) {
      console.log('Submitting patient data:', patientData)
      router.push('/patients')
    }
  }

  const handleCancel = () => {
    setShowCancelDialog(false)
    router.push('/patients')
  }

  const handlePatientTypeSelect = (type: 'Adulte' | 'Adolescent') => {
    setSelectedPatientType(type)
    patientTypeForm.setValue('type', type)
    setPatientData((prev) => ({ ...prev, type }))
  }

  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId)
    patientTypeForm.setValue('pack', packId)
    setPatientData((prev) => ({ ...prev, pack: packId }))
  }

  const handleConditionClick = (condition: string) => {
    const newConditions = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition]

    setSelectedConditions(newConditions)
    setPatientData((prev) => ({ ...prev, conditions: newConditions }))
  }

  const updateBirthDate = (field: string, value: string) => {
    setPatientData((prev) => ({
      ...prev,
      birthDate: {
        ...prev.birthDate,
        [field]: value,
      },
    }))
  }

  const renderPrescriptionSummary = () => {
    const data = (patientData.prescription || {}) as Record<string, any>

    const items = [
      { id: 'arcade', label: t('patients.new.prescription.summary.arcade'), value: data.arcade === 'both' ? t('patients.new.prescription.summary.both_arcades') : data.arcade === 'maxillaire' ? t('patients.new.prescription.summary.maxillary') : t('patients.new.prescription.summary.mandibular') },
      { id: 'restrictions', label: t('patients.new.prescription.summary.restrictions'), value: data.restrictions === 'none' ? t('patients.new.prescription.summary.none') : `${t('patients.new.prescription.summary.do_not_move')} : ${Array.from(data.restrictionsTeeth || []).join(', ')}` },
      { id: 'taquets', label: t('patients.new.prescription.summary.attachments'), value: data.taquets === 'none' ? t('patients.new.prescription.summary.place_if_needed') : `${t('patients.new.prescription.summary.do_not_place_on')} : ${Array.from(data.taquetsTeeth || []).join(', ')}` },
      { id: 'rapportAP', label: t('patients.new.prescription.summary.ap_report'), value: `D: ${data.rapportAP?.D || '-'}, G: ${data.rapportAP?.G || '-'}` },
      { id: 'overjet', label: t('patients.new.prescription.summary.overjet'), value: data.overjet },
      { id: 'overbite', label: t('patients.new.prescription.summary.overbite'), value: data.overbite },
      { id: 'biteRamps', label: t('patients.new.prescription.summary.bite_ramps'), value: data.biteRamps },
      { id: 'milieux', label: t('patients.new.prescription.summary.midlines'), value: data.milieux },
      { id: 'extractions', label: t('patients.new.prescription.summary.extractions'), value: data.extractions === 'none' ? t('patients.new.prescription.summary.none') : `${t('patients.new.prescription.summary.extract')} : ${Array.from(data.extractionsTeeth || []).join(', ')}` },
      { id: 'Espacement', label: t('patients.new.prescription.summary.spacing'), value: data.espacement },
      { id: 'specialInstructions', label: t('patients.new.prescription.summary.instructions'), value: data.specialInstructions || t('patients.new.prescription.summary.none') },
    ]

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-lg">{t('patients.new.prescription.summary_title')}</h4>
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between p-3 bg-white border rounded-lg">
              <div>
                <p className="font-medium text-sm text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500 mt-1">{item.value?.toString() || t('patients.new.verify.not_specified')}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#0170B4] hover:text-[#005f99] hover:bg-[#0170B4]/10"
                onClick={() => handleEditPrescription(item.id)}
              >
                {t('patients.new.verify.modify')}
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t('patients.new.product.title')} <span className="text-red-500">*</span>
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('patients.new.product.desc')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {[
                  {
                    label: t('patients.new.product.adult_title'),
                    type: 'Adulte' as const,
                    description: t('patients.new.product.adult_desc'),
                    image: '/images/adult.png',
                    color: 'blue',
                    gradient: 'from-[#0170B4] to-[#005f99]',
                  },
                  {
                    label: t('patients.new.product.teen_title'),
                    type: 'Adolescent' as const,
                    description: t('patients.new.product.teen_desc'),
                    image: '/images/adol.png',
                    color: 'teal',
                    gradient: 'from-[#00B6AE] to-[#008C86]',
                  },
                ].map(({ label, type, description, image, color, gradient }) => (
                  <DiamondCard
                    key={type}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group ${selectedPatientType === type
                      ? `ring-2 ring-offset-2 ${color === 'blue' ? 'ring-[#0170B4]' : 'ring-[#00B6AE]'}`
                      : 'hover:border-[#0170B4]/30'
                      }`}
                    onClick={() => handlePatientTypeSelect(type)}
                  >
                    <div className="relative">
                      {/* Check icon */}
                      <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${selectedPatientType === type
                        ? 'bg-[#00B6AE] scale-100 shadow-lg'
                        : 'bg-gray-100 scale-0 opacity-0'
                        }`}>
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>

                      {/* Header */}
                      <div className={`px-6 py-4 text-white bg-gradient-to-r ${gradient}`}>
                        <h4 className="text-xl font-bold flex items-center gap-2">
                          {label}
                        </h4>
                      </div>

                      {/* Content */}
                      <DiamondCardContent className="p-6">
                        {/* Image container */}
                        <div className="flex justify-center mb-6 relative">
                          <div className="absolute inset-0 bg-[#0170B4]/10 rounded-full blur-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500"></div>
                          <div className="w-full h-48 relative z-10 transition-transform duration-500 group-hover:scale-105">
                            <img src={image} alt={label} className="w-full h-full object-contain drop-shadow-md" />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="text-center mb-6">
                          <p className="text-slate-500 font-medium">{description}</p>
                        </div>

                        {/* Select button */}
                        <Button
                          className={`w-full font-bold shadow-md transition-all duration-300 ${selectedPatientType === type
                            ? `${color === 'blue' ? 'bg-[#0170B4] hover:bg-[#005f99]' : 'bg-[#00B6AE] hover:bg-[#008C86]'} text-white`
                            : 'bg-white text-slate-700 border-2 border-slate-100 hover:border-[#0170B4]/30 hover:bg-[#0170B4]/10'
                            }`}
                        >
                          {selectedPatientType === type ? t('patients.new.product.selected') : t('patients.new.product.choose')}
                        </Button>
                      </DiamondCardContent>
                    </div>
                  </DiamondCard>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('patients.new.product.pack_title')}</h3>
              <div className="grid grid-cols-3 gap-6">
                {mockPacks.map((pack) => (
                  <DiamondCard
                    key={pack.id}
                    className={`relative text-center overflow-visible flex flex-col min-h-[550px] transition-all duration-300 group ${selectedPack === pack.id
                      ? 'ring-2 ring-[#00B6AE] shadow-xl scale-[1.02]'
                      : 'hover:shadow-xl hover:-translate-y-1 hover:border-[#00B6AE]/30'
                      }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePackSelect(pack.id)
                    }}
                  >
                    {/* Background Number */}
                    <div className="absolute w-full h-[60%] top-1/2 left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-slate-100 font-bold text-[150px] opacity-20 z-0 pointer-events-none tracking-[-15px] select-none group-hover:text-slate-200 transition-colors">
                      {pack.id === '1' ? '7' : pack.id === '2' ? '12' : '24'}
                    </div>

                    {selectedPack === pack.id && (
                      <div className="absolute -top-3 -right-3 bg-[#00B6AE] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-20 animate-in zoom-in duration-300">
                        <CheckCircle className="w-6 h-6 stroke-[2.5]" />
                      </div>
                    )}

                    <DiamondCardContent className="flex-1 flex flex-col p-6 z-10">
                      <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto mb-4 bg-[#00B6AE]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <img
                            src="/images/pack1.png"
                            alt={pack.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <h2 className="text-2xl font-bold mt-1.5 mb-2 text-slate-800 relative z-10 text-center group-hover:text-[#00B6AE] transition-colors">
                          {pack.name.replace('Pack ', '')}
                        </h2>
                      </div>

                      <div className="w-16 h-1 mx-auto bg-gradient-to-r from-[#00B6AE] to-[#0170B4] rounded-full my-6 opacity-30 group-hover:opacity-100 transition-opacity"></div>

                      <div className="flex-1 space-y-6">
                        <div className="bg-slate-50 rounded-lg p-3 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Étapes par arcade
                          </p>
                          <p className="font-bold text-slate-800 text-lg">
                            {pack.id === '1'
                              ? '7 étapes'
                              : pack.id === '2'
                                ? '12 étapes'
                                : '24 étapes'}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-3 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Corrections incluses</p>
                          <p className="font-bold text-slate-800 text-lg">
                            {pack.id === '1'
                              ? '1 correction'
                              : pack.id === '2'
                                ? '1 correction'
                                : '2 corrections'}
                          </p>
                        </div>

                        <div className="w-full h-px bg-slate-100 my-4"></div>

                        <div className="flex justify-between gap-4">
                          <div className="flex-1 text-center p-3 rounded-lg border border-[#00B6AE]/20 bg-[#00B6AE]/10">
                            <p className="text-lg font-bold text-[#00B6AE]">
                              {pack.id === '1' ? '850' : pack.id === '2' ? '1150' : '2100'} <span className="text-xs align-top">TND</span>
                            </p>
                            <p className="text-[10px] font-bold text-[#00B6AE]/70 uppercase whitespace-nowrap">
                              {t('patients.new.product.one_arch')}
                            </p>
                          </div>
                          <div className="flex-1 text-center p-3 rounded-lg border border-[#0170B4]/20 bg-[#0170B4]/10">
                            <p className="text-lg font-bold text-[#0170B4]">
                              {pack.price} <span className="text-xs align-top">TND</span>
                            </p>
                            <p className="text-[10px] font-bold text-[#0170B4]/70 uppercase whitespace-nowrap">
                              {t('patients.new.product.two_arches')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        className={`w-full mt-6 py-6 text-lg font-bold shadow-md transition-all duration-300 ${selectedPack === pack.id
                          ? 'bg-[#00B6AE] hover:bg-[#00a099] text-white'
                          : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-[#00B6AE] hover:text-[#00B6AE]'
                          }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePackSelect(pack.id)
                        }}
                      >
                        {selectedPack === pack.id ? t('patients.new.product.selected') : t('patients.new.product.choose_pack')}
                      </Button>
                    </DiamondCardContent>
                  </DiamondCard>
                ))}
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{t('patients.new.details.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('patients.new.details.last_name')} <span className="text-red-500">*</span>
                </label>
                <Input
                  value={patientData.nom}
                  onChange={(e) => setPatientData((prev) => ({ ...prev, nom: e.target.value }))}
                  placeholder={t('patients.new.details.last_name')}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('patients.new.details.first_name')} <span className="text-red-500">*</span>
                </label>
                <Input
                  value={patientData.prenom}
                  onChange={(e) => setPatientData((prev) => ({ ...prev, prenom: e.target.value }))}
                  placeholder={t('patients.new.details.first_name')}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('patients.new.details.dob')} <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder={t('patients.new.details.day')}
                  maxLength={2}
                  value={patientData.birthDate.day}
                  onChange={(e) => {
                    const value = e.target.value
                    if (
                      (!value || /^\d+$/.test(value)) &&
                      (!value || (parseInt(value) <= 31 && value !== '00'))
                    ) {
                      updateBirthDate('day', value)
                    }
                  }}
                  className="w-20"
                />
                <Input
                  placeholder={t('patients.new.details.month')}
                  maxLength={2}
                  value={patientData.birthDate.month}
                  onChange={(e) => {
                    const value = e.target.value
                    if (
                      (!value || /^\d+$/.test(value)) &&
                      (!value || (parseInt(value) <= 12 && value !== '00'))
                    ) {
                      updateBirthDate('month', value)
                    }
                  }}
                  className="w-20"
                />
                <Input
                  placeholder={t('patients.new.details.year')}
                  maxLength={4}
                  value={patientData.birthDate.year}
                  onChange={(e) => {
                    const value = e.target.value
                    if ((!value || /^\d+$/.test(value)) && (!value || value !== '0000')) {
                      updateBirthDate('year', value)
                    }
                  }}
                  className="w-24"
                />
              </div>
              {age !== null && <p className="text-sm text-gray-600 font-medium mt-1">{t('patients.new.details.age_display').replace('{age}', String(age))}</p>}
              {ageError && error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('patients.new.details.gender')} <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {['Male', 'Female', 'Autre'].map((genre) => (
                  <label key={genre} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="genre"
                      value={genre}
                      checked={patientData.genre === genre}
                      onChange={(e) =>
                        setPatientData((prev) => ({ ...prev, genre: e.target.value as any }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      {genre === 'Male' ? t('patients.new.details.male') : genre === 'Female' ? t('patients.new.details.female') : t('patients.new.details.other')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('patients.new.details.clinical_conditions')}</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {conditions.map((condition) => (
                  <div
                    key={condition}
                    className={`p-2 text-xs border-0 rounded cursor-pointer transition-colors ${selectedConditions.includes(condition)
                      ? 'bg-[#0170B4]/10 border border-[#0170B4] text-[#0170B4] font-medium'
                      : 'hover:bg-gray-100 bg-gray-50 text-gray-600'
                      }`}
                    onClick={() => handleConditionClick(condition)}
                  >
                    {condition}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{t('patients.new.photos.title')}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">
                  {t('patients.new.photos.intro')} <span className="text-red-500">*</span>
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {t('patients.new.photos.intro_desc')}
                  <span className="text-xs text-gray-500"> - {t('patients.new.photos.max_size')}</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'image1', label: t('patients.new.photos.labels.portrait_profile'), required: true },
                    { key: 'image2', label: t('patients.new.photos.labels.portrait_face'), required: true },
                    { key: 'image3', label: t('patients.new.photos.labels.portrait_smile'), required: true },
                    { key: 'image4', label: t('patients.new.photos.labels.occlusal_upper'), required: true },
                    { key: 'image6', label: t('patients.new.photos.labels.occlusal_lower'), required: true },
                    { key: 'image7', label: t('patients.new.photos.labels.intra_right'), required: true },

                    { key: 'image8', label: t('patients.new.photos.labels.intra_face'), required: true },
                    { key: 'image9', label: t('patients.new.photos.labels.intra_left'), required: true },
                    // Generate "Other" photos dynamically
                    ...Array.from({ length: otherPhotosCount }).map((_, index) => ({
                      key: `other_${index}`,
                      label: t('patients.new.photos.labels.other') || 'Autre',
                      required: false,
                    })),
                  ].map((photo) => (
                    <div key={photo.key} className="border-0 bg-gray-50 rounded-lg p-4 text-center transition-colors relative group">
                      <div
                        className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden relative cursor-pointer"
                        onClick={() => {
                          if (patientData.photos && patientData.photos[photo.key] instanceof File) {
                            setPreviewFile({ file: patientData.photos[photo.key] as File, title: photo.label })
                          } else {
                            handleUploadClick('photos', photo.key)
                          }
                        }}
                      >
                        {patientData.photos && patientData.photos[photo.key] instanceof File ? (
                          <>
                            <img
                              src={URL.createObjectURL(patientData.photos[photo.key] as File)}
                              alt={photo.label}
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <Button size="icon" variant="secondary" className="h-6 w-6 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={(e) => {
                                e.stopPropagation();
                                setPreviewFile({ file: patientData.photos[photo.key] as File, title: photo.label });
                              }}>
                                <Maximize2 className="h-3 w-3 text-gray-700" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Camera className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {photo.label} {photo.required && <span className="text-red-500">*</span>}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-all duration-300"
                        onClick={() => handleUploadClick('photos', photo.key)}
                      >
                        {patientData.photos && patientData.photos[photo.key] ? t('patients.new.photos.modify') : t('patients.new.photos.select_plus')}
                      </Button>
                    </div>
                  ))}

                  {/* Add button for new "Other" photo */}
                  <div
                    onClick={() => setOtherPhotosCount(prev => prev + 1)}
                    className="rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all min-h-[220px] group"
                    role="button"
                    tabIndex={0}
                  >
                    <div className="w-20 h-20 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center mb-3 shadow-sm group-hover:border-[#0170B4] group-hover:scale-110 transition-all">
                      <Plus className="w-10 h-10 text-gray-400 group-hover:text-[#0170B4] transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-[#0170B4] transition-colors">{t('patients.new.photos.add_photo') || 'Ajouter une photo'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">{t('patients.new.photos.xrays')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border-0 bg-gray-50 rounded-lg p-4 text-center transition-colors relative group">
                    <div
                      className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden relative cursor-pointer"
                      onClick={() => {
                        if (patientData.radiographies && patientData.radiographies['panoramic'] instanceof File) {
                          setPreviewFile({ file: patientData.radiographies['panoramic'] as File, title: t('patients.new.photos.panoramic') })
                        } else {
                          handleUploadClick('radiographies', 'panoramic')
                        }
                      }}
                    >
                      {patientData.radiographies && patientData.radiographies['panoramic'] instanceof File ? (
                        <>
                          <img
                            src={URL.createObjectURL(patientData.radiographies['panoramic'] as File)}
                            alt={t('patients.new.photos.panoramic')}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button size="icon" variant="secondary" className="h-6 w-6 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={(e) => {
                              e.stopPropagation();
                              setPreviewFile({ file: patientData.radiographies['panoramic'] as File, title: t('patients.new.photos.panoramic') });
                            }}>
                              <Maximize2 className="h-3 w-3 text-gray-700" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <FileText className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {t('patients.new.photos.panoramic')} <span className="text-red-500">*</span>
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-all duration-300"
                      onClick={() => handleUploadClick('radiographies', 'panoramic')}
                    >
                      {patientData.radiographies && patientData.radiographies['panoramic'] ? t('patients.new.photos.modify') : t('patients.new.photos.select_plus')}
                    </Button>
                  </div>
                  <div className="border-0 bg-gray-50 rounded-lg p-4 text-center transition-colors relative group">
                    <div
                      className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden relative cursor-pointer"
                      onClick={() => {
                        if (patientData.radiographies && patientData.radiographies['xray_profile'] instanceof File) {
                          setPreviewFile({ file: patientData.radiographies['xray_profile'] as File, title: t('patients.new.photos.xray_profile') })
                        } else {
                          handleUploadClick('radiographies', 'xray_profile')
                        }
                      }}
                    >
                      {patientData.radiographies && patientData.radiographies['xray_profile'] instanceof File ? (
                        <>
                          <img
                            src={URL.createObjectURL(patientData.radiographies['xray_profile'] as File)}
                            alt={t('patients.new.photos.xray_profile')}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button size="icon" variant="secondary" className="h-6 w-6 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={(e) => {
                              e.stopPropagation();
                              setPreviewFile({ file: patientData.radiographies['xray_profile'] as File, title: t('patients.new.photos.xray_profile') });
                            }}>
                              <Maximize2 className="h-3 w-3 text-gray-700" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <FileText className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{t('patients.new.photos.xray_profile')}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-all duration-300"
                      onClick={() => handleUploadClick('radiographies', 'xray_profile')}
                    >
                      {patientData.radiographies && patientData.radiographies['xray_profile'] ? t('patients.new.photos.modify') : t('patients.new.photos.select_plus')}
                    </Button>
                  </div>
                  {/* CBCT via URL */}
                  <div className="border-0 bg-gray-50 rounded-lg p-4 text-center">
                    <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                      <Scan className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{t('patients.new.photos.cbct')}</p>
                    {patientData.cbctUrl ? (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 break-all">{patientData.cbctUrl}</p>
                        <Button variant="outline" size="sm" className="w-full hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-all duration-300" onClick={() => setOpenCbctDialog(true)}>
                          {t('patients.new.photos.modify')}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-all duration-300" onClick={() => setOpenCbctDialog(true)}>
                        {t('patients.new.photos.add_cbct')}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Dialog: Ajouter CBCT URL */}
                <Dialog open={openCbctDialog} onOpenChange={setOpenCbctDialog}>
                  <DialogContent className="bg-white sm:max-w-md md:left-[calc(50%+8rem)]">
                    <DialogHeader className="mb-3">
                      <DialogTitle>{t('patients.new.dialogs.add_cbct_title')}</DialogTitle>
                      <DialogDescription>{t('patients.new.dialogs.add_cbct_desc')}</DialogDescription>
                    </DialogHeader>

                    <Form {...cbctForm}>
                      <form
                        onSubmit={cbctForm.handleSubmit((values) => {
                          setPatientData((prev) => ({ ...prev, cbctUrl: values.url }))
                          setOpenCbctDialog(false)
                        })}
                        className="space-y-4"
                      >
                        <FormField
                          control={cbctForm.control}
                          name="url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('patients.new.dialogs.scan_link')}</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button type="button" variant="outline" className="hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-colors" onClick={() => setOpenCbctDialog(false)}>
                            {t('patients.new.form.cancel')}
                          </Button>
                          <Button type="submit" className="bg-[#0170B4] hover:bg-[#005f99] text-white">
                            {t('patients.new.dialogs.confirm')}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{t('patients.new.scans.title')}</h3>
            <p className="text-sm text-gray-600">
              {t('patients.new.scans.desc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-0 bg-gray-50 rounded-lg p-4 text-center transition-colors relative group">
                <div className="w-full h-40 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden relative" onClick={() => {
                  if (patientData.scans && patientData.scans['upper']) {
                    setPreviewFile({ file: patientData.scans['upper'] as File, title: t('patients.new.scans.upper') })
                  } else {
                    handleUploadClick('scans', 'upper')
                  }
                }}>
                  {patientData.scans && patientData.scans['upper'] ? (
                    <>
                      <div className="w-full h-full cursor-pointer">
                        <ScanViewer
                          file={patientData.scans['upper'] as File}
                          autoRotate={true}
                          onClick={() => setPreviewFile({ file: patientData.scans['upper'] as File, title: t('patients.new.scans.upper') })}
                        />
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={(e) => {
                          e.stopPropagation();
                          setPreviewFile({ file: patientData.scans['upper'] as File, title: t('patients.new.scans.upper') });
                        }}>
                          <Maximize2 className="h-4 w-4 text-gray-700" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Scan className="w-8 h-8 text-gray-400 cursor-pointer" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {t('patients.new.scans.upper')} <span className="text-red-500">*</span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-all duration-300"
                  onClick={() => handleUploadClick('scans', 'upper')}
                >
                  {patientData.scans && patientData.scans['upper'] ? t('patients.new.photos.modify') : t('patients.new.photos.select_plus')}
                </Button>
              </div>
              <div className="border-0 bg-gray-50 rounded-lg p-4 text-center transition-colors relative group">
                <div className="w-full h-40 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden relative" onClick={() => {
                  if (patientData.scans && patientData.scans['lower']) {
                    setPreviewFile({ file: patientData.scans['lower'] as File, title: t('patients.new.scans.lower') })
                  } else {
                    handleUploadClick('scans', 'lower')
                  }
                }}>
                  {patientData.scans && patientData.scans['lower'] ? (
                    <>
                      <div className="w-full h-full cursor-pointer">
                        <ScanViewer
                          file={patientData.scans['lower'] as File}
                          autoRotate={true}
                          onClick={() => setPreviewFile({ file: patientData.scans['lower'] as File, title: t('patients.new.scans.lower') })}
                        />
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white" onClick={(e) => {
                          e.stopPropagation();
                          setPreviewFile({ file: patientData.scans['lower'] as File, title: t('patients.new.scans.lower') });
                        }}>
                          <Maximize2 className="h-4 w-4 text-gray-700" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Scan className="w-8 h-8 text-gray-400 cursor-pointer" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {t('patients.new.scans.lower')} <span className="text-red-500">*</span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-all duration-300"
                  onClick={() => handleUploadClick('scans', 'lower')}
                >
                  {patientData.scans && patientData.scans['lower'] ? t('patients.new.photos.modify') : t('patients.new.photos.select_plus')}
                </Button>
              </div>
            </div>

            {/* Separator content "ou" */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-3 text-sm text-gray-700">{t('patients.new.scans.or')}</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>
            <div className="flex justify-center">
              <Button
                className="bg-[#0170B4] hover:bg-[#005f99] text-white"
                onClick={() => setOpenScanDialog(true)}
              >
                {t('patients.new.scans.send_via_scanner')}
              </Button>
            </div>

            {/* Dialog: envoyer via scanner */}
            <Dialog open={openScanDialog} onOpenChange={setOpenScanDialog}>
              <DialogContent className="bg-white sm:max-w-lg md:max-w-xl">
                <DialogHeader className="mb-3">
                  <DialogTitle>{t('patients.new.dialogs.scan_options_title')}</DialogTitle>
                  <DialogDescription>{t('patients.new.dialogs.scan_options_desc')}</DialogDescription>
                </DialogHeader>

                <Form {...scanSendForm}>
                  <form
                    onSubmit={scanSendForm.handleSubmit((values) => {
                      if (values.mode === 'link') {
                        setPatientData((prev) => ({ ...prev, scanMode: values.mode as any, scanLink: values.link }))
                      } else {
                        setPatientData((prev) => ({ ...prev, scanMode: values.mode as any, scanLink: undefined }))
                      }
                      setOpenScanDialog(false)
                    })}
                    className="space-y-4"
                  >
                    <FormField
                      control={scanSendForm.control}
                      name="mode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('patients.new.dialogs.choose_option')}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="grid grid-cols-1 md:grid-cols-2 gap-3"
                            >
                              <div className={`flex items-center gap-2 p-3 border rounded-md ${field.value === 'link' ? 'border-[#0170B4] bg-[#0170B4]/10' : 'border-slate-200'}`}>
                                <RadioGroupItem className="data-[state=checked]:border-[#0170B4] text-[#0170B4]" value="link" id="mode-link" />
                                <label htmlFor="mode-link" className="cursor-pointer text-sm">{t('patients.new.dialogs.add_scan_link')}</label>
                              </div>
                              <div className={`flex items-center gap-2 p-3 border rounded-md ${field.value === 'scanner' ? 'border-[#0170B4] bg-[#0170B4]/10' : 'border-slate-200'}`}>
                                <RadioGroupItem className="data-[state=checked]:border-[#0170B4] text-[#0170B4]" value="scanner" id="mode-scanner" />
                                <label htmlFor="mode-scanner" className="cursor-pointer text-sm">{t('patients.new.dialogs.send_from_scanner')}</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Conditional input for scan link when mode = link */}
                    {scanSendForm.watch('mode') === 'link' && (
                      <FormField
                        control={scanSendForm.control}
                        name="link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('patients.new.dialogs.scan_link')}</FormLabel>
                            <FormControl>
                              <Input placeholder="https://exemple.com/scan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <DialogFooter>
                      <Button type="button" variant="outline" className="hover:bg-[#0170B4]/10 hover:text-[#0170B4] hover:border-[#0170B4]/30 transition-colors" onClick={() => setOpenScanDialog(false)}>
                        {t('patients.new.form.cancel')}
                      </Button>
                      <Button type="submit" className="bg-[#0170B4] hover:bg-[#005f99] text-white">
                        {t('patients.new.dialogs.continue')}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <Prescription
              ref={prescriptionRef}
              initialSection={initialSection}
              patientDetails={{
                name: patientData.nom,
                surname: patientData.prenom,
                age: age,
                gender: patientData.genre,
                category: selectedPatientType
              }}
              prescriptionData={typeof patientData.prescription === 'object' ? patientData.prescription : {}}
            />
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{t('patients.new.verify.title')}</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">{t('patients.new.verify.patient_summary')}</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>{t('patients.new.verify.type')}</strong> {selectedPatientType || t('patients.new.verify.not_selected')}
                  </p>
                  <p>
                    <strong>{t('patients.new.details.last_name')}:</strong> {patientData.nom || t('patients.new.verify.not_filled')} {patientData.prenom || ''}
                  </p>
                </div>
              </div>

              {/* Prescription Summary */}
              {renderPrescriptionSummary()}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="z-50 sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 supports-[backdrop-filter]:bg-white/60">
        <div className="flex items-center justify-between px-6 py-4 max-w-[1600px] mx-auto w-full">
          <HeadingTitle
            title={t('patients.new.title')}
            subtitle={t('patients.new.subtitle').replace('{current}', String(currentStep + 1)).replace('{total}', String(steps.length))}
            titleClassName="text-3xl font-bold text-gray-900"
            subtitleClassName="text-sm font-medium text-gray-500 mt-1"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('patients.new.buttons.prev')}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t('patients.new.buttons.cancel_case')}
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button className="bg-[#0170B4] hover:bg-[#005f99] text-white shadow-md transition-all hover:translate-y-[-1px]">
                  {t('patients.new.buttons.save_close')}
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-[#00B6AE] text-white hover:bg-[#00a099] shadow-lg transition-all hover:translate-y-[-1px]"
                  >
                    {t('patients.new.buttons.next')}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!areAllStepsCompleted()}
                    className={`shadow-lg transition-all hover:translate-y-[-1px] ${areAllStepsCompleted()
                      ? 'bg-gradient-to-r from-[#0170B4] to-[#00B6AE] hover:from-[#005f99] hover:to-[#00a099] text-white border-0'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {areAllStepsCompleted() ? t('patients.new.buttons.submit_case') : t('patients.new.buttons.complete_all')}
                  </Button>
                )}
              </div>
            </div>
          </HeadingTitle>
        </div>
      </div>

      {/* Main content with flex layout */}
      <div className="flex flex-1 min-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Sidebar - 1/3 width */}
        <div className="w-1/3 border-r-0 p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <DiamondCard variant="outlined" className="h-auto py-10">
            <DiamondCardContent>
              <nav className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentStep
                  const isCompleted = isStepCompleted(index)

                  const isLastStep = index === steps.length - 1

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer border ${isActive
                        ? isLastStep
                          ? 'bg-gradient-to-r from-[#0170B4]/10 to-[#00B6AE]/10 border-[#0170B4]/20 shadow-sm border-l-4 border-l-[#0170B4]'
                          : 'bg-[#0170B4]/10 border-[#0170B4]/20 shadow-sm border-l-4 border-l-[#0170B4]'
                        : isCompleted
                          ? isLastStep
                            ? 'bg-gradient-to-r from-[#0170B4]/20 to-[#00B6AE]/20 border-[#00B6AE]/30 border-l-4 border-l-[#00B6AE] shadow-md'
                            : 'bg-[#00B6AE]/10 border-[#00B6AE]/20 border-l-4 border-l-[#00B6AE]'
                          : 'border-transparent hover:bg-gray-100 hover:border-gray-200'
                        }`}
                      onClick={() => handleStepClick(index)}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${isActive
                          ? isLastStep
                            ? 'bg-gradient-to-r from-[#0170B4] to-[#00B6AE] text-white shadow-md'
                            : 'bg-[#0170B4] text-white shadow-md'
                          : isCompleted
                            ? isLastStep
                              ? 'bg-gradient-to-r from-[#0170B4] to-[#00B6AE] text-white shadow-md ring-2 ring-offset-2 ring-[#00B6AE]/30'
                              : 'bg-[#00B6AE] text-white shadow-md'
                            : 'bg-gray-100 text-gray-400'
                          }`}
                      >
                        {isCompleted && !isActive ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-medium transition-colors duration-300 ${isActive
                            ? 'text-[#0170B4]'
                            : isCompleted
                              ? 'text-[#00B6AE]'
                              : 'text-gray-500'
                            }`}
                        >
                          {step.label}
                        </div>
                        <div className={`text-xs transition-colors duration-300 ${isActive ? 'text-[#0170B4]/80' : 'text-gray-400'}`}>{step.description}</div>
                      </div>
                    </div>
                  )
                })}
              </nav>
            </DiamondCardContent>
          </DiamondCard>
        </div>

        {/* Main content - 2/3 width */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <DiamondCard className="h-full">
              <DiamondCardContent className="p-6">{renderStepContent()}</DiamondCardContent>
            </DiamondCard>
          </div>
        </div>
      </div>

      {/* Cancel confirmation dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('patients.new.dialogs.cancel_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('patients.new.dialogs.cancel_desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('patients.new.dialogs.continue_editing')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
              {t('patients.new.dialogs.yes_cancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {/* Dialog: Preview 3D */}
      <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="w-[min(90vw,90vh)] h-[min(90vw,90vh)] !max-w-none flex flex-col p-0 overflow-hidden bg-slate-50">
          <DialogHeader className="p-4 bg-white border-b shrink-0">
            <DialogTitle>{previewFile?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 relative bg-slate-100">
            {previewFile && (
              <>
                {previewFile.file instanceof File && (previewFile.file.type.startsWith('image/') || previewFile.file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ? (
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
    </div>
  )
}
