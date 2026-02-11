import RadioGroup from '../ui/RadioGroup'
import { useTranslation } from '@/hooks/useTranslation'

export default function EspacementSection() {
  const { t } = useTranslation()
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adult')}</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">
            {t('preferences_cliniques.sections.espacement.residual_space')}
          </div>
          <RadioGroup
            options={[
              t('preferences_cliniques.sections.espacement.options.distal_lateral'),
              t('preferences_cliniques.sections.espacement.options.mesial_lateral'),
              t('preferences_cliniques.sections.espacement.options.distal_canine'),
              t('preferences_cliniques.sections.espacement.options.equal'),
              t('preferences_cliniques.sections.espacement.options.no_space'),
            ]}
            name="gestion-espace-adulte"
            defaultValue={t('preferences_cliniques.sections.espacement.options.distal_lateral')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adolescent')}</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">
            {t('preferences_cliniques.sections.espacement.residual_space')}
          </div>
          <RadioGroup
            options={[
              t('preferences_cliniques.sections.espacement.options.distal_lateral'),
              t('preferences_cliniques.sections.espacement.options.mesial_lateral'),
              t('preferences_cliniques.sections.espacement.options.distal_canine'),
              t('preferences_cliniques.sections.espacement.options.equal'),
              t('preferences_cliniques.sections.espacement.options.no_space'),
            ]}
            name="gestion-espace-ado"
            defaultValue={t('preferences_cliniques.sections.espacement.options.distal_lateral')}
          />
        </div>
      </div>
    </>
  )
}
