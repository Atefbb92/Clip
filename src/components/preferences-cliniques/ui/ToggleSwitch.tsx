interface ToggleSwitchProps {
  label: string
  checked: boolean
  onChange: () => void
}

export default function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <div className="mb-4">
      <label className="text-sm text-gray-700 mb-2 block">{label}</label>
      <button
        onClick={onChange}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
          checked ? 'bg-[#0B9FD7]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
            checked ? 'translate-x-8' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
