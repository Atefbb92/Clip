'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import RadioGroup from '../ui/RadioGroup'
import TabButton from '../ui/TabButton'
import { useTranslation } from '@/hooks/useTranslation'

interface AnteroSectionProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AnteroSection({ activeTab, setActiveTab }: AnteroSectionProps) {
  const { t } = useTranslation()
  const [objectifAdulte, setObjectifAdulte] = useState(t('preferences_cliniques.sections.antero.objectives.molars_canines_class1'))
  const [objectifAdo, setObjectifAdo] = useState(t('preferences_cliniques.sections.antero.objectives.molars_canines_class1'))
  const [objectifAdulteDropdownOpen, setObjectifAdulteDropdownOpen] = useState(false)
  const [objectifAdoDropdownOpen, setObjectifAdoDropdownOpen] = useState(false)
  const [arcadeSupAdulte, setArcadeSupAdulte] = useState('Distalisation')
  const [arcadeSupAdo, setArcadeSupAdo] = useState('Distalisation')
  const [arcadeSupAdulteClasse3, setArcadeSupAdulteClasse3] = useState('Pas de correction')
  const [arcadeSupAdoClasse3, setArcadeSupAdoClasse3] = useState('Pas de correction')
  const [arcadeInfAdulteClasse3, setArcadeInfAdulteClasse3] = useState('Distalisation')
  const [arcadeInfAdoClasse3, setArcadeInfAdoClasse3] = useState('Distalisation')

  const objectifOptions = [
    t('preferences_cliniques.sections.antero.objectives.molars_canines_class1'),
    t('preferences_cliniques.sections.antero.objectives.canines_class1'),
    t('preferences_cliniques.sections.antero.objectives.molars_class1'),
    t('preferences_cliniques.sections.antero.objectives.maintain'),
  ]

