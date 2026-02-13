interface SquareButtonProps {
  value: string
  selected: boolean
  onClick: () => void
}

export default function SquareButton({ value, selected, onClick }: SquareButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${selected
        ? 'bg-[#0072B8] text-white shadow-md shadow-[#0072B8]/20 hover:bg-[#0072B8]/90'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
        }`}
    >
      {value}
    </button>
  )
}
