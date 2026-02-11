"use client";

import { Dent } from "../../lib/types";
import { dentTypelist } from "../../lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

// Liste des dents molaires qui ne doivent pas avoir l'option "dent temporaire"
const MOLARS = ['16', '17', '18', '26', '27', '28', '36', '37', '38', '46', '47', '48'];

// Liste des dents pour lesquelles l'option "pontique" ne doit pas être affichée
const NO_PONTIC_TEETH = ['18', '28', '38', '48'];

interface ContextualMenuProps {
  selectedTeeth: Dent;
  onSelectTeethType: (code: string, type: string) => void;
  onClose: () => void;
  trigger?: React.ReactNode;
}

export default function ContextualMenu({ 
  selectedTeeth, 
  onSelectTeethType, 
  onClose,
  trigger
}: ContextualMenuProps) {
  
  const setNewDentType = (dentType: { key: string; value: string }) => {
    onSelectTeethType(selectedTeeth.code, dentType.key);
  };

  // Filtrer les options du menu selon le code de la dent
  const filteredDentTypes = dentTypelist.filter(dentType => {
    // Ne pas afficher l'option "dent temporaire" pour les molaires
    if (dentType.key === 'dent_temporaire' && MOLARS.includes(selectedTeeth.code)) {
      return false;
    }
    
    // Ne pas afficher l'option "pontique" pour certaines dents
    if (dentType.key === 'pontique' && NO_PONTIC_TEETH.includes(selectedTeeth.code)) {
      return false;
    }
    
    return true;
  });

  // Si utilisé comme menu déroulant
  if (trigger) {
    return (
      <DropdownMenu onOpenChange={(open: boolean) => !open && onClose()}>
        <DropdownMenuTrigger asChild>
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {filteredDentTypes.map((dentType, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => setNewDentType(dentType)}
              className="cursor-pointer"
            >
              <span className="font-medium">{dentType.value}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Si utilisé comme menu contextuel
  return (
    <div 
      className="bg-white p-3 shadow-md rounded-md border border-gray-200 w-56"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-2">
        {filteredDentTypes.map((dentType, index) => (
          <div
            key={index}
            className="px-2 py-1.5 rounded-md cursor-pointer hover:bg-secondary"
            onClick={() => setNewDentType(dentType)}
          >
            <span className="font-medium">{dentType.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}