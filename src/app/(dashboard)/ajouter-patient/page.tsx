'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, X, User, FileText, Camera, Scan, Stethoscope, CheckCircle } from 'lucide-react'
import { HeadingTitle } from '@/components/HeadingTitle'
import {
  DiamondCard,
  DiamondCardHeader,
  DiamondCardTitle,
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

// Validation schemas
const patientTypeSchema = z.object({
  type: z.enum(['Adulte', 'Adolescent'], {
    required_error: 'Veuillez sélectionner un type de patient',
  }),
  pack: z.string().min(1, 'Veuillez sélectionner un pack'),
})

const patientDetailsSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  genre: z.enum(['Male', 'Female', 'Autre'], {
    required_error: 'Veuillez sélectionner un genre',
  }),
  birthDate: z.object({
    day: z.string().min(1, 'Jour requis'),
    month: z.string().min(1, 'Mois requis'),
    year: z.string().min(4, 'Année requise'),
  }),
  conditions: z.array(z.string()).optional(),
})

type PatientTypeFormValues = z.infer<typeof patientTypeSchema>
type PatientDetailsFormValues = z.infer<typeof patientDetailsSchema>

// Mock data for packs
const mockPacks = [
  {
    id: '1',
    name: 'Pack Essentiel',
    description: 'Traitement orthodontique de base',
    price: 2500,
    features: ['Aligneurs transparents', 'Suivi mensuel', 'Retouches incluses'],
  },
  {
    id: '2',
    name: 'Pack Premium',
    description: 'Traitement orthodontique complet',
    price: 3500,
    features: [
      'Aligneurs transparents',
      'Suivi bi-mensuel',
      'Retouches illimitées',
      'Blanchiment inclus',
    ],
  },
  {
    id: '3',
    name: 'Pack Luxe',
    description: 'Traitement orthodontique haut de gamme',
    price: 4500,
    features: [
      'Aligneurs transparents premium',
      'Suivi hebdomadaire',
      'Retouches illimitées',
      'Blanchiment inclus',
      'Contention à vie',
    ],
  },
]

const conditions = [
  'Encombrement',
  'Espacement',
  'Proalvéolie',
  'Articulé inversé anterieur',
  'Surplomb',
  'Articulé inversé postérieur',
  'Supraclusion',
  'Classe II division 1',
  'Classe II division 2',
  'Classe III',
  'Arcade étroite',
  'Béance',
]

const steps = [
  {
    label: 'Choisir un produit',
    icon: User,
    description: 'Type et pack',
  },
  {
    label: 'Détails du patient',
    icon: FileText,
    description: 'Informations personnelles',
  },
  {
    label: 'Photos/Radiographies',
    icon: Camera,
    description: 'Photos cliniques',
  },
  {
    label: 'Scans',
    icon: Scan,
    description: 'Scans 3D',
  },
  {
    label: 'Prescription',
    icon: Stethoscope,
    description: 'Prescription médicale',
  },
  {
    label: 'Vérifier et soumettre',
    icon: CheckCircle,
    description: 'Vérification finale',
  },
]

interface PatientData {
  type?: string
  pack?: string
  nom: string
  prenom: string
  genre: string
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
  prescription?: any
}

