import RadioGroup from '../ui/RadioGroup'
import { useTranslation } from '@/hooks/useTranslation'

export default function SurcorrectionSection() {
  const { t } = useTranslation()
  return (
    <>
      <div className="text-sm text-gray-700 mb-4">{t('preferences_cliniques.sections.surcorrection.label')}</div>
      <RadioGroup
        options={[
          t('preferences_cliniques.sections.surcorrection.options.add_3'),
          t('preferences_cliniques.sections.surcorrection.options.no_add'),
        ]}
        name="surcorrection"
        defaultValue={t('preferences_cliniques.sections.surcorrection.options.no_add')}
      />
    </>
  )
}
