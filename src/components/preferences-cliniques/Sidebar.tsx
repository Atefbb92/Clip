import { Info } from 'lucide-react'
import DiamondCard from '../ui/diamond-card'
import { useTranslation } from '@/hooks/useTranslation'

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
  const { t } = useTranslation()
  const menuItems = [
    { id: 'rip', label: t('preferences_cliniques.menu.rip') },
    { id: 'dents', label: t('preferences_cliniques.menu.dents') },
    { id: 'extractions', label: t('preferences_cliniques.menu.extractions') },
    {
      id: 'malocclusion',
      label: t('preferences_cliniques.menu.malocclusion_category'),
      isCategory: true,
    },
    { id: 'encombrement', label: t('preferences_cliniques.menu.encombrement') },
    { id: 'espacement', label: t('preferences_cliniques.menu.espacement') },
    { id: 'axe', label: t('preferences_cliniques.menu.axe') },
    { id: 'antero', label: t('preferences_cliniques.menu.antero') },
    { id: 'articule', label: t('preferences_cliniques.menu.articule') },
    {
      id: 'anterieure',
      label: t('preferences_cliniques.menu.anterieure_category'),
      isCategory: true,
    },
    { id: 'nivellement', label: t('preferences_cliniques.menu.nivellement') },
    { id: 'recouvrement', label: t('preferences_cliniques.menu.recouvrement') },
    { id: 'fonctionnalites', label: t('preferences_cliniques.menu.fonctionnalites') },
    { id: 'surcorrection', label: t('preferences_cliniques.menu.surcorrection') },
    { id: 'aligneurs', label: t('preferences_cliniques.menu.aligneurs') },
  ]
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
                  className={`w-full text-left px-4 py-2.5 rounded-lg mb-1 transition-all duration-200 ${activeSection === item.id
                    ? 'bg-[#0B9FD7]/10 font-medium text-[#0B9FD7] shadow-sm ring-1 ring-[#0B9FD7]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
