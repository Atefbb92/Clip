'use client'

import { useTranslation } from '@/hooks/useTranslation'
import React from 'react'
import StatCard from '../StatCard'
import {
    FileText,
    Calendar,
    Clock,
    Cog,
    Activity,
    CheckCircle
} from 'lucide-react'

interface StatusCounts {
    drafts: number;
    enplanification: number;
    attente: number;
    enproduction: number;
    entraitement: number;
    termine: number;
}

interface StatusCardProps {
    selectedStatus: number | null;
    onStatusSelect: (statusId: number | null) => void;
    counts: StatusCounts;
}

const StatusCard: React.FC<StatusCardProps> = ({ selectedStatus, onStatusSelect, counts }) => {
    const { t } = useTranslation()

    // Cards data
    const cards = [
        {
            icon: <FileText className="w-6 h-6" />,
            number: counts.drafts,
            label: t('status.brouillon'),
            statusId: 0,
            color: 'gray' as const
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            number: counts.enplanification,
            label: t('status.planning'),
            statusId: 1,
            color: 'blue' as const
        },
        {
            icon: <Clock className="w-6 h-6" />,
            number: counts.attente,
            label: t('status.en-attente'),
            statusId: 2,
            color: 'yellow' as const
        },
        {
            icon: <Cog className="w-6 h-6" />,
            number: counts.enproduction,
            label: t('status.en-production'),
            statusId: 3,
            color: 'orange' as const
        },
        {
            icon: <Activity className="w-6 h-6" />,
            number: counts.entraitement,
            label: t('status.en-traitement'),
            statusId: 4,
            color: 'purple' as const
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            number: counts.termine,
            label: t('status.termine'),
            statusId: 5,
            color: 'green' as const
        },
    ]

    const handleCardClick = (statusId: number) => {
        if (onStatusSelect) {
            onStatusSelect(selectedStatus === statusId ? null : statusId)
        }
    }

    const isCardSelected = (statusId: number) => {
        return selectedStatus === statusId
    }

    return (
        <div className="flex flex-nowrap gap-4 mb-8 px-4 max-w-full overflow-x-auto pb-4 snap-x scrollbar-hide">
            {cards.map((card, index) => (
                <StatCard
                    key={index}
                    icon={card.icon}
                    value={card.number}
                    label={card.label}
                    color={card.color}
                    onClick={() => handleCardClick(card.statusId)}
                    isSelected={isCardSelected(card.statusId)}
                    className="min-w-[220px] flex-1 snap-center"
                />
            ))}
        </div>
    )
}

export default StatusCard
