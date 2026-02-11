import RadioGroup from '../ui/RadioGroup'

export default function AxeSection() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Adulte</h2>
        <div className="mb-4">
          <div className="text-sm mb-2">Approche</div>
          <RadioGroup
            options={[
              'Prioriser les autres objectifs',
              'Améliorer le milieu inter-incisif par une RIP',
            ]}
            name="objectif-axe-adulte"
            defaultValue="Prioriser les autres objectifs"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Adolescent</h2>
        <div className="mb-4">
          <div className="text-sm mb-2">Approche</div>
          <RadioGroup
            options={[
              'Prioriser les autres objectifs',
              'Améliorer le milieu inter-incisif par une RIP',
            ]}
            name="objectif-axe-ado"
            defaultValue="Prioriser les autres objectifs"
          />
        </div>
      </div>
    </>
  )
}
