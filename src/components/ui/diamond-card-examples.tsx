import React from 'react'
import {
  DiamondCard,
  DiamondCardHeader,
  DiamondCardTitle,
  DiamondCardDescription,
  DiamondCardContent,
  DiamondCardFooter,
  DiamondCardAction
} from './diamond-card'
import { Button } from './button'
import { Badge } from './badge'
import { MoreHorizontal, Heart, Share2 } from 'lucide-react'

// Exemple 1: Carte de base
export function BasicDiamondCard() {
  return (
    <DiamondCard className="w-[350px]">
      <DiamondCardHeader>
        <DiamondCardTitle>Titre de la carte</DiamondCardTitle>
        <DiamondCardDescription>
          Description de la carte avec des informations utiles pour l'utilisateur.
        </DiamondCardDescription>
      </DiamondCardHeader>
      <DiamondCardContent>
        <p>Contenu principal de la carte avec des informations détaillées.</p>
      </DiamondCardContent>
      <DiamondCardFooter>
        <Button variant="outline">Annuler</Button>
        <Button>Confirmer</Button>
      </DiamondCardFooter>
    </DiamondCard>
  )
}

// Exemple 2: Carte élevée avec action
export function ElevatedDiamondCard() {
  return (
    <DiamondCard variant="elevated" size="lg" className="w-[400px]">
      <DiamondCardHeader withDivider>
        <DiamondCardTitle gradient>Statistiques du patient</DiamondCardTitle>
        <DiamondCardAction>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DiamondCardAction>
        <DiamondCardDescription>
          Données de suivi médical pour le mois en cours
        </DiamondCardDescription>
      </DiamondCardHeader>
      <DiamondCardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">24</div>
            <div className="text-sm text-gray-600">Consultations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-sm text-gray-600">Traitements</div>
          </div>
        </div>
      </DiamondCardContent>
    </DiamondCard>
  )
}

// Exemple 3: Carte avec contour
export function OutlinedDiamondCard() {
  return (
    <DiamondCard variant="outlined" className="w-[320px]">
      <DiamondCardHeader>
        <DiamondCardTitle>Notification</DiamondCardTitle>
        <DiamondCardDescription>
          Vous avez reçu une nouvelle notification
        </DiamondCardDescription>
      </DiamondCardHeader>
      <DiamondCardContent>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Nouveau</Badge>
          <span className="text-sm">Rendez-vous confirmé pour demain</span>
        </div>
      </DiamondCardContent>
      <DiamondCardFooter>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            J'aime
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </DiamondCardFooter>
    </DiamondCard>
  )
}

// Exemple 4: Carte en verre (glass)
export function GlassDiamondCard() {
  return (
    <DiamondCard variant="glass" size="sm" className="w-[280px]">
      <DiamondCardHeader>
        <DiamondCardTitle>Effet de verre</DiamondCardTitle>
        <DiamondCardDescription>
          Carte avec effet de transparence moderne
        </DiamondCardDescription>
      </DiamondCardHeader>
      <DiamondCardContent>
        <p className="text-sm">Parfait pour les overlays et les interfaces modernes.</p>
      </DiamondCardContent>
    </DiamondCard>
  )
}

// Exemple 5: Grille de cartes
export function DiamondCardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <BasicDiamondCard />
      <ElevatedDiamondCard />
      <OutlinedDiamondCard />
      <GlassDiamondCard />
    </div>
  )
}

// Export par défaut
export default DiamondCardGrid