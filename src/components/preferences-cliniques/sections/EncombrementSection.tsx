import RadioGroup from '../ui/RadioGroup'

export default function EncombrementSection() {
  return (
    <>
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">Limiter l&apos;expansion d&apos;arcade</div>
        <RadioGroup
          options={['Expansion, si nécessaire', '0 mm', '1 mm', '2 mm', '3 mm', '4 mm']}
          name="expansion-arcade"
          defaultValue="Expansion, si nécessaire"
        />
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium mb-2">
          Limiter la vestibulo-version des dents antérieures:
        </div>
        <RadioGroup
          options={['Vestibulo-version, si nécessaire', '0 mm', '0,5 mm', '1 mm', '1,5 mm', '2 mm']}
          name="vestibulo-version"
          defaultValue="Vestibulo-version, si nécessaire"
        />
      </div>
    </>
  )
}
