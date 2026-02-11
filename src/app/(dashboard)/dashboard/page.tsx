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
} from 'lucide-react'
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
  nom?: string
  prenom?: string
  age?: number
  category?: string
  status?: string
  medecinEmail?: string
  createdAt?: {
    toDate: () => Date
  }
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
        fetchDashboardData(user.email)
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchDashboardData = async (email: string | null) => {
    if (!email) return

    try {
      const patientsRef = collection(db, 'patients')
      const q = query(patientsRef, where('medecinEmail', '==', email || ''))
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

      const newThisMonth = patients.filter((patient) => {
        const createdAt = patient.createdAt?.toDate() || new Date()
        return createdAt >= startOfMonth
      }).length

      const newLastMonth = patients.filter((patient) => {
        const createdAt = patient.createdAt?.toDate() || new Date()
        return createdAt >= lastMonth && createdAt <= endOfLastMonth
      }).length

      const inTreatment = patients.filter((patient) =>
        ['en-traitement', 'en-production', 'en-planification'].includes(patient.status || '')
      ).length

      const completed = patients.filter((patient) => patient.status === 'termine').length

      const pending = patients.filter((patient) =>
        ['brouillon', 'en-attente'].includes(patient.status || '')
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

      // Récupérer les patients récents
      const recentPatientsQuery = query(
        patientsRef,
        where('medecinEmail', '==', email || ''),
        orderBy('createdAt', 'desc'),
        limit(5)
      )
      const recentSnapshot = await getDocs(recentPatientsQuery)
      const recentPatients: Patient[] = recentSnapshot.docs.map(
        (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Patient)
      )

      setStats({
        totalPatients: patients.length,
        newPatientsThisMonth: newThisMonth,
        patientsInTreatment: inTreatment,
        completedTreatments: completed,
        pendingActions: pending,
        recentPatients,
        averageTreatmentDuration,
        successRate,
        monthlyGrowth,
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      brouillon: '#6B7280',
      'en-attente': '#F59E0B',
      'en-planification': '#3B82F6',
      'en-production': '#8B5CF6',
      'en-traitement': '#10B981',
      termine: '#059669',
    }
    return statusColors[status] || '#6B7280'
  }

  const getStatusLabel = (status: string) => {
    return t(`status.${status}`)
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
    <div className="flex flex-col gap-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-2">
        <HeadingTitle
          title={getWelcomeMessage()}
          subtitle={getDynamicPhrase()}
          titleClassName="text-4xl font-bold text-gray-900"
          subtitleClassName="text-lg text-gray-600"
        />
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
            <PatientsEvolutionChart />
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
                        {(patient.nom || 'N').charAt(0)}
                        {(patient.prenom || 'P').charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {patient.nom || 'Last name'} {patient.prenom || 'First name'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {patient.age} {t('common.days')} • {patient.category}
                        </p>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getStatusColor(patient.status || '') }}
                      >
                        {getStatusLabel(patient.status || '')}
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
