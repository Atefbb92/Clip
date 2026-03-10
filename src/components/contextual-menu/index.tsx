"use client";

import { Dent } from "../../lib/types";
import { dentTypelist } from "../../lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  XCircle,
  RotateCcw,
  Crown,
  Link as LinkIcon,
  Anchor,
  Baby,
  Smile
} from "lucide-react";
import { cn } from "../../lib/utils";

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

const getIcon = (key: string) => {
  switch (key) {
    case 'normal': return <RotateCcw className="w-4 h-4" />;
    case 'absente': return <XCircle className="w-4 h-4" />;
    case 'couronne': return <Crown className="w-4 h-4" />;
    case 'pontique': return <LinkIcon className="w-4 h-4" />;
    case 'implant': return <Anchor className="w-4 h-4" />;
    case 'dent_temporaire': return <Baby className="w-4 h-4" />;
    default: return <Smile className="w-4 h-4" />;
  }
};

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
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-1">
            Dent {selectedTeeth.code}
          </div>
          {filteredDentTypes.map((dentType, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => setNewDentType(dentType)}
              className="cursor-pointer flex items-center gap-2"
            >
              <span className="text-gray-500">{getIcon(dentType.key)}</span>
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
      className="bg-white/95 backdrop-blur-sm p-1.5 shadow-xl rounded-xl border border-gray-100 w-60 overflow-hidden ring-1 ring-black/5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest border-b border-gray-50 mb-1 flex justify-between items-center">
        <span>Options Dentaires</span>
        <span className="bg-blue-50 px-2 py-0.5 rounded-full text-blue-500">#{selectedTeeth.code}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {filteredDentTypes.map((dentType, index) => (
          <div
            key={index}
            className={cn(
              "px-3 py-2 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 group",
              "hover:bg-blue-50 hover:scale-[1.02] active:scale-95"
            )}
            onClick={() => setNewDentType(dentType)}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm transition-colors">
              {getIcon(dentType.key)}
            </div>
            <span className="font-semibold text-sm text-gray-700 group-hover:text-blue-700">{dentType.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}