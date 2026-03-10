'use client'

import React from 'react'
import { Package } from 'lucide-react'

interface TreatmentPlanViewer3DProps {
    patientName?: string
    versionLabel?: string
    url?: string
}

const TreatmentPlanViewer3D: React.FC<TreatmentPlanViewer3DProps> = ({ patientName, versionLabel, url }) => {
    if (url) {
        return (
            <div className="w-full h-full flex flex-col bg-slate-50 rounded-lg overflow-hidden relative border border-slate-200 shadow-inner">
                <iframe src={url} className="w-full h-full border-0" allowFullScreen />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-500 border border-slate-200 z-10 pointer-events-none">
                    TP Check : {patientName || 'Plan de traitement'} {versionLabel ? `- ${versionLabel}` : ''}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg overflow-hidden relative border border-slate-200 shadow-inner p-6 text-center">
            <Package className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-1">Aucun TP Check disponible</h3>
            <p className="text-sm text-slate-500">
                Le lien vers la plateforme de visualisation n'a pas encore été généré pour cette version.
            </p>
        </div>
    )
}

export default TreatmentPlanViewer3D
