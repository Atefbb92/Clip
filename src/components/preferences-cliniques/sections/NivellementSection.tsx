import RadioGroup from '../ui/RadioGroup'
import { useTranslation } from '@/hooks/useTranslation'

export default function NivellementSection() {
  const { t } = useTranslation()
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adult')}</h2>
        <div className="text-sm text-gray-700 mb-4">{t('preferences_cliniques.sections.nivellement.open_bite')}</div>
        <RadioGroup
          options={[
            t('preferences_cliniques.sections.nivellement.options.egression_anterior'),
            t('preferences_cliniques.sections.nivellement.options.egression_ant_ingression_post'),
          ]}
          name="beance-adulte"
          defaultValue={t('preferences_cliniques.sections.nivellement.options.egression_ant_ingression_post')}
        />

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.nivellement.bite_turbos')}</div>
          <RadioGroup
            options={[t('preferences_cliniques.sections.common.yes'), t('preferences_cliniques.sections.common.no'), t('preferences_cliniques.sections.common.if_needed')]}
            name="bite-turbos-beance-adulte"
            defaultValue={t('preferences_cliniques.sections.common.if_needed')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adolescent')}</h2>
        <div className="text-sm text-gray-700 mb-4">{t('preferences_cliniques.sections.nivellement.open_bite')}</div>
        <RadioGroup
          options={[
            t('preferences_cliniques.sections.nivellement.options.egression_anterior'),
            t('preferences_cliniques.sections.nivellement.options.egression_ant_ingression_post'),
          ]}
          name="beance-ado"
          defaultValue={t('preferences_cliniques.sections.nivellement.options.egression_ant_ingression_post')}
        />

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.nivellement.bite_turbos')}</div>
          <RadioGroup
            options={[t('preferences_cliniques.sections.common.yes'), t('preferences_cliniques.sections.common.no'), t('preferences_cliniques.sections.common.if_needed')]}
            name="bite-turbos-beance-ado"
            defaultValue={t('preferences_cliniques.sections.common.if_needed')}
          />
        </div>
      </div>
    </>
  )
}
