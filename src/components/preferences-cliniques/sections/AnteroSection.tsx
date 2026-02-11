'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import RadioGroup from '../ui/RadioGroup'
import TabButton from '../ui/TabButton'

interface AnteroSectionProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AnteroSection({ activeTab, setActiveTab }: AnteroSectionProps) {
  const [objectifAdulte, setObjectifAdulte] = useState('Molaires et canines en Classe I')
  const [objectifAdo, setObjectifAdo] = useState('Molaires et canines en Classe I')
  const [objectifAdulteDropdownOpen, setObjectifAdulteDropdownOpen] = useState(false)
  const [objectifAdoDropdownOpen, setObjectifAdoDropdownOpen] = useState(false)
  const [arcadeSupAdulte, setArcadeSupAdulte] = useState('Distalisation')
  const [arcadeSupAdo, setArcadeSupAdo] = useState('Distalisation')
  const [arcadeSupAdulteClasse3, setArcadeSupAdulteClasse3] = useState('Pas de correction')
  const [arcadeSupAdoClasse3, setArcadeSupAdoClasse3] = useState('Pas de correction')
  const [arcadeInfAdulteClasse3, setArcadeInfAdulteClasse3] = useState('Distalisation')
  const [arcadeInfAdoClasse3, setArcadeInfAdoClasse3] = useState('Distalisation')

  const objectifOptions = [
    'Molaires et canines en Classe I',
    'Canines en Classe I',
    'Molaires en Classe I',
    'Maintenir',
  ]

