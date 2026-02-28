'use client'

import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { Chart } from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface PatientsEvolutionChartProps {
  data?: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
      borderColor: string
      borderWidth: number
    }[]
  }
}

interface AnimationProgressContext {
  chart: Chart
  currentStep: number
  numSteps: number
}

const PatientsEvolutionChart: React.FC<PatientsEvolutionChartProps> = ({ data }) => {
  const { t } = useTranslation()
  const defaultData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: t('dashboard.charts.evolution_new_cases'),
        data: [12, 19, 15, 25, 22, 30],
        fill: true,
        backgroundColor: 'rgba(1, 112, 180, 0.1)',
        borderColor: '#0170B4',
        borderWidth: 3,
        pointBackgroundColor: '#0170B4',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
      },
      {
        label: t('dashboard.charts.evolution_approved_cases'),
        data: [8, 14, 13, 20, 18, 26],
        fill: true,
        backgroundColor: 'rgba(0, 182, 174, 0.1)', // #00B6AE at 0.1
        borderColor: '#00B6AE', // #00B6AE
        borderWidth: 3,
        pointBackgroundColor: '#00B6AE',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        suggestedMax: 6,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Line data={data || defaultData} options={options} />
    </div>
  )
}

export default PatientsEvolutionChart
