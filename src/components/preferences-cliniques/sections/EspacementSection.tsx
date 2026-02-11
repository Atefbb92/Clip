import RadioGroup from '../ui/RadioGroup'

export default function EspacementSection() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Adulte</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">
            En cas de dysharmonie dento-dentaire, laisser l&apos;espace résiduel
          </div>
          <RadioGroup
            options={[
              'En distal des incisives latérales',
              'En mésial des incisives latérales',
              'En distal des canines',
              'De manière égale autour des dents latérales',
              "Pas d'espaces",
            ]}
            name="gestion-espace-adulte"
            defaultValue="En distal des incisives latérales"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Adolescent</h2>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">
            En cas de dysharmonie dento-dentaire, laisser l&apos;espace résiduel
          </div>
          <RadioGroup
            options={[
              'En distal des incisives latérales',
              'En mésial des incisives latérales',
              'En distal des canines',
              'De manière égale autour des dents latérales',
              "Pas d'espaces",
            ]}
            name="gestion-espace-ado"
            defaultValue="En distal des incisives latérales"
          />
        </div>
      </div>
    </>
  )
}