  return (
    <>
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <TabButton active={activeTab === 'classe2'} onClick={() => setActiveTab('classe2')}>
          Classe II
        </TabButton>
        <TabButton active={activeTab === 'classe3'} onClick={() => setActiveTab('classe3')}>
          Classe III
        </TabButton>
      </div>

      {activeTab === 'classe2' && (
        <>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Adulte</h2>

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Objectif de traitement</label>
              <div className="relative">
                <button
                  onClick={() => setObjectifAdulteDropdownOpen(!objectifAdulteDropdownOpen)}
                  className="w-auto min-w-[280px] px-4 py-3 bg-gray-50 rounded text-left flex justify-between items-center hover:bg-gray-100 transition border border-[#0B9FD7]"
                >
                  <span className="text-sm">{objectifAdulte}</span>
                  <ChevronDown className="w-5 h-5 ml-2" />
                </button>
                {objectifAdulteDropdownOpen && (
                  <div className="absolute z-10 w-auto min-w-[280px] mt-1 bg-white border border-gray-300 rounded shadow-lg">
                    {objectifOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setObjectifAdulte(option)
                          setObjectifAdulteDropdownOpen(false)
                        }}
                        className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Arcade supérieure</div>
              <RadioGroup
                options={['Distalisation', 'Pas de correction']}
                name="arcade-sup-adulte"
                defaultValue="Distalisation"
                value={arcadeSupAdulte}
                onChange={(value) => setArcadeSupAdulte(value)}
              />
            </div>

            <RadioGroup
              label="Protocole de distalisation"
              options={[
                'Distalisation semi-sequentielle optimisee',
                'Distalisation semi-sequentielle standard',
                'Distalisation sequentielle',
                'Protocole hybride',
              ]}
              name="protocole-adulte"
              defaultValue="Distalisation semi-sequentielle optimisee"
              disabled={arcadeSupAdulte === 'Pas de correction'}
            />

            <RadioGroup
              label="Définir la priorité sur"
              options={['Molaire', 'Canine']}
              name="priorite-adulte"
              defaultValue="Canine"
              showInfo={true}
            />

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Arcade inférieure</div>
              <RadioGroup
                options={['Pas de correction', 'Mésialisation', 'Simulation de la correction']}
                name="arcade-inf-adulte"
                defaultValue="Simulation de la correction"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Adolescent</h2>

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Objectif de traitement</label>
              <div className="relative">
                <button
                  onClick={() => setObjectifAdoDropdownOpen(!objectifAdoDropdownOpen)}
                  className="w-auto min-w-[280px] px-4 py-3 bg-gray-50 rounded text-left flex justify-between items-center hover:bg-gray-100 transition border border-[#0B9FD7]"
                >
                  <span className="text-sm">{objectifAdo}</span>
                  <ChevronDown className="w-5 h-5 ml-2" />
                </button>
                {objectifAdoDropdownOpen && (
                  <div className="absolute z-10 w-auto min-w-[280px] mt-1 bg-white border border-gray-300 rounded shadow-lg">
                    {objectifOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setObjectifAdo(option)
                          setObjectifAdoDropdownOpen(false)
                        }}
                        className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Arcade supérieure</div>
              <RadioGroup
                options={['Distalisation', 'Pas de correction']}
                name="arcade-sup-ado"
                defaultValue="Distalisation"
                value={arcadeSupAdo}
                onChange={(value) => setArcadeSupAdo(value)}
              />
            </div>

            <RadioGroup
              label="Protocole de distalisation"
              options={[
                'Distalisation semi-sequentielle optimisee',
                'Distalisation semi-sequentielle standard',
                'Distalisation sequentielle',
                'Protocole hybride',
              ]}
              name="protocole-ado"
              defaultValue="Distalisation semi-sequentielle optimisee"
              disabled={arcadeSupAdo === 'Pas de correction'}
            />

            <RadioGroup
              label="Définir la priorité sur"
              options={['Molaire', 'Canine']}
              name="priorite-ado"
              defaultValue="Canine"
              showInfo={true}
            />

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Arcade inférieure</div>
              <RadioGroup
                options={[
                  'Pas de correction',
                  'Avancee mandibulaire par MAF',
                  'Mésialisation',
                  'Simulation de la correction',
                ]}
                name="arcade-inf-ado"
                defaultValue="Simulation de la correction"
              />
            </div>
          </div>
        </>
      )}

      {activeTab === 'classe3' && (
        <>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Adulte</h2>

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Objectif de traitement</label>
              <div className="relative">
                <button
                  onClick={() => setObjectifAdulteDropdownOpen(!objectifAdulteDropdownOpen)}
                  className="w-auto min-w-[280px] px-4 py-3 bg-gray-50 rounded text-left flex justify-between items-center hover:bg-gray-100 transition border border-[#0B9FD7]"
                >
                  <span className="text-sm">{objectifAdulte}</span>
                  <ChevronDown className="w-5 h-5 ml-2" />
                </button>
                {objectifAdulteDropdownOpen && (
                  <div className="absolute z-10 w-auto min-w-[280px] mt-1 bg-white border border-gray-300 rounded shadow-lg">
                    {objectifOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setObjectifAdulte(option)
                          setObjectifAdulteDropdownOpen(false)
                        }}
                        className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Arcade supérieure</div>
              <RadioGroup
                options={['Pas de correction', 'Mésialisation']}
                name="arcade-sup-adulte-classe3"
                defaultValue="Pas de correction"
                value={arcadeSupAdulteClasse3}
                onChange={(value) => setArcadeSupAdulteClasse3(value)}
              />
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Arcade inférieure</div>
              <RadioGroup
                options={['Distalisation', 'Pas de correction']}
                name="arcade-inf-adulte-classe3"
                defaultValue="Distalisation"
                value={arcadeInfAdulteClasse3}
                onChange={(value) => setArcadeInfAdulteClasse3(value)}
              />
            </div>

            <RadioGroup
              label="Protocole de distalisation"
              options={[
                'Distalisation semi-sequentielle optimisee',
                'Distalisation semi-sequentielle standard',
                'Distalisation sequentielle',
                'Protocole hybride',
              ]}
              name="protocole-adulte-classe3"
              defaultValue="Distalisation semi-sequentielle optimisee"
              disabled={arcadeInfAdulteClasse3 === 'Pas de correction'}
            />

            <RadioGroup
              label="Définir la priorité sur"
              options={['Molaire', 'Canine']}
              name="priorite-adulte-classe3"
              defaultValue="Canine"
              showInfo={true}
              labelInfoText="Si les deux ne sont pas réalisables, le logiciel tentera de donner la priorité à votre sélection."
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Adolescent</h2>

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Objectif de traitement</label>
              <div className="relative">
                <button
                  onClick={() => setObjectifAdoDropdownOpen(!objectifAdoDropdownOpen)}
                  className="w-auto min-w-[280px] px-4 py-3 bg-gray-50 rounded text-left flex justify-between items-center hover:bg-gray-100 transition border border-[#0B9FD7]"
                >
                  <span className="text-sm">{objectifAdo}</span>
                  <ChevronDown className="w-5 h-5 ml-2" />
                </button>
                {objectifAdoDropdownOpen && (
                  <div className="absolute z-10 w-auto min-w-[280px] mt-1 bg-white border border-gray-300 rounded shadow-lg">
                    {objectifOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setObjectifAdo(option)
                          setObjectifAdoDropdownOpen(false)
                        }}
                        className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Arcade supérieure</div>
              <RadioGroup
                options={['Pas de correction', 'Mésialisation']}
                name="arcade-sup-ado-classe3"
                defaultValue="Pas de correction"
                value={arcadeSupAdoClasse3}
                onChange={(value) => setArcadeSupAdoClasse3(value)}
              />
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Arcade inférieure</div>
              <RadioGroup
                options={['Distalisation', 'Pas de correction']}
                name="arcade-inf-ado-classe3"
                defaultValue="Distalisation"
                value={arcadeInfAdoClasse3}
                onChange={(value) => setArcadeInfAdoClasse3(value)}
              />
            </div>

            <RadioGroup
              label="Protocole de distalisation"
              options={[
                'Distalisation semi-sequentielle optimisee',
                'Distalisation semi-sequentielle standard',
                'Distalisation sequentielle',
                'Protocole hybride',
              ]}
              name="protocole-ado-classe3"
              defaultValue="Distalisation semi-sequentielle optimisee"
              disabled={arcadeInfAdoClasse3 === 'Pas de correction'}
            />

            <RadioGroup
              label="Définir la priorité sur"
              options={['Molaire', 'Canine']}
              name="priorite-ado-classe3"
              defaultValue="Canine"
              showInfo={true}
              labelInfoText="Si les deux ne sont pas réalisables, le logiciel tentera de donner la priorité à votre sélection."
            />
          </div>
        </>
      )}
    </>
  )
}
