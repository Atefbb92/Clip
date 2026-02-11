# HeadingTitle Component

Composant réutilisable pour afficher des titres cohérents dans toute l'application.

## Utilisation

```tsx
import { HeadingTitle } from '@/components/HeadingTitle';

// Utilisation basique avec titre seulement
<HeadingTitle title="Mon Titre" />

// Avec titre et sous-titre
<HeadingTitle 
  title="Mon Titre" 
  subtitle="Description du contenu de la page"
/>

// Avec contenu personnalisé
<HeadingTitle 
  title="Mon Titre" 
  subtitle="Description"
>
  <div className="flex gap-4">
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </div>
</HeadingTitle>
```

## Props

| Prop | Type | Requis | Description |
|------|------|--------|--------------|
| `title` | `string` | ✅ | Le titre principal |
| `subtitle` | `string` | ❌ | Le sous-titre optionnel |
| `children` | `React.ReactNode` | ❌ | Contenu personnalisé à afficher sous le titre |
| `className` | `string` | ❌ | Classes CSS pour le conteneur principal |
| `titleClassName` | `string` | ❌ | Classes CSS pour le titre |
| `subtitleClassName` | `string` | ❌ | Classes CSS pour le sous-titre |
| `contentClassName` | `string` | ❌ | Classes CSS pour le contenu |

## Exemples d'utilisation

### Page de liste
```tsx
<HeadingTitle 
  title="Patients" 
  subtitle="Gérez vos patients et suivez leurs traitements"
>
  <div className="flex justify-between items-center">
    <SearchInput />
    <Button>Nouveau patient</Button>
  </div>
</HeadingTitle>
```

### Page de détail
```tsx
<HeadingTitle 
  title="Détails du patient" 
  subtitle="Informations complètes et historique médical"
  titleClassName="text-3xl"
/>
```

### Avec actions personnalisées
```tsx
<HeadingTitle 
  title="Tableau de bord" 
  subtitle="Vue d'ensemble de votre activité"
>
  <div className="grid grid-cols-3 gap-4">
    <StatCard title="Patients" value="125" />
    <StatCard title="Rendez-vous" value="8" />
    <StatCard title="Traitements" value="23" />
  </div>
</HeadingTitle>
```

## Styles par défaut

- **Titre** : `text-2xl font-bold tracking-tight text-gray-900`
- **Sous-titre** : `text-sm text-gray-600`
- **Espacement** : `space-y-4` pour le conteneur, `space-y-2` pour titre/sous-titre
- **Contenu** : `mt-4` pour l'espacement avec le contenu personnalisé

Tous les styles peuvent être surchargés via les props `*ClassName`.