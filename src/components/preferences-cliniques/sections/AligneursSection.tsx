'use client'

import { useState } from 'react'
import RadioGroup from '../ui/RadioGroup'
import ToggleSwitch from '../ui/ToggleSwitch'

export default function AligneursSection() {
  const [aligneursPassifs, setAligneursPassifs] = useState(true)

  return (
    <>
      <div className="mb-6">
        <div className="text-sm text-gray-700 mb-4">
          Comment terminer les étapes des aligneurs actifs
        </div>
        <RadioGroup
          options={[
            'Commencer et terminer les étapes actives en même temps sur les deux arcades',
            'Commencer les étapes actives en même temps mais les terminer à des moments différents',
          ]}
          name="aligneurs-actifs"
          defaultValue="Commencer les étapes actives en même temps mais les terminer à des moments différents"
        />
      </div>

      <div>
        <ToggleSwitch
          label="Aligneurs passifs"
          checked={aligneursPassifs}
          onChange={() => setAligneursPassifs(!aligneursPassifs)}
        />
      </div>
    </>
  )
}
