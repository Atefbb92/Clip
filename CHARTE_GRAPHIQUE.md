# Charte Graphique - Application Diamond

## 🎨 Palette de Couleurs

### Couleurs Principales

#### Système de Design (CSS Variables)
```css
/* Couleurs primaires */
--primary: 221.2 83.2% 53.3%;           /* Bleu principal #1e88e5 */
--primary-foreground: 210 40% 98%;       /* Texte sur fond primaire */
--secondary: 210 40% 96%;                /* Gris clair secondaire */
--secondary-foreground: 222.2 84% 4.9%;  /* Texte sur fond secondaire */

/* Couleurs spécifiques Diamond */
--primary-color: #1e88e5;                /* Bleu Diamond */
--text-color: #425567;                   /* Texte principal */
--background-color: #f5f7fa;             /* Fond de l'application */
--color-secondary: #333333;              /* Texte secondaire */
--color-white: #ffffff;                  /* Blanc */
```

#### Palette Étendue "Curious Blue"
```css
'curious-blue': {
  '50': '#f2f8fd',   /* Très clair */
  '100': '#e3effb',  /* Clair */
  '200': '#c1dff6',  /* Moyen clair */
  '300': '#8ac5ef',  /* Moyen */
  '400': '#4ca7e4',  /* Moyen foncé */
  '500': '#3498db',  /* Principal */
  '600': '#176fb2',  /* Foncé */
  '700': '#145990',  /* Très foncé */
  '800': '#144c78',  /* Ultra foncé */
  '900': '#164064',  /* Noir bleuté */
  '950': '#0f2942',  /* Noir profond */
}
```

#### Couleurs Fonctionnelles
```css
/* États et actions */
--destructive: 0 84.2% 60.2%;           /* Rouge pour les actions destructives */
--muted: 210 40% 96%;                    /* Gris atténué */
--accent: 210 40% 96%;                   /* Couleur d'accent */
--border: 214.3 31.8% 91.4%;            /* Bordures */
--input: 214.3 31.8% 91.4%;             /* Champs de saisie */
--ring: 221.2 83.2% 53.3%;              /* Focus ring */

/* Couleurs spécialisées */
--primary-blue: #2E6DB4;                 /* Bleu profil */
--secondary-blue: #1B4B87;              /* Bleu secondaire profil */
--accent-teal: #00BFA5;                  /* Vert d'accent */
--light-gray: #F5F5F5;                   /* Gris clair */
--border-gray: #E0E0E0;                  /* Gris bordure */
--text-dark: #333333;                    /* Texte foncé */
--text-gray: #666666;                    /* Texte gris */
```

### Couleurs de Statut
```css
/* Statuts des traitements */
.completed { background-color: #00b5b8; }    /* Terminé - Teal */
.start { background-color: #1e40af; }        /* Démarrer - Bleu */
.check { background-color: #1e40af; }        /* Vérifier - Bleu */
```

## 📝 Typographie

### Familles de Polices
```css
/* Police principale */
--font-default: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

/* Police primaire (titres) */
--font-primary: var(--font-default);

/* Police secondaire (navigation) */
--font-secondary: var(--font-default);

/* Police monospace */
--font-monospace: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
```

### Hiérarchie Typographique

#### Titres
- **H1 Principal** : `font-size: 2.5rem; font-weight: 700; color: #1e293b;`
- **H2 Section** : `font-size: 2rem; font-weight: 600;`
- **H3 Sous-section** : `font-size: 1.5rem; font-weight: 600;`
- **H4 Card Title** : `font-size: 1.25rem; font-weight: 600;`

#### Corps de Texte
- **Texte principal** : `font-size: 1rem; font-weight: 400; line-height: 1.5;`
- **Texte secondaire** : `font-size: 0.875rem; color: #64748b;`
- **Texte petit** : `font-size: 0.75rem; color: #94a3b8;`

#### Navigation
- **Liens navigation** : `font-size: 1rem; font-weight: 400; font-family: var(--font-secondary);`
- **Boutons** : `font-size: 0.875rem; font-weight: 500;`

## 🎯 Composants UI

### Boutons

#### Variantes
```tsx
// Bouton principal
default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"

// Bouton destructif
destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90"

// Bouton contour
outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"

// Bouton secondaire
secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80"

// Bouton fantôme
ghost: "hover:bg-accent hover:text-accent-foreground"

// Lien
link: "text-primary underline-offset-4 hover:underline"
```

