'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import RadioGroup from '../ui/RadioGroup'
import TabButton from '../ui/TabButton'

interface FonctionnalitesSectionProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function FonctionnalitesSection({
  activeTab,
  setActiveTab,
}: FonctionnalitesSectionProps) {
  const [taquetsStep, setTaquetsStep] = useState(1)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <>
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <TabButton active={activeTab === 'taquets'} onClick={() => setActiveTab('taquets')}>
          Taquets
        </TabButton>
        <TabButton active={activeTab === 'decoupes'} onClick={() => setActiveTab('decoupes')}>
          Pose des élastiques
        </TabButton>
        <TabButton active={activeTab === 'rampes'} onClick={() => setActiveTab('rampes')}>
          Rampes d&apos;occlusion
        </TabButton>
        <TabButton active={activeTab === 'crete'} onClick={() => setActiveTab('crete')}>
          Ligne de coupe
        </TabButton>
      </div>

      {activeTab === 'taquets' && (
        <>
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-4">
              Taille des taquets optimisés
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium mb-2">Pour les dents antérieures</div>
                <RadioGroup
                  options={['Normal', 'Le plus grand qui convienne']}
                  name="taquets-ant"
                  defaultValue="Normal"
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Pour les dents postérieures</div>
                <RadioGroup
                  options={['Normal', 'Le plus grand qui convienne']}
                  name="taquets-post"
                  defaultValue="Normal"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Pose des taquets à partir de l&apos;étape:
            </label>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-3 bg-gray-50 rounded text-left flex justify-between items-center hover:bg-gray-100 transition border border-[#0B9FD7]"
              >
                <span className="text-sm">{taquetsStep}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-64 overflow-y-auto">
                  {[...Array(10)].map((_, idx) => (
                    <div
                      key={idx + 1}
                      onClick={() => {
                        setTaquetsStep(idx + 1)
                        setDropdownOpen(false)
                      }}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-2">
            « Étape à retarder » est définie sur l&apos;étape 1 pour les produits à étapes limitées.
          </p>
        </>
      )}

      {activeTab === 'decoupes' && (
        <>
          <div className="mb-6">
            <div className="text-sm font-medium mb-4">Découpes de précision</div>
            <RadioGroup
              options={[
                'Utiliser les découpes de précision pour les élastiques de Classe II et de Classe III',
                'Utiliser les découpes de précision pour les élastiques de Classe II uniquement',
                'Utiliser les découpes de précision pour les élastiques de Classe III uniquement',
                'Ne pas utiliser de découpes de précision',
              ]}
              name="decoupes-precision"
              defaultValue="Utiliser les découpes de précision pour les élastiques de Classe II et de Classe III"
            />
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">
              Pose des élastiques à partir de l&apos;étape
            </div>
            <RadioGroup
              options={['1', '2', '3', '4', '5']}
              name="etape-elastiques"
              defaultValue="1"
            />
          </div>
        </>
      )}

      {activeTab === 'rampes' && (
        <>
          <div className="mb-6">
            <div className="text-sm font-medium mb-4">Bite Ramps</div>
            <RadioGroup
              options={[
                'Poser des Bite Ramps si nécessaire',
                'Toujours poser des Bite Ramps',
                'Ne jamais poser de Bite Ramps',
              ]}
              name="bite-ramps"
              defaultValue="Poser des Bite Ramps si nécessaire"
            />
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Bite Turbos</div>
            <RadioGroup
              options={[
                'Poser des Bite Turbos si nécessaire',
                'Toujours poser des Bite Turbos',
                'Ne jamais poser de Bite Turbos',
              ]}
              name="bite-turbos"
              defaultValue="Poser des Bite Turbos si nécessaire"
            />
          </div>
        </>
      )}

      {activeTab === 'crete' && (
        <>
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Design de la ligne de coupe</div>
            <RadioGroup
              options={[
                'Ligne de coupe droite juxtagingivale',
                'Ligne de coupe droite étendue de 1 mm',
                'Ligne festonnée',
                'Combinaison hybride',
              ]}
              name="ligne-coupe"
              defaultValue="Ligne de coupe droite juxtagingivale"
            />
          </div>
        </>
      )}
    </>
  )
}
