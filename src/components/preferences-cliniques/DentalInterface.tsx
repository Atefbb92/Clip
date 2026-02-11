'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import MainContent from './MainContent'
import { HeadingTitle } from '../HeadingTitle'
import { useTranslation } from '@/hooks/useTranslation'

export default function DentalInterface() {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState('rip')
  const [activeTab, setActiveTab] = useState('classe2')
  const [activeFonctionnaliteTab, setActiveFonctionnaliteTab] = useState('taquets')

  return (
    <div className="flex flex-col gap-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-[1600px] mx-auto w-full px-6 py-8">
        <HeadingTitle
          title={t('preferences_cliniques.title')}
          subtitle={t('preferences_cliniques.subtitle')}
          titleClassName="text-4xl font-bold text-gray-900"
          subtitleClassName="text-lg text-gray-600"
        />

        <div>
          <p className="text-sm mt-2 text-muted-foreground">
            {t('preferences_cliniques.updated_at', { date: 'nov. 14, 2025' })}
          </p>
        </div>

        <div className="mt-8 flex gap-6">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <MainContent
            activeSection={activeSection}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeFonctionnaliteTab={activeFonctionnaliteTab}
            setActiveFonctionnaliteTab={setActiveFonctionnaliteTab}
          />
        </div>
      </div>
    </div>
  )
}
