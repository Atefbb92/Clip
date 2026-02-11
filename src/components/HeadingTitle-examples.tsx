import React from 'react';
import { HeadingTitle } from './HeadingTitle';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Plus, Filter } from 'lucide-react';

// Exemple 1: Utilisation basique
export const BasicExample = () => (
  <HeadingTitle title="Tableau de bord" />
);

// Exemple 2: Avec sous-titre
export const WithSubtitleExample = () => (
  <HeadingTitle
    title="Patients"
    subtitle="Gérez vos patients et suivez leurs traitements"
  />
);

// Exemple 3: Avec actions personnalisées
export const WithActionsExample = () => (
  <HeadingTitle
    title="Gestion des patients"
    subtitle="Vue d'ensemble de tous vos patients"
  >
    <div className="flex justify-between items-center">
      <div className="flex gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un patient..."
            className="pl-10 w-80"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtrer
        </Button>
      </div>
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        Nouveau patient
      </Button>
    </div>
  </HeadingTitle>
);

// Exemple 4: Avec statistiques
export const WithStatsExample = () => (
  <HeadingTitle
    title="Tableau de bord"
    subtitle="Vue d'ensemble de votre activité"
  >
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-blue-600">125</div>
        <div className="text-sm text-gray-600">Patients actifs</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-green-600">8</div>
        <div className="text-sm text-gray-600">RDV aujourd'hui</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-orange-600">23</div>
        <div className="text-sm text-gray-600">En traitement</div>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-2xl font-bold text-purple-600">5</div>
        <div className="text-sm text-gray-600">En attente</div>
      </div>
    </div>
  </HeadingTitle>
);

// Exemple 5: Avec badges et styles personnalisés
export const WithBadgesExample = () => (
  <HeadingTitle
    title="Traitements en cours"
    subtitle="Suivi des traitements orthodontiques actifs"
    titleClassName="text-3xl font-bold text-purple-900"
    subtitleClassName="text-purple-600"
  >
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Tous (45)</Badge>
      <Badge variant="secondary">En planification (12)</Badge>
      <Badge variant="outline">En production (18)</Badge>
      <Badge variant="destructive">Urgent (3)</Badge>
    </div>
  </HeadingTitle>
);

// Exemple 6: Page de détail
export const DetailPageExample = () => (
  <HeadingTitle
    title="Marie Dubois"
    subtitle="Patiente depuis le 15 mars 2024 • Traitement orthodontique"
    className="border-b pb-6"
  >
    <div className="flex gap-3">
      <Button variant="outline">Modifier</Button>
      <Button variant="outline">Historique</Button>
      <Button>Nouveau RDV</Button>
    </div>
  </HeadingTitle>
);

// Exemple 7: Avec contenu complexe
export const ComplexContentExample = () => (
  <HeadingTitle
    title="Rapports et analyses"
    subtitle="Analysez vos performances et générez des rapports détaillés"
  >
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <select className="border rounded-md px-3 py-2">
            <option>Derniers 30 jours</option>
            <option>Derniers 3 mois</option>
            <option>Cette année</option>
          </select>
          <Button variant="outline">Exporter PDF</Button>
        </div>
        <Badge variant="secondary">Dernière mise à jour: il y a 2h</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">€12,450</div>
          <div className="text-blue-100">Chiffre d'affaires</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">89%</div>
          <div className="text-green-100">Taux de satisfaction</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">156</div>
          <div className="text-purple-100">Traitements terminés</div>
        </div>
      </div>
    </div>
  </HeadingTitle>
);