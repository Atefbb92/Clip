import RadioGroup from '../ui/RadioGroup'
import { useTranslation } from '@/hooks/useTranslation'

export default function AxeSection() {
  const { t } = useTranslation()
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adult')}</h2>
        <div className="mb-4">
          <div className="text-sm mb-2">{t('preferences_cliniques.sections.axe.approach')}</div>
          <RadioGroup
            options={[
              t('preferences_cliniques.sections.axe.options.prioritize_others'),
              t('preferences_cliniques.sections.axe.options.improve_rip'),
            ]}
            name="objectif-axe-adulte"
            defaultValue={t('preferences_cliniques.sections.axe.options.prioritize_others')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adolescent')}</h2>
        <div className="mb-4">
          <div className="text-sm mb-2">{t('preferences_cliniques.sections.axe.approach')}</div>
          <RadioGroup
            options={[
              t('preferences_cliniques.sections.axe.options.prioritize_others'),
              t('preferences_cliniques.sections.axe.options.improve_rip'),
            ]}
            name="objectif-axe-ado"
            defaultValue={t('preferences_cliniques.sections.axe.options.prioritize_others')}
          />
        </div>
      </div>
    </>
  )
}
