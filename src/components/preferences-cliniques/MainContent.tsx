'use client'

import RIPSection from './sections/RIPSection'
import DentsAbsentesSection from './sections/DentsAbsentesSection'
import ExtractionsSection from './sections/ExtractionsSection'
import EncombrementSection from './sections/EncombrementSection'
import EspacementSection from './sections/EspacementSection'
import AxeSection from './sections/AxeSection'
import AnteroSection from './sections/AnteroSection'
import ArticuleSection from './sections/ArticuleSection'
import NivellementSection from './sections/NivellementSection'
import RecouvrementSection from './sections/RecouvrementSection'
import FonctionnalitesSection from './sections/FonctionnalitesSection'
import SurcorrectionSection from './sections/SurcorrectionSection'
import AligneursSection from './sections/AligneursSection'
import DiamondCard from '../ui/diamond-card'

interface MainContentProps {
  activeSection: string
  activeTab: string
  setActiveTab: (tab: string) => void
  activeFonctionnaliteTab: string
  setActiveFonctionnaliteTab: (tab: string) => void
}

export default function MainContent({
  activeSection,
  activeTab,
  setActiveTab,
  activeFonctionnaliteTab,
  setActiveFonctionnaliteTab,
}: MainContentProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <DiamondCard>
        {activeSection === 'rip' && <RIPSection />}
        {activeSection === 'dents' && <DentsAbsentesSection />}
        {activeSection === 'extractions' && <ExtractionsSection />}
        {activeSection === 'encombrement' && <EncombrementSection />}
        {activeSection === 'espacement' && <EspacementSection />}
        {activeSection === 'axe' && <AxeSection />}
        {activeSection === 'antero' && (
          <AnteroSection activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {activeSection === 'articule' && <ArticuleSection />}
        {activeSection === 'nivellement' && <NivellementSection />}
        {activeSection === 'recouvrement' && <RecouvrementSection />}
        {activeSection === 'fonctionnalites' && (
          <FonctionnalitesSection
            activeTab={activeFonctionnaliteTab}
            setActiveTab={setActiveFonctionnaliteTab}
          />
        )}
        {activeSection === 'surcorrection' && <SurcorrectionSection />}
        {activeSection === 'aligneurs' && <AligneursSection />}
      </DiamondCard>
    </div>
  )
}
