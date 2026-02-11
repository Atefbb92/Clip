'use client';

import React from 'react';
import styles from '../../pages/profile/profile.module.css';
import Image from 'next/image';

import bruillon from "../../assets/img/brouillon.png"
import enplanification from "../../assets/img/en planification.png"
import enattente from "../../assets/img/en attente.png"
import production from "../../assets/img/en production.png"
import termine from "../../assets/img/termine.png"
import enTraitement from "../../assets/img/en traitement.png"

const AnonymousIcon = () => (
  <svg 
      viewBox="0 0 24 24" 
      style={{
          width: '100%',
          height: '100%',
          color: '#718096',
          backgroundColor: '#E2E8F0'
      }}
      fill="currentColor"
  >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const getStatusImage = (status) => {
  switch (status) {
    case 0:
      return bruillon;
    case 1:
      return enplanification;
    case 2:
      return enattente;
    case 3:
      return production;
    case 4:
      return termine;
    case 5:
      return termine;
  }
};

// Function to get action button based on status
const getActionButton = (status) => {
  switch(status) {
    case 0:
      return <button className={styles.actionButton}>Continuer la prescription</button>;
    case 2:
      return <button className={styles.actionButton}>Validate TP Check</button>;
    case 3:
      return <button className={styles.actionButton}>Commencer le traitement</button>;
  }
};

const PatientsTable = ({ patients, onPatientClick, isActionsTab }) => {
  return (
    <table className={styles.patientsTable}>
      <thead>
        <tr className={styles.tableRow}>
          <th className={styles.tableHeader}>ID</th>
          <th className={styles.tableHeader}>Patient</th>
          <th className={styles.tableHeader}>Date de début</th>
          <th className={styles.tableHeader}>Statut</th>
          <th className={styles.tableHeader}>{isActionsTab ? "Actions" : "Conditions cliniques"}</th>
        </tr>
      </thead>
      <tbody id="patientsTableBody">
        {patients.map(patient => (
          <tr key={patient.id} onClick={() => onPatientClick(patient)} className={styles.tableRow}>
            <td className={styles.tableCell}>{patient.id.slice(0, 8)}</td>
            <td className={styles.tableCell}>
              <div className={styles.patientInfo}>
                {patient.images?.img2 ? (
                  <Image 
                    src={patient.images.img2} 
                    alt={`${patient.name}`} 
                    className={styles.patientAvatar}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className={styles.defaultAvatar}>
                    <AnonymousIcon />
                  </div>
                )}
                <span>{`${patient.name} ${patient.surname || ''}`}</span>
              </div>
            </td>
            <td className={styles.tableCell}>{patient.createdAt?.toDate().toLocaleDateString()}</td>
            <td className={styles.tableCell}>
              <Image 
                src={patient.alignersShippedDate ? enTraitement : getStatusImage(patient.status)}
                alt={`Status ${patient.status}`} 
                className={styles.statusIcon}
                width={60}
                height={40}
              />
            </td>
            <td className={styles.tableCell}>
              {isActionsTab ? (
                <div className={styles.actionButtonContainer}>
                  {getActionButton(patient.status)}
                </div>
              ) : (
                <div className={styles.conditionTags}>
                  {patient.conditions?.map((condition, index) => (
                    (index < 2 && <span key={index} className={styles.conditionTag}>
                      {condition}
                    </span>)
                  ))}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PatientsTable;