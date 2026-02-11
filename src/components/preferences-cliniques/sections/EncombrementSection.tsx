import RadioGroup from '../ui/RadioGroup'
import { useTranslation } from '@/hooks/useTranslation'

export default function EncombrementSection() {
  const { t } = useTranslation()
  return (
    <>
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.encombrement.limit_expansion')}</div>
        <RadioGroup
          options={[t('preferences_cliniques.sections.encombrement.options.expansion_needed'), '0 mm', '1 mm', '2 mm', '3 mm', '4 mm']}
          name="expansion-arcade"
          defaultValue={t('preferences_cliniques.sections.encombrement.options.expansion_needed')}
        />
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium mb-2">
          {t('preferences_cliniques.sections.encombrement.limit_vestibulo')}
        </div>
        <RadioGroup
          options={[t('preferences_cliniques.sections.encombrement.options.vestibulo_needed'), '0 mm', '0,5 mm', '1 mm', '1,5 mm', '2 mm']}
          name="vestibulo-version"
          defaultValue={t('preferences_cliniques.sections.encombrement.options.vestibulo_needed')}
        />
      </div>
    </>
  )
}
