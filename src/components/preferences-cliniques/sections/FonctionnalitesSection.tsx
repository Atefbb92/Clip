'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import RadioGroup from '../ui/RadioGroup'
import TabButton from '../ui/TabButton'
import { useTranslation } from '@/hooks/useTranslation'

interface FonctionnalitesSectionProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function FonctionnalitesSection({
  activeTab,
  setActiveTab,
}: FonctionnalitesSectionProps) {
  const { t } = useTranslation()
  const [taquetsStep, setTaquetsStep] = useState(1)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <>
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <TabButton active={activeTab === 'taquets'} onClick={() => setActiveTab('taquets')}>
          {t('preferences_cliniques.sections.fonctionnalites.tabs.attachments')}
        </TabButton>
        <TabButton active={activeTab === 'decoupes'} onClick={() => setActiveTab('decoupes')}>
          {t('preferences_cliniques.sections.fonctionnalites.tabs.elastics')}
        </TabButton>
        <TabButton active={activeTab === 'rampes'} onClick={() => setActiveTab('rampes')}>
          {t('preferences_cliniques.sections.fonctionnalites.tabs.ramps')}
        </TabButton>
        <TabButton active={activeTab === 'crete'} onClick={() => setActiveTab('crete')}>
          {t('preferences_cliniques.sections.fonctionnalites.tabs.cutline')}
        </TabButton>
      </div>

      {activeTab === 'taquets' && (
        <>
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-4">
              {t('preferences_cliniques.sections.fonctionnalites.attachments.size')}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.fonctionnalites.attachments.anterior')}</div>
                <RadioGroup
                  options={[t('preferences_cliniques.sections.fonctionnalites.attachments.options.normal'), t('preferences_cliniques.sections.fonctionnalites.attachments.options.largest')]}
                  name="taquets-ant"
                  defaultValue={t('preferences_cliniques.sections.fonctionnalites.attachments.options.normal')}
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.fonctionnalites.attachments.posterior')}</div>
                <RadioGroup
                  options={[t('preferences_cliniques.sections.fonctionnalites.attachments.options.normal'), t('preferences_cliniques.sections.fonctionnalites.attachments.options.largest')]}
                  name="taquets-post"
                  defaultValue={t('preferences_cliniques.sections.fonctionnalites.attachments.options.normal')}
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              {t('preferences_cliniques.sections.fonctionnalites.attachments.start_step')}
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
            {t('preferences_cliniques.sections.fonctionnalites.attachments.delay_note')}
          </p>
        </>
      )}

      {activeTab === 'decoupes' && (
        <>
          <div className="mb-6">
            <div className="text-sm font-medium mb-4">{t('preferences_cliniques.sections.fonctionnalites.elastics.precision_cuts')}</div>
            <RadioGroup
              options={[
                t('preferences_cliniques.sections.fonctionnalites.elastics.options.class2_3'),
                t('preferences_cliniques.sections.fonctionnalites.elastics.options.class2_only'),
                t('preferences_cliniques.sections.fonctionnalites.elastics.options.class3_only'),
                t('preferences_cliniques.sections.fonctionnalites.elastics.options.no_cuts'),
              ]}
              name="decoupes-precision"
              defaultValue={t('preferences_cliniques.sections.fonctionnalites.elastics.options.class2_3')}
            />
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">
              {t('preferences_cliniques.sections.fonctionnalites.elastics.start_step')}
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
            <div className="text-sm font-medium mb-4">{t('preferences_cliniques.sections.fonctionnalites.ramps.bite_ramps')}</div>
            <RadioGroup
              options={[
                t('preferences_cliniques.sections.fonctionnalites.ramps.options.ramps_needed'),
                t('preferences_cliniques.sections.fonctionnalites.ramps.options.ramps_always'),
                t('preferences_cliniques.sections.fonctionnalites.ramps.options.ramps_never'),
              ]}
              name="bite-ramps"
              defaultValue={t('preferences_cliniques.sections.fonctionnalites.ramps.options.ramps_needed')}
            />
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.fonctionnalites.ramps.bite_turbos')}</div>
            <RadioGroup
              options={[
                t('preferences_cliniques.sections.fonctionnalites.ramps.options.turbos_needed'),
                t('preferences_cliniques.sections.fonctionnalites.ramps.options.turbos_always'),
                t('preferences_cliniques.sections.fonctionnalites.ramps.options.turbos_never'),
              ]}
              name="bite-turbos"
              defaultValue={t('preferences_cliniques.sections.fonctionnalites.ramps.options.turbos_needed')}
            />
          </div>
        </>
      )}

      {activeTab === 'crete' && (
        <>
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.fonctionnalites.cutline.design')}</div>
            <RadioGroup
              options={[
                t('preferences_cliniques.sections.fonctionnalites.cutline.options.straight_juxta'),
                t('preferences_cliniques.sections.fonctionnalites.cutline.options.straight_extended'),
                t('preferences_cliniques.sections.fonctionnalites.cutline.options.scalloped'),
                t('preferences_cliniques.sections.fonctionnalites.cutline.options.hybrid'),
              ]}
              name="ligne-coupe"
              defaultValue={t('preferences_cliniques.sections.fonctionnalites.cutline.options.straight_juxta')}
            />
          </div>
        </>
      )}
    </>
  )
}
