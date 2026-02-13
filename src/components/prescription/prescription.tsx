// This is a workaround for TypeScript module resolution issues
// TypeScript doesn't recognize these imports correctly in this environment
// @ts-ignore
import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react'
// @ts-ignore
import styles from "./prescription.module.css"
// @ts-ignore
import anamnese from "../../assets/img/presciptionframe.png"
// @ts-ignore
import prescription3 from "../../assets/icons/Prescription-3.png"
import { doc, getDoc, collection, where, getDocs, query } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { db, auth, storage } from '../../firebase/firebase'
import "./dental-dialog.css";
import DentalChart from "../../components/dental-chart";
import { Button } from "../../components/ui/button";
import html2canvas from "html2canvas";
import "./dental-dialog.css";
import {
  DiamondCard,
  DiamondCardHeader,
  DiamondCardTitle,
  DiamondCardContent,
} from "@/components/ui/diamond-card";
import { Badge } from "@/components/ui/badge";

interface PrescriptionProps {
  initialSection?: string;
  prescriptionData?: any; // Replace `any` with a more specific type if possible
  patientDetails?: any;  // Replace `any` with a more specific type if possible
  onModify?: (step: any, section: any) => void; // Replace `any` with appropriate types
}

// Define proper types for the state
interface RapportAPState {
  D: string;
  G: string;
  options: string | string[];
  rip: boolean;
  ripPrecision: string;
  simulation: boolean;
  simulationPrecision: string;
  chirurgie: boolean;
  distalisation?: boolean;
}

interface OverbiteSection {
  selected: boolean;
  egressionAnterieure: boolean;
  ingressionPosterieure: boolean;
}

interface FormState {
  arcade: string;
  maxillaireOption: string;
  mandibulaireOption: string;
  restrictions: string;
  restrictionsTeeth: Set<number>;  // Corrected property name
  taquets: string;
  taquetsTeeth: Set<number>;
  rapportAP: RapportAPState;
  overjet: string;
  overbite: string;
  espacement: string;
  especesSpecifiques: string;
  expansion: string;
  expansion2: string;
  vestibuloversion: string;
  vestibuloversion2: string;
  ripAnt: string;
  ripAnt2: string;
  ripPostDroite: string;
  ripPostDroite2: string;
  ripPostGauche: string;
  ripPostGauche2: string;
  maxillaireOverbite: OverbiteSection;
  mandibulaireOverbite: OverbiteSection;
  maxillaireSupraclusion: OverbiteSection;
  mandibulaireSupraclusion: OverbiteSection;
  autreBeance: boolean;
  autreSupraclusion: boolean;
  biteRamps: string;
  biteRampsOptions: string[];
  milieux: string;
  milieuxOptions: string[];
  milieuxTeeth: Set<number>;
  extractions: string;
  extractionsTeeth: Set<number>;
  specialInstructions: string;
}

// Define tooth mapping arrays
const upperTeethMapping = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
];
const lowerTeethMapping = [
  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];
const validTeethNumbers = new Set([...upperTeethMapping, ...lowerTeethMapping]);

