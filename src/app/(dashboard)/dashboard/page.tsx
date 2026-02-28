'use client'

import React, { useState, useEffect } from 'react'
import { auth, db } from '@/firebase/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import {
  Users,
  UserPlus,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  PlusIcon,
  Bell,
  Check,
  MessageCircle,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DiamondCard,
  DiamondCardContent,
  DiamondCardDescription,
  DiamondCardHeader,
  DiamondCardTitle,
} from '@/components/ui/diamond-card'
import StatCard from '@/components/StatCard/StatCard'
import PacksDistributionChart from '@/components/charts/PacksDistributionChart'
import PatientsEvolutionChart from '@/components/charts/PatientsEvolutionChart'
import { HeadingTitle } from '@/components/HeadingTitle'
import styles from './dashboard.module.css'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

interface Patient {
  id: string
  name?: string
  surname?: string
  nom?: string // Support legacy or mixed data
  prenom?: string
  age?: any
  category?: string
  status?: number
  userId?: string
  medecinEmail?: string
  createdAt?: any
}

interface DashboardStats {
  totalPatients: number
  newPatientsThisMonth: number
  patientsInTreatment: number
  completedTreatments: number
  pendingActions: number
  recentPatients: Patient[]
  averageTreatmentDuration: number
  successRate: number
  monthlyGrowth: number
  chartData?: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
      borderColor: string
      borderWidth: number
      fill?: boolean
      pointBackgroundColor?: string
      pointBorderColor?: string
      pointBorderWidth?: number
      pointRadius?: number
      pointHoverRadius?: number
      tension?: number
    }[]
  }
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    newPatientsThisMonth: 0,
    patientsInTreatment: 0,
    completedTreatments: 0,
    pendingActions: 0,
    recentPatients: [],
    averageTreatmentDuration: 0,
    successRate: 0,
    monthlyGrowth: 0,
  })

  // Mock notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nouveau patient ajouté',
      message: 'Le patient Sarah Connor a été ajouté avec succès.',
      time: 'Il y a 2 heures',
      read: false,
    },
    {
      id: 2,
      title: 'Traitement terminé',
      message: 'Le traitement de John Doe est marqué comme terminé.',
      time: 'Il y a 5 heures',
      read: false,
    },
    {
      id: 3,
      title: 'Rappel de rendez-vous',
      message: 'Consultation prévue avec Dr. Smith demain à 10h.',
      time: 'Il y a 1 jour',
      read: true,
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }



  // Mock messages state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Dr. House',
      avatar: 'H',
      message: 'Le patient de la chambre 3 a besoin de vous.',
      time: '15 min',
      unread: true,
    },
    {
      id: 2,
      sender: 'Sarah (Secrétaire)',
      avatar: 'S',
      message: 'Nouveau rendez-vous ajouté pour demain 14h.',
      time: '1h',
      unread: true,
    },
    {
      id: 3,
      sender: 'Laboratoire',
      avatar: 'L',
      message: 'Les résultats d\'analyse sont disponibles.',
      time: '3h',
      unread: false,
    },
  ])

  const unreadMessagesCount = messages.filter(m => m.unread).length

  const markMessageAsRead = (id: number) => {
    setMessages(messages.map(m => m.id === id ? { ...m, unread: false } : m))
  }

  const markAllMessagesAsRead = () => {
    setMessages(messages.map(m => ({ ...m, unread: false })))
  }

  const [loading, setLoading] = useState(true)
  const { t, language } = useTranslation()

  // Messages de bienvenue dynamiques
  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return t('dashboard.welcome_morning')
    } else if (hour >= 12 && hour < 18) {
      return t('dashboard.welcome_afternoon')
    } else {
      return t('dashboard.welcome_evening')
    }
  }

  // Phrases dynamiques qui changent à chaque rafraîchissement
  const getDynamicPhrase = () => {
    const phrases = t('dashboard.dynamic_phrases') as string[]
    return phrases[Math.floor(Math.random() * phrases.length)]
  }
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email)
        fetchDashboardData(user)
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchDashboardData = async (user: any) => {
    if (!user) return

    try {
      const patientsRef = collection(db, 'patients')
      // Standardize query on userId like patients/page.tsx
      const q = query(patientsRef, where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)

      const patients: Patient[] = querySnapshot.docs.map(
        (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Patient)
      )

      // Calculer les statistiques
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      // Helper to safely convert Firestore timestamp or other date formats to Date
      const toDate = (date: any) => {
        if (!date) return new Date()
        if (typeof date.toDate === 'function') return date.toDate()
        if (date instanceof Date) return date
        if (typeof date === 'number') return new Date(date)
        if (typeof date === 'string') return new Date(date)
        return new Date()
      }

      const newThisMonth = patients.filter((patient) => {
        const createdAt = toDate(patient.createdAt)
        return createdAt >= startOfMonth
      }).length

      const newLastMonth = patients.filter((patient) => {
        const createdAt = toDate(patient.createdAt)
        return createdAt >= lastMonth && createdAt <= endOfLastMonth
      }).length

      const inTreatment = patients.filter((patient) =>
        [1, 3, 4].includes(Number(patient.status))
      ).length

      const completed = patients.filter((patient) => Number(patient.status) === 5).length

      const pending = patients.filter((patient) =>
        [0, 2].includes(Number(patient.status))
      ).length

      // Calculer la croissance mensuelle
      const monthlyGrowth =
        newLastMonth > 0
          ? ((newThisMonth - newLastMonth) / newLastMonth) * 100
          : newThisMonth > 0
            ? 100
            : 0

      // Calculer le taux de réussite
      const successRate = patients.length > 0 ? Math.round((completed / patients.length) * 100) : 0

      // Calculer la durée moyenne de traitement (simulée)
      const averageTreatmentDuration = 180 // 6 mois en moyenne

      // Calculate chart data for last 6 months (current + 5 previous)
      const last6Months = []
      const monthNames = []
      const locale = language === 'FR' ? 'fr-FR' : language === 'DE' ? 'de-DE' : 'en-US'

      for (let i = 6; i >= 1; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        last6Months.push(d)
        monthNames.push(d.toLocaleDateString(locale, { month: 'short' }))
      }

      const newCasesData = last6Months.map(monthDate => {
        const nextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1)
        return patients.filter(p => {
          const createdAt = toDate(p.createdAt)
          return createdAt >= monthDate && createdAt < nextMonth
        }).length
      })

      const approvedCasesData = last6Months.map(monthDate => {
        const nextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1)
        return patients.filter(p => {
          const createdAt = toDate(p.createdAt)
          const isApproved = ![0, 2].includes(Number(p.status))
          return createdAt >= monthDate && createdAt < nextMonth && isApproved
        }).length
      })

      // Use local sorting for recent patients to avoid composite index requirements
      const recentPatientsSorted = [...patients]
        .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
        .slice(0, 5)

      setStats({
        totalPatients: patients.length,
        newPatientsThisMonth: newThisMonth,
        patientsInTreatment: inTreatment,
        completedTreatments: completed,
        pendingActions: pending,
        recentPatients: recentPatientsSorted,
        averageTreatmentDuration,
        successRate,
        monthlyGrowth,
        chartData: {
          labels: monthNames,
          datasets: [
            {
              label: t('dashboard.charts.evolution_new_cases'),
              data: newCasesData,
              fill: true,
              backgroundColor: 'rgba(1, 112, 180, 0.1)',
              borderColor: '#0170B4',
              borderWidth: 3,
              pointBackgroundColor: '#0170B4',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              tension: 0.4,
            },
            {
              label: t('dashboard.charts.evolution_approved_cases'),
              data: approvedCasesData,
              fill: true,
              backgroundColor: 'rgba(0, 182, 174, 0.1)',
              borderColor: '#00B6AE',
              borderWidth: 3,
              pointBackgroundColor: '#00B6AE',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              tension: 0.4,
            }
          ]
        }
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: any) => {
    const statusKeys: { [key: number]: string } = {
      0: 'brouillon',
      1: 'planning',
      2: 'en-attente',
      3: 'en-production',
      4: 'en-traitement',
      5: 'termine',
      6: 'rejete'
    }
    const key = typeof status === 'number' ? statusKeys[status] : status
    return t(`status.${key || 'unknown'}`)
  }

  const getStatusColor = (status: any) => {
    const numericStatus = Number(status)
    const statusColors: { [key: number]: string } = {
      0: '#6B7280', // brouillon
      1: '#3B82F6', // planning
      2: '#F59E0B', // en-attente
      3: '#8B5CF6', // en-production
      4: '#10B981', // en-traitement
      5: '#059669', // termine
      6: '#EF4444', // rejete
    }
    return statusColors[numericStatus] || '#6B7280'
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-2">
        <HeadingTitle
          title={getWelcomeMessage()}
          subtitle={getDynamicPhrase()}
          titleClassName="text-4xl font-bold text-gray-900"
          subtitleClassName="text-lg text-gray-600"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 min-w-[320px]">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700 font-medium whitespace-nowrap">
              {new Date().toLocaleDateString(language === 'FR' ? 'fr-FR' : language === 'DE' ? 'de-DE' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-12 w-12 rounded-xl border-gray-200 bg-white shadow-sm hover:bg-gray-50">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-white border border-gray-200 shadow-xl z-[100]" align="end" sideOffset={5}>
              <div className="flex items-center justify-between border-b px-4 py-3 bg-white rounded-t-lg">
                <h4 className="font-semibold text-gray-900">{t('dashboard.messages.title')}</h4>
                {unreadMessagesCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={markAllMessagesAsRead}
                  >
                    {t('dashboard.messages.read_all')}
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px] bg-white rounded-b-lg">
                {messages.length > 0 ? (
                  <div className="divide-y">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 p-4 transition-colors hover:bg-gray-50 cursor-pointer ${message.unread ? 'bg-blue-50/30' : 'bg-white'}`}
                        onClick={() => markMessageAsRead(message.id)}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-xs">
                          {message.avatar}
                        </div>
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium truncate ${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {message.sender}
                            </span>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                              {message.time}
                            </span>
                          </div>
                          <p className={`text-xs line-clamp-2 ${message.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                            {message.message}
                          </p>
                        </div>
                        {message.unread && (
                          <div className="self-center h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-gray-500 bg-white">
                    <MessageCircle className="h-8 w-8 text-gray-300" />
                    <p className="text-sm">{t('dashboard.messages.empty')}</p>
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-12 w-12 rounded-xl border-gray-200 bg-white shadow-sm hover:bg-gray-50">
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-white border border-gray-200 shadow-xl z-[100]" align="end" sideOffset={5}>
              <div className="flex items-center justify-between border-b px-4 py-3 bg-white rounded-t-lg">
                <h4 className="font-semibold text-gray-900">{t('dashboard.notifications.title')}</h4>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={markAllAsRead}
                  >
                    {t('dashboard.notifications.mark_all_read')}
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px] bg-white rounded-b-lg">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex flex-col gap-1 p-4 transition-colors hover:bg-gray-50 ${!notification.read ? 'bg-blue-50/30' : 'bg-white'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {notification.message}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {notification.time}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-gray-500 bg-white">
                    <Bell className="h-8 w-8 text-gray-300" />
                    <p className="text-sm">{t('dashboard.notifications.empty')}</p>
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* First row - Statistics cards (6 cards aligned) */}
      <div className="flex gap-6">
        <div className="flex-1">
          <StatCard
            icon={<Users />}
            value={stats.totalPatients}
            label={t('dashboard.stats.total_patients')}
            color="blue"
          />
        </div>
        <div className="flex-1">
          <StatCard
            icon={<UserPlus />}
            value={stats.newPatientsThisMonth}
            label={t('dashboard.stats.new_this_month')}
            color="green"
          />
        </div>
        <div className="flex-1">
          <StatCard
            icon={<Activity />}
            value={stats.patientsInTreatment}
            label={t('dashboard.stats.in_treatment')}
            color="purple"
          />
        </div>
        <div className="flex-1">
          <StatCard
            icon={<CheckCircle />}
            value={stats.completedTreatments}
            label={t('dashboard.stats.completed')}
            color="cyan"
          />
        </div>
        <div className="flex-1">
          <StatCard
            icon={<AlertTriangle />}
            value={stats.pendingActions}
            label={t('dashboard.stats.actions_required')}
            color="red"
          />
        </div>
      </div>

      {/* Second row - Patient evolution (100% width) */}
      <div className="w-full flex flex-col space-y-6">
        <div className="ml-auto">
          <Button variant="primary" asChild>
            <Link href="/patients/new" prefetch>
              <PlusIcon className="size-4" />
              <span>{t('common.new_patient')}</span>
            </Link>
          </Button>
        </div>
        <DiamondCard variant="elevated" className="bg-white">
          <DiamondCardHeader className="flex flex-row items-center gap-3 pb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <DiamondCardTitle className="text-xl font-semibold text-gray-900">
              {t('dashboard.charts.evolution')}
            </DiamondCardTitle>
          </DiamondCardHeader>
          <DiamondCardContent>
            <PatientsEvolutionChart data={stats.chartData} />
          </DiamondCardContent>
        </DiamondCard>
      </div>

      {/* Third row - Recent patients (60%) and Status distribution (40%) */}
      <div className="flex gap-6">
        {/* Recent patients - 60% */}
        <div className="flex-[3]">
          <DiamondCard variant="default" className="bg-white h-full">
            <DiamondCardHeader>
              <DiamondCardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <Clock className="w-5 h-5 text-blue-500" />
                {t('dashboard.recent_patients.title')}
              </DiamondCardTitle>
              <DiamondCardDescription>{t('dashboard.recent_patients.subtitle')}</DiamondCardDescription>
            </DiamondCardHeader>
            <DiamondCardContent>
              {stats.recentPatients.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full font-semibold text-sm">
                        {(patient.surname || patient.nom || 'N').charAt(0)}
                        {(patient.name || patient.prenom || 'P').charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {patient.name || patient.nom || 'Last name'} {patient.surname || patient.prenom || 'First name'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {patient.age} {t('common.days')} • {patient.category}
                        </p>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getStatusColor(patient.status ?? 0) }}
                      >
                        {getStatusLabel(patient.status ?? 0)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mb-4 text-gray-300" />
                  <p>{t('dashboard.recent_patients.empty')}</p>
                </div>
              )}
            </DiamondCardContent>
          </DiamondCard>
        </div>

        {/* Status distribution - 40% */}
        <div className="flex-[2]">
          <DiamondCard variant="outlined" className="bg-white h-full">
            <DiamondCardHeader>
              <DiamondCardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                {t('dashboard.charts.status_dist')}
              </DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700">{t('dashboard.stats.in_treatment')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-1000"
                        style={{
                          width: `${stats.totalPatients > 0
                            ? (stats.patientsInTreatment / stats.totalPatients) * 100
                            : 0
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 min-w-[2rem] text-right">
                      {stats.patientsInTreatment}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                    <span className="text-sm font-medium text-gray-700">{t('dashboard.stats.completed')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-1000"
                        style={{
                          width: `${stats.totalPatients > 0
                            ? (stats.completedTreatments / stats.totalPatients) * 100
                            : 0
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 min-w-[2rem] text-right">
                      {stats.completedTreatments}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium text-gray-700">{t('status.en-attente')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-1000"
                        style={{
                          width: `${stats.totalPatients > 0
                            ? (stats.pendingActions / stats.totalPatients) * 100
                            : 0
                            }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 min-w-[2rem] text-right">
                      {stats.pendingActions}
                    </span>
                  </div>
                </div>
              </div>
            </DiamondCardContent>
          </DiamondCard>
        </div>
      </div>

      {/* Fourth row - Performance metrics (50%) and Pack distribution (50%) */}
      <div className="flex gap-6">
        {/* Performance metrics - 50% */}
        <div className="flex-1">
          <DiamondCard variant="glass" className="bg-white h-full">
            <DiamondCardHeader>
              <DiamondCardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                {t('dashboard.charts.performance')}
              </DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stats.successRate}%</div>
                  <div className="text-sm text-gray-600 mb-4">{t('dashboard.stats.validation_rate')}</div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-1000"
                      style={{ width: `${stats.successRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.averageTreatmentDuration}{t('common.days')}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{t('dashboard.stats.average_duration')}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>6 {t('common.months')}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.monthlyGrowth >= 0 ? '+' : ''}
                    {Math.round(stats.monthlyGrowth)}%
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{t('dashboard.stats.monthly_growth')}</div>
                  <div className="flex items-center gap-2 text-sm">
                    {stats.monthlyGrowth >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={stats.monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {stats.monthlyGrowth >= 0 ? t('dashboard.stats.trending_up') : t('dashboard.stats.trending_down')}
                    </span>
                  </div>
                </div>
              </div>
            </DiamondCardContent>
          </DiamondCard>
        </div>

        {/* Pack distribution - 50% */}
        <div className="flex-1">
          <DiamondCard variant="elevated" className="bg-white h-full">
            <DiamondCardHeader>
              <DiamondCardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <PieChart className="w-5 h-5 text-blue-500" />
                {t('dashboard.charts.pack_dist')}
              </DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent>
              <div className="flex justify-center items-center h-80">
                <PacksDistributionChart />
              </div>
            </DiamondCardContent>
          </DiamondCard>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
