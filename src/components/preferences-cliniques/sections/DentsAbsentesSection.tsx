import RadioGroup from '../ui/RadioGroup'
import { useTranslation } from '@/hooks/useTranslation'

export default function DentsAbsentesSection() {
  const { t } = useTranslation()
  return (
    <>
      <div className="text-sm font-medium mb-4">{t('preferences_cliniques.sections.dents_absentes.pontics')}</div>
      <RadioGroup
        options={[
          t('preferences_cliniques.sections.dents_absentes.options.allow_all'),
          t('preferences_cliniques.sections.dents_absentes.options.allow_anterior'),
          t('preferences_cliniques.sections.dents_absentes.options.allow_posterior'),
          t('preferences_cliniques.sections.dents_absentes.options.forbid'),
        ]}
        name="pontiques-dents-absentes"
        defaultValue={t('preferences_cliniques.sections.dents_absentes.options.allow_all')}
      />
    </>
  )
}
