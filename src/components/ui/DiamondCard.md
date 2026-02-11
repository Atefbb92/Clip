# DiamondCard

Le composant `DiamondCard` est une extension du composant `Card` de Shadcn UI, spécialement conçu pour l'application Diamond. Il offre une cohérence visuelle et des variantes prédéfinies pour tous les composants de type carte dans l'application.

## Caractéristiques

- **Variantes de style** : `default`, `elevated`, `outlined`, `glass`
- **Tailles** : `sm`, `md`, `lg`
- **Animations** : Transitions fluides et effets de hover
- **Accessibilité** : Conforme aux standards d'accessibilité
- **Responsive** : S'adapte à tous les écrans

## Installation

```tsx
import { 
  DiamondCard, 
  DiamondCardHeader, 
  DiamondCardTitle, 
  DiamondCardDescription, 
  DiamondCardContent, 
  DiamondCardFooter,
  DiamondCardAction 
} from '@/components/ui/diamond-card'
```

## Utilisation de base

```tsx
<DiamondCard className="w-[350px]">
  <DiamondCardHeader>
    <DiamondCardTitle>Titre de la carte</DiamondCardTitle>
    <DiamondCardDescription>
      Description de la carte
    </DiamondCardDescription>
  </DiamondCardHeader>
  <DiamondCardContent>
    <p>Contenu de la carte</p>
  </DiamondCardContent>
  <DiamondCardFooter>
    <Button variant="outline">Annuler</Button>
    <Button>Confirmer</Button>
  </DiamondCardFooter>
</DiamondCard>
```

## Variantes

### Default
Style par défaut avec ombre légère et bordure subtile.

```tsx
<DiamondCard variant="default">
  {/* Contenu */}
</DiamondCard>
```

### Elevated
Carte surélevée avec ombre prononcée et effet de hover.

```tsx
<DiamondCard variant="elevated">
  {/* Contenu */}
</DiamondCard>
```

### Outlined
Carte avec bordure colorée et sans ombre.

```tsx
<DiamondCard variant="outlined">
  {/* Contenu */}
</DiamondCard>
```

### Glass
Effet de verre avec transparence et flou d'arrière-plan.

```tsx
<DiamondCard variant="glass">
  {/* Contenu */}
</DiamondCard>
```

## Tailles

### Small (sm)
```tsx
<DiamondCard size="sm">
  {/* Contenu compact */}
</DiamondCard>
```

### Medium (md) - Par défaut
```tsx
<DiamondCard size="md">
  {/* Contenu standard */}
</DiamondCard>
```

### Large (lg)
```tsx
<DiamondCard size="lg">
  {/* Contenu spacieux */}
</DiamondCard>
```

## Composants enfants

### DiamondCardHeader
En-tête de la carte avec option de séparateur.

```tsx
<DiamondCardHeader withDivider>
  <DiamondCardTitle>Titre</DiamondCardTitle>
  <DiamondCardDescription>Description</DiamondCardDescription>
</DiamondCardHeader>
```

### DiamondCardTitle
Titre avec option de dégradé.

```tsx
<DiamondCardTitle gradient>Titre avec dégradé</DiamondCardTitle>
```

### DiamondCardAction
Zone d'action dans l'en-tête (boutons, menus).

```tsx
<DiamondCardAction>
  <Button variant="ghost" size="sm">
    <MoreHorizontal className="h-4 w-4" />
  </Button>
</DiamondCardAction>
```

## Exemples d'utilisation

### Carte de statistiques
```tsx
<DiamondCard variant="elevated" size="lg">
  <DiamondCardHeader withDivider>
    <DiamondCardTitle gradient>Statistiques</DiamondCardTitle>
    <DiamondCardAction>
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DiamondCardAction>
  </DiamondCardHeader>
  <DiamondCardContent>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">24</div>
        <div className="text-sm text-gray-600">Patients</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">18</div>
        <div className="text-sm text-gray-600">Consultations</div>
      </div>
    </div>
  </DiamondCardContent>
</DiamondCard>
```

### Carte de notification
```tsx
<DiamondCard variant="outlined">
  <DiamondCardHeader>
    <DiamondCardTitle>Nouvelle notification</DiamondCardTitle>
    <DiamondCardDescription>
      Vous avez reçu un message
    </DiamondCardDescription>
  </DiamondCardHeader>
  <DiamondCardContent>
    <div className="flex items-center space-x-2">
      <Badge variant="secondary">Nouveau</Badge>
      <span className="text-sm">Rendez-vous confirmé</span>
    </div>
  </DiamondCardContent>
  <DiamondCardFooter>
    <Button variant="ghost" size="sm">Marquer comme lu</Button>
  </DiamondCardFooter>
</DiamondCard>
```

## Props

### DiamondCard
| Prop | Type | Défaut | Description |
|------|------|--------|--------------|
| `variant` | `'default' \| 'elevated' \| 'outlined' \| 'glass'` | `'default'` | Style de la carte |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille de la carte |
| `className` | `string` | - | Classes CSS additionnelles |

### DiamondCardHeader
| Prop | Type | Défaut | Description |
|------|------|--------|--------------|
| `withDivider` | `boolean` | `false` | Ajoute un séparateur sous l'en-tête |
| `className` | `string` | - | Classes CSS additionnelles |

### DiamondCardTitle
| Prop | Type | Défaut | Description |
|------|------|--------|--------------|
| `gradient` | `boolean` | `false` | Applique un dégradé au texte |
| `className` | `string` | - | Classes CSS additionnelles |

## Bonnes pratiques

1. **Cohérence** : Utilisez toujours `DiamondCard` au lieu du composant `Card` de base
2. **Variantes** : Choisissez la variante appropriée selon le contexte
3. **Tailles** : Adaptez la taille au contenu et à l'espace disponible
4. **Accessibilité** : Ajoutez des `aria-label` si nécessaire
5. **Performance** : Évitez les animations sur les cartes nombreuses

## Migration depuis Card

Pour migrer une carte existante :

```tsx
// Avant
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>Contenu</CardContent>
</Card>

// Après
<DiamondCard>
  <DiamondCardHeader>
    <DiamondCardTitle>Titre</DiamondCardTitle>
  </DiamondCardHeader>
  <DiamondCardContent>Contenu</DiamondCardContent>
</DiamondCard>
```

## Personnalisation

Le composant utilise les variables CSS de l'application Diamond. Pour personnaliser :

```css
:root {
  --primary: /* Couleur principale */;
  --primary-blue: /* Couleur secondaire pour les dégradés */;
}
```