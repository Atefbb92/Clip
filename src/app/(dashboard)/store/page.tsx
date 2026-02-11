'use client'

import React, { useState } from 'react'
import {
    DiamondCard,
    DiamondCardContent,
    DiamondCardDescription,
    DiamondCardHeader,
    DiamondCardTitle,
} from '@/components/ui/diamond-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HeadingTitle } from '@/components/HeadingTitle'
import { Input } from '@/components/ui/input'
import {
    Search,
    ShoppingCart,
    Filter,
    Package,
    Wrench,
    FlaskConical,
    Box,
    ArrowRight,
    Info,
    CheckCircle,
    Truck,
    ShieldCheck,
} from 'lucide-react'

// Mock Data for Store
const categories = [
    { id: 'all', label: 'Tous les produits', icon: Box },
    { id: 'equipment', label: 'Équipements', icon: Wrench },
    { id: 'material', label: 'Matériels', icon: Package },
    { id: 'consumables', label: 'Consommables', icon: FlaskConical },
]

const products = [
    {
        id: '1',
        category: 'equipment',
        name: 'Scanner Intra-oral Diamond Scan v3',
        description: 'Scanner haute précision pour des prises d\'empreintes numériques ultra-rapides et confortables pour le patient.',
        price: '18 900 DT',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffce47267a5?w=800&q=80',
        status: 'En stock',
        specs: ['Précision 5µm', 'Sans fil', 'IA intégrée'],
    },
    {
        id: '2',
        category: 'material',
        name: 'Kit Diamond Ortho Expert',
        description: 'Kit complet de démarrage incluant tous les instruments nécessaires pour la pose et le suivi des aligneurs.',
        price: '450 DT',
        image: 'https://images.unsplash.com/photo-1599408226997-399066ac065e?w=800&q=80',
        status: 'Populaire',
        specs: ['Acier chirurgical', 'Garantie 2 ans', 'Ergonomique'],
    },
    {
        id: '3',
        category: 'consumables',
        name: 'Résine 3D Diamond Premium (1kg)',
        description: 'Résine biocompatible optimisée pour l\'impression 3D de modèles orthodontiques haute définition.',
        price: '280 DT',
        image: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=800&q=80',
        status: 'En stock',
        specs: ['Biocompatible', 'Ultra-rapide', 'Stabilité dimensionnelle'],
    },
    {
        id: '4',
        category: 'equipment',
        name: 'Imprimante 3D Diamond Print L2',
        description: 'Imprimante LCD professionnelle dédiée à la production rapide de modèles de travail et de contention.',
        price: '3 200 DT',
        image: 'https://images.unsplash.com/photo-1631284520291-a5482386da36?w=800&q=80',
        status: 'Dernières unités',
        specs: ['Surface 250x140mm', 'Résolution 4K', 'Connexion Cloud'],
    },
    {
        id: '5',
        category: 'material',
        name: 'Boîtiers de Rangement Diamond (Lot de 50)',
        description: 'Boîtiers premium ventilés avec miroir intégré, disponibles en plusieurs coloris élégants.',
        price: '125 DT',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80',
        status: 'En stock',
        specs: ['Fermeture magnétique', 'Antibactérien', 'Miroir HD'],
    },
    {
        id: '6',
        category: 'consumables',
        name: 'Pince à Thermoformage Diamond',
        description: 'Outil de précision pour la modification locale des aligneurs et la création de points de pression.',
        price: '185 DT',
        image: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?w=800&q=80',
        status: 'En stock',
        specs: ['Acier inoxydable', 'Point de pression précis', 'Poignée antidérapante'],
    },
]

