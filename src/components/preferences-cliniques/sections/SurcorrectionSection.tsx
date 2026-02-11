import RadioGroup from '../ui/RadioGroup'

export default function SurcorrectionSection() {
  return (
    <>
      <div className="text-sm text-gray-700 mb-4">Aligners de surcorrection</div>
      <RadioGroup
        options={[
          'Ajouter 3 aligners de surcorrection',
          "Ne pas ajouter d'aligners de surcorrection",
        ]}
        name="surcorrection"
        defaultValue="Ne pas ajouter d'aligners de surcorrection"
      />
    </>
  )
}