  return (
    <>
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <TabButton active={activeTab === 'classe2'} onClick={() => setActiveTab('classe2')}>
          {t('preferences_cliniques.sections.antero.tabs.class2')}
        </TabButton>
        <TabButton active={activeTab === 'classe3'} onClick={() => setActiveTab('classe3')}>
          {t('preferences_cliniques.sections.antero.tabs.class3')}
        </TabButton>
      </div>

      {activeTab === 'classe2' && (
        <>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adult')}</h2>

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
              <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.common.upper_arch')}</div>
              <RadioGroup
                options={[t('preferences_cliniques.sections.antero.options.distalization'), t('preferences_cliniques.sections.antero.options.no_correction')]}
                name="arcade-sup-adulte"
                defaultValue={t('preferences_cliniques.sections.antero.options.distalization')}
                value={arcadeSupAdulte}
                onChange={(value) => setArcadeSupAdulte(value)}
              />
            </div>

            <RadioGroup
              label={t('preferences_cliniques.sections.antero.distalization_protocol')}
              options={[
                t('preferences_cliniques.sections.antero.options.optimized'),
                t('preferences_cliniques.sections.antero.options.standard'),
                t('preferences_cliniques.sections.antero.options.sequential'),
                t('preferences_cliniques.sections.antero.options.hybrid'),
              ]}
              name="protocole-adulte"
              defaultValue={t('preferences_cliniques.sections.antero.options.optimized')}
              disabled={arcadeSupAdulte === t('preferences_cliniques.sections.antero.options.no_correction') || arcadeSupAdulte === 'Pas de correction'}
            />

            <RadioGroup
              label={t('preferences_cliniques.sections.antero.priority')}
              options={[t('preferences_cliniques.sections.antero.options.molar'), t('preferences_cliniques.sections.antero.options.canine')]}
              name="priorite-adulte"
              defaultValue={t('preferences_cliniques.sections.antero.options.canine')}
              showInfo={true}
              labelInfoText={t('preferences_cliniques.sections.antero.priority_info')}
            />

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.common.lower_arch')}</div>
              <RadioGroup
                options={[t('preferences_cliniques.sections.antero.options.no_correction'), t('preferences_cliniques.sections.antero.options.mesialization'), t('preferences_cliniques.sections.antero.options.simulation')]}
                name="arcade-inf-adulte"
                defaultValue={t('preferences_cliniques.sections.antero.options.simulation')}
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
              <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.common.upper_arch')}</div>
              <RadioGroup
                options={[t('preferences_cliniques.sections.antero.options.distalization'), t('preferences_cliniques.sections.antero.options.no_correction')]}
                name="arcade-sup-ado"
                defaultValue={t('preferences_cliniques.sections.antero.options.distalization')}
                value={arcadeSupAdo}
                onChange={(value) => setArcadeSupAdo(value)}
              />
            </div>

            <RadioGroup
              label={t('preferences_cliniques.sections.antero.distalization_protocol')}
              options={[
                t('preferences_cliniques.sections.antero.options.optimized'),
                t('preferences_cliniques.sections.antero.options.standard'),
                t('preferences_cliniques.sections.antero.options.sequential'),
                t('preferences_cliniques.sections.antero.options.hybrid'),
              ]}
              name="protocole-ado"
              defaultValue={t('preferences_cliniques.sections.antero.options.optimized')}
              disabled={arcadeSupAdo === t('preferences_cliniques.sections.antero.options.no_correction') || arcadeSupAdo === 'Pas de correction'}
            />

            <RadioGroup
              label={t('preferences_cliniques.sections.antero.priority')}
              options={[t('preferences_cliniques.sections.antero.options.molar'), t('preferences_cliniques.sections.antero.options.canine')]}
              name="priorite-ado"
              defaultValue={t('preferences_cliniques.sections.antero.options.canine')}
              showInfo={true}
              labelInfoText={t('preferences_cliniques.sections.antero.priority_info')}
            />

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.common.lower_arch')}</div>
              <RadioGroup
                options={[
                  t('preferences_cliniques.sections.antero.options.no_correction'),
                  t('preferences_cliniques.sections.antero.options.maf'),
                  t('preferences_cliniques.sections.antero.options.mesialization'),
                  t('preferences_cliniques.sections.antero.options.simulation'),
                ]}
                name="arcade-inf-ado"
                defaultValue={t('preferences_cliniques.sections.antero.options.simulation')}
              />
            </div>
          </div>
        </>
      )}

      {activeTab === 'classe3' && (
        <>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adult')}</h2>

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">{t('preferences_cliniques.sections.antero.objective')}</label>
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
              <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.common.upper_arch')}</div>
              <RadioGroup
                options={[t('preferences_cliniques.sections.antero.options.no_correction'), t('preferences_cliniques.sections.antero.options.mesialization')]}
                name="arcade-sup-adulte-classe3"
                defaultValue={t('preferences_cliniques.sections.antero.options.no_correction')}
                value={arcadeSupAdulteClasse3}
                onChange={(value) => setArcadeSupAdulteClasse3(value)}
              />
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.common.lower_arch')}</div>
              <RadioGroup
                options={[t('preferences_cliniques.sections.antero.options.distalization'), t('preferences_cliniques.sections.antero.options.no_correction')]}
                name="arcade-inf-adulte-classe3"
                defaultValue={t('preferences_cliniques.sections.antero.options.distalization')}
                value={arcadeInfAdulteClasse3}
                onChange={(value) => setArcadeInfAdulteClasse3(value)}
              />
            </div>

            <RadioGroup
              label={t('preferences_cliniques.sections.antero.distalization_protocol')}
              options={[
                t('preferences_cliniques.sections.antero.options.optimized'),
                t('preferences_cliniques.sections.antero.options.standard'),
                t('preferences_cliniques.sections.antero.options.sequential'),
                t('preferences_cliniques.sections.antero.options.hybrid'),
              ]}
              name="protocole-adulte-classe3"
              defaultValue={t('preferences_cliniques.sections.antero.options.optimized')}
              disabled={arcadeInfAdulteClasse3 === t('preferences_cliniques.sections.antero.options.no_correction') || arcadeInfAdulteClasse3 === 'Pas de correction'}
            />

            <RadioGroup
              label={t('preferences_cliniques.sections.antero.priority')}
              options={[t('preferences_cliniques.sections.antero.options.molar'), t('preferences_cliniques.sections.antero.options.canine')]}
              name="priorite-adulte-classe3"
              defaultValue={t('preferences_cliniques.sections.antero.options.canine')}
              showInfo={true}
              labelInfoText={t('preferences_cliniques.sections.antero.priority_info')}
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
              <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.common.upper_arch')}</div>
              <RadioGroup
                options={[t('preferences_cliniques.sections.antero.options.no_correction'), t('preferences_cliniques.sections.antero.options.mesialization')]}
                name="arcade-sup-ado-classe3"
                defaultValue={t('preferences_cliniques.sections.antero.options.no_correction')}
                value={arcadeSupAdoClasse3}
                onChange={(value) => setArcadeSupAdoClasse3(value)}
              />
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.common.lower_arch')}</div>
              <RadioGroup
                options={[t('preferences_cliniques.sections.antero.options.distalization'), t('preferences_cliniques.sections.antero.options.no_correction')]}
                name="arcade-inf-ado-classe3"
                defaultValue={t('preferences_cliniques.sections.antero.options.distalization')}
                value={arcadeInfAdoClasse3}
                onChange={(value) => setArcadeInfAdoClasse3(value)}
              />
            </div>

            <RadioGroup
              label={t('preferences_cliniques.sections.antero.distalization_protocol')}
              options={[
                t('preferences_cliniques.sections.antero.options.optimized'),
                t('preferences_cliniques.sections.antero.options.standard'),
                t('preferences_cliniques.sections.antero.options.sequential'),
                t('preferences_cliniques.sections.antero.options.hybrid'),
              ]}
              name="protocole-ado-classe3"
              defaultValue={t('preferences_cliniques.sections.antero.options.optimized')}
              disabled={arcadeInfAdoClasse3 === t('preferences_cliniques.sections.antero.options.no_correction') || arcadeInfAdoClasse3 === 'Pas de correction'}
            />

            <RadioGroup
              label={t('preferences_cliniques.sections.antero.priority')}
              options={[t('preferences_cliniques.sections.antero.options.molar'), t('preferences_cliniques.sections.antero.options.canine')]}
              name="priorite-ado-classe3"
              defaultValue={t('preferences_cliniques.sections.antero.options.canine')}
              showInfo={true}
              labelInfoText={t('preferences_cliniques.sections.antero.priority_info')}
            />
          </div>
        </>
      )}
    </>
  )
}
