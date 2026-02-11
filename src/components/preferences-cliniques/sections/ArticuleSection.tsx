import RadioGroup from '../ui/RadioGroup'

export default function ArticuleSection() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Adulte</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Approche pour les molaires</div>
          <RadioGroup
            options={[
              'Corriger les prémolaires et les molaires',
              'Corriger les prémolaires uniquement',
              'Ne pas corriger',
            ]}
            name="molaires-adulte"
            defaultValue="Corriger les prémolaires et les molaires"
          />
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Pose des Bite Turbos</div>
          <RadioGroup
            options={['Oui', 'Non', 'Si nécessaire']}
            name="bite-turbos-adulte"
            defaultValue="Si nécessaire"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Adolescent</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Approche pour les molaires</div>
          <RadioGroup
            options={[
              'Corriger les prémolaires et les molaires',
              'Corriger les prémolaires uniquement',
              'Ne pas corriger',
            ]}
            name="molaires-ado"
            defaultValue="Corriger les prémolaires et les molaires"
          />
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Pose des Bite Turbos</div>
          <RadioGroup
            options={['Oui', 'Non', 'Si nécessaire']}
            name="bite-turbos-ado"
            defaultValue="Si nécessaire"
          />
        </div>
      </div>
    </>
  )
}
