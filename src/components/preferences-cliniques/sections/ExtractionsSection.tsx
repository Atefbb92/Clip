'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import RadioGroup from '../ui/RadioGroup'
import { useTranslation } from '@/hooks/useTranslation'

export default function ExtractionsSection() {
  const { t } = useTranslation()
  const [extractionStep, setExtractionStep] = useState(1)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <>
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">
          {t('preferences_cliniques.sections.extractions.consider_from')}
        </label>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-fit px-4 py-3 bg-gray-50 rounded text-left flex justify-between items-center hover:bg-gray-100 transition border border-[#0B9FD7]"
          >
            <span className="text-sm">{extractionStep}</span>
            <ChevronDown className="w-5 h-5" />
          </button>
          {dropdownOpen && (
            <div className="absolute z-10 w-fit mt-1 bg-white border border-gray-100 rounded shadow-lg max-h-64 overflow-y-auto">
              {[...Array(20)].map((_, idx) => (
                <div
                  key={idx + 1}
                  onClick={() => {
                    setExtractionStep(idx + 1)
                    setDropdownOpen(false)
                  }}
                  className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-sm  last:border-b-0"
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.extractions.pontics')}</div>
        <RadioGroup
          options={[
            t('preferences_cliniques.sections.extractions.options.open_spaces'),
            t('preferences_cliniques.sections.extractions.options.anterior_only'),
            t('preferences_cliniques.sections.extractions.options.posterior_only'),
            t('preferences_cliniques.sections.extractions.options.forbid'),
          ]}
          name="pontiques-extractions"
          defaultValue={t('preferences_cliniques.sections.extractions.options.open_spaces')}
        />
      </div>
    </>
  )
}
