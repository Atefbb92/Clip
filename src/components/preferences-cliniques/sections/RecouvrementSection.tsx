import RadioGroup from '../ui/RadioGroup'
import { useTranslation } from '@/hooks/useTranslation'

export default function RecouvrementSection() {
  const { t } = useTranslation()
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adult')}</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.recouvrement.approach')}</div>
          <RadioGroup
            options={[
              t('preferences_cliniques.sections.recouvrement.options.ingression_anterior'),
              t('preferences_cliniques.sections.recouvrement.options.ingression_ant_egression_post'),
            ]}
            name="supraclusion-adulte"
            defaultValue={t('preferences_cliniques.sections.recouvrement.options.ingression_anterior')}
          />
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.recouvrement.bite_ramps')}</div>
          <RadioGroup
            options={[t('preferences_cliniques.sections.common.yes'), t('preferences_cliniques.sections.common.no'), t('preferences_cliniques.sections.common.if_needed')]}
            name="bite-ramps-supra-adulte"
            defaultValue={t('preferences_cliniques.sections.common.if_needed')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adolescent')}</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.recouvrement.approach')}</div>
          <RadioGroup
            options={[
              t('preferences_cliniques.sections.recouvrement.options.ingression_anterior'),
              t('preferences_cliniques.sections.recouvrement.options.ingression_ant_egression_post'),
            ]}
            name="supraclusion-ado"
            defaultValue={t('preferences_cliniques.sections.recouvrement.options.ingression_anterior')}
          />
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.recouvrement.bite_ramps')}</div>
          <RadioGroup
            options={[t('preferences_cliniques.sections.common.yes'), t('preferences_cliniques.sections.common.no'), t('preferences_cliniques.sections.common.if_needed')]}
            name="bite-ramps-supra-ado"
            defaultValue={t('preferences_cliniques.sections.common.if_needed')}
          />
        </div>
      </div>
    </>
  )
}