const Prescription = forwardRef<HTMLDivElement, PrescriptionProps>(({ initialSection, prescriptionData, patientDetails, onModify }, ref) => {
  const [showDentalChart, setShowDentalChart] = useState(false);
  const [modifications, setModifications] = useState<
    { code: string, type: string }[]
  >([]);
  const [savedTeethStates, setSavedTeethStates] = useState<
    Record<string, string>
  >({});
  const [showTextualGrid, setShowTextualGrid] = useState(false);
  const [showChartPreview, setShowChartPreview] = useState(false);
  const [chartImage, setChartImage] = useState<string | null>(null);
  const dentalChartRef = useRef<any>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);



  // Fonction pour convertir un type de dent en son code d'une lettre
  const getTeethTypeCode = (
    code: string,
    states: Record<string, string>
  ): string => {
    const type = states[code] || "normal";
    switch (type) {
      case "normal":
        return "N";
      case "absente":
        return "X";
      case "couronne":
        return "C";
      case "pontique":
        return "P";
      case "implant":
        return "I";
      case "dent_temporaire":
        return "d";
      default:
        return "N";
    }
  };

  // Default form state
  const [formState, setFormState] = useState<FormState>({
    arcade: 'both',
    maxillaireOption: '',
    mandibulaireOption: '',
    restrictions: 'none',
    restrictionsTeeth: new Set(),  // Corrected initial state
    taquets: 'none',
    taquetsTeeth: new Set(),
    rapportAP: {
      D: '',
      G: '',
      options: [],
      rip: false,
      ripPrecision: '',
      simulation: false,
      simulationPrecision: '',
      chirurgie: false
    },
    overjet: 'realiser',
    overbite: 'realiser',
    espacement: 'fermer',
    especesSpecifiques: '',
    expansion: 'siNecessaire',
    expansion2: 'siNecessaire',
    vestibuloversion: 'siNecessaire',
    vestibuloversion2: 'siNecessaire',
    ripAnt: 'siNecessaire',
    ripAnt2: 'siNecessaire',
    ripPostDroite: 'siNecessaire',
    ripPostDroite2: 'siNecessaire',
    ripPostGauche: 'siNecessaire',
    ripPostGauche2: 'siNecessaire',
    maxillaireOverbite: {
      selected: false,
      egressionAnterieure: false,
      ingressionPosterieure: false
    },
    mandibulaireOverbite: {
      selected: false,
      egressionAnterieure: false,
      ingressionPosterieure: false
    },
    maxillaireSupraclusion: {
      selected: false,
      egressionAnterieure: false,
      ingressionPosterieure: false
    },
    mandibulaireSupraclusion: {
      selected: false,
      egressionAnterieure: false,
      ingressionPosterieure: false
    },
    autreBeance: false,
    autreSupraclusion: false,
    biteRamps: 'auto',
    biteRampsOptions: [],
    milieux: 'realiser',
    milieuxOptions: [],
    milieuxTeeth: new Set(),
    extractions: '',
    extractionsTeeth: new Set(),
    specialInstructions: ''
  });

  const [activeSection, setActiveSection] = useState('arcade');
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    /*console.log('Auth state change effect running');*/
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        /*console.log('No user found, redirecting to signin');*/
        router.push('/signin');
      } else {
        /*console.log('User authenticated:', user.uid);*/
        setUserId(user.uid);
        fetchUserRole(user.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchUserRole = async (uid: string) => {
    try {
      /*console.log('Fetching role for UID:', uid);*/
      const q = query(collection(db, 'medecins'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        /*console.log('Full user data:', userData);*/
        const { role } = userData;
        /*console.log('Role from database:', role);*/

        if (role) {
          /*console.log('Setting user role to:', role);*/
          setUserRole(role.toLowerCase());
        } else {
          /*console.log('No role found in user data, defaulting to omnipraticien');*/
          setUserRole('omnipraticien');
        }
      } else {
        /*console.log('No user document found for UID:', uid);*/
        setUserRole('omnipraticien');
      }
    } catch (error: unknown) {
      console.error('Error fetching user role:', error);
      console.error('Error details:', {
        code: error instanceof Error ? (error as any).code : 'unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      setUserRole('omnipraticien');
    }
  };

  useEffect(() => {
    if (activeSection) {
      const sectionElement = document.getElementById(activeSection);
      if (sectionElement) {
        setTimeout(() => {
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          sectionElement.classList.add(styles.highlight);
          setTimeout(() => {
            sectionElement.classList.remove(styles.highlight);
          }, 2000);
        }, 100);
      }
    }
  }, [activeSection]);

  useEffect(() => {
    if (prescriptionData?.activeSection) {
      setActiveSection(prescriptionData.activeSection);
    }
  }, [prescriptionData?.activeSection]);

  useEffect(() => {
    if (prescriptionData?.activeSection) {
      const sectionElement = document.getElementById(prescriptionData.activeSection);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        sectionElement.classList.add(styles.highlight);

        setTimeout(() => {
          sectionElement.classList.remove(styles.highlight);
        }, 2000);
      }
    }
  }, [prescriptionData?.activeSection]);

  const convertToothNumberToNotation = (number: number) => {
    const quadrant = Math.ceil(number / 8);
    const position = number % 8 === 0 ? 8 : number % 8;
    return `${quadrant}${position}`;
  };

  const convertNotationToToothNumber = (notation: string) => {
    const quadrant = parseInt(notation[0]);
    const position = parseInt(notation[1]);
    return (quadrant - 1) * 8 + position;
  };

  useEffect(() => {
    if (prescriptionData) {
      // Helper function to safely convert various data types to Set<number>
      const safeConvertToSetOfNumbers = (data: any): Set<number> => {
        if (!data) return new Set<number>();
        if (data instanceof Set) return data as Set<number>;
        let numbers: number[] = [];
        if (Array.isArray(data)) {
          numbers = data
            .map(item => {
              if (typeof item === 'number') return item;
              if (typeof item === 'string') {
                const num = parseInt(item);
                if (!isNaN(num)) return num;
                const notationNum = convertNotationToToothNumber(item);
                if (notationNum !== -1) return notationNum;
              }
              return NaN;
            })
            .filter(item => !isNaN(item) && validTeethNumbers.has(item));
        } else {
          // If data is not null, Set, or Array, log a warning
          console.warn("Unexpected format for tooth data in prescriptionData:", data);
        }
        return new Set<number>(numbers);
      };

      // Create the new form state by merging existing state with prescription data
      const nextFormState: FormState = {
        ...formState, // Start with current formState
        ...prescriptionData, // Overlay with incoming prescriptionData (overwrites simple values)
        // Explicitly ensure Set types for teeth selections, converting incoming data
        restrictionsTeeth: safeConvertToSetOfNumbers(prescriptionData.restrictionsTeeth),
        taquetsTeeth: safeConvertToSetOfNumbers(prescriptionData.taquetsTeeth),
        milieuxTeeth: safeConvertToSetOfNumbers(prescriptionData.milieuxTeeth),
        extractionsTeeth: safeConvertToSetOfNumbers(prescriptionData.extractionsTeeth),

        // Explicitly handle other specific fields with potential default values or type concerns
        espacement: prescriptionData.espacement ?? formState.espacement ?? 'fermer',
        expansion: prescriptionData.expansion ?? formState.expansion ?? '',
        expansion2: prescriptionData.expansion2 ?? formState.expansion2 ?? '',
        vestibuloversion: prescriptionData.vestibuloversion ?? formState.vestibuloversion ?? '',
        vestibuloversion2: prescriptionData.vestibuloversion2 ?? formState.vestibuloversion2 ?? '',
        ripAnt: prescriptionData.ripAnt ?? formState.ripAnt ?? '',
        ripAnt2: prescriptionData.ripAnt2 ?? formState.ripAnt2 ?? '',
        ripPostDroite: prescriptionData.ripPostDroite ?? formState.ripPostDroite ?? '',
        ripPostDroite2: prescriptionData.ripPostDroite2 ?? formState.ripPostDroite2 ?? '',
        ripPostGauche: prescriptionData.ripPostGauche ?? formState.ripPostGauche ?? '',
        ripPostGauche2: prescriptionData.ripPostGauche2 ?? formState.ripPostGauche2 ?? '',

        // Handle array options, ensuring they are arrays and merging with existing options if needed
        // Assuming biteRampsOptions and milieuxOptions in formState are always arrays due to initial state/handlers
        biteRampsOptions: Array.isArray(prescriptionData.biteRampsOptions) ? prescriptionData.biteRampsOptions : (Array.isArray(formState.biteRampsOptions) ? formState.biteRampsOptions : []),
        milieuxOptions: Array.isArray(prescriptionData.milieuxOptions) ? prescriptionData.milieuxOptions : (Array.isArray(formState.milieuxOptions) ? formState.milieuxOptions : []),

        // Ensure nested objects exist, merging with default structure if necessary
        rapportAP: { ...formState.rapportAP, ...(prescriptionData.rapportAP ?? {}) } as RapportAPState, // Cast to ensure type correctness
        maxillaireOverbite: { ...formState.maxillaireOverbite, ...(prescriptionData.maxillaireOverbite ?? {}) } as OverbiteSection, // Cast
        mandibulaireOverbite: { ...formState.mandibulaireOverbite, ...(prescriptionData.mandibulaireOverbite ?? {}) } as OverbiteSection, // Cast
        maxillaireSupraclusion: { ...formState.maxillaireSupraclusion, ...(prescriptionData.maxillaireSupraclusion ?? {}) } as OverbiteSection, // Cast
        mandibulaireSupraclusion: { ...formState.mandibulaireSupraclusion, ...(prescriptionData.mandibulaireSupraclusion ?? {}) } as OverbiteSection, // Cast

        // Other simple fields are overlaid by spread ...prescriptionData
        // specialInstructions: prescriptionData.specialInstructions ?? formState.specialInstructions,
        // etc.
      };

      /*console.log("Setting form state with converted data:", {
        restrictionsTeeth: Array.from(nextFormState.restrictionsTeeth),
        taquetsTeeth: Array.from(nextFormState.taquetsTeeth),
        milieuxTeeth: Array.from(nextFormState.milieuxTeeth),
        extractionsTeeth: Array.from(nextFormState.extractionsTeeth)
      });*/
      setFormState(nextFormState);
    }
  }, [prescriptionData]);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const handleRadioChange = (section: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [section]: value,
      ...(section === 'arcade' && {
        maxillaireOption: '',
        mandibulaireOption: ''
      }),
      ...(section === 'overbite' && {
        maxillaireOverbite: { selected: false, egressionAnterieure: false, ingressionPosterieure: false },
        mandibulaireOverbite: { selected: false, egressionAnterieure: false, ingressionPosterieure: false },
        maxillaireSupraclusion: { selected: false, egressionAnterieure: false, ingressionPosterieure: false },
        mandibulaireSupraclusion: { selected: false, egressionAnterieure: false, ingressionPosterieure: false },
        autreBeance: false,
        autreSupraclusion: false
      }),
      ...(section === 'taquets' && {
        taquetsTeeth: new Set()
      })
    }))
  }

  const handleNestedRadioChange = (section: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [section]: value
    }))
  }

  const handleCheckboxChange = (section: string, field: string) => {
    setFormState(prev => {
      // Get the section object and ensure it's an object that can have properties
      const sectionObj = prev[section as keyof FormState];
      if (typeof sectionObj === 'object' && sectionObj !== null && !Array.isArray(sectionObj) && !(sectionObj instanceof Set)) {
        // Now TypeScript knows this is an object we can spread and access properties on
        return {
          ...prev,
          [section]: {
            // @ts-ignore - Spreading object with dynamic keys
            ...sectionObj,
            [field]: !((sectionObj as any)[field]),
            ...(field === 'selected' && !(sectionObj as any).selected && {
              egressionAnterieure: false,
              ingressionPosterieure: false
            })
          }
        };
      }
      // Return unchanged state if the section isn't the right type
      return prev;
    });
  }

  const handleNestedCheckboxChange = (section: string, field: string) => {
    setFormState(prev => {
      // Get the section object and ensure it's an object that can have properties
      const sectionObj = prev[section as keyof FormState];
      if (typeof sectionObj === 'object' && sectionObj !== null && !Array.isArray(sectionObj) && !(sectionObj instanceof Set)) {
        // Now TypeScript knows this is an object we can spread and access properties on
        return {
          ...prev,
          [section]: {
            // @ts-ignore - Spreading object with dynamic keys
            ...sectionObj,
            [field]: !((sectionObj as any)[field])
          }
        };
      }
      // Return unchanged state if the section isn't the right type
      return prev;
    });
  }

  const handleBiteRampsChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      biteRamps: value,
      biteRampsOptions: []
    }))
  }

  const handleBiteRampsOptionChange = (option: string) => {
    setFormState(prev => {
      if (option === 'incisives' || option === 'canines') {
        return {
          ...prev,
          biteRampsOptions: prev.biteRampsOptions
            .filter(opt => opt !== 'incisives' && opt !== 'canines')
            .concat(option)
        };
      }
      else {
        const newOptions = [...prev.biteRampsOptions];
        if (newOptions.includes(option)) {
          return {
            ...prev,
            biteRampsOptions: newOptions.filter(opt => opt !== option)
          };
        } else {
          return {
            ...prev,
            biteRampsOptions: [...newOptions, option]
          };
        }
      }
    });
  }

  const handleRapportAPChange = (side: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      rapportAP: {
        ...prev.rapportAP,
        [side]: value
      }
    }))
  }

  const handleRapportAPOptionChange = (option: string) => {
    setFormState(prev => {
      if (option === 'options' || prev.rapportAP.options === 'options') {
        return {
          ...prev,
          rapportAP: {
            ...prev.rapportAP,
            [option]: !prev.rapportAP[option as keyof typeof prev.rapportAP],
            ...(option === 'rip' && prev.rapportAP.rip && { ripPrecision: '' }),
            ...(option === 'simulation' && prev.rapportAP.simulation && { simulationPrecision: '' })
          }
        };
      }
      return prev;
    });
  }

  const handleRapportAPPrecisionChange = (option: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      rapportAP: {
        ...prev.rapportAP,
        [option]: value
      }
    }));
  }

  const handleRestrictionsChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      restrictions: value,
      selectedTeeth: new Set()
    }));
  }

  const handleSelectAllTeeth = (section: keyof Pick<FormState, 'restrictionsTeeth' | 'taquetsTeeth' | 'milieuxTeeth' | 'extractionsTeeth'>) => {
    setFormState(prev => {
      // Ensure the section exists in formState and is a Set
      const currentTeeth = prev[section];
      if (!(currentTeeth instanceof Set)) {
        console.error(`Invalid section provided to handleSelectAllTeeth: ${section}`);
        return prev; // Return previous state if section is invalid
      }

      // Create a new Set with all possible teeth numbers
      const allTeethSet = new Set<number>();
      // Add all upper teeth (18-11, 21-28)
      for (let i = 18; i >= 11; i--) allTeethSet.add(i);
      for (let i = 21; i <= 28; i++) allTeethSet.add(i);
      // Add all lower teeth (48-41, 31-38)
      for (let i = 48; i >= 41; i--) allTeethSet.add(i);
      for (let i = 31; i <= 38; i++) allTeethSet.add(i);

      // If all teeth are already selected, clear the selection
      // Otherwise, select all teeth
      const updatedTeeth = currentTeeth.size === allTeethSet.size ? new Set<number>() : allTeethSet;

      /*console.log(`Selecting all teeth for ${section}:`, Array.from(updatedTeeth));*/
      return {
        ...prev,
        [section]: updatedTeeth
      };
    });
  }

  const handleTeethSelection = (toothNumber: number, section: keyof Pick<FormState, 'restrictionsTeeth' | 'taquetsTeeth' | 'milieuxTeeth' | 'extractionsTeeth'>) => {
    setFormState(prev => {
      // Ensure the section exists in formState and is a Set
      const currentTeeth = prev[section];
      if (!(currentTeeth instanceof Set)) {
        console.error(`Invalid section provided to handleTeethSelection: ${section}`);
        return prev; // Return previous state if section is invalid
      }

      const updatedTeeth = new Set(currentTeeth);
      if (updatedTeeth.has(toothNumber)) {
        updatedTeeth.delete(toothNumber);
      } else {
        updatedTeeth.add(toothNumber);
      }
      /*console.log(`Updated teeth for ${section}:`, Array.from(updatedTeeth));*/
      return {
        ...prev,
        [section]: updatedTeeth
      };
    });
  }

  const handleMilieuxChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      milieux: value,
      milieuxOptions: []
    }));
  }

  const handleMilieuxOptionChange = (option: string, value: boolean) => {
    setFormState(prev => ({
      ...prev,
      milieuxOptions: [...prev.milieuxOptions, option]
    }));
  }

  const handleOverjetChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      overjet: value
    }));
  }

  const handleSpecialInstructionsChange = (value: string) => {
    /*console.log("Setting special instructions:", value);*/
    setFormState(prev => ({
      ...prev,
      specialInstructions: value
    }));
  }

  const handleEspecesSpecifiquesChange = (value: string) => {
    /*console.log("Setting espaces spécifiques:", value);*/
    setFormState(prev => ({
      ...prev,
      especesSpecifiques: value
    }));
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formState.arcade) {
      errors.arcade = 'Veuillez sélectionner une arcade';
    }

    if (!formState.restrictions) {
      errors.restrictions = 'Veuillez sélectionner une option de restriction';
    }

    if (!formState.rapportAP.D || !formState.rapportAP.G) {
      errors.rapportAP = 'Veuillez sélectionner les options pour le rapport A-P';
    }

    if (!formState.overjet) {
      errors.overjet = 'Veuillez sélectionner une option pour l\'overjet';
    }

    if (!formState.overbite) {
      errors.overbite = 'Veuillez sélectionner une option pour l\'overbite';
    }

    return errors;
  }

  const handleRapportAPRadioChange = (option: string) => {
    setFormState(prev => {
      return {
        ...prev,
        rapportAP: {
          ...prev.rapportAP,
          options: option,
          ...(option !== 'options' && {
            rip: false,
            ripPrecision: '',
            simulation: false,
            simulationPrecision: '',
            distalisation: false
          })
        }
      };
    });
  };

  const handleEspacementOptionChange = (field: string, value: string) => {
    /*console.log(`Updating ${field} with value:`, value);*/
    setFormState(prev => {
      const newState = {
        ...prev,
        [field]: value
      };
      /*console.log("New form state:", newState);*/
      return newState;
    });
  };

  useImperativeHandle(ref, () => ({
    getPrescriptionData: () => {
      const data = {
        arcade: formState.arcade,
        maxillaireOption: formState.maxillaireOption,
        mandibulaireOption: formState.mandibulaireOption,
        restrictions: formState.restrictions,
        restrictionsTeeth: Array.from(formState.restrictionsTeeth), // Removed .map(convertToothNumberToNotation)
        taquets: formState.taquets,
        taquetsTeeth: Array.from(formState.taquetsTeeth), // Removed .map(convertToothNumberToNotation)
        rapportAP: {
          D: formState.rapportAP.D,
          G: formState.rapportAP.G,
          options: formState.rapportAP.options,
          rip: formState.rapportAP.rip,
          ripPrecision: formState.rapportAP.ripPrecision,
          simulation: formState.rapportAP.simulation,
          simulationPrecision: formState.rapportAP.simulationPrecision,
          chirurgie: formState.rapportAP.chirurgie
        },
        overjet: formState.overjet,
        overbite: formState.overbite,
        espacement: formState.espacement,
        especesSpecifiques: formState.especesSpecifiques || '',
        expansion: formState.expansion,
        expansion2: formState.expansion2,
        vestibuloversion: formState.vestibuloversion,
        vestibuloversion2: formState.vestibuloversion2,
        ripAnt: formState.ripAnt,
        ripAnt2: formState.ripAnt2,
        ripPostDroite: formState.ripPostDroite,
        ripPostDroite2: formState.ripPostDroite2,
        ripPostGauche: formState.ripPostGauche,
        ripPostGauche2: formState.ripPostGauche2,
        maxillaireOverbite: { ...formState.maxillaireOverbite },
        mandibulaireOverbite: { ...formState.mandibulaireOverbite },
        maxillaireSupraclusion: { ...formState.maxillaireSupraclusion },
        mandibulaireSupraclusion: { ...formState.mandibulaireSupraclusion },
        autreBeance: formState.autreBeance,
        autreSupraclusion: formState.autreSupraclusion,
        biteRamps: formState.biteRamps,
        biteRampsOptions: formState.biteRampsOptions,
        milieux: formState.milieux,
        milieuxOptions: formState.milieuxOptions,
        milieuxTeeth: Array.from(formState.milieuxTeeth), // Removed .map(convertToothNumberToNotation)
        extractions: formState.extractions,
        extractionsTeeth: Array.from(formState.extractionsTeeth), // Removed .map(convertToothNumberToNotation)
        specialInstructions: formState.specialInstructions,
      };
      /*console.log("Returning prescription data:", data);*/
      return data;
    },
    setActiveSection: (section: string) => {
      setActiveSection(section);
    }
  } as unknown as HTMLDivElement));

  const handleSectionModification = (step: any, section: string) => {
    if (onModify) {
      onModify(step, section);
    }
    setActiveSection(section);
  };

  return (
    <div className={`${styles.formStep} ${styles.active}`}>
      {/* Current user role: {userRole} */}

      <div className={`${styles.sectionHeader} ${styles.sub}`}>
        <div className={styles.subsectionHeader}>
          <img src={prescription3.src} alt="" />
          <h2>Prescription</h2>
        </div>
        <h2 className={styles.patientType}>Type de patient : {patientDetails.category || 'Non spécifié'}</h2>
      </div>

      <div className={styles.scrollableContent}>
        <DiamondCard className="mb-6">
          <DiamondCardHeader>
            <DiamondCardTitle>Anamnèse</DiamondCardTitle>
          </DiamondCardHeader>
          <DiamondCardContent>
            <div className={styles.dentalChartContainer}>
              <img
                className={styles.perimg}
                // @ts-ignore
                src={anamnese}
                alt="Anamnèse"
                onClick={() => setShowDentalChart(true)}
                style={{ cursor: 'pointer' }}
                title="Cliquez pour ouvrir le tableau dentaire"
              />
              {showChartPreview && chartImage && (
                <div className={styles.chartPreview}>
                  <img
                    src={chartImage}
                    alt="Tableau dentaire"
                    className={styles.previewImage}
                    onClick={() => setShowDentalChart(true)}
                  />
                </div>
              )}
            </div>
          </DiamondCardContent>
        </DiamondCard>

        {/* Modal popup for dental chart */}
        {showDentalChart && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContainer} id="custom-dental-modal">
              <button
                className={styles.closeButton}
                onClick={() => setShowDentalChart(false)}
              >
                ✕
              </button>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  Tableau dentaire
                </h2>
                <p className={styles.modalSubtitle}>
                  Cliquez sur une dent pour afficher les options
                </p>
              </div>
              <div
                className={styles.chartContainer}
                ref={chartContainerRef}
                id="dental-chart-container"
              >
                <DentalChart
                  ref={dentalChartRef}
                  initialStates={savedTeethStates}
                  onSave={(mods, states) => {
                    setModifications(mods);
                    setSavedTeethStates(states);
                  }}
                />
              </div>
              <div className={styles.modalFooter}>
                <div className={styles.footerContent}>
                  <div className={styles.footerButtons}>
                    <Button
                      onClick={async () => {
                        // Appeler la fonction handleSave à travers la référence
                        if (
                          dentalChartRef.current &&
                          dentalChartRef.current.handleSave
                        ) {
                          dentalChartRef.current.handleSave();
                        }

                        // Capturer le tableau dentaire en image avant de fermer le dialogue
                        try {
                          const dentalChartElement = document.getElementById('dental-chart-container');
                          if (dentalChartElement) {
                            /*console.log("Génération de la capture d'écran...");*/
                            // Créer une copie de l'élément pour la capture et 
                            // remplacer les couleurs oklch par des couleurs RGB
                            const clonedElement = dentalChartElement.cloneNode(true) as HTMLElement;
                            document.body.appendChild(clonedElement);
                            clonedElement.style.position = 'absolute';
                            clonedElement.style.left = '-9999px';
                            clonedElement.style.backgroundColor = '#ffffff';

                            // Convertir toutes les couleurs oklch en RGB
                            const oklchElements = clonedElement.querySelectorAll('[style*="oklch"]');
                            oklchElements.forEach((el) => {
                              // Remplacer les couleurs oklch par des couleurs standard
                              const element = el as HTMLElement;
                              element.style.backgroundColor = '#3B82F6'; // blue-500
                              element.style.color = '#1E3A8A'; // blue-900
                            });

                            // Remplacer les classes de couleur Tailwind
                            const blueElements = clonedElement.querySelectorAll('[class*="blue-"]');
                            blueElements.forEach((el) => {
                              const element = el as HTMLElement;
                              element.style.backgroundColor = '#EFF6FF'; // blue-50
                              element.style.color = '#1E3A8A'; // blue-900
                            });

                            const canvas = await html2canvas(clonedElement, {
                              backgroundColor: '#ffffff',
                              scale: 2, // Pour une meilleure qualité
                              logging: true,
                              useCORS: true,
                              allowTaint: true,
                              onclone: (doc, element) => {
                                // Fonction supplémentaire pour traiter le clone
                                /*console.log("Document cloné pour capture");*/
                              }
                            });

                            // Nettoyer l'élément cloné
                            document.body.removeChild(clonedElement);

                            // Convertir en URL de données PNG
                            const dataUrl = canvas.toDataURL('image/png');
                            setChartImage(dataUrl);
                            /*console.log("Capture d'écran générée avec succès!");*/

                            // Télécharger automatiquement l'image
                            const link = document.createElement('a');
                            link.download = `tableau-dentaire-${new Date().toISOString().split('T')[0]}.png`;
                            link.href = dataUrl;
                            link.click();
                          }
                        } catch (error) {
                          console.error("Erreur lors de la capture d'écran:", error);
                        }

                        // Fermer le dialogue et afficher la grille textuelle
                        setShowDentalChart(false);
                        setShowTextualGrid(true);
                        setShowChartPreview(true);
                      }}
                      className={styles.submitButton}
                      size="lg"
                    >
                      Valider les modifications
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>)}
      </div>
      <div className={styles.prescriptionForm}>
        <DiamondCard id="arcade" className={`mb-6 ${activeSection === 'arcade' ? 'ring-2 ring-blue-500' : ''}`}>
          <DiamondCardHeader>
            <DiamondCardTitle>1. Arcade(s) à traiter</DiamondCardTitle>
          </DiamondCardHeader>
          <DiamondCardContent>
            <div className={`${styles.radioGroup} ${styles.arcadeRadioGroup}`}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="arcade"
                  value="both"
                  checked={formState.arcade === 'both'}
                  onChange={() => handleRadioChange('arcade', 'both')}
                />
                <span>Les deux arcades</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="arcade"
                  value="maxillaire"
                  checked={formState.arcade === 'maxillaire'}
                  onChange={() => handleRadioChange('arcade', 'maxillaire')}
                />
                <span>Maxillaire</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="arcade"
                  value="mandibulaire"
                  checked={formState.arcade === 'mandibulaire'}
                  onChange={() => handleRadioChange('arcade', 'mandibulaire')}
                />
                <span>Mandibulaire</span>
              </label>
            </div>
          </DiamondCardContent>
        </DiamondCard>

        <DiamondCard id="restrictions" className={`mb-6 ${activeSection === 'restrictions' ? 'ring-2 ring-blue-500' : ''}`}>
          <DiamondCardHeader>
            <DiamondCardTitle>2. Restrictions des mouvements dentaires (ex. bridges, dents ankylosées, implants, etc.)</DiamondCardTitle>
          </DiamondCardHeader>
          <DiamondCardContent>
            <div className={styles.radioGroup}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="restrictions"
                  value="none"
                  checked={formState.restrictions === 'none'}
                  onChange={(e) => handleRadioChange('restrictions', e.target.value)}
                />
                <span>Aucune (déplacer toutes les dents)</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="restrictions"
                  value="some"
                  checked={formState.restrictions === 'some'}
                  onChange={(e) => handleRadioChange('restrictions', e.target.value)}
                />
                <span>Ne pas déplacer ces dents</span>
              </label>
            </div>

            {/* Upper Teeth */}
            <div className={styles.teethGrid}>
              <div className={styles.teethRow}>
                <div className={styles.teethNumbers}>
                  {upperTeethMapping.map((num) => (
                    <span key={`restriction-upper-${num}`}>{num}</span>
                  ))}
                </div>
                <div className={styles.teethBoxes}>
                  {upperTeethMapping.map((num) => (
                    <div className={styles.toothBox} key={`restriction-box-upper-${num}`}>
                      <input
                        type="checkbox"
                        disabled={formState.restrictions !== 'some'}
                        checked={formState.restrictionsTeeth.has(num)}
                        onChange={() => handleTeethSelection(num, 'restrictionsTeeth')}
                      />
                    </div>
                  ))}
                  <div className={styles.verticalLine}></div>
                </div>
              </div>

              <div className={styles.jawLabels}>
                <span className={styles.labelD}>D</span>
                <div className={styles.horizontalLine}></div>
                <span className={styles.labelG}>G</span>
              </div>

              {/* Lower Teeth */}
              <div className={styles.teethRow}>
                <div className={styles.teethNumbers}>
                  {lowerTeethMapping.map((num) => (
                    <span key={`restriction-lower-${num}`}>{num}</span>
                  ))}
                </div>
                <div className={styles.teethBoxes}>
                  {lowerTeethMapping.map((num) => (
                    <div className={styles.toothBox} key={`restriction-box-lower-${num}`}>
                      <input
                        type="checkbox"
                        disabled={formState.restrictions !== 'some'}
                        checked={formState.restrictionsTeeth.has(num)}
                        onChange={() => handleTeethSelection(num, 'restrictionsTeeth')}
                      />
                    </div>
                  ))}
                  <div className={styles.verticalLine}></div>
                </div>
              </div>
            </div>
          </DiamondCardContent>
        </DiamondCard>
        <DiamondCard id="taquets" className={`mb-6 ${activeSection === 'taquets' ? 'ring-2 ring-blue-500' : ''}`}>
          <DiamondCardHeader>
            <DiamondCardTitle>3. Taquets (Spécifier les taquets, voir les Préférences Cliniques)</DiamondCardTitle>
          </DiamondCardHeader>
          <DiamondCardContent>
            <div className={styles.radioGroup}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="taquets"
                  value="none"
                  checked={formState.taquets === 'none'}
                  onChange={(e) => handleRadioChange('taquets', e.target.value)}
                />
                <span>Placer des taquets si nécessaire</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="taquets"
                  value="some"
                  checked={formState.taquets === 'some'}
                  onChange={(e) => handleRadioChange('taquets', e.target.value)}
                />
                <span>Ne pas placer de taquets sur ces dents</span>
              </label>
            </div>

            <div className={styles.selectAll}>
              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  checked={formState.taquetsTeeth.size === (upperTeethMapping.length + lowerTeethMapping.length)}
                  onChange={() => handleSelectAllTeeth('taquetsTeeth')}
                  disabled={formState.taquets !== 'some'}
                />
                <span>Tout sélectionner</span>
              </label>
            </div>

            {/* Upper Teeth */}
            <div className={styles.teethGrid}>
              <div className={styles.teethRow}>
                <div className={styles.teethNumbers}>
                  {upperTeethMapping.map((num) => (
                    <span key={`taquets-upper-${num}`}>{num}</span>
                  ))}
                </div>
                <div className={styles.teethBoxes}>
                  {upperTeethMapping.map((num) => (
                    <div className={styles.toothBox} key={`taquets-box-upper-${num}`}>
                      <input
                        type="checkbox"
                        disabled={formState.taquets !== 'some'}
                        checked={formState.taquetsTeeth.has(num)}
                        onChange={() => handleTeethSelection(num, 'taquetsTeeth')}
                      />
                    </div>
                  ))}
                  <div className={styles.verticalLine}></div>
                </div>
              </div>

              <div className={styles.jawLabels}>
                <span className={styles.labelD}>D</span>
                <div className={styles.horizontalLine}></div>
                <span className={styles.labelG}>G</span>
              </div>

              {/* Lower Teeth */}
              <div className={styles.teethRow}>
                <div className={styles.teethNumbers}>
                  {lowerTeethMapping.map((num) => (
                    <span key={`taquets-lower-${num}`}>{num}</span>
                  ))}
                </div>
                <div className={styles.teethBoxes}>
                  {lowerTeethMapping.map((num) => (
                    <div className={styles.toothBox} key={`taquets-box-lower-${num}`}>
                      <input
                        type="checkbox"
                        disabled={formState.taquets !== 'some'}
                        checked={formState.taquetsTeeth.has(num)}
                        onChange={() => handleTeethSelection(num, 'taquetsTeeth')}
                      />
                    </div>
                  ))}
                  <div className={styles.verticalLine}></div>
                </div>
              </div>
            </div>
          </DiamondCardContent>
        </DiamondCard>
        {userRole === 'orthodontiste' && (
          <>
            <DiamondCard id="rapportAP" className={`mb-6 ${activeSection === 'rapportAP' ? 'ring-2 ring-blue-500' : ''}`}>
              <DiamondCardHeader>
                <DiamondCardTitle>4. Rapport antéro-postérieur</DiamondCardTitle>
              </DiamondCardHeader>
              <DiamondCardContent>
                <table className={styles.apTable}>
                  <tr>
                    <th></th>
                    <th>D</th>
                    <th>G</th>
                  </tr>
                  <tr>
                    <td className={styles.td1}>Conserver la situation actuelle</td>
                    <td>
                      <input
                        type="radio"
                        name="rapportAP_D"
                        value="conserver"
                        checked={formState.rapportAP.D === 'conserver'}
                        onChange={(e) => handleRapportAPChange('D', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name="rapportAP_G"
                        value="conserver"
                        checked={formState.rapportAP.G === 'conserver'}
                        onChange={(e) => handleRapportAPChange('G', e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td1}>Améliorer la relation canine uniquement</td>
                    <td>
                      <input
                        type="radio"
                        name="rapportAP_D"
                        value="ameliorer_canine"
                        checked={formState.rapportAP.D === 'ameliorer_canine'}
                        onChange={(e) => handleRapportAPChange('D', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name="rapportAP_G"
                        value="ameliorer_canine"
                        checked={formState.rapportAP.G === 'ameliorer_canine'}
                        onChange={(e) => handleRapportAPChange('G', e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td1}>Améliorer la relation canine & molaire</td>
                    <td>
                      <input
                        type="radio"
                        name="rapportAP_D"
                        value="ameliorer_both"
                        checked={formState.rapportAP.D === 'ameliorer_both'}
                        onChange={(e) => handleRapportAPChange('D', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name="rapportAP_G"
                        value="ameliorer_both"
                        checked={formState.rapportAP.G === 'ameliorer_both'}
                        onChange={(e) => handleRapportAPChange('G', e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td1}>Correction en Classe I (canine et molaire)</td>
                    <td>
                      <input
                        type="radio"
                        name="rapportAP_D"
                        value="correction"
                        checked={formState.rapportAP.D === 'correction'}
                        onChange={(e) => handleRapportAPChange('D', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name="rapportAP_G"
                        value="correction"
                        checked={formState.rapportAP.G === 'correction'}
                        onChange={(e) => handleRapportAPChange('G', e.target.value)}
                      />
                    </td>
                  </tr>
                </table>

                <div className={styles.optionsSection}>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name="rapportAP_options"
                        value="options"
                        checked={formState.rapportAP.options === 'options'}
                        onChange={() => handleRapportAPRadioChange('options')}
                      />
                      <span>Options thérapeutiques (Si plus d'une option est sélectionnée, indiquer la quantité et l'ordre dans les Instructions Spéciales)</span>
                    </label>

                    <div className={`${styles.nestedOptions} ${formState.rapportAP.options !== 'options' ? styles.disabled : ''}`}>
                      <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxOption}>
                          <input
                            type="checkbox"
                            name="rip"
                            checked={formState.rapportAP.rip}
                            onChange={() => handleRapportAPOptionChange('rip')}
                            disabled={formState.rapportAP.options !== 'options'}
                          />
                          <span>RIP postérieure</span>
                        </label>
                        <div className={`${styles.nestedOptions} ${!formState.rapportAP.rip ? styles.disabled : ''}`}>
                          <p>Precision Cuts - peuvent compromettre la résistance et la durabilité</p>
                          <div className={styles.radioGroup}>
                            <label className={styles.radioOption}>
                              <input
                                type="radio"
                                name="ripPrecision"
                                value="oui"
                                checked={formState.rapportAP.ripPrecision === 'oui'}
                                onChange={(e) => handleRapportAPPrecisionChange('ripPrecision', e.target.value)}
                                disabled={!formState.rapportAP.rip || formState.rapportAP.options !== 'options'}
                              />
                              <span>Oui (Spécifier dans l'interface des Precision Cuts)</span>
                            </label>
                            <label className={styles.radioOption}>
                              <input
                                type="radio"
                                name="ripPrecision"
                                value="non"
                                checked={formState.rapportAP.ripPrecision === 'non'}
                                onChange={(e) => handleRapportAPPrecisionChange('ripPrecision', e.target.value)}
                                disabled={!formState.rapportAP.rip || formState.rapportAP.options !== 'options'}
                              />
                              <span>Non</span>
                            </label>
                          </div>
                        </div>

                        <label className={styles.checkboxOption}>
                          <input
                            type="checkbox"
                            name="simulation"
                            checked={formState.rapportAP.simulation}
                            onChange={() => handleRapportAPOptionChange('simulation')}
                            disabled={formState.rapportAP.options !== 'options'}
                          />
                          <span>Simulation de correction Classe II/III (Élastiques exigés) </span>
                        </label>

                        <div className={`${styles.nestedOptions} ${!formState.rapportAP.simulation ? styles.disabled : ''}`}>
                          <p>Precision Cuts - peuvent compromettre la résistance et la durabilité</p>
                          <div className={styles.radioGroup}>
                            <label className={styles.radioOption}>
                              <input
                                type="radio"
                                name="simulationPrecision"
                                value="oui"
                                checked={formState.rapportAP.simulationPrecision === 'oui'}
                                onChange={(e) => handleRapportAPPrecisionChange('simulationPrecision', e.target.value)}
                                disabled={!formState.rapportAP.simulation || formState.rapportAP.options !== 'options'}
                              />
                              <span>Oui (Spécifier dans l'interface des Precision Cuts)</span>
                            </label>
                            <label className={styles.radioOption}>
                              <input
                                type="radio"
                                name="simulationPrecision"
                                value="non"
                                checked={formState.rapportAP.simulationPrecision === 'non'}
                                onChange={(e) => handleRapportAPPrecisionChange('simulationPrecision', e.target.value)}
                                disabled={!formState.rapportAP.simulation || formState.rapportAP.options !== 'options'}
                              />
                              <span>Non</span>
                            </label>
                          </div>
                        </div>

                        <label className={styles.checkboxOption}>
                          <input
                            type="checkbox"
                            name="distalisation"
                            checked={formState.rapportAP.distalisation}
                            onChange={() => handleRapportAPOptionChange('distalisation')}
                            disabled={formState.rapportAP.options !== 'options'}
                          />
                          <span>Distalisation séquentielle optimisée</span>
                        </label>
                      </div>
                    </div>

                    <label className={`${styles.radioOption} ${patientDetails.category !== 'adolescent' ? styles.disabled : ''}`}>
                      <input
                        type="radio"
                        name="rapportAP_options"
                        value="avanceeMandibulaire"
                        checked={formState.rapportAP.options === 'avanceeMandibulaire'}
                        onChange={() => handleRapportAPRadioChange('avanceeMandibulaire')}
                        disabled={patientDetails.category !== 'adolescent'}
                      />
                      <span>Avancée mandibulaire (AM) (L'utilisation de préférences cliniques sera limitée pendant les étapes d'AM)</span>
                    </label>
                  </div>
                </div>
              </DiamondCardContent>
            </DiamondCard>
            <DiamondCard id="overjet" className={`mb-6 ${activeSection === 'overjet' ? 'ring-2 ring-blue-500' : ''}`}>
              <DiamondCardHeader>
                <DiamondCardTitle>5. Overjet</DiamondCardTitle>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className={styles.radioGroup}>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="Overjet"
                      value="realiser"
                      onChange={(e) => handleOverjetChange(e.target.value)}
                    />
                    <span>Réaliser les autres objectifs et j'évaluerai le surplomb</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="Overjet"
                      value="maintenir"
                      onChange={(e) => handleOverjetChange(e.target.value)}
                    />
                    <span>Maintenir le surplomb d'origine (IPR peut être nécessaire)</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="Overjet"
                      value="ameliorer"
                      onChange={(e) => handleOverjetChange(e.target.value)}
                    />
                    <span>Améliorer le surplomb créé par IPR</span>
                  </label>
                </div>
              </DiamondCardContent>
            </DiamondCard>
            <DiamondCard id="overbite" className={`mb-6 ${activeSection === 'overbite' ? 'ring-2 ring-blue-500' : ''}`}>
              <DiamondCardHeader>
                <DiamondCardTitle>6. Overbite</DiamondCardTitle>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className={styles.radioGroup}>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="Overbite"
                      value="realiser"
                      checked={formState.overbite === 'realiser'}
                      onChange={(e) => handleRadioChange('overbite', e.target.value)}
                    />
                    <span>Réaliser les autres objectifs et j'évaluerai le recouvrement</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="Overbite"
                      value="maintenir"
                      checked={formState.overbite === 'maintenir'}
                      onChange={(e) => handleRadioChange('overbite', e.target.value)}
                    />
                    <span>Maintenir le recouvrement d'origine (IPR peut être nécessaire)</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="Overbite"
                      value="corriger_beance"
                      checked={formState.overbite === 'corriger_beance'}
                      onChange={(e) => handleRadioChange('overbite', e.target.value)}
                    />
                    <span>Corriger la béance</span>
                  </label>
                  <div className={styles.subOptions}>
                    <label className={styles.checkboxOption}>
                      <input
                        type="checkbox"
                        name="maxillaire"
                        checked={formState.maxillaireOverbite.selected}
                        onChange={() => handleCheckboxChange('maxillaireOverbite', 'selected')}
                        disabled={formState.overbite !== 'corriger_beance'}
                      />
                      <span>Maxillaire</span>
                    </label>
                    <div className={styles.nestedOptions}>
                      <label className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          name="egressionAnterieure"
                          checked={formState.maxillaireOverbite.egressionAnterieure}
                          onChange={() => handleNestedCheckboxChange('maxillaireOverbite', 'egressionAnterieure')}
                          disabled={!formState.maxillaireOverbite.selected || formState.overbite !== 'corriger_beance'}
                        />
                        <span>Égression des dents antérieures</span>
                      </label>
                      <label className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          name="ingressionPosterieure"
                          checked={formState.maxillaireOverbite.ingressionPosterieure}
                          onChange={() => handleNestedCheckboxChange('maxillaireOverbite', 'ingressionPosterieure')}
                          disabled={!formState.maxillaireOverbite.selected || formState.overbite !== 'corriger_beance'}
                        />
                        <span>Ingression des dents postérieures</span>
                      </label>
                    </div>

                    <label className={styles.checkboxOption}>
                      <input
                        type="checkbox"
                        name="mandibulaire"
                        checked={formState.mandibulaireOverbite.selected}
                        onChange={() => handleCheckboxChange('mandibulaireOverbite', 'selected')}
                        disabled={formState.overbite !== 'corriger_beance'}
                      />
                      <span>Mandibulaire</span>
                    </label>
                    <div className={styles.nestedOptions}>
                      <label className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          name="egressionAnterieure"
                          checked={formState.mandibulaireOverbite.egressionAnterieure}
                          onChange={() => handleNestedCheckboxChange('mandibulaireOverbite', 'egressionAnterieure')}
                          disabled={!formState.mandibulaireOverbite.selected || formState.overbite !== 'corriger_beance'}
                        />
                        <span>Égression des dents antérieures</span>
                      </label>
                      <label className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          name="ingressionPosterieure"
                          checked={formState.mandibulaireOverbite.ingressionPosterieure}
                          onChange={() => handleNestedCheckboxChange('mandibulaireOverbite', 'ingressionPosterieure')}
                          disabled={!formState.mandibulaireOverbite.selected || formState.overbite !== 'corriger_beance'}
                        />
                        <span>Ingression des dents postérieures</span>
                      </label>
                    </div>
                  </div>

                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="Overbite"
                      value="corriger_supraclusion"
                      checked={formState.overbite === 'corriger_supraclusion'}
                      onChange={(e) => handleRadioChange('overbite', e.target.value)}
                    />
                    <span>Corriger la supraclusion</span>
                  </label>
                  <div className={styles.subOptions}>
                    <label className={styles.checkboxOption}>
                      <input
                        type="checkbox"
                        name="maxillaireSupraclusion"
                        checked={formState.maxillaireSupraclusion?.selected}
                        onChange={() => handleCheckboxChange('maxillaireSupraclusion', 'selected')}
                        disabled={formState.overbite !== 'corriger_supraclusion'}
                      />
                      <span>Maxillaire</span>
                    </label>
                    <div className={styles.nestedOptions}>
                      <label className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          name="egressionAnterieureSupraclusion"
                          checked={formState.maxillaireSupraclusion?.egressionAnterieure}
                          onChange={() => handleNestedCheckboxChange('maxillaireSupraclusion', 'egressionAnterieure')}
                          disabled={!formState.maxillaireSupraclusion?.selected || formState.overbite !== 'corriger_supraclusion'}
                        />
                        <span>Égression des dents antérieures</span>
                      </label>
                      <label className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          name="ingressionPosterieureSupraclusion"
                          checked={formState.maxillaireSupraclusion?.ingressionPosterieure}
                          onChange={() => handleNestedCheckboxChange('maxillaireSupraclusion', 'ingressionPosterieure')}
                          disabled={!formState.maxillaireSupraclusion?.selected || formState.overbite !== 'corriger_supraclusion'}
                        />
                        <span>Ingression des dents postérieures</span>
                      </label>
                    </div>

                    <label className={styles.checkboxOption}>
                      <input
                        type="checkbox"
                        name="mandibulaireSupraclusion"
                        checked={formState.mandibulaireSupraclusion?.selected}
                        onChange={() => handleCheckboxChange('mandibulaireSupraclusion', 'selected')}
                        disabled={formState.overbite !== 'corriger_supraclusion'}
                      />
                      <span>Mandibulaire</span>
                    </label>
                    <div className={styles.nestedOptions}>
                      <label className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          name="egressionAnterieureSupraclusion"
                          checked={formState.mandibulaireSupraclusion?.egressionAnterieure}
                          onChange={() => handleNestedCheckboxChange('mandibulaireSupraclusion', 'egressionAnterieure')}
                          disabled={!formState.mandibulaireSupraclusion?.selected || formState.overbite !== 'corriger_supraclusion'}
                        />
                        <span>Égression des dents antérieures</span>
                      </label>
                      <label className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          name="ingressionPosterieureSupraclusion"
                          checked={formState.mandibulaireSupraclusion?.ingressionPosterieure}
                          onChange={() => handleNestedCheckboxChange('mandibulaireSupraclusion', 'ingressionPosterieure')}
                          disabled={!formState.mandibulaireSupraclusion?.selected || formState.overbite !== 'corriger_supraclusion'}
                        />
                        <span>Ingression des dents postérieures</span>
                      </label>
                    </div>
                  </div>
                </div>
              </DiamondCardContent>
            </DiamondCard>
            <DiamondCard id="biteRamps" className={`mb-6 ${activeSection === 'biteRamps' ? 'ring-2 ring-blue-500' : ''}`}>
              <DiamondCardHeader>
                <DiamondCardTitle>7. Bite ramps</DiamondCardTitle>
              </DiamondCardHeader>
              <DiamondCardContent>
                <div className={styles.radioGroup}>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="bite"
                      value="auto"
                      checked={formState.biteRamps === 'auto'}
                      onChange={(e) => handleBiteRampsChange(e.target.value)}
                    />
                    <span>Placer automatiquement les rampes d'occlusion chaque fois que l'ingression des incisives inférieures est supérieure à 1.5 mm</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="bite"
                      value="manual"
                      checked={formState.biteRamps === 'manual'}
                      onChange={(e) => handleBiteRampsChange(e.target.value)}
                    />
                    <span>Placer des Rampes d'Occlusion sur la face palatine de ces dents maxillaires</span>
                  </label>
                  <div className={styles.nestedOptions}>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name="maxillaire-option"
                        checked={formState.biteRampsOptions.includes('incisives')}
                        onChange={() => handleBiteRampsOptionChange('incisives')}
                        disabled={formState.biteRamps !== 'manual'}
                      />
                      <span>Incisives</span>
                    </label>
                    <p>Remarque:le positionnement des Rampes d'Occlusion remplacera les fonctionnalités d'ingression antérieure maxillaire
                      (Zones de Pression), si nécessaire.</p>
                    <div className={styles.nestedOptions}>
                      <label className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          checked={formState.biteRampsOptions.includes('incisivesCentrales')}
                          onChange={() => handleBiteRampsOptionChange('incisivesCentrales')}
                          disabled={!formState.biteRampsOptions.includes('incisives') || formState.biteRamps !== 'manual'}
                        />
                        <span>Incisives centrales</span>
                      </label>
                      <label className={styles.checkboxOption}>
                        <input
                          type="checkbox"
                          checked={formState.biteRampsOptions.includes('incisivesLaterales')}
                          onChange={() => handleBiteRampsOptionChange('incisivesLaterales')}
                          disabled={!formState.biteRampsOptions.includes('incisives') || formState.biteRamps !== 'manual'}
                        />
                        <span>Incisives latérales</span>
                      </label>
                    </div>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name="maxillaire-option"
                        checked={formState.biteRampsOptions.includes('canines')}
                        onChange={() => handleBiteRampsOptionChange('canines')}
                        disabled={formState.biteRamps !== 'manual'}
                      />
                      <span>Canines</span>
                    </label>
                  </div>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="bite"
                      value="none"
                      checked={formState.biteRamps === 'none'}
                      onChange={(e) => handleBiteRampsChange(e.target.value)}
                    />
                    <span>Aucun</span>
                  </label>
                  <p>Remarque : dans certains cas, le positionnement des rampes d'occlusion peut s'avérer impossible en raison
                    d'un surplomb excessif.</p>
                </div>
              </DiamondCardContent>
            </DiamondCard>
          </>
        )}

        <DiamondCard id="milieux" className={`mb-6 ${activeSection === 'milieux' ? 'ring-2 ring-blue-500' : ''}`}>
          <DiamondCardHeader>
            <DiamondCardTitle>{userRole === 'orthodontiste' ? '8.' : '4.'} Milieux inter-incisifs</DiamondCardTitle>
          </DiamondCardHeader>
          <DiamondCardContent>
            <div className={`${styles.radioGroup} ${styles.milieuxRadioGroup}`}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="milieux"
                  value="realiser"
                  checked={formState.milieux === 'realiser'}
                  onChange={() => handleMilieuxChange('realiser')}
                />
                <span>Réaliser les autres objectifs et j'évaluerai les milieux inter-incisifs</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="milieux"
                  value="maintenir"
                  checked={formState.milieux === 'maintenir'}
                  onChange={() => handleMilieuxChange('maintenir')}
                />
                <span>Maintenir les milieux inter-incisifs d'origine (IPR peut être nécessaire)</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="milieux"
                  value="ameliorer"
                  checked={formState.milieux === 'ameliorer'}
                  onChange={() => handleMilieuxChange('ameliorer')}
                />
                <span>Améliorer les milieux inter-incisifs par IPR</span>
              </label>
            </div>
            <div className={styles.nestedOptions}>
              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  name="milieuxMaxillaire"
                  checked={formState.milieuxOptions.includes('maxillaire')}
                  onChange={(e) => handleMilieuxOptionChange('maxillaire', e.target.checked)}
                  disabled={formState.milieux !== 'ameliorer'}
                />
                <span>Maxillaire</span>
              </label>
              <div className={styles.nestedOptions}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="maxillaireDirection"
                    value="droite"
                    checked={formState.milieuxOptions.includes('maxillaireDirection-droite')}
                    onChange={(e) => handleMilieuxOptionChange('maxillaireDirection-droite', e.target.checked)}
                    disabled={!formState.milieuxOptions.includes('maxillaire') || formState.milieux !== 'ameliorer'}
                  />
                  <span>Vers la droite</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="maxillaireDirection"
                    value="gauche"
                    checked={formState.milieuxOptions.includes('maxillaireDirection-gauche')}
                    onChange={(e) => handleMilieuxOptionChange('maxillaireDirection-gauche', e.target.checked)}
                    disabled={!formState.milieuxOptions.includes('maxillaire') || formState.milieux !== 'ameliorer'}
                  />
                  <span>Vers la gauche</span>
                </label>
              </div>
            </div>
            <div className={styles.nestedOptions}>
              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  name="milieuxMandibulaire"
                  checked={formState.milieuxOptions.includes('mandibulaire')}
                  onChange={(e) => handleMilieuxOptionChange('mandibulaire', e.target.checked)}
                  disabled={formState.milieux !== 'ameliorer'}
                />
                <span>Mandibulaire</span>
              </label>
              <div className={styles.nestedOptions}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="mandibulaireDirection"
                    value="droite"
                    checked={formState.milieuxOptions.includes('mandibulaireDirection-droite')}
                    onChange={(e) => handleMilieuxOptionChange('mandibulaireDirection-droite', e.target.checked)}
                    disabled={!formState.milieuxOptions.includes('mandibulaire') || formState.milieux !== 'ameliorer'}
                  />
                  <span>Vers la droite</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="mandibulaireDirection"
                    value="gauche"
                    checked={formState.milieuxOptions.includes('mandibulaireDirection-gauche')}
                    onChange={(e) => handleMilieuxOptionChange('mandibulaireDirection-gauche', e.target.checked)}
                    disabled={!formState.milieuxOptions.includes('mandibulaire') || formState.milieux !== 'ameliorer'}
                  />
                  <span>Vers la gauche</span>
                </label>
              </div>
            </div>
          </DiamondCardContent>
        </DiamondCard>
        {userRole === 'orthodontiste' && (
          <DiamondCard id="extractions" className={`mb-6 ${activeSection === 'extractions' ? 'ring-2 ring-blue-500' : ''}`}>
            <DiamondCardHeader>
              <DiamondCardTitle>9. Articulé croisé postérieur (si présent)</DiamondCardTitle>
            </DiamondCardHeader>
            <DiamondCardContent>
              <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                  <input type="radio" name="Articule" value="none"
                    onChange={(e) => handleRadioChange('extractions', e.target.value)}
                    className={styles.radioInput}
                  />
                  <span>Ne pas corriger</span>
                </label>
                <label className={styles.radioOption}>
                  <input type="radio" name="Articule" value="some"
                    checked={formState.extractions === 'some'}
                    onChange={(e) => handleRadioChange('extractions', e.target.value)}
                    className={styles.radioInput}
                  />
                  <span>Corriger</span>
                </label>
              </div>
            </DiamondCardContent>
          </DiamondCard>
        )}
        <DiamondCard id="Espacement" className={`mb-6 ${activeSection === 'specialInstructions' ? 'ring-2 ring-blue-500' : ''}`}>
          <DiamondCardHeader>
            <DiamondCardTitle>{userRole === 'orthodontiste' ? '10.' : '5.'}Espacement et Encombrement (DDM)</DiamondCardTitle>
          </DiamondCardHeader>
          <DiamondCardContent>
            <div className={styles.resolutionIndented}>
              <h3>Espacement</h3>
              <div className={styles.radioGroup} style={{ marginBottom: '20px' }}>
                <label className={styles.radioOption} style={{ marginBottom: '10px' }}>
                  <input
                    type="radio"
                    name="espacement"
                    value="fermer"
                    checked={formState.espacement === 'fermer'}
                    onChange={(e) => handleRadioChange('espacement', e.target.value)}
                  />
                  <span>Fermer tous les espaces</span>
                </label>
                <label className={styles.radioOption} style={{ marginBottom: '10px' }}>
                  <input
                    type="radio"
                    name="espacement"
                    value="laisser"
                    checked={formState.espacement === 'laisser'}
                    onChange={(e) => handleRadioChange('espacement', e.target.value)}
                  />
                  <span>Laisser des espaces spécifiques</span>
                </label>
                {formState.espacement === 'laisser' && (
                  <div style={{
                    width: '100%',
                    marginTop: '10px',
                    marginBottom: '15px'
                  }}>
                    <input
                      type="text"
                      placeholder="Indiquez les espaces spécifiques"
                      value={formState.especesSpecifiques || ''}
                      onChange={(e) => handleEspacementOptionChange('especesSpecifiques', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        color: '#333',
                        marginBottom: '10px'
                      }}
                    />
                  </div>
                )}
              </div>
              <h3 style={{ marginTop: '30px' }}>Encombrement</h3>
              <div>
                <h4 className={styles.resolutionSubtitle}>Résolution au maxillaire</h4>
                <table className={styles.apTable}>
                  <tbody>
                    <tr>
                      <td className={styles.td1}>Expansion</td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="expansion"
                            value="Oui"
                            checked={formState.expansion === 'Oui'}
                            onChange={(e) => handleEspacementOptionChange('expansion', e.target.value)}
                          />
                          <span>Oui</span>
                        </span>
                      </td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="expansion"
                            value="siNecessaire"
                            checked={formState.expansion === 'siNecessaire'}
                            onChange={(e) => handleEspacementOptionChange('expansion', e.target.value)}
                          />
                          <span>Si nécessaire</span>
                        </span>
                      </td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="expansion"
                            value="Non"
                            checked={formState.expansion === 'Non'}
                            onChange={(e) => handleEspacementOptionChange('expansion', e.target.value)}
                          />
                          <span>Non</span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.td1}>Vestibuloversion</td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="vestibuloversion"
                            value="Oui"
                            checked={formState.vestibuloversion === 'Oui'}
                            onChange={(e) => handleEspacementOptionChange('vestibuloversion', e.target.value)}
                          />
                          <span>Oui</span>
                        </span>
                      </td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="vestibuloversion"
                            value="siNecessaire"
                            checked={formState.vestibuloversion === 'siNecessaire'}
                            onChange={(e) => handleEspacementOptionChange('vestibuloversion', e.target.value)}
                          />
                          <span>Si nécessaire</span>
                        </span>
                      </td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="vestibuloversion"
                            value="Non"
                            checked={formState.vestibuloversion === 'Non'}
                            onChange={(e) => handleEspacementOptionChange('vestibuloversion', e.target.value)}
                          />
                          <span>Non</span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.td1}>RIP - Antérieure</td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="ripAnt"
                            value="Oui"
                            checked={formState.ripAnt === 'Oui'}
                            onChange={(e) => handleEspacementOptionChange('ripAnt', e.target.value)}
                          />
                          <span>Oui</span>
                        </span>
                      </td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="ripAnt"
                            value="siNecessaire"
                            checked={formState.ripAnt === 'siNecessaire'}
                            onChange={(e) => handleEspacementOptionChange('ripAnt', e.target.value)}
                          />
                          <span>Si nécessaire</span>
                        </span>
                      </td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="ripAnt"
                            value="Non"
                            checked={formState.ripAnt === 'Non'}
                            onChange={(e) => handleEspacementOptionChange('ripAnt', e.target.value)}
                          />
                          <span>Non</span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.td1}>RIP - Postérieure à droite</td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="ripPostDroite"
                            value="Oui"
                            checked={formState.ripPostDroite === 'Oui'}
                            onChange={(e) => handleEspacementOptionChange('ripPostDroite', e.target.value)}
                          />
                          <span>Oui</span>
                        </span>
                      </td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="ripPostDroite"
                            value="siNecessaire"
                            checked={formState.ripPostDroite === 'siNecessaire'}
                            onChange={(e) => handleEspacementOptionChange('ripPostDroite', e.target.value)}
                          />
                          <span>Si nécessaire</span>
                        </span>
                      </td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="ripPostDroite"
                            value="Non"
                            checked={formState.ripPostDroite === 'Non'}
                            onChange={(e) => handleEspacementOptionChange('ripPostDroite', e.target.value)}
                          />
                          <span>Non</span>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.td1}>RIP - Postérieure à gauche</td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="ripPostGauche"
                            value="Oui"
                            checked={formState.ripPostGauche === 'Oui'}
                            onChange={(e) => handleEspacementOptionChange('ripPostGauche', e.target.value)}
                          />
                          <span>Oui</span>
                        </span>
                      </td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="ripPostGauche"
                            value="siNecessaire"
                            checked={formState.ripPostGauche === 'siNecessaire'}
                            onChange={(e) => handleEspacementOptionChange('ripPostGauche', e.target.value)}
                          />
                          <span>Si nécessaire</span>
                        </span>
                      </td>
                      <td>
                        <span className={styles.radioInline}>
                          <input
                            type="radio"
                            name="ripPostGauche"
                            value="Non"
                            checked={formState.ripPostGauche === 'Non'}
                            onChange={(e) => handleEspacementOptionChange('ripPostGauche', e.target.value)}
                          />
                          <span>Non</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h4 className={styles.resolutionSubtitle}>Résolution à la mandibulaire</h4>
                <table className={styles.apTable}>
                  <tr>
                    <td className={styles.td1}>Expansion</td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="expansion2"
                          value="Oui"
                          checked={formState.expansion2 === 'Oui'}
                          onChange={(e) => handleEspacementOptionChange('expansion2', e.target.value)}
                        />
                        <span>Oui</span>
                      </span>
                    </td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="expansion2"
                          value="siNecessaire"
                          checked={formState.expansion2 === 'siNecessaire'}
                          onChange={(e) => handleEspacementOptionChange('expansion2', e.target.value)}
                        />
                        <span>Si nécessaire</span>
                      </span>
                    </td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="expansion2"
                          value="Non"
                          checked={formState.expansion2 === 'Non'}
                          onChange={(e) => handleEspacementOptionChange('expansion2', e.target.value)}
                        />
                        <span>Non</span>
                      </span>
                    </td>
                  </tr>
                  <tr><td className={styles.td1}>Vestibuloversion</td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="vestibuloversion2"
                          value="Oui"
                          checked={formState.vestibuloversion2 === 'Oui'}
                          onChange={(e) => handleEspacementOptionChange('vestibuloversion2', e.target.value)}
                        />
                        <span>Oui</span>
                      </span>
                    </td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="vestibuloversion2"
                          value="siNecessaire"
                          checked={formState.vestibuloversion2 === 'siNecessaire'}
                          onChange={(e) => handleEspacementOptionChange('vestibuloversion2', e.target.value)}
                        />
                        <span>Si nécessaire</span>
                      </span>
                    </td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="vestibuloversion2"
                          value="Non"
                          checked={formState.vestibuloversion2 === 'Non'}
                          onChange={(e) => handleEspacementOptionChange('vestibuloversion2', e.target.value)}
                        />
                        <span>Non</span>
                      </span>
                    </td>
                  </tr>
                  <tr><td className={styles.td1}>RIP - Antérieure</td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="ripAnt2"
                          value="Oui"
                          checked={formState.ripAnt2 === 'Oui'}
                          onChange={(e) => handleEspacementOptionChange('ripAnt2', e.target.value)}
                        />
                        <span>Oui</span>
                      </span>
                    </td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="ripAnt2"
                          value="siNecessaire"
                          checked={formState.ripAnt2 === 'siNecessaire'}
                          onChange={(e) => handleEspacementOptionChange('ripAnt2', e.target.value)}
                        />
                        <span>Si nécessaire</span>
                      </span>
                    </td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="ripAnt2"
                          value="Non"
                          checked={formState.ripAnt2 === 'Non'}
                          onChange={(e) => handleEspacementOptionChange('ripAnt2', e.target.value)}
                        />
                        <span>Non</span>
                      </span>
                    </td>
                  </tr>
                  <tr><td className={styles.td1}>RIP - Postérieure à droite</td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="ripPostDroite2"
                          value="Oui"
                          checked={formState.ripPostDroite2 === 'Oui'}
                          onChange={(e) => handleEspacementOptionChange('ripPostDroite2', e.target.value)}
                        />
                        <span>Oui</span>
                      </span>
                    </td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="ripPostDroite2"
                          value="siNecessaire"
                          checked={formState.ripPostDroite2 === 'siNecessaire'}
                          onChange={(e) => handleEspacementOptionChange('ripPostDroite2', e.target.value)}
                        />
                        <span>Si nécessaire</span>
                      </span>
                    </td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="ripPostDroite2"
                          value="Non"
                          checked={formState.ripPostDroite2 === 'Non'}
                          onChange={(e) => handleEspacementOptionChange('ripPostDroite2', e.target.value)}
                        />
                        <span>Non</span>
                      </span>
                    </td>
                  </tr>
                  <tr><td className={styles.td1}>RIP - Postérieure à gauche</td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="ripPostGauche2"
                          value="Oui"
                          checked={formState.ripPostGauche2 === 'Oui'}
                          onChange={(e) => handleEspacementOptionChange('ripPostGauche2', e.target.value)}
                        />
                        <span>Oui</span>
                      </span>
                    </td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="ripPostGauche2"
                          value="siNecessaire"
                          checked={formState.ripPostGauche2 === 'siNecessaire'}
                          onChange={(e) => handleEspacementOptionChange('ripPostGauche2', e.target.value)}
                        />
                        <span>Si nécessaire</span>
                      </span>
                    </td>
                    <td>
                      <span className={styles.radioInline}>
                        <input
                          type="radio"
                          name="ripPostGauche2"
                          value="Non"
                          checked={formState.ripPostGauche2 === 'Non'}
                          onChange={(e) => handleEspacementOptionChange('ripPostGauche2', e.target.value)}
                        />
                        <span>Non</span>
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              {userRole === 'orthodontiste' && (<div>
                <h3>Extractions</h3>
                <div className={styles.radioGroup}>
                  <label className={styles.radioOption}>
                    <input type="radio" name="extractions" value="none"
                      onChange={(e) => handleRadioChange('extractions', e.target.value)}
                      className={styles.radioInput}
                    />
                    <span>Aucune</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input type="radio" name="extractions" value="some"
                      onChange={(e) => handleRadioChange('extractions', e.target.value)}
                      className={styles.radioInput}
                    />
                    <span>Extraire les dents suivantes</span>
                  </label>
                </div>
                <div className={styles.teethGrid}>
                  <div className={styles.teethRow}>
                    <div className={styles.teethNumbers}>
                      {upperTeethMapping.map((num) => (
                        <span key={`extractions-upper-number-${num}`}>{num}</span>
                      ))}
                    </div>
                    <div className={styles.teethBoxes}>
                      {upperTeethMapping.map((num) => (
                        <div className={styles.toothBox} key={`extractions-upper-${num}`}>
                          <input
                            type="checkbox"
                            checked={formState.extractionsTeeth && formState.extractionsTeeth.has(num)}
                            onChange={() => handleTeethSelection(num, 'extractionsTeeth')}
                            disabled={formState.extractions !== 'some'}
                          />
                        </div>
                      ))}
                      <div className={styles.verticalLine}></div>
                    </div>
                  </div>
                  <div className={styles.jawLabels}>
                    <span className={styles.labelD}>D</span>
                    <div className={styles.horizontalLine}></div>
                    <span className={styles.labelG}>G</span>
                  </div>
                  <div className={styles.teethRow}>
                    <div className={styles.teethNumbers}>
                      {lowerTeethMapping.map((num) => (
                        <span key={`extractions-lower-number-${num}`}>{num}</span>
                      ))}
                    </div>
                    <div className={styles.teethBoxes}>
                      {lowerTeethMapping.map((num) => (
                        <div className={styles.toothBox} key={`extractions-lower-${num}`}>
                          <input
                            type="checkbox"
                            checked={formState.extractionsTeeth && formState.extractionsTeeth.has(num)}
                            onChange={() => handleTeethSelection(num, 'extractionsTeeth')}
                            disabled={formState.extractions !== 'some'}
                          />
                        </div>
                      ))}
                      <div className={styles.verticalLine}></div>
                    </div>
                  </div>
                </div>
                <p>
                  Pour les auxiliaires (par exemple, Power Arm), spécifier dans les Instructions Spéciales.
                </p>
              </div>
              )}
            </div>
          </DiamondCardContent>
        </DiamondCard>
        <DiamondCard id="specialInstructions" className={`mb-6 ${activeSection === 'specialInstructions' ? 'ring-2 ring-blue-500' : ''}`}>
          <DiamondCardHeader>
            <DiamondCardTitle>{userRole === 'orthodontiste' ? '11.' : '6.'} Instructions Spéciales</DiamondCardTitle>
          </DiamondCardHeader>
          <DiamondCardContent>
            <div className="space-y-4">
              <textarea
                name="instructions"
                className={`${styles.instructions} w-full min-h-[150px] p-3 border rounded-md`}
                value={formState.specialInstructions}
                onChange={(e) => handleSpecialInstructionsChange(e.target.value)}
                placeholder="Ajoutez vos instructions spéciales ici..."
              />
              <div className="flex justify-end">
                <Button
                  className="bg-[#0170B4] hover:bg-[#005f99] text-white"
                  onClick={() => console.log('Instructions saved:', formState.specialInstructions)}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          </DiamondCardContent>
        </DiamondCard>
      </div>

    </div>


  )
})

export default Prescription