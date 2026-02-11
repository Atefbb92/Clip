import { useState, useMemo } from 'react';

export default function usePatientSearch(patients, searchFields = ['name']) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    return patients.filter(patient =>
      searchFields.some(field =>
        (patient[field] || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [patients, searchTerm, searchFields]);

  return { searchTerm, setSearchTerm, filteredPatients };
} 