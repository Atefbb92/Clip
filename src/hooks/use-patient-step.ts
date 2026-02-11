'use client';

import { useQueryState } from 'nuqs';
import { usePatientStore } from '@/stores/patient-store';
import { useEffect } from 'react';

export function usePatientStep() {
  // Utiliser nuqs pour persister le step dans l'URL
  const [stepFromUrl, setStepInUrl] = useQueryState('step', {
    defaultValue: '0',
    parse: (value) => value || '0',
    serialize: (value) => value
  });

  // Utiliser Zustand pour l'état global
  const {
    currentStep,
    completedSteps,
    setCurrentStep: setStepInStore,
    markStepAsCompleted,
    ...store
  } = usePatientStore();

  // Synchroniser l'URL avec le store au chargement
  useEffect(() => {
    const stepNumber = parseInt(stepFromUrl, 10);
    if (!isNaN(stepNumber) && stepNumber !== currentStep) {
      setStepInStore(stepNumber);
    }
  }, [stepFromUrl, currentStep, setStepInStore]);

  // Fonction pour changer de step (met à jour à la fois l'URL et le store)
  const setCurrentStep = (step: number) => {
    setStepInStore(step);
    setStepInUrl(step.toString());
  };

  // Fonction pour aller au step suivant
  const nextStep = () => {
    const newStep = Math.min(currentStep + 1, 5); // Max 5 steps (0-5)
    setCurrentStep(newStep);
  };

  // Fonction pour aller au step précédent
  const prevStep = () => {
    const newStep = Math.max(currentStep - 1, 0); // Min 0
    setCurrentStep(newStep);
  };

  // Fonction pour aller à un step spécifique
  const goToStep = (step: number) => {
    if (step >= 0 && step <= 5) {
      setCurrentStep(step);
    }
  };

  // Fonction pour vérifier si une étape est complétée
  const isStepCompleted = (step: number) => {
    return completedSteps.includes(step);
  };

  // Fonction pour vérifier si une étape est accessible (toutes les étapes sont maintenant accessibles)
  const isStepAccessible = (step: number) => {
    return true; // Toutes les étapes sont cliquables
  };

  // Fonction pour réinitialiser complètement (store + URL)
  const resetAll = () => {
    store.resetStore(); // Réinitialise le store Zustand
    setStepInUrl('0'); // Réinitialise l'URL à step=0
  };

  return {
    currentStep,
    completedSteps,
    setCurrentStep,
    nextStep,
    prevStep,
    goToStep,
    markStepAsCompleted,
    isStepCompleted,
    isStepAccessible,
    resetAll,
    ...store
  };
}