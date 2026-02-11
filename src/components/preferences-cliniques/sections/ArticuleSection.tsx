import RadioGroup from '../ui/RadioGroup'
import { useTranslation } from '@/hooks/useTranslation'

export default function ArticuleSection() {
  const { t } = useTranslation()
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adult')}</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.articule.molars_approach')}</div>
          <RadioGroup
            options={[
              t('preferences_cliniques.sections.articule.options.correct_pre_molars'),
              t('preferences_cliniques.sections.articule.options.correct_pre_only'),
              t('preferences_cliniques.sections.articule.options.do_not_correct'),
            ]}
            name="molaires-adulte"
            defaultValue={t('preferences_cliniques.sections.articule.options.correct_pre_molars')}
          />
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.articule.bite_turbos')}</div>
          <RadioGroup
            options={[
              t('preferences_cliniques.sections.common.yes'),
              t('preferences_cliniques.sections.common.no'),
              t('preferences_cliniques.sections.common.if_needed'),
            ]}
            name="bite-turbos-adulte"
            defaultValue={t('preferences_cliniques.sections.common.if_needed')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">{t('preferences_cliniques.sections.common.adolescent')}</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.articule.molars_approach')}</div>
          <RadioGroup
            options={[
              t('preferences_cliniques.sections.articule.options.correct_pre_molars'),
              t('preferences_cliniques.sections.articule.options.correct_pre_only'),
              t('preferences_cliniques.sections.articule.options.do_not_correct'),
            ]}
            name="molaires-ado"
            defaultValue={t('preferences_cliniques.sections.articule.options.correct_pre_molars')}
          />
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">{t('preferences_cliniques.sections.articule.bite_turbos')}</div>
          <RadioGroup
            options={[
              t('preferences_cliniques.sections.common.yes'),
              t('preferences_cliniques.sections.common.no'),
              t('preferences_cliniques.sections.common.if_needed'),
            ]}
            name="bite-turbos-ado"
            defaultValue={t('preferences_cliniques.sections.common.if_needed')}
          />
        </div>
      </div>
    </>
  )
}
