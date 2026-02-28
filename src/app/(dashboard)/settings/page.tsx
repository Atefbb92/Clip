'use client'

import React, { useState, useRef, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  User,
  Bell,
  Shield,
  Database,
  Mail,
  MapPin,
  CheckCircle,
  Info,
  Camera,
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
import { useTranslation } from '@/hooks/useTranslation'
import { NotificationsTab } from './components/NotificationsTab'
import { SecurityTab } from './components/SecurityTab'
import { DataTab } from './components/DataTab'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { auth } from '@/firebase/firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { updateProfile, onAuthStateChanged } from 'firebase/auth'

// Schéma Zod pour l'adresse (utilisé par Form de shadcn)
const addressSchema = z.object({
  address: z.string().min(5, 'Adresse trop courte'),
  city: z.string().min(2, 'Ville invalide'),
  postalCode: z.string().min(3, 'Code postal invalide'),
  country: z.string().min(2, 'Pays invalide'),
})

type AddressFormValues = z.infer<typeof addressSchema>

const SettingsPage: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false)
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('profile')
  const [photoURL, setPhotoURL] = useState('/placeholder-avatar.jpg')
  const [creationDate, setCreationDate] = useState('')
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.photoURL) {
          setPhotoURL(user.photoURL)
        }
        if (user.metadata.creationTime) {
          const date = new Date(user.metadata.creationTime)
          setCreationDate(date.toLocaleDateString())
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !auth.currentUser) return

    setIsUploadingPhoto(true)
    try {
      const storage = getStorage()
      const storageRef = ref(storage, `profile_photos/${auth.currentUser.uid}_${Date.now()}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await updateProfile(auth.currentUser, {
        photoURL: downloadURL
      })
      setPhotoURL(downloadURL)
    } catch (error) {
      console.error('Error uploading photo:', error)
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  // État local pour le profil
  const [profile, setProfile] = useState({
    firstName: 'Dr. Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@diamond.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Paix',
    city: 'Paris',
    postalCode: '75001',
    country: 'Tunisie',
    clinicName: 'Cabinet Dentaire Dupont',
    license: 'FR-12345678',
  })

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: profile.address,
      city: profile.city,
      postalCode: profile.postalCode,
      country: profile.country,
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

  return (
    <div className="min-h-screen space-y-8 p-8 animate-in fade-in duration-500">
      {/* En-tête */}
      <HeadingTitle
        title={t('settings.title') || 'Paramètres'}
        subtitle={t('settings.subtitle') || 'Gérez vos préférences et informations personnelles.'}
        titleClassName="text-4xl font-bold text-slate-900"
        subtitleClassName="text-lg text-slate-600"
      />

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <User className="w-4 h-4" />
              {t('settings.tabs.profile') || 'Profil'}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Bell className="w-4 h-4" />
              {t('settings.tabs.notifications') || 'Notifications'}
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Shield className="w-4 h-4" />
              {t('settings.tabs.security') || 'Sécurité'}
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'data'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Database className="w-4 h-4" />
              {t('settings.tabs.data') || 'Données'}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar & Basic Info Card - Left Column */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                      <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Avatar className="h-32 w-32 border-4 border-slate-50 shadow-md">
                          <AvatarImage src={photoURL} />
                          <AvatarFallback className="text-3xl bg-slate-100 text-slate-400">
                            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {isUploadingPhoto ? (
                            <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
                          ) : (
                            <Camera className="text-white h-8 w-8" />
                          )}
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          hidden
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">{profile.firstName} {profile.lastName}</h2>
                      <p className="text-sm text-slate-500 mb-2">
                        {creationDate ? `${t('settings.practitioner.active_since')} ${creationDate}` : ''}
                      </p>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    </CardContent>
                  </Card>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900 text-sm">{t('settings.alert.title') || 'Information'}</p>
                        <p className="text-xs text-blue-700 mt-1">
                          {t('settings.alert.desc') || 'Vos informations sont visibles sur vos ordonnances.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Form - Right Column */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-curious-blue-100 rounded-lg">
                          <User className="w-5 h-5 text-curious-blue-600" />
                        </div>
                        <span className="text-slate-900">{t('settings.practitioner.title') || 'Informations Personnelles'}</span>
                      </CardTitle>
                      <CardDescription className="text-slate-600 ml-10">
                        {t('settings.practitioner.desc') || 'Mettez à jour vos informations personnelles.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">{t('settings.practitioner.first_name') || 'Prénom'}</Label>
                          <Input
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{t('settings.practitioner.last_name') || 'Nom'}</Label>
                          <Input
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('settings.practitioner.email') || 'Email'}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10 bg-slate-50 text-slate-500 cursor-not-allowed"
                            value={profile.email}
                            disabled
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('settings.practitioner.phone') || 'Téléphone'}</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-curious-blue-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-curious-blue-600" />
                        </div>
                        <span className="text-slate-900">{t('settings.clinic.title') || 'Informations du Cabinet'}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="clinicName">{t('settings.clinic.name') || 'Nom du cabinet'}</Label>
                        <Input
                          id="clinicName"
                          value={profile.clinicName}
                          onChange={(e) => setProfile({ ...profile, clinicName: e.target.value })}
                        />
                      </div>
                      <Form {...addressForm}>
                        <div className="space-y-4">
                          <FormField
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('settings.clinic.street') || 'Rue'}</FormLabel>
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
                                  <FormLabel>{t('settings.clinic.postal_code') || 'Code Postal'}</FormLabel>
                                  <FormControl>
                                    <Input placeholder="75000" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('settings.clinic.city') || 'Ville'}</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Paris" {...field} />
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
                                <FormLabel>{t('settings.clinic.country') || 'Pays'}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionnez un pays" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Tunisie">Tunisie</SelectItem>
                                    <SelectItem value="France">France</SelectItem>
                                    <SelectItem value="Belgique">Belgique</SelectItem>
                                    <SelectItem value="Suisse">Suisse</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Form>

                      <div className="pt-4 flex justify-end">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
                          disabled={isSaving}
                        >
                          {isSaving ? (t('common.saving') || 'Enregistrement...') : (t('common.save') || 'Enregistrer')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <NotificationsTab />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <SecurityTab />
            </div>
          )}

          {activeTab === 'data' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <DataTab />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
