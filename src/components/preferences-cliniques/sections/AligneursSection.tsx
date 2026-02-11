'use client'

import { useState } from 'react'
import RadioGroup from '../ui/RadioGroup'
import ToggleSwitch from '../ui/ToggleSwitch'
import { useTranslation } from '@/hooks/useTranslation'

export default function AligneursSection() {
  const { t } = useTranslation()
  const [aligneursPassifs, setAligneursPassifs] = useState(true)

  return (
    <>
      <div className="mb-6">
        <div className="text-sm text-gray-700 mb-4">
          {t('preferences_cliniques.sections.aligneurs.active_steps')}
        </div>
        <RadioGroup
          options={[
            t('preferences_cliniques.sections.aligneurs.options.same_finish'),
            t('preferences_cliniques.sections.aligneurs.options.diff_finish'),
          ]}
          name="aligneurs-actifs"
          defaultValue={t('preferences_cliniques.sections.aligneurs.options.diff_finish')}
        />
      </div>

      <div>
        <ToggleSwitch
          label={t('preferences_cliniques.sections.aligneurs.passive')}
          checked={aligneursPassifs}
          onChange={() => setAligneursPassifs(!aligneursPassifs)}
        />
      </div>
    </>
  )
}
