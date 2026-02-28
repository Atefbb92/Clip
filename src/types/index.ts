import type { Timestamp } from 'firebase/firestore';
import type { ReactElement } from 'react';

export type PatientCategory = 'Adulte' | 'Adolescent';
export type Gender = 'Male' | 'Female' | 'Autre' | '';
export type ArcadeOption = 'both' | 'maxillaire' | 'mandibular';

export interface RapportAP {
    D: string;
    G: string;
    options: string | string[];
    rip: boolean;
    ripPrecision: string;
    simulation: boolean;
    simulationPrecision: string;
    chirurgie: boolean; //commentaire
    distalisation?: boolean;
}

export interface OverbiteSection {
    selected: boolean;
    egressionAnterieure: boolean;
    ingressionPosterieure: boolean;
}

export interface PrescriptionData {
    arcade: ArcadeOption;
    maxillaireOption?: string;
    mandibulaireOption?: string;
    restrictions: string;
    restrictionsTeeth: number[];
    taquets: string;
    taquetsTeeth: number[];
    rapportAP: RapportAP;
    overjet: string;
    overbite: string;
    espacement: string;
    especesSpecifiques?: string;
    expansion?: string;
    expansion2?: string;
    vestibuloversion?: string;
    vestibuloversion2?: string;
    ripAnt?: string;
    ripAnt2?: string;
    ripPostDroite?: string;
    ripPostDroite2?: string;
    ripPostGauche?: string;
    ripPostGauche2?: string;
    maxillaireOverbite?: OverbiteSection;
    mandibulaireOverbite?: OverbiteSection;
    maxillaireSupraclusion?: OverbiteSection;
    mandibulaireSupraclusion?: OverbiteSection;
    autreBeance?: boolean;
    autreSupraclusion?: boolean;
    biteRamps?: string;
    biteRampsOptions?: string[];
    milieux?: string;
    milieuxOptions?: string[];
    milieuxTeeth?: number[];
    extractions?: string;
    extractionsTeeth?: number[];
    specialInstructions?: string;
}

export interface BirthDate {
    day: string;
    month: string;
    year: string;
}

export interface PatientData {
    type?: PatientCategory;
    pack?: string;
    nom: string;
    prenom: string;
    genre: Gender;
    birthDate: BirthDate;
    age?: number;
    conditions: string[];
    photos: Record<string, File | null>;
    radiographies: Record<string, File | null>;
    scans: Record<string, File | null>;
    prescription?: PrescriptionData | null;
    cbctUrl?: string;
    scanMode?: 'link' | 'scanner';
    scanLink?: string;
}

export interface Pack {
    id: string;
    name: string;
    description: string;
    price: number;
    features: string[];
}

export type BillStatus = 'paid' | 'pending' | 'overdue' | 'partial';

export interface Bill {
    id: number;
    patientName: string;
    submitDate: string;
    validationDate: string;
    priceHT: number;
    remise: number;
    tva: number;
    paid: number;
    status: BillStatus;
}

export interface PatientImages {
    img2?: string;
}

export interface Patient {
    id: string;
    name: string;
    surname: string;
    age: string;
    birthDate: string;
    gender: string;
    address: string;
    phone: string;
    email?: string;
    medicalHistory?: string;
    allergies?: string;
    currentMedications?: string;
    treatmentGoals?: string;
    notes?: string;
    status: number;
    archived: number;
    files?: string[];
    createdAt?: Timestamp | Date | null;
    validationDate?: Timestamp | Date | null;
    updatedAt?: Timestamp | Date | null;
    userId: string;
    images?: PatientImages;
}

export interface DashboardStats {
    totalPatients: number;
    newPatientsThisMonth: number;
    patientsInTreatment: number;
    completedTreatments: number;
    pendingActions: number;
    recentPatients: Patient[];
    averageTreatmentDuration: number;
    successRate: number;
    monthlyGrowth: number;
}

