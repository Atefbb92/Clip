'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import RadioGroup from '../ui/RadioGroup'
import SquareButton from '../ui/SquareButton'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

export default function RIPSection() {
  const { t } = useTranslation()
  const [ripAnterieureAdulte, setRipAnterieureAdulte] = useState('0.5')
  const [ripPosterieureAdulte, setRipPosterieureAdulte] = useState('0.5')
  const [ripAnterieureAdo, setRipAnterieureAdo] = useState('0.5')
  const [ripPosterieureAdo, setRipPosterieureAdo] = useState('0.5')

  const copyToAdolescent = () => {
    setRipAnterieureAdo(ripAnterieureAdulte)
    setRipPosterieureAdo(ripPosterieureAdulte)
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adult')}</h2>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <Image
            src="/Anteriorsvg.svg"
            alt="Anterior"
            width={180}
            height={120}
            className="ml-20 mb-6"
          />
          <h3 className="text-sm font-medium mb-4">Limiter la RIP antérieure par contact</h3>
          <div className="flex gap-3">
            {['0.5', '0.4', '0.3', '0.2'].map((val) => (
              <SquareButton
                key={val}
                value={val}
                selected={ripAnterieureAdulte === val}
                onClick={() => setRipAnterieureAdulte(val)}
              />
            ))}
          </div>
        </div>
        <div>
          <Image
            src="/posteriorsvg.svg"
            alt="Posterior"
            width={180}
            height={120}
            className="ml-20 mb-6"
          />
          <h3 className="text-sm font-medium mb-4">Limiter la RIP postérieure par contact</h3>
          <div className="flex gap-3">
            {['0.5', '0.4', '0.3', '0.2'].map((val) => (
              <SquareButton
                key={val}
                value={val}
                selected={ripPosterieureAdulte === val}
                onClick={() => setRipPosterieureAdulte(val)}
              />
            ))}
          </div>
        </div>
      </div>

      <RadioGroup
        label={t('preferences_cliniques.sections.rip.programming')}
        options={[
          t('preferences_cliniques.sections.rip.options.before'),
          t('preferences_cliniques.sections.rip.options.after'),
        ]}
        name="programmation-adulte"
        defaultValue={t('preferences_cliniques.sections.rip.options.before')}
      />

      <div className="flex items-center gap-3 mb-4 mt-8">
        <h2 className="text-lg font-semibold">{t('preferences_cliniques.sections.common.adolescent')}</h2>
        <button
          onClick={copyToAdolescent}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Copier depuis Adulte"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <Image
            src="/Anteriorsvg.svg"
            alt="Anterior"
            width={180}
            height={120}
            className="ml-20 mb-6"
          />
          <h3 className="text-sm font-medium mb-4">Limiter la RIP antérieure par contact</h3>
          <div className="flex gap-3">
            {['0.5', '0.4', '0.3', '0.2'].map((val) => (
              <SquareButton
                key={val}
                value={val}
                selected={ripAnterieureAdo === val}
                onClick={() => setRipAnterieureAdo(val)}
              />
            ))}
          </div>
        </div>
        <div>
          <Image
            src="/posteriorsvg.svg"
            alt="Posterior"
            width={180}
            height={120}
            className="ml-20 mb-6"
          />
          <h3 className="text-sm font-medium mb-4">Limiter la RIP postérieure par contact</h3>
          <div className="flex gap-3">
            {['0.5', '0.4', '0.3', '0.2'].map((val) => (
              <SquareButton
                key={val}
                value={val}
                selected={ripPosterieureAdo === val}
                onClick={() => setRipPosterieureAdo(val)}
              />
            ))}
          </div>
        </div>
      </div>

      <RadioGroup
        label={t('preferences_cliniques.sections.rip.programming')}
        options={[
          t('preferences_cliniques.sections.rip.options.before'),
          t('preferences_cliniques.sections.rip.options.after'),
        ]}
        name="programmation-ado"
        defaultValue={t('preferences_cliniques.sections.rip.options.before')}
      />
    </>
  )
}
