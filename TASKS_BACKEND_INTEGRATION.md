# Liste des Tâches Backend & Intégration Front/Back

Ce document recense les tâches techniques nécessaires pour consolider l'architecture du projet, assurer la conformité avec les standards demandés (Zod, Shadcn) et améliorer la maintenabilité.

## 1. Architecture & Nettoyage (Priorité Haute)

Le projet semble être dans une phase de transition entre une ancienne structure (React "classique" ou pages HTML/JS) et Next.js App Router.

- [ ] **Suppression du dossier `src/pages`** : Le code moderne se trouve dans `src/app`. Le dossier `src/pages` contient du code legacy (`.jsx`, styles modules, logique vanilla) qui fait doublon et crée de la confusion.
- [ ] **Nettoyage des Assets JS** : Le dossier `src/assets/js` contient des scripts vanilla (`ajouterPatient.js`, `main.js`, `click.js`) qui manipulent le DOM directement. Cette logique doit être migrée vers des composants React ou des Hooks personnalisés.
- [ ] **Unification des dépendances UI** : Le projet utilise à la fois `bootstrap`, `react-bootstrap` et `tailwindcss` (via Shadcn).
  - [ ] Supprimer progressivement Bootstrap pour ne garder que Tailwind + Shadcn.

## 2. Backend (Firebase & Logique Serveur)

Bien que le projet utilise Firebase (BaaS), la logique "Backend" doit être structurée pour être sécurisée et typée.

- [ ] **Création d'une couche Service (`src/services/`)** :
  - Actuellement, les appels Firebase (`getDocs`, `addDoc`, `signInWithEmailAndPassword`) sont éparpillés dans les composants UI.
  - **Tâche** : Centraliser ces appels dans des fichiers dédiés (ex: `authService.ts`, `patientService.ts`).
- [ ] **Typage Strict (TypeScript)** :
  - Définir des interfaces TypeScript pour tous les modèles de données (Patient, Médecin, Rendez-vous) correspondant aux documents Firestore.
  - Utiliser ces types dans les retours des services.
- [ ] **Server Actions (Optionnel mais recommandé)** :
  - Pour les mutations sensibles (ex: création de patient, modification de dossier), envisager d'utiliser des **Server Actions** Next.js au lieu d'appels clients directs, pour une meilleure sécurité et gestion des erreurs.

## 3. Liaison Front/Back & Formulaires (Règle stricte : Zod + Shadcn)

La règle "Tous les formulaires doivent utiliser Zod et Shadcn Form" n'est pas respectée partout.

### 3.1 Authentification

- [ ] **Refonte `src/app/(auth)/signin/page.tsx`** :
  - **État actuel** : Utilise `useState` simple et des inputs HTML bruts.
  - **Tâche** : Réécrire avec `react-hook-form`, `zod` et les composants `<Form>` de Shadcn.
- [ ] **Refonte `src/app/(auth)/signup/page.tsx`** :
  - Même travail que pour le login.

### 3.2 Gestion des Patients

- [ ] **Consolidation des routes d'ajout** :
  - Il existe `src/app/(dashboard)/ajouter-patient` et `src/app/(dashboard)/patients/add`.
  - **Tâche** : Garder une seule route (de préférence `patients/add` qui semble déjà utiliser Zod) et supprimer l'autre.
  - Vérifier que le formulaire "survivant" couvre tous les champs nécessaires (upload fichiers, infos médicales).
- [ ] **Refonte des autres formulaires** :
  - Tout formulaire de contact, de profil ou de recherche doit être migré vers le standard Zod/Shadcn.

## 4. Gestion des Données (Fetching)

- [ ] **Standardisation du Data Fetching** :
  - Actuellement : `useEffect` + `getDocs` (Pattern React classique).
  - **Cible** :
    - Pour les données statiques/serveur : Récupérer les données directement dans les **Server Components** (`page.tsx`) et les passer aux composants clients.
    - Pour les données temps réel : Créer des Custom Hooks (ex: `usePatients`) qui encapsulent la logique `onSnapshot` de Firebase.

## 5. Résumé des Tâches Immédiates (To-Do)

1. [ ] Analyser et fusionner `ajouter-patient` et `patients/add`.
2. [ ] Réécrire la page de Login (`signin`) avec Zod/Shadcn.
3. [ ] Créer le fichier `src/types/index.ts` pour les modèles Firestore.
4. [ ] Extraire la logique Firebase des composants vers `src/services/firebase`.
