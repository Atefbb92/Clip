import { Info } from 'lucide-react'
import DiamondCard from '../ui/diamond-card'

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const menuItems = [
  { id: 'rip', label: 'Réduction interproximale RIP' },
  { id: 'dents', label: 'Dents absentes' },
  { id: 'extractions', label: 'Extractions' },
  { id: 'malocclusion', label: 'Correction de la malocclusion', isCategory: true },
  { id: 'encombrement', label: 'Encombrement' },
  { id: 'espacement', label: 'Espacement' },
  { id: 'axe', label: 'Milieux inter-incisifs' },
  { id: 'antero', label: 'Correction antéro-postérieure' },
  { id: 'articule', label: 'Articulé croisé postérieure' },
  { id: 'anterieure', label: 'Correction antérieure', isCategory: true },
  { id: 'nivellement', label: 'Béance antérieure' },
  { id: 'recouvrement', label: 'Supraclusion' },
  { id: 'fonctionnalites', label: 'Fonctionnalités des aligners' },
  { id: 'surcorrection', label: "Surcorrection de la fermeture d'espace" },
  { id: 'aligneurs', label: 'Aligneurs actifs – passifs' },
]

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <DiamondCard className="h-fit">
      <div className="p-6">
        <nav>
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.isCategory ? (
                <div className="text-xs text-gray-400 mt-6 mb-2 font-medium">{item.label}</div>
              ) : (
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded mb-1 transition ${
                    activeSection === item.id
                      ? 'bg-blue-50 font-medium border-l-4 border-[#1e88e5] text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm">{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>
    </DiamondCard>
  )
}