export default function StorePage() {
    const [activeTab, setActiveTab] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    const filteredProducts = products.filter(
        (product) =>
            (activeTab === 'all' || product.category === activeTab) &&
            (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="min-h-screen space-y-8 animate-in fade-in duration-500 pb-12">
            {/* 1. Header Section */}
            <HeadingTitle
                title="Diamond Store"
                subtitle="Tout votre matériel et vos consommables au même endroit"
                titleClassName="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600"
            >
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 border-slate-200">
                        <ShoppingCart className="w-4 h-4" />
                        Panier <Badge className="ml-1 bg-blue-600 text-white px-1.5 h-4 min-w-4 flex items-center justify-center">0</Badge>
                    </Button>
                </div>
            </HeadingTitle>

            {/* 2. Hero Promotion Section */}
            {!searchTerm && activeTab === 'all' && (
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-xl h-[300px]">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 rounded-full -ml-24 -mb-24"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center max-w-2xl gap-4">
                        <Badge className="bg-amber-400 text-blue-900 border-none w-fit hover:bg-amber-400">Offre Spéciale</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            -15% sur tous les consommables ce mois-ci
                        </h2>
                        <p className="text-blue-100 opacity-90 max-w-lg">
                            Optimisez vos coûts cabinet avec nos tarifs préférentiels sur les résines, boîtiers et accessoires Diamond.
                        </p>
                        <div className="mt-4">
                            <Button size="lg" className="bg-white text-blue-900 hover:bg-slate-100 font-bold px-6">
                                Voir les offres <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center p-8">
                        <Package className="w-48 h-48 text-white/10 rotate-12" />
                    </div>
                </div>
            )}

            {/* 3. Navigation & Filtering bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-20 bg-white/90 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-sm">
                <nav className="flex space-x-1 p-1 bg-slate-100/50 rounded-lg overflow-x-auto no-scrollbar">
                    {categories.map((cat) => {
                        const isActive = activeTab === cat.id
                        const Icon = cat.icon
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${isActive
                                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}
                `}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        )
                    })}
                </nav>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Rechercher un équipement, matériel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-white border-slate-200 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* 4. Support Features Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-200 pb-8">
                <div className="flex items-center gap-3 p-4">
                    <div className="p-3 bg-blue-50 rounded-full flex-shrink-0">
                        <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Livraison Rapide</h4>
                        <p className="text-xs text-slate-500">24-48h partout dans le pays</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4">
                    <div className="p-3 bg-blue-50 rounded-full flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Garantie Qualité</h4>
                        <p className="text-xs text-slate-500">Certifié conforme CE & ISO</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4">
                    <div className="p-3 bg-blue-50 rounded-full flex-shrink-0">
                        <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Support Dédié</h4>
                        <p className="text-xs text-slate-500">Conseillers cliniques à votre écoute</p>
                    </div>
                </div>
            </div>

            {/* 5. Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                    <DiamondCard key={product.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100 overflow-hidden flex flex-col bg-white">
                        <div className="relative h-56 bg-slate-50 overflow-hidden flex items-center justify-center group-hover:bg-slate-100/50 transition-colors">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4">
                                <Badge className={`${product.status === 'Populaire' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-green-100 text-green-700 border-green-200'} border shadow-none font-semibold px-2.5 py-0.5`}>
                                    {product.status}
                                </Badge>
                            </div>
                        </div>

                        <DiamondCardContent className="p-6 flex-1 flex flex-col gap-4">
                            <div className="space-y-2">
                                <Badge variant="outline" className="mb-1 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-slate-200">
                                    {categories.find(c => c.id === product.category)?.label}
                                </Badge>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
                                    {product.name}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 min-h-[40px]">
                                    {product.description}
                                </p>
                            </div>

                            <div className="space-y-3 flex-1 pt-2">
                                <div className="flex flex-wrap gap-2">
                                    {product.specs.map((spec, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                            <CheckCircle className="w-3 h-3 text-blue-500" /> {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-end justify-between pt-6 border-t border-slate-100">
                                <div>
                                    <span className="text-slate-400 text-xs block mb-0.5">Prix cabinet</span>
                                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">{product.price}</span>
                                </div>
                                <Button className="bg-[#0072B8] hover:bg-blue-700 shadow-md group-hover:scale-105 transition-all text-white h-11 px-6">
                                    Commander <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </DiamondCardContent>
                    </DiamondCard>
                ))}
            </div>

            {/* 6. Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                        <Box className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Aucun produit trouvé</h3>
                    <p className="text-slate-500">Nous n&apos;avons pas de produit correspondant à &quot;{searchTerm}&quot;.</p>
                    <Button variant="link" onClick={() => setSearchTerm('')} className="mt-4 text-blue-600">
                        Effacer la recherche
                    </Button>
                </div>
            )}

            {/* 7. Catalog Request Banner */}
            <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="relative z-10 space-y-3 text-center md:text-left">
                    <h3 className="text-2xl font-bold">Catalogue Complet 2026</h3>
                    <p className="text-slate-400 max-w-md">Découvrez plus de 500 références exclusives pour l&apos;orthodontie numérique dans notre catalogue PDF.</p>
                </div>
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 h-12 relative z-10 transition-transform hover:scale-105">
                    Télécharger le catalogue (PDF)
                </Button>
            </div>

        </div>
    )
}
