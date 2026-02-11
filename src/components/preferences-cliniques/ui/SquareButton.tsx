interface SquareButtonProps {
  value: string
  selected: boolean
  onClick: () => void
}

export default function SquareButton({ value, selected, onClick }: SquareButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium rounded transition-all ${
        selected
          ? 'bg-[#0B9FD7] text-white border-2 border-[#0B9FD7] shadow-md'
          : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-gray-400'
      }`}
    >
      {value}
    </button>
  )
}
