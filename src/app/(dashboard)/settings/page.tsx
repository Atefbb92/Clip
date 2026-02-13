'use client'

import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  MapPin,
  Briefcase,
  CheckCircle,
  Info,
  Stethoscope,
  Activity,
} from 'lucide-react'
import {
  DiamondCard as Card,
  DiamondCardContent as CardContent,
  DiamondCardDescription as CardDescription,
  DiamondCardHeader as CardHeader,
  DiamondCardTitle as CardTitle,
} from '@/components/ui/diamond-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { HeadingTitle } from '@/components/HeadingTitle'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from '@/hooks/useTranslation'

// Schéma Zod pour l'adresse (utilisé par Form de shadcn)
const addressSchema = z.object({
  address: z.string().min(5, 'Adresse trop courte'),
  city: z.string().min(2, 'Ville invalide'),
  postalCode: z.string().min(3, 'Code postal invalide'),
  country: z.string().min(2, 'Pays invalide'),
})

type AddressFormValues = z.infer<typeof addressSchema>

// Schéma Zod pour les préférences cliniques
const clinicalPrefsSchema = z.object({
  classType: z.enum(['classII', 'classIII']),
  adult: z.object({
    objectifTraitement: z.enum(['maintenir', 'ameliorerRelationCanines', 'classeI']),
    arcadeSuperieure: z.enum(['pasCorrection', 'distalisation']),
    arcadeInferieure: z.enum(['pasCorrection', 'simulationOcclusion', 'mesialisation']),
    patronDistalisation: z.enum(['sequentielle', 'compacte', 'amelioree']).optional(),
    quantiteDistalisationMm: z.enum(['2', '3', '4']).optional(),
    commencerMouvement: z.boolean(),
    prioriteSur: z.enum(['molaire', 'canine']),
    typeSimulation: z.enum(['elastiques', 'chirurgical']),
  }),
  adolescent: z.object({
    objectifTraitement: z.enum(['classeI']),
    arcadeSuperieure: z.enum(['pasCorrection', 'distalisation']),
    arcadeInferieure: z.enum(['pasCorrection', 'simulationOcclusion', 'mesialisation']),
    prioriteSur: z.enum(['molaire', 'canine']),
    typeSimulation: z.enum(['elastiques', 'chirurgical']),
  }),
})

type ClinicalPrefsForm = z.infer<typeof clinicalPrefsSchema>

const SettingsPage: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false)
  const { t } = useTranslation()
  const [profile, setProfile] = useState({
    firstName: 'Dr. Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@diamond.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Paix',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    clinicName: 'Cabinet Dentaire Dupont',
    specialty: 'orthodontie',
    license: 'FR-12345678',
    experience: '10+',
  })
  const [activeTab, setActiveTab] = useState('clinical-prefs')

  // État local pour les préférences cliniques
  const [clinicalPreferences, setClinicalPreferences] = useState<ClinicalPrefsForm>({
    classType: 'classII',
    adult: {
      objectifTraitement: 'classeI',
      arcadeSuperieure: 'distalisation',
      arcadeInferieure: 'simulationOcclusion',
      patronDistalisation: 'amelioree',
      quantiteDistalisationMm: '4',
      commencerMouvement: true,
      prioriteSur: 'canine',
      typeSimulation: 'elastiques',
    },
    adolescent: {
      objectifTraitement: 'classeI',
      arcadeSuperieure: 'pasCorrection',
      arcadeInferieure: 'simulationOcclusion',
      prioriteSur: 'canine',
      typeSimulation: 'elastiques',
    },
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    const addressValues = addressForm.getValues()
    setProfile((prev) => ({ ...prev, ...addressValues }))
    setTimeout(() => {
      setIsSaving(false)
      console.log('Profil sauvegardé')
    }, 1000)
  }

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: profile.address,
      city: profile.city,
      postalCode: profile.postalCode,
      country: profile.country,
    },
  })

  const clinicalForm = useForm<ClinicalPrefsForm>({
    resolver: zodResolver(clinicalPrefsSchema),
    defaultValues: clinicalPreferences,
  })

  return (
    <div className="min-h-screen space-y-8 p-8">
      {/* En-tête */}
      <HeadingTitle
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        titleClassName="text-4xl font-bold text-slate-900"
        subtitleClassName="text-lg text-slate-600"
      />

      {/* Alerte de sauvegarde */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">{t('settings.alert.title')}</p>
            <p className="text-sm text-blue-700">
              {t('settings.alert.desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Onglets principaux - Style "Underline" */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('clinical-prefs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'clinical-prefs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <User className="w-4 h-4" />
              {t('settings.tabs.profile')}
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'integrations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Bell className="w-4 h-4" />
              {t('settings.tabs.notifications')}
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Shield className="w-4 h-4" />
              {t('settings.tabs.security')}
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'data'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Database className="w-4 h-4" />
              {t('settings.tabs.data')}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'clinical-prefs' && (
            <div className="space-y-8">
              {/* Section 1: Informations Praticien & Cabinet */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <Card className="shadow-none border border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      {t('settings.practitioner.title')}
                    </CardTitle>
                    <CardDescription>{t('settings.practitioner.desc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">{t('settings.practitioner.first_name')}</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">{t('settings.practitioner.last_name')}</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">{t('settings.practitioner.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialty" className="text-sm font-medium">{t('settings.practitioner.specialty')}</Label>
                      <Select
                        value={profile.specialty}
                        onValueChange={(value) => setProfile({ ...profile, specialty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('settings.practitioner.specialty_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orthodontie">{t('settings.specialties.orthodontie')}</SelectItem>
                          <SelectItem value="chirurgie">{t('settings.specialties.chirurgie')}</SelectItem>
                          <SelectItem value="endodontie">{t('settings.specialties.endodontie')}</SelectItem>
                          <SelectItem value="parodontologie">{t('settings.specialties.parodontologie')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg mt-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">{t('settings.practitioner.verified')}</p>
                          <p className="text-sm text-green-700">{t('settings.practitioner.verified_desc')}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">{t('settings.practitioner.active')}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Informations de la clinique */}
                <Card className="shadow-none border border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      {t('settings.clinic.title')}
                    </CardTitle>
                    <CardDescription>{t('settings.clinic.desc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinicName" className="text-sm font-medium">{t('settings.clinic.name')}</Label>
                      <Input
                        id="clinicName"
                        value={profile.clinicName}
                        onChange={(e) => setProfile({ ...profile, clinicName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t('settings.clinic.address')}</Label>
                      <Form {...addressForm}>
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('settings.clinic.street')}</FormLabel>
                                <FormControl>
                                  <Input placeholder="Numéro et rue" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              name="postalCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('settings.clinic.postal_code')}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t('settings.clinic.postal_code_placeholder')} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('settings.clinic.city')}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t('settings.clinic.city_placeholder')} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('settings.clinic.country')}</FormLabel>
                                <FormControl>
                                  <Input placeholder={t('settings.clinic.country_placeholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Form>
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-4"
                      disabled={isSaving}
                    >
                      {isSaving ? t('settings.actions.saving') : t('settings.actions.save')}
                    </Button>
                  </CardContent>
                </Card>
              </div>


            </div>
          )}

          {/* Placeholder for other tabs */}
          {['integrations', 'security', 'data'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <Settings className="w-12 h-12 mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900">{t('settings.placeholder.title')}</h3>
              <p className="max-w-sm mt-2">{t('settings.placeholder.desc').replace('{{section}}', activeTab)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
