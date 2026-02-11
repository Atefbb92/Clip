'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import MainContent from './MainContent'
import { HeadingTitle } from '../HeadingTitle'

export default function DentalInterface() {
  const [activeSection, setActiveSection] = useState('rip')
  const [activeTab, setActiveTab] = useState('classe2')
  const [activeFonctionnaliteTab, setActiveFonctionnaliteTab] = useState('taquets')

  return (
    <div className="min-h-screen ">
      <HeadingTitle title="Préférences cliniques" subtitle="Configuration globale" />

      <div>
        <p className="text-sm  mt-2 text-muted-foreground">Mis à jour le nov. 14, 2025</p>
      </div>

      <div className=" p-4 md:p-6 lg:p-8 flex gap-6">
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
  )
}
