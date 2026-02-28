'use client'
import React, { useState, useEffect } from 'react'
import {
  DiamondCard,
  DiamondCardContent,
  DiamondCardDescription,
  DiamondCardHeader,
  DiamondCardTitle,
} from '@/components/ui/diamond-card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { HeadingTitle } from '@/components/HeadingTitle'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Target, TrendingUp, Info, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

export default function DiamondPurityProgram() {
  const [progressValue, setProgressValue] = useState(0)
  const { t, language } = useTranslation()

  // Format current date based on active learning
  const currentDate = new Date().toLocaleDateString(
    language === 'FR' ? 'fr-FR' : language === 'DE' ? 'de-DE' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  )

  const levels = [
    {
      name: 'STARTER',
      cases: 0,
      badge: 'ST',
      color: 'bg-gradient-to-br from-red-600 to-red-800',
      iconColor: 'text-red-700',
      discount: '0,0%',
    },
    {
      name: 'PRIME',
      cases: 5,
      badge: 'PR',
      color: 'bg-gradient-to-br from-orange-600 to-orange-800',
      iconColor: 'text-orange-700',
      discount: '10,0%',
    },
    {
      name: 'VIP',
      cases: 10,
      badge: 'VIP',
      color: 'bg-gradient-to-br from-green-600 to-green-800',
      iconColor: 'text-green-700',
      discount: '15,0%',
    },
    {
      name: 'ELITE',
      cases: 15,
      badge: 'EL',
      color: 'bg-gradient-to-br from-blue-600 to-blue-800',
      iconColor: 'text-blue-700',
      discount: '20,0%',
    },
    {
      name: 'ULTIMATE',
      cases: 30,
      badge: 'UL',
      color: 'bg-gradient-to-br from-purple-600 to-purple-800',
      iconColor: 'text-purple-700',
      discount: '25,0%',
    },
  ]

  const stats = [
    {
      value: '15',
      label: t('diamond_purity.stats.validated_cases', { date: currentDate }),
      icon: <CheckCircle className="w-5 h-5 text-cyan-600" />,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-100',
      subStats: [
        { value: '0', label: t('diamond_purity.stats.pending') },
        { value: '0', label: t('diamond_purity.stats.submitted') },
      ],
    },
    {
      value: '0',
      label: t('diamond_purity.stats.required_maintain'),
      icon: <AlertCircle className="w-5 h-5 text-green-700" />,
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-100',
      subStats: [{ value: '0,0%', label: t('diamond_purity.stats.current_discount') }],
    },
    {
      value: '5',
      label: t('diamond_purity.stats.required_next'),
      icon: <Target className="w-5 h-5 text-purple-700" />,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      subStats: [{ value: '10,0%', label: t('diamond_purity.stats.future_discount') }],
    },
  ]

  // Compute progress from validated cases toward ULTIMATE target
  useEffect(() => {
    const validatedCases = parseInt(stats[0].value, 10)
    const ultimateTarget = levels.find((l) => l.name === 'ULTIMATE')?.cases ?? 30
    const computed = Math.min(100, Math.round((validatedCases / ultimateTarget) * 100))
    const id = setTimeout(() => setProgressValue(computed), 300)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="min-h-screen p-8">
      {/* Header Standardisé */}
      <HeadingTitle
        title={t('diamond_purity.title')}
        subtitle={t('diamond_purity.subtitle')}
        titleClassName="text-4xl font-bold text-slate-900"
        subtitleClassName="text-lg text-slate-600"
      />

      <div className="space-y-8 mt-6">

        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Current Status Card */}
          <DiamondCard className="lg:col-span-1 border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

            <DiamondCardHeader className="relative z-10 pb-2">
              <DiamondCardTitle className="text-blue-100 flex items-center gap-2 text-lg font-medium">
                <Trophy className="w-5 h-5 text-yellow-400" />
                {t('diamond_purity.current_level')}
              </DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent className="relative z-10 text-center space-y-6 pt-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
                  {/* Placeholder for badge image if available, or fallback */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center border-4 border-gray-500 shadow-2xl mx-auto">
                    <span className="text-4xl font-bold text-white tracking-widest">ST</span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-1">Starter</h2>
                <p className="text-slate-400 text-sm">{t('diamond_purity.validity')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{t('diamond_purity.discount_current')}</p>
                  <p className="text-2xl font-bold text-white">0,0%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{t('diamond_purity.validated_cases_count')}</p>
                  <p className="text-2xl font-bold text-white">15</p>
                </div>
              </div>
            </DiamondCardContent>
          </DiamondCard>

          {/* Stats & Progress Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className={`rounded-xl p-5 border ${stat.border} ${stat.bg} transition-all duration-200 hover:shadow-md`}>
                  <div className="flex items-start justify-between mb-4">
                    <span className={`p-2 rounded-lg bg-white/60 ${stat.color}`}>{stat.icon}</span>
                    <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-4 h-10 line-clamp-2">{stat.label}</p>
                  <div className="flex gap-4 border-t border-slate-200/50 pt-3 mt-auto">
                    {stat.subStats.map((sub, idx) => (
                      <div key={idx}>
                        <p className="text-lg font-bold text-slate-900">{sub.value}</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">{sub.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar Card */}
            <DiamondCard>
              <DiamondCardHeader>
                <DiamondCardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  {t('diamond_purity.progress.title')}
                </DiamondCardTitle>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className="space-y-6">
                  <div className="relative pt-6 pb-2">
                    <div className="flex mb-2 items-center justify-between">
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                        {t('diamond_purity.progress.label')}
                      </span>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {progressValue}% {t('diamond_purity.progress.to_ultimate')}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-blue-100 relative">
                      <div style={{ width: `${progressValue}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-1000 ease-out"></div>
                      {/* Tick marks for levels could rely on absolute positioning if needed */}
                    </div>

                    <div className="grid grid-cols-5 gap-1 text-center">
                      {levels.map((level, index) => {
                        const isAchieved = 15 >= level.cases;
                        return (
                          <div key={index} className="flex flex-col items-center gap-1 group">
                            <div className={`w-3 h-3 rounded-full mb-1 ${isAchieved ? 'bg-blue-600' : 'bg-gray-200 group-hover:bg-blue-300'} transition-colors`}></div>
                            <span className={`text-xs font-bold ${isAchieved ? 'text-blue-900' : 'text-gray-400'}`}>{level.name}</span>
                            <span className="text-[10px] text-gray-500">{level.cases}+</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <Alert className="mt-6 bg-slate-50 border-slate-200">
                  <Info className="h-4 w-4 text-slate-500" />
                  <AlertDescription className="text-slate-600 text-sm">
                    {t('diamond_purity.info')}
                  </AlertDescription>
                </Alert>
              </DiamondCardContent>
            </DiamondCard>
          </div>
        </div>

        {/* Levels Details Table */}
        <DiamondCard>
          <DiamondCardHeader>
            <DiamondCardTitle>{t('diamond_purity.details.title')}</DiamondCardTitle>
            <DiamondCardDescription>{t('diamond_purity.details.subtitle')}</DiamondCardDescription>
          </DiamondCardHeader>
          <DiamondCardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700">{t('diamond_purity.details.level')}</th>
                    {levels.map(level => (
                      <th key={level.name} className={`px-6 py-4 font-semibold text-center ${level.iconColor}`}>{level.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">{t('diamond_purity.details.badge')}</td>
                    {levels.map(level => (
                      <td key={level.name} className="px-6 py-4">
                        <div className="flex justify-center">
                          <div className={`w-10 h-10 ${level.color} rounded-lg shadow-sm flex items-center justify-center text-white font-bold text-xs ring-2 ring-white`}>
                            {level.badge}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">{t('diamond_purity.details.required_cases')}</td>
                    {levels.map(level => (
                      <td key={level.name} className="px-6 py-4 text-center text-slate-600">
                        {level.cases} {level.name === 'ULTIMATE' ? '+' : ''}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">{t('diamond_purity.details.granted_discount')}</td>
                    {levels.map(level => (
                      <td key={level.name} className={`px-6 py-4 text-center font-bold text-lg ${level.iconColor}`}>
                        {level.discount}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </DiamondCardContent>
        </DiamondCard>

        {/* Bottom Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0072B8] via-[#0097c0] to-[#00BFA5] p-8 md:p-12 text-center text-white shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('diamond_purity.banner.title')}</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
            {t('diamond_purity.banner.subtitle')}
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-700 hover:bg-blue-50 border-none font-semibold shadow-md"
            onClick={() => window.location.href = '/diamond-purity/simulator'}
          >
            {t('diamond_purity.banner.button')}
          </Button>
        </div>

      </div>
    </div>
  )
}