#### Tailles
```tsx
default: "h-9 px-4 py-2"     // Taille standard
sm: "h-8 px-3"               // Petit
lg: "h-10 px-6"              // Grand
icon: "size-9"               // Icône seule
```

### Cartes (Cards)

#### Structure
```tsx
// Carte principale
Card: "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"

// En-tête de carte
CardHeader: "grid auto-rows-min items-start gap-1.5 px-6"

// Titre de carte
CardTitle: "leading-none font-semibold"

// Description
CardDescription: "text-muted-foreground text-sm"

// Contenu
CardContent: "px-6"

// Pied de carte
CardFooter: "flex items-center gap-3 px-6"
```

### Badges

#### Variantes
```tsx
default: "border-transparent bg-primary text-primary-foreground"
secondary: "border-transparent bg-secondary text-secondary-foreground"
destructive: "border-transparent bg-destructive text-white"
outline: "text-foreground"
```

## 🎨 Effets Visuels

### Ombres
```css
/* Ombres principales */
shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.05);
shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.04);
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

### Bordures
```css
/* Rayons de bordure */
--radius: 0.5rem;              /* Rayon de base */
rounded-md: calc(var(--radius) - 2px);
rounded-lg: var(--radius);
rounded-xl: 12px;              /* Cartes principales */
rounded-full: 50%;             /* Éléments circulaires */
```

### Transitions
```css
/* Transitions standard */
transition-all: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
transition-colors: color 0.3s ease;
transition-transform: transform 0.3s ease;
```

### Dégradés
```css
/* Dégradé de fond principal */
background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

/* Dégradé de titre */
background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
```

## 📐 Espacements

### Système d'Espacement (Tailwind)
```css
/* Espacements internes (padding) */
p-1: 0.25rem    /* 4px */
p-2: 0.5rem     /* 8px */
p-3: 0.75rem    /* 12px */
p-4: 1rem       /* 16px */
p-6: 1.5rem     /* 24px */
p-8: 2rem       /* 32px */

/* Espacements externes (margin) */
m-1: 0.25rem    /* 4px */
m-2: 0.5rem     /* 8px */
m-4: 1rem       /* 16px */
m-6: 1.5rem     /* 24px */
m-8: 2rem       /* 32px */

/* Gaps pour les grilles */
gap-1: 0.25rem  /* 4px */
gap-2: 0.5rem   /* 8px */
gap-4: 1rem     /* 16px */
gap-6: 1.5rem   /* 24px */
```

### Conteneurs
```css
/* Conteneur principal */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Grille du dashboard */
.statsGrid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.25rem;
}
```

## 🌙 Mode Sombre

### Variables Mode Sombre
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --primary: 217.2 91.2% 59.8%;
  --secondary: 217.2 32.6% 17.5%;
  --muted: 217.2 32.6% 17.5%;
  --accent: 217.2 32.6% 17.5%;
  --destructive: 0 62.8% 30.6%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
}
```

## 🎭 Animations

### Animations Personnalisées
```css
/* Animation d'apparition */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation de rotation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animations Tailwind */
accordion-down: "accordion-down 0.2s ease-out"
accordion-up: "accordion-up 0.2s ease-out"
```

## 📊 Graphiques

### Couleurs des Graphiques
```css
/* Couleurs Chart.js */
--chart-1: oklch(0.488 0.243 264.376);  /* Bleu */
--chart-2: oklch(0.696 0.17 162.48);   /* Vert */
--chart-3: oklch(0.769 0.188 70.08);   /* Jaune */
--chart-4: oklch(0.627 0.265 303.9);   /* Violet */
--chart-5: oklch(0.645 0.246 16.439);  /* Orange */
```

## 🎯 Bonnes Pratiques

### Accessibilité
- Contraste minimum de 4.5:1 pour le texte normal
- Contraste minimum de 3:1 pour le texte large
- Focus visible avec `ring` de 3px
- Support des états `aria-invalid`

### Responsive Design
- Mobile-first approach
- Breakpoints Tailwind standard
- Grilles adaptatives avec CSS Grid
- Composants flexibles

### Performance
- Utilisation de `backdrop-filter` pour les effets de flou
- Transitions optimisées avec `cubic-bezier`
- Lazy loading des composants lourds
- Optimisation des animations CSS

---

*Cette charte graphique est basée sur l'analyse de l'application Diamond et utilise le système de design Tailwind CSS avec des composants shadcn/ui.*