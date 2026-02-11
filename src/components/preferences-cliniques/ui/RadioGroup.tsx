'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'

interface RadioGroupProps {
  label?: string
  options: string[]
  name: string
  defaultValue: string
  showInfo?: boolean
  disabled?: boolean
  onChange?: (value: string) => void
  value?: string
  labelInfoText?: string
}

export default function RadioGroup({
  label,
  options,
  name,
  defaultValue,
  showInfo,
  disabled,
  onChange,
  value,
  labelInfoText,
}: RadioGroupProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue)
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null)
  const [showLabelTooltip, setShowLabelTooltip] = useState(false)

  const currentValue = value !== undefined ? value : selectedValue

  const infoTexts: Record<string, string> = {
    'Distalisation semi-sequentielle optimisee': 'Optimise le mouvement de distalisation',
    'Distalisation semi-sequentielle standard': 'Approche standard',
    'Distalisation sequentielle': 'Distalisation dent par dent',
    'Protocole hybride': 'Combine différentes approches',
    'Avancee mandibulaire par MAF': 'Avancée mandibulaire par MAF',
  }

  const handleSelect = (option: string) => {
    if (!disabled) {
      setSelectedValue(option)
      onChange?.(option)
    }
  }

  return (
    <div className="mb-4">
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm text-gray-700">{label}</label>
          {labelInfoText && (
            <div
              className="relative inline-block"
              onMouseEnter={() => setShowLabelTooltip(true)}
              onMouseLeave={() => setShowLabelTooltip(false)}
            >
              <Info size={16} className="text-gray-400 hover:text-gray-600 cursor-help" />
              {showLabelTooltip && (
                <div className="absolute left-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded shadow-lg z-50">
                  {labelInfoText}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {options.map((option, idx) => {
        const isChecked = currentValue === option
        const hasInfo = infoTexts[option]
        return (
          <div
            key={idx}
            className={`flex items-center w-xl gap-3 mb-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isChecked
                ? 'shadow-md bg-[#0B9FD7]/5 ring-2 ring-[#0B9FD7]/20'
                : 'shadow-sm bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleSelect(option)}
          >
            <div className="relative flex items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  isChecked ? 'border-[#0B9FD7] shadow-sm' : 'border-gray-300'
                }`}
              >
                {isChecked && (
                  <div className="w-2 h-2 rounded-full bg-[#0B9FD7] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <span className={`text-sm flex-1 ${isChecked ? 'font-medium' : 'text-gray-600'}`}>
              {option}
            </span>
            {hasInfo && (
              <div
                className="relative"
                onMouseEnter={() => !disabled && setHoveredInfo(option)}
                onMouseLeave={() => setHoveredInfo(null)}
                onClick={(e) => e.stopPropagation()}
              >
                <Info size={16} className="text-gray-400 hover:text-gray-600" />
                {hoveredInfo === option && (
                  <div className="absolute z-50 left-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded shadow-lg">
                    {infoTexts[option]}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
