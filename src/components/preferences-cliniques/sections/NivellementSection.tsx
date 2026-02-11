import RadioGroup from '../ui/RadioGroup'

export default function NivellementSection() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Adulte</h2>
        <div className="text-sm text-gray-700 mb-4">Arcade supérieure et arcade inférieure</div>
        <RadioGroup
          options={[
            'Effectuer une égression des dents antérieures',
            'Effectuer une égression des dents antérieures et une ingression des dents postérieures',
          ]}
          name="beance-adulte"
          defaultValue="Effectuer une égression des dents antérieures et une ingression des dents postérieures"
        />

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Pose automatique des Bite Turbos</div>
          <RadioGroup
            options={['Oui', 'Non', 'Si nécessaire']}
            name="bite-turbos-beance-adulte"
            defaultValue="Si nécessaire"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Adolescent</h2>
        <div className="text-sm text-gray-700 mb-4">Arcade supérieure et arcade inférieure</div>
        <RadioGroup
          options={[
            'Effectuer une égression des dents antérieures',
            'Effectuer une égression des dents antérieures et une ingression des dents postérieures',
          ]}
          name="beance-ado"
          defaultValue="Effectuer une égression des dents antérieures et une ingression des dents postérieures"
        />

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Pose automatique des Bite Turbos</div>
          <RadioGroup
            options={['Oui', 'Non', 'Si nécessaire']}
            name="bite-turbos-beance-ado"
            defaultValue="Si nécessaire"
          />
        </div>
      </div>
    </>
  )
}
