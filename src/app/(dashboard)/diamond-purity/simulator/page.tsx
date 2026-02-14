'use client'

import React, { useState, useEffect } from 'react'
import {
    DiamondCard,
    DiamondCardContent,
    DiamondCardHeader,
    DiamondCardTitle,
} from '@/components/ui/diamond-card'
import { Button } from '@/components/ui/button'
import { HeadingTitle } from '@/components/HeadingTitle'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Calculator, TrendingUp, Trophy, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'

export default function DiamondPuritySimulator() {
    const router = useRouter()

    // State for inputs
    const [monthlyCases, setMonthlyCases] = useState<number>(5)
    const [caseCost, setCaseCost] = useState<number>(2000)
    const [patientPrice, setPatientPrice] = useState<number>(4500)

    // Derived values
    const annualCases = monthlyCases * 12
    const annualPatientRevenue = annualCases * patientPrice
    const annualLabCostGross = annualCases * caseCost

    // Logic to determine level based on Annual Cases
    const getLevel = (cases: number) => {
        if (cases >= 30) return { name: 'ULTIMATE', discount: 0.25, color: 'text-purple-600', bg: 'bg-purple-100', Badge: 'UL' }
        if (cases >= 15) return { name: 'ELITE', discount: 0.20, color: 'text-blue-600', bg: 'bg-blue-100', Badge: 'EL' }
        if (cases >= 10) return { name: 'VIP', discount: 0.15, color: 'text-green-600', bg: 'bg-green-100', Badge: 'VIP' }
        if (cases >= 5) return { name: 'PRIME', discount: 0.10, color: 'text-orange-600', bg: 'bg-orange-100', Badge: 'PR' }
        return { name: 'STARTER', discount: 0.0, color: 'text-red-600', bg: 'bg-red-100', Badge: 'ST' }
    }

    const currentLevel = getLevel(annualCases)
    const discountAmount = annualLabCostGross * currentLevel.discount
    const netLabCost = annualLabCostGross - discountAmount
    const annualProfit = annualPatientRevenue - netLabCost

    // Calculate progress to next level
    const levels = [0, 5, 10, 15, 30]
    const nextLevelThreshold = levels.find(l => l > annualCases) || 30
    const prevLevelThreshold = [...levels].reverse().find(l => l <= annualCases) || 0
    const progressToNext = nextLevelThreshold > annualCases
        ? ((annualCases - prevLevelThreshold) / (nextLevelThreshold - prevLevelThreshold)) * 100
        : 100

    return (
        <div className="min-h-screen p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="w-fit text-slate-500 hover:text-slate-900 -ml-2"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Retour au programme
                </Button>
                <HeadingTitle
                    title="Simulateur de Rentabilité"
                    subtitle="Projetez vos remises annuelles selon votre volume de cas"
                    titleClassName="text-3xl font-bold text-slate-900"
                    subtitleClassName="text-lg text-slate-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Controls Column */}
                <div className="lg:col-span-4 space-y-6">
                    <DiamondCard className="h-full border-blue-100 shadow-lg">
                        <DiamondCardHeader className="bg-slate-50 border-b border-slate-100">
                            <DiamondCardTitle className="flex items-center gap-2 text-slate-800">
                                <Calculator className="w-5 h-5 text-blue-600" />
                                Paramètres de simulation
                            </DiamondCardTitle>
                        </DiamondCardHeader>
                        <DiamondCardContent className="space-y-8 pt-6">

                            {/* Monthly Cases Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="cases" className="text-slate-700 font-medium">Cas par mois</Label>
                                    <span className="text-2xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                        {monthlyCases}
                                    </span>
                                </div>
                                <Slider
                                    id="cases"
                                    min={0}
                                    max={10}
                                    step={1}
                                    value={[monthlyCases]}
                                    onValueChange={(val) => setMonthlyCases(val[0])}
                                    className="py-4 [&>[data-slot=slider-track]]:bg-slate-200 [&>[data-slot=slider-range]]:bg-blue-600 [&>[data-slot=slider-thumb]]:border-blue-600 [&>[data-slot=slider-thumb]]:bg-white"
                                />
                                <p className="text-xs text-slate-500 text-right">
                                    Soit <span className="font-bold text-slate-700">{annualCases}</span> cas par an
                                </p>
                            </div>

                            {/* Case Cost Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="caseCost" className="text-slate-700 font-medium">Coût moyen d'achat (DT)</Label>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="caseCost"
                                        type="number"
                                        value={caseCost}
                                        onChange={(e) => setCaseCost(Number(e.target.value))}
                                        className="pl-8 font-semibold text-lg bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">dt</span>
                                </div>
                            </div>

                            {/* Patient Price Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="patientPrice" className="text-slate-700 font-medium">Honoraires moyens facturés au patient (DT)</Label>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="patientPrice"
                                        type="number"
                                        value={patientPrice}
                                        onChange={(e) => setPatientPrice(Number(e.target.value))}
                                        className="pl-8 font-semibold text-lg bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">dt</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-600">Chiffre d'Affaires Est. (An)</span>
                                    <span className="font-bold text-slate-900">{new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(annualPatientRevenue)}</span>
                                </div>
                            </div>

                        </DiamondCardContent>
                    </DiamondCard>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Main Result Card */}
                    <DiamondCard className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <DiamondCardContent className="p-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <p className="text-slate-300 font-medium mb-1 uppercase tracking-wide text-xs">Niveau Projeté</p>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300`}>
                                            {currentLevel.name}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/10`}>
                                            {currentLevel.Badge}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">Progression vers le niveau suivant</span>
                                            <span className="text-white font-bold">{Math.round(progressToNext)}%</span>
                                        </div>
                                        <Progress value={progressToNext} className="h-2 bg-slate-700" />
                                        <p className="text-xs text-slate-400 mt-2">
                                            {nextLevelThreshold > annualCases
                                                ? `${nextLevelThreshold - annualCases} cas manquants pour atteindre le niveau supérieur`
                                                : 'Niveau maximum atteint !'}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Wallet className="w-5 h-5 text-green-400" />
                                        <h3 className="font-semibold text-lg">Bénéfice Annuel Estimé</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-slate-300">Coût Net</span>
                                            <span className="text-xl font-bold text-slate-200">{new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(netLabCost)}</span>
                                        </div>
                                        <div className="h-px bg-white/10"></div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-slate-300">Marge Nette</span>
                                            <span className="text-3xl font-bold text-white">
                                                {new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(annualProfit)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DiamondCardContent>
                    </DiamondCard>

                    {/* Breakdown/Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DiamondCard>
                            <DiamondCardContent className="p-6 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Remise sur achats</p>
                                <p className="text-2xl font-bold text-green-600">{new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(discountAmount)}</p>
                            </DiamondCardContent>
                        </DiamondCard>

                        <DiamondCard>
                            <DiamondCardContent className="p-6 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                                    <Trophy className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Niveau Atteint</p>
                                <p className={`text-2xl font-bold ${currentLevel.color}`}>{currentLevel.name}</p>
                            </DiamondCardContent>
                        </DiamondCard>

                        <DiamondCard>
                            <DiamondCardContent className="p-6 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                                    <Calculator className="w-6 h-6 text-purple-600" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Nombre de cas annuels</p>
                                <p className="text-2xl font-bold text-slate-900">{annualCases} Cas</p>
                            </DiamondCardContent>
                        </DiamondCard>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-blue-900 text-lg mb-1">Cet objectif est-il réalisable ?</h4>
                            <p className="text-blue-700/80 text-sm">Contactez votre responsable commercial pour établir un plan de croissance personnalisé.</p>
                        </div>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                            onClick={() => window.open('https://linktr.ee/diamond_aligner', '_blank')}
                        >
                            Contacter mon commercial
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}
