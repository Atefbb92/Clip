'use client'

import React, { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Target,
  Activity,
  PieChart,
  LineChart,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DiamondCard,
  DiamondCardContent,
  DiamondCardDescription,
  DiamondCardHeader,
  DiamondCardTitle,
} from '@/components/ui/diamond-card'
import { HeadingTitle } from '@/components/HeadingTitle'
import StatCard from '@/components/StatCard'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from '@/hooks/useTranslation'

// Types pour les données statistiques
interface StatCardData {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ReactNode
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'analytics'
  description?: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    fill?: boolean
  }[]
}

export default function StatistiquesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { t } = useTranslation()

  // Données simulées pour les statistiques
  // Don't move this up, it needs t
  const statsCards: StatCardData[] = [
    {
      id: 'total-patients',
      title: t('statistics.cards.total_patients'),
      value: '2,847',
      change: 12.5,
      changeType: 'increase',
      icon: <Users className="w-6 h-6" />,
      color: 'primary',
      description: t('statistics.descriptions.registered'),
    },
    {
      id: 'nouveaux-patients',
      title: t('statistics.cards.new_patients'),
      value: '156',
      change: 8.2,
      changeType: 'increase',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success',
      description: t('statistics.descriptions.this_month'),
    },
    {
      id: 'traitements-actifs',
      title: t('statistics.cards.active_treatments'),
      value: '423',
      change: -2.1,
      changeType: 'decrease',
      icon: <Activity className="w-6 h-6" />,
      color: 'warning',
      description: t('statistics.descriptions.in_progress'),
    },
    {
      id: 'taux-completion',
      title: t('statistics.cards.completion_rate'),
      value: '94.2%',
      change: 3.8,
      changeType: 'increase',
      icon: <Target className="w-6 h-6" />,
      color: 'analytics',
      description: t('statistics.descriptions.completed_treatments'),
    },

    {
      id: 'temps-moyen',
      title: t('statistics.cards.average_duration'),
      value: '18.5j',
      change: -5.2,
      changeType: 'decrease',
      icon: <Clock className="w-6 h-6" />,
      color: 'success',
      description: t('statistics.descriptions.treatment_duration'),
    },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulation d'un appel API
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }



  return (
    <div className="flex flex-col gap-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <HeadingTitle
          title={t('statistics.title')}
          subtitle={t('statistics.subtitle')}
        >
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px] border-gray-100 focus-within:border-none">
                <SelectValue placeholder={t('statistics.periods.placeholder')} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-100 shadow-sm">
                <SelectItem value="7">{t('statistics.periods.7days')}</SelectItem>
                <SelectItem value="30">{t('statistics.periods.30days')}</SelectItem>
                <SelectItem value="90">{t('statistics.periods.3months')}</SelectItem>
                <SelectItem value="365">{t('statistics.periods.12months')}</SelectItem>
                <SelectItem value="currentYear">{new Date().getFullYear()}</SelectItem>
                <SelectItem value="previousYear">{new Date().getFullYear() - 1}</SelectItem>
                <SelectItem value="all">{t('statistics.periods.all')}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('statistics.refresh')}
            </Button>


          </div>
        </HeadingTitle>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              {t('statistics.tabs.overview')}
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'patients'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Users className="w-4 h-4" />
              {t('navigation.patients')}
            </button>
            <button
              onClick={() => setActiveTab('treatments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'treatments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Activity className="w-4 h-4" />
              {t('statistics.tabs.treatments')}
            </button>

          </nav>
        </div>
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {statsCards.map((stat) => {
              // Mapper les couleurs vers celles supportées par StatCard
              const colorMap = {
                primary: 'blue',
                success: 'green',
                warning: 'yellow',
                info: 'cyan',
                danger: 'red',
                analytics: 'purple',
              }

              return (
                <StatCard
                  key={stat.id}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.title}
                  color={(colorMap[stat.color] || 'blue') as any}
                />
              )
            })}
          </div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution des patients */}
            <DiamondCard className="col-span-1">
              <DiamondCardHeader>
                <DiamondCardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-500" />
                  {t('statistics.charts.evolution')}
                </DiamondCardTitle>
                <DiamondCardDescription>
                  {t('statistics.charts.evolution_desc')}
                </DiamondCardDescription>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">{t('statistics.placeholders.evolution_chart')}</p>
                    <p className="text-sm text-gray-400">{t('statistics.placeholders.chart_js_integration')}</p>
                  </div>
                </div>
              </DiamondCardContent>
            </DiamondCard>

            {/* Répartition des traitements */}
            <DiamondCard className="col-span-1">
              <DiamondCardHeader>
                <DiamondCardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-500" />
                  {t('statistics.charts.distribution')}
                </DiamondCardTitle>
                <DiamondCardDescription>{t('statistics.charts.distribution_desc')}</DiamondCardDescription>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">{t('statistics.placeholders.pie_chart')}</p>
                    <p className="text-sm text-gray-400">{t('statistics.placeholders.chart_js_integration')}</p>
                  </div>
                </div>
              </DiamondCardContent>
            </DiamondCard>
          </div>

          {/* Métriques de performance */}
          <DiamondCard>
            <DiamondCardHeader>
              <DiamondCardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                {t('statistics.charts.performance')}
              </DiamondCardTitle>
              <DiamondCardDescription>
                {t('statistics.charts.performance_desc')}
              </DiamondCardDescription>
            </DiamondCardHeader>
            <DiamondCardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">94.2%</div>
                  <div className="text-sm text-green-600">{t('metrics.satisfaction')}</div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">18.5j</div>
                  <div className="text-sm text-blue-600">{t('statistics.metrics.avg_treatment_time')}</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-700">12</div>
                  <div className="text-sm text-orange-600">{t('statistics.metrics.actions_required')}</div>
                </div>
              </div>
            </DiamondCardContent>
          </DiamondCard>
        </div>
      )}

      {/* Onglet Patients */}
      {activeTab === 'patients' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DiamondCard>
              <DiamondCardHeader>
                <DiamondCardTitle>{t('statistics.charts.demographics')}</DiamondCardTitle>
                <DiamondCardDescription>{t('statistics.charts.demographics_desc')}</DiamondCardDescription>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">{t('statistics.placeholders.demographic_chart')}</p>
                  </div>
                </div>
              </DiamondCardContent>
            </DiamondCard>

            <DiamondCard>
              <DiamondCardHeader>
                <DiamondCardTitle>{t('statistics.charts.conversion')}</DiamondCardTitle>
                <DiamondCardDescription>
                  {t('statistics.charts.conversion_desc')}
                </DiamondCardDescription>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className="space-y-6">
                  {/* Taux de conversion global */}
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-700 mb-1">78.5%</div>
                    <div className="text-sm text-blue-600">{t('statistics.metrics.global_conversion')}</div>
                    <div className="flex items-center justify-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">+5.2% {t('statistics.descriptions.this_month')}</span>
                    </div>
                  </div>

                  {/* Détail par étape */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{t('statistics.metrics.consultation_quote')}</span>
                      <span className="text-sm font-semibold text-green-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{t('statistics.metrics.quote_acceptance')}</span>
                      <span className="text-sm font-semibold text-blue-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </DiamondCardContent>
            </DiamondCard>
          </div>
        </div>
      )}

      {/* Onglet Traitements */}
      {activeTab === 'treatments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DiamondCard>
              <DiamondCardHeader>
                <DiamondCardTitle>{t('statistics.charts.status')}</DiamondCardTitle>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{t('dashboard.stats.in_treatment')}</span>
                    </div>
                    <Badge variant="secondary">423</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{t('dashboard.stats.completed')}</span>
                    </div>
                    <Badge variant="secondary">1,247</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">{t('status.en-attente')}</span>
                    </div>
                    <Badge variant="secondary">89</Badge>
                  </div>
                </div>
              </DiamondCardContent>
            </DiamondCard>

            <DiamondCard className="lg:col-span-2">
              <DiamondCardHeader>
                <DiamondCardTitle>{t('statistics.charts.duration_by_type')}</DiamondCardTitle>
                <DiamondCardDescription>{t('statistics.charts.duration_by_type_desc')}</DiamondCardDescription>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">{t('statistics.placeholders.bar_chart')}</p>
                  </div>
                </div>
              </DiamondCardContent>
            </DiamondCard>
          </div>
        </div>
      )}


    </div>
  )
}