export interface NotificationItem {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

export interface MessageItem {
    id: number;
    sender: string;
    avatar: string;
    message: string;
    time: string;
    unread: boolean;
}

export interface Profile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    clinicName: string;
    license: string;
}

export interface AddressFormValues {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

export interface DocumentationSubsection {
    id: string;
    title: string;
    content: string;
}

export interface DocumentationSection {
    id: string;
    title: string;
    description: string;
    icon: ReactElement<{ className?: string }>;
    subsections: DocumentationSubsection[];
}

export interface RIPPreferences {
    anterieure: string;
    posterieure: string;
    programmation: string;
}

export interface AnteroClassPreferences {
    objectif: string;
    arcadeSup: string;
    arcadeInf: string;
    protocole?: string;
    priorite?: string;
}

export interface DentsAbsentesPreferences {
    pontiques: string;
}

export interface ExtractionsPreferences {
    considererAPartirDeEtape: number;
    pontiques: string;
}

export interface ClinicalPreferences {
    rip: {
        adulte: RIPPreferences;
        ado: RIPPreferences;
    };
    antero: {
        classe2: {
            adulte: AnteroClassPreferences;
            ado: AnteroClassPreferences;
        };
        classe3: {
            adulte: AnteroClassPreferences;
            ado: AnteroClassPreferences;
        };
    };
    dentsAbsentes: DentsAbsentesPreferences;
    extractions: ExtractionsPreferences;
    // Fallback for other sections that haven't been strongly typed yet
    encombrement?: Record<string, any>;
    espacement?: Record<string, any>;
    axe?: Record<string, any>;
    articule?: Record<string, any>;
    nivellement?: Record<string, any>;
    recouvrement?: Record<string, any>;
    fonctionnalites?: Record<string, any>;
    surcorrection?: Record<string, any>;
    aligneurs?: Record<string, any>;
}

export interface EventCategory {
    id: string;
    label: string;
    icon?: any;
}

export interface EventItem {
    id: string;
    type: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: string;
    status: string;
    featured: boolean;
}

export interface StoreCategory {
    id: string;
    label: string;
    icon?: any;
}

export interface StoreProduct {
    id: string;
    category: string;
    name: string;
    description: string;
    price: string;
    image: string;
    status: string;
    specs: string[];
}

export interface DemoCaseItem {
    id: string;
    title: string;
    titleFr: string;
    description: string;
    beforeImage: string;
    afterImage: string;
    color: string;
    category: 'malocclusion' | 'class';
    difficulty: 'Easy' | 'Medium' | 'Complex';
    duration: string;
}

export interface AcademyCategory {
    id: string;
    label: string;
    icon?: any;
}

export interface AcademyContentItem {
    id: string;
    type: string;
    title: string;
    description: string;
    duration: string;
    level: string;
    image: string;
    date: string;
    author: string;
}

export interface AcademyLearningStats {
    hoursWatched: number;
    itemsCompleted: number;
    itemsInProgress: number;
    itemsNotStarted: number;
}

export interface AcademyProgressItem {
    id: string;
    title: string;
    type: string;
    progress: number;
    image: string;
    lastWatched: string;
}

export interface AcademyCompletedItem {
    id: string;
    title: string;
    type: string;
    completedDate: string;
    grade: string;
}

export interface DiamondPurityLevel {
    name: string;
    cases: number;
    badge: string;
    color: string;
    iconColor: string;
    discount: string;
}

export interface DiamondPuritySubStat {
    value: string;
    label: string;
}

export interface DiamondPurityStat {
    value: string;
    label: string;
    icon: any;
    color: string;
    bg: string;
    border: string;
    subStats: DiamondPuritySubStat[];
}

export interface StatCardData {
    id: string;
    title: string;
    value: string | number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    icon: any;
    color: 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'analytics';
    description?: string;
}

export interface ChartDataset {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
}

export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}
