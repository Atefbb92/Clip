import RadioGroup from '../ui/RadioGroup'

export default function RecouvrementSection() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Adulte</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Approche</div>
          <RadioGroup
            options={[
              'Effectuer une ingression des dents antérieures',
              'Effectuer une ingression des dents antérieures et une égression des dents postérieures',
            ]}
            name="supraclusion-adulte"
            defaultValue="Effectuer une ingression des dents antérieures"
          />
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Pose automatique des Bite Ramps</div>
          <RadioGroup
            options={['Oui', 'Non', 'Si nécessaire']}
            name="bite-ramps-supra-adulte"
            defaultValue="Si nécessaire"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Adolescent</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Approche</div>
          <RadioGroup
            options={[
              'Effectuer une ingression des dents antérieures',
              'Effectuer une ingression des dents antérieures et une égression des dents postérieures',
            ]}
            name="supraclusion-ado"
            defaultValue="Effectuer une ingression des dents antérieures"
          />
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Pose automatique des Bite Ramps</div>
          <RadioGroup
            options={['Oui', 'Non', 'Si nécessaire']}
            name="bite-ramps-supra-ado"
            defaultValue="Si nécessaire"
          />
        </div>
      </div>
    </>
  )
}
