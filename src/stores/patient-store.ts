import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PatientDetails {
  nom: string;
  prenom: string;
  dateNaissance: string;
  genre: string;
  age: number;
  conditions: string[];
  pack?: string;
}

interface BirthDate {
  day: string;
  month: string;
  year: string;
}

interface PatientStore {
  // State
  currentStep: number;
  completedSteps: number[];
  selectedPatientType: string;
  selectedPack: string;
  selectedConditions: string[];
  patientDetails: PatientDetails;
  birthDate: BirthDate;
  photos: { [key: string]: File | null };
  radiographies: { [key: string]: File | null };
  scans: { [key: string]: File | null };
  
  // Actions
  setCurrentStep: (step: number) => void;
  markStepAsCompleted: (step: number) => void;
  setSelectedPatientType: (type: string) => void;
  setSelectedPack: (pack: string) => void;
  setSelectedConditions: (conditions: string[]) => void;
  setPatientDetails: (details: PatientDetails) => void;
  setBirthDate: (birthDate: BirthDate) => void;
  setPhotos: (photos: { [key: string]: File | null }) => void;
  setRadiographies: (radiographies: { [key: string]: File | null }) => void;
  setScans: (scans: { [key: string]: File | null }) => void;
  
  // Reset
  resetStore: () => void;
}

const initialState = {
  currentStep: 0,
  completedSteps: [],
  selectedPatientType: '',
  selectedPack: '',
  selectedConditions: [],
  patientDetails: {
    nom: '',
    prenom: '',
    dateNaissance: '',
    genre: '',
    age: 0,
    conditions: [],
    pack: ''
  },
  birthDate: {
    day: '',
    month: '',
    year: ''
  },
  photos: {},
  radiographies: {},
  scans: {}
};

export const usePatientStore = create<PatientStore>()(persist(
  (set) => ({
    ...initialState,
    
    setCurrentStep: (step: number) => set({ currentStep: step }),
    markStepAsCompleted: (step: number) => set((state) => ({
      completedSteps: state.completedSteps.includes(step) 
        ? state.completedSteps 
        : [...state.completedSteps, step]
    })),
    setSelectedPatientType: (type: string) => set({ selectedPatientType: type }),
    setSelectedPack: (pack: string) => set({ selectedPack: pack }),
    setSelectedConditions: (conditions: string[]) => set({ selectedConditions: conditions }),
    setPatientDetails: (details: PatientDetails) => set({ patientDetails: details }),
    setBirthDate: (birthDate: BirthDate) => set({ birthDate: birthDate }),
    setPhotos: (photos: { [key: string]: File | null }) => set({ photos: photos }),
    setRadiographies: (radiographies: { [key: string]: File | null }) => set({ radiographies: radiographies }),
    setScans: (scans: { [key: string]: File | null }) => set({ scans: scans }),
    
    resetStore: () => set(initialState)
  }),
  {
    name: 'patient-store',
    // Ne pas persister les fichiers car ils ne peuvent pas être sérialisés
    partialize: (state) => ({
      currentStep: state.currentStep,
      completedSteps: state.completedSteps,
      selectedPatientType: state.selectedPatientType,
      selectedPack: state.selectedPack,
      selectedConditions: state.selectedConditions,
      patientDetails: state.patientDetails,
      birthDate: state.birthDate
    })
  }
));