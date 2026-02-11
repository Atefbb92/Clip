interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export default function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 px-2 text-sm font-medium transition ${
        active ? 'border-b-2 border-[#0B9FD7] text-gray-900' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}