export default function AjouterPatient() {
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
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

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
        return patientData.nom !== '' && patientData.prenom !== '' && patientData.genre !== '' &&
          patientData.birthDate.day !== '' && patientData.birthDate.month !== '' && patientData.birthDate.year !== ''
      case 2: // Photos/Radiographies
        return Object.keys(patientData.photos).length > 0 || Object.keys(patientData.radiographies).length > 0
      case 3: // Scans
        return Object.keys(patientData.scans).length > 0
      case 4: // Prescription
        return patientData.prescription !== undefined && patientData.prescription !== null
      case 5: // Vérifier et soumettre
        return true // Always accessible once other steps are completed
      default:
        return false
    }
  }

  // Function to check if all steps are completed
  const areAllStepsCompleted = (): boolean => {
    for (let i = 0; i < steps.length - 1; i++) { // Exclude the last step (submit)
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
    if (areAllStepsCompleted()) {
      console.log('Submitting patient data:', patientData)
      router.push('/patients')
    }
  }

  const handleCancel = () => {
    setShowCancelDialog(false)
    router.push('/patients')
  }

  const handleCardClick = (type: string) => {
    setSelectedPatientType(type)
    setPatientData((prev) => ({ ...prev, type }))
  }

  const handlePackSelect = (pack: any) => {
    setSelectedPack(pack.id)
    setPatientData((prev) => ({ ...prev, pack: pack.id }))
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sélectionnez le type de patient <span className="text-red-500">*</span>
                </h3>
                <p className="text-gray-600 mb-6">
                  Choisissez le type de patient pour personnaliser le traitement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {[
                  {
                    label: 'Adulte',
                    type: 'Adulte',
                    description: 'Patient de 18 ans et plus',
                    image: '/images/adult.png',
                    color: 'blue',
                  },
                  {
                    label: 'Adolescent',
                    type: 'Adolescent',
                    description: 'Patient de 12 à 17 ans',
                    image: '/images/adol.png',
                    color: 'gray',
                  },
                ].map(({ label, type, description, image, color }) => (
                  <div
                    key={type}
                    className={`cursor-pointer border rounded-lg overflow-hidden ${selectedPatientType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    onClick={() => handleCardClick(type)}
                  >
                    <div className="relative">
                      {/* Check icon */}
                      {selectedPatientType === type && (
                        <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Header simple */}
                      <div
                        className={`px-4 py-3 text-white ${color === 'blue' ? 'bg-blue-500' : 'bg-gray-600'
                          }`}
                      >
                        <h4 className="text-lg font-semibold">{label}</h4>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Image container */}
                        <div className="flex justify-center mb-4">
                          <div className="w-full h-40 p-2">
                            <img src={image} alt={label} className="w-full h-full object-contain" />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="text-center mb-4">
                          <p className="text-gray-600 text-sm">{description}</p>
                        </div>

                        {/* Select button */}
                        <button
                          className={`w-full py-2 px-4 rounded font-medium transition-colors duration-200 ${selectedPatientType === type
                              ? `${color === 'blue'
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-700 hover:bg-gray-800'
                              } text-white`
                              : `${color === 'blue'
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-gray-600 hover:bg-gray-700'
                              } text-white`
                            }`}
                        >
                          {selectedPatientType === type ? (
                            <span className="flex items-center justify-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Sélectionné</span>
                            </span>
                          ) : (
                            <span>Sélectionner</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sélectionnez un pack</h3>
              <div className="grid grid-cols-3 gap-6">
                {mockPacks.map((pack) => (
                  <div
                    key={pack.id}
                    className={`bg-white rounded-xl p-4 relative text-center overflow-visible border flex flex-col min-h-[550px] ${selectedPack === pack.id ? 'border-teal-500' : 'border-gray-200'
                      }`}
                    onClick={() => handlePackSelect(pack)}
                  >
                    {/* Background Number */}
                    <div className="absolute w-full h-[60%] top-1/2 left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 font-bold text-[150px] opacity-[0.08] z-0 pointer-events-none tracking-[-15px]">
                      {pack.id === '1' ? '7' : pack.id === '2' ? '12' : '24'}
                    </div>

                    {selectedPack === pack.id && (
                      <div className="absolute -top-2.5 -right-2.5 bg-teal-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10">
                        <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                      </div>
                    )}

                    <div className="relative z-10">
                      <img
                        src="/images/pack1.png"
                        alt={pack.name}
                        className="w-16 h-16 mx-auto mb-2"
                      />
                      <h2 className="text-2xl font-semibold mt-1.5 mb-2 text-teal-600 relative z-10 text-center">
                        {pack.name.replace('Pack ', '')}
                      </h2>
                    </div>

                    <div className="w-full h-0.5 bg-teal-600 my-4 relative z-10"></div>

                    <div className="flex-1 relative z-10">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Nombre maximal d'étapes par arcade
                        </p>
                        <p className="font-medium">
                          {pack.id === '1'
                            ? '7 étapes'
                            : pack.id === '2'
                              ? '12 étapes'
                              : '24 étapes'}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Nombre de corrections incluses</p>
                        <p className="font-medium">
                          {pack.id === '1'
                            ? '1 correction'
                            : pack.id === '2'
                              ? '1 correction'
                              : '2 corrections'}
                        </p>
                      </div>

                      <div className="w-full h-0.5 bg-teal-600 my-4"></div>

                      <div className="flex justify-between mb-4">
                        <div className="text-center">
                          <p className="text-lg font-bold" style={{ color: '#05B4B2' }}>
                            {pack.id === '1' ? '850' : pack.id === '2' ? '1150' : '2100'} TND
                          </p>
                          <p className="text-xs" style={{ color: '#05B4B2' }}>
                            Arcade Unique
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold" style={{ color: '#2969AC' }}>
                            {pack.price} TND
                          </p>
                          <p className="text-xs" style={{ color: '#2969AC' }}>
                            Deux Arcades
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-colors mt-auto relative z-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePackSelect(pack)
                      }}
                    >
                      Sélectionner
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Détails du patient</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input
                  value={patientData.nom}
                  onChange={(e) => setPatientData((prev) => ({ ...prev, nom: e.target.value }))}
                  placeholder="Nom de famille"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <Input
                  value={patientData.prenom}
                  onChange={(e) => setPatientData((prev) => ({ ...prev, prenom: e.target.value }))}
                  placeholder="Prénom"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Date de naissance <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="JJ"
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
                  placeholder="MM"
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
                  placeholder="AAAA"
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
              {age && <p className="text-sm text-gray-600">Âge: {age} ans</p>}
              {ageError && error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Genre <span className="text-red-500">*</span>
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
                        setPatientData((prev) => ({ ...prev, genre: e.target.value }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Conditions cliniques</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {conditions.map((condition) => (
                  <div
                    key={condition}
                    className={`p-2 text-xs border-0 rounded cursor-pointer transition-colors ${selectedConditions.includes(condition)
                        ? 'bg-blue-50 border border-blue-500 text-blue-700'
                        : 'hover:bg-gray-50 bg-gray-50'
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
            <h3 className="text-lg font-semibold">Photos / Radiographies</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">
                  Photos extra et intraorales <span className="text-red-500">*</span>
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Sélectionner (depuis votre ordinateur) / utiliser l'application Diamond Clinic
                  <span className="text-xs text-gray-500"> - Taille max de l'image: 15Mo</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'image1', label: 'Portrait de profil au repos', required: true },
                    { key: 'image2', label: 'Portrait de face au repos', required: true },
                    { key: 'image3', label: 'Portrait de face en sourire', required: true },
                    { key: 'image4', label: 'Occlusale supérieure', required: true },
                    { key: 'image6', label: 'Occlusale inférieure', required: true },
                    { key: 'image7', label: 'Intra-orale latérale droite', required: true },
                    { key: 'image8', label: 'Intra-orale de face', required: true },
                    { key: 'image9', label: 'Intra-orale latérale gauche', required: true },
                  ].map((photo) => (
                    <div key={photo.key} className="border-0 bg-gray-50 rounded-lg p-4 text-center">
                      <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {photo.label} {photo.required && <span className="text-red-500">*</span>}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Sélectionner +
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Radiographies</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-0 bg-gray-50 rounded-lg p-4 text-center">
                    <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Panoramique <span className="text-red-500">*</span>
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Sélectionner +
                    </Button>
                  </div>
                  <div className="border-0 bg-gray-50 rounded-lg p-4 text-center">
                    <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Radiographie de profil</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Sélectionner +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Scans</h3>
            <p className="text-sm text-gray-600">
              Sélectionner (depuis votre ordinateur) / utiliser l'application Diamond Clinic
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-0 bg-gray-50 rounded-lg p-4 text-center">
                <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <Scan className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Maxillaire <span className="text-red-500">*</span>
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Sélectionner +
                </Button>
              </div>
              <div className="border-0 bg-gray-50 rounded-lg p-4 text-center">
                <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <Scan className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Mandibulaire <span className="text-red-500">*</span>
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Sélectionner +
                </Button>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Prescription</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Saisissez la prescription médicale..."
                className="min-h-[200px]"
              />
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Vérifier et soumettre</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Résumé du patient</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Type:</strong> {selectedPatientType || 'Non sélectionné'}
                  </p>
                  <p>
                    <strong>Pack:</strong>{' '}
                    {selectedPack
                      ? mockPacks.find((p) => p.id === selectedPack)?.name
                      : 'Non sélectionné'}
                  </p>
                  <p>
                    <strong>Nom:</strong> {patientData.nom || 'Non renseigné'}
                  </p>
                  <p>
                    <strong>Prénom:</strong> {patientData.prenom || 'Non renseigné'}
                  </p>
                  <p>
                    <strong>Genre:</strong> {patientData.genre || 'Non renseigné'}
                  </p>
                  <p>
                    <strong>Âge:</strong> {age ? `${age} ans` : 'Non calculé'}
                  </p>
                  <p>
                    <strong>Conditions:</strong>{' '}
                    {selectedConditions.length > 0 ? selectedConditions.join(', ') : 'Aucune'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="z-50 px-6 py-4 sticky top-0 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <HeadingTitle
            title="Nouveau Patient"
            subtitle={`Étape ${currentStep + 1} sur ${steps.length}`}
            subtitleClassName="text-sm text-blue-600 font-medium"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler le cas
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Enregistrer et fermer
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    className="text-gray-600 border-gray-300 bg-white hover:bg-gray-50"
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleSubmit}
                    disabled={!areAllStepsCompleted()}
                    className={`border-gray-300 bg-white ${areAllStepsCompleted()
                        ? 'text-gray-600 hover:bg-gray-50'
                        : 'text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {areAllStepsCompleted() ? 'Soumettre' : 'Complétez toutes les étapes'}
                  </Button>
                )}
              </div>
            </div>
          </HeadingTitle>
        </div>
      </div>

      {/* Main content with flex layout */}
      <div className="flex flex-1 min-h-[calc(100vh-140px)]">
        {/* Sidebar - 1/3 width */}
        <div className="w-1/3 border-r-0 p-6 sticky top-0 h-screen overflow-y-auto">
          <DiamondCard variant="outlined" className="h-auto py-10">
            <DiamondCardContent>
              <nav className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentStep
                  const isCompleted = isStepCompleted(index)

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${isActive
                          ? 'bg-blue-50 border border-blue-200'
                          : isCompleted
                            ? 'bg-green-50 border border-green-200'
                            : 'hover:bg-gray-50'
                        }`}
                      onClick={() => handleStepClick(index)}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${isActive
                            ? 'bg-blue-600 text-white'
                            : isCompleted
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-600'
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
                          className={`font-medium ${isActive
                              ? 'text-blue-900'
                              : isCompleted
                                ? 'text-green-900'
                                : 'text-gray-700'
                            }`}
                        >
                          {step.label}
                        </div>
                        <div className="text-xs text-gray-500">{step.description}</div>
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
            <AlertDialogTitle>Annuler la création du patient ?</AlertDialogTitle>
            <AlertDialogDescription>
              Toutes les données saisies seront perdues. Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer l'édition</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
              Oui, annuler
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
