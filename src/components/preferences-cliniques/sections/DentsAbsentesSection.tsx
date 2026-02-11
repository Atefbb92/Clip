import RadioGroup from '../ui/RadioGroup'

export default function DentsAbsentesSection() {
  return (
    <>
      <div className="text-sm font-medium mb-4">Pose de pontiques</div>
      <RadioGroup
        options={[
          'Autoriser des pontiques pour les dents antérieures et postérieures absentes',
          'Autoriser des pontiques pour les dents antérieures absentes uniquement',
          'Autoriser des pontiques pour les dents postérieures absentes uniquement',
          'Ne pas autoriser de pontiques',
        ]}
        name="pontiques-dents-absentes"
        defaultValue="Autoriser des pontiques pour les dents antérieures et postérieures absentes"
      />
    </>
  )
}
