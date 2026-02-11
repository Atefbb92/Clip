'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(ArcElement, Tooltip, Legend);

const PacksDistributionChart: React.FC = () => {
  const data = {
    labels: ['Pack Lite', 'Pack Essential', 'Pack Smart', 'Pack Pro', 'Pack Pro+'],
    datasets: [
      {
        data: [20, 25, 15, 25, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // Bleu avec transparence
          'rgba(16, 185, 129, 0.7)', // Vert avec transparence
          'rgba(245, 158, 11, 0.7)', // Orange avec transparence
          'rgba(139, 92, 246, 0.7)', // Violet avec transparence
          'rgba(239, 68, 68, 0.7)'   // Rouge avec transparence
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 8
      }
    ]
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}%`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000
    },
    elements: {
      arc: {
        borderRadius: 4
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PacksDistributionChart;