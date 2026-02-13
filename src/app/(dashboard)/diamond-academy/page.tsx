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
import { useTranslation } from '@/hooks/useTranslation'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
    PlayCircle,
    BookOpen,
    Video,
    Search,
    Clock,
    Calendar,
    ArrowRight,
    GraduationCap,
    Microscope,
    FileText,
    Star,
    CheckCircle2,
    Trophy,
    Timer
} from 'lucide-react'

// Mock Data
const categories = [
    { id: 'tutorials', label: 'Tutoriels Vidéo', icon: PlayCircle },
    { id: 'webinars', label: 'Webinaires', icon: Video },
    { id: 'articles', label: 'Articles Scientifiques', icon: Microscope },
]

const contentItems = [
    {
        id: '1',
        type: 'tutorials',
        title: 'Maîtriser le collage des taquets',
        description: 'Guide étape par étape pour un collage précis et durable des taquets en composite.',
        duration: '15 min',
        level: 'Débutant',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
        date: '10 Fév 2026',
        author: 'Dr. Sarah Cohen'
    },
    {
        id: '2',
        type: 'tutorials',
        title: 'IPR : Techniques et Instruments',
        description: 'Comparaison des différentes techniques de réduction interproximale et choix des instruments.',
        duration: '22 min',
        level: 'Intermédiaire',
        image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
        date: '05 Fév 2026',
        author: 'Dr. Marc Levy'
    },
    {
        id: '3',
        type: 'webinars',
        title: 'Traiter les classes II sans extractions',
        description: 'Replay du webinaire sur les stratégies de distalisation avec Diamond Aligners.',
        duration: '1h 30min',
        level: 'Avancé',
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&q=80',
        date: '28 Jan 2026',
        author: 'Prof. J. Dupont'
    },
    {
        id: '4',
        type: 'webinars',
        title: 'L\'avenir de l\'orthodontie numérique',
        description: 'Table ronde avec des experts sur l\'intégration de l\'IA dans le diagnostic.',
        duration: '45 min',
        level: 'Tous niveaux',
        image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80',
        date: '15 Jan 2026',
        author: 'Diamond Team'
    },
    {
        id: '5',
        type: 'articles',
        title: 'Biomécanique des aligneurs : Étude 2025',
        description: 'Analyse approfondie des forces exercées par les nouveaux matériaux Diamond.',
        duration: 'Lecture 10 min',
        level: 'Avancé',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
        date: '12 Déc 2025',
        author: 'Research Team'
    },
    {
        id: '6',
        type: 'articles',
        title: 'Gestion des récidives',
        description: 'Protocoles de contention et gestion des cas de récidive légère.',
        duration: 'Lecture 8 min',
        level: 'Intermédiaire',
        image: 'https://images.unsplash.com/photo-1581093458791-9f302e6883e0?w=800&q=80',
        date: '30 Nov 2025',
        author: 'Dr. Elise Martin'
    },
]

// My Learning Data
const myLearning = {
    stats: {
        hoursWatched: 12.5,
        itemsCompleted: 8,
        itemsInProgress: 4,
        itemsNotStarted: 12
    },
    inProgress: [
        {
            id: '3',
            title: 'Traiter les classes II sans extractions',
            type: 'Webinaire',
            progress: 65,
            image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&q=80',
            lastWatched: 'Il y a 2 jours'
        },
        {
            id: '5',
            title: 'Biomécanique des aligneurs : Étude 2025',
            type: 'Article',
            progress: 30,
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
            lastWatched: 'Aujourd\'hui'
        }
    ],
    completed: [
        {
            id: '1',
            title: 'Maîtriser le collage des taquets',
            type: 'Tutoriel',
            completedDate: '15 Jan 2026',
            grade: '100%'
        },
        {
            id: '2',
            title: 'IPR : Techniques et Instruments',
            type: 'Tutoriel',
            completedDate: '20 Jan 2026',
            grade: '95%'
        }
    ]
}

export default function AcademyPage() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('tutorials')
    const [searchTerm, setSearchTerm] = useState('')
    const [showMyLearning, setShowMyLearning] = useState(false)

    const filteredContent = contentItems.filter(
        (item) =>
            item.type === activeTab &&
            (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="min-h-screen space-y-8 animate-in fade-in duration-500 p-8">

            {/* 1. Header Section */}
            <HeadingTitle
                title={t('academy.title')}
                subtitle={showMyLearning ? t('academy.my_learning_subtitle') : t('academy.subtitle')}
            >
                <div className="flex gap-3">
                    <Button
                        onClick={() => setShowMyLearning(!showMyLearning)}
                        className={`gap-2 shadow-lg transition-all duration-300 ${showMyLearning ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        {showMyLearning ? 'Retour au catalogue' : 'Mon Parcours'}
                    </Button>
                </div>
            </HeadingTitle>

            {showMyLearning ? (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DiamondCard className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-xl">
                            <DiamondCardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 font-medium mb-1 text-sm">Heures d'apprentissage</p>
                                    <h3 className="text-3xl font-bold">{myLearning.stats.hoursWatched}h</h3>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Timer className="w-6 h-6 text-white" />
                                </div>
                            </DiamondCardContent>
                        </DiamondCard>

                        <DiamondCard className="bg-white border-slate-200 shadow-lg">
                            <DiamondCardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 font-medium mb-1 text-sm">Éléments complétés</p>
                                    <h3 className="text-3xl font-bold text-slate-800">{myLearning.stats.itemsCompleted}</h3>
                                </div>
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                            </DiamondCardContent>
                        </DiamondCard>

                        <DiamondCard className="bg-white border-slate-200 shadow-lg">
                            <DiamondCardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 font-medium mb-1 text-sm">Éléments en cours</p>
                                    <h3 className="text-3xl font-bold text-slate-800">{myLearning.stats.itemsInProgress}</h3>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-xl">
                                    <PlayCircle className="w-6 h-6 text-amber-500" />
                                </div>
                            </DiamondCardContent>
                        </DiamondCard>

                        <DiamondCard className="bg-white border-slate-200 shadow-lg">
                            <DiamondCardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 font-medium mb-1 text-sm">Non commencés</p>
                                    <h3 className="text-3xl font-bold text-slate-800">{myLearning.stats.itemsNotStarted}</h3>
                                </div>
                                <div className="p-3 bg-slate-100 rounded-xl">
                                    <BookOpen className="w-6 h-6 text-slate-500" />
                                </div>
                            </DiamondCardContent>
                        </DiamondCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* In Progress Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <PlayCircle className="w-6 h-6 text-blue-600" /> En cours
                            </h3>
                            <div className="space-y-4">
                                {myLearning.inProgress.map(item => (
                                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                                        <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <PlayCircle className="w-8 h-8 text-white/80" />
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <Badge variant="outline" className="mb-2 text-xs border-blue-200 text-blue-700 bg-blue-50">{item.type}</Badge>
                                                <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-slate-500">
                                                    <span>{item.progress}% complété</span>
                                                    <span>{item.lastWatched}</span>
                                                </div>
                                                <Progress value={item.progress} className="h-2 bg-blue-100" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Completed Column */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6 text-green-600" /> Historique
                            </h3>
                            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                {myLearning.completed.map(item => (
                                    <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="text-sm font-semibold text-slate-900 truncate">{item.title}</h5>
                                                <p className="text-xs text-slate-500">{item.completedDate}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-50 text-green-700 border-green-200 shadow-none ml-2">
                                            {item.grade}
                                        </Badge>
                                    </div>
                                ))}
                                <Button variant="ghost" className="w-full text-slate-500 text-sm hover:text-slate-900">
                                    Voir tout l&apos;historique
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* 2. Hero Section - Featured Masterclass */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-2xl group cursor-pointer">
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80"
                                alt="Masterclass Background"
                                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                        </div>

                        <div className="relative z-10 p-8 md:p-12 max-w-2xl flex flex-col items-start gap-4">
                            <Badge className="bg-amber-500 text-white border-none px-3 py-1 text-sm font-semibold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" /> À la une
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                Masterclass: Les Clés du Succès Clinique
                            </h2>
                            <p className="text-lg text-slate-300">
                                Rejoignez le Dr. Alami pour une série exclusive de 4 modules couvrant le diagnostic, la planification et la finition des cas complexes.
                            </p>
                            <div className="flex items-center gap-6 mt-4">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none font-bold">
                                    <PlayCircle className="w-5 h-5 mr-2" /> Commencer
                                </Button>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold">+2k</div>
                                </div>
                                <span className="text-sm text-slate-400">Praticiens inscrits</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Navigation & Filtering */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-20 bg-white/90 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-sm">
                        <nav className="flex space-x-1 p-1 bg-slate-100/50 rounded-lg">
                            {categories.map((cat) => {
                                const isActive = activeTab === cat.id
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTab(cat.id)}
                                        className={`
                              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                              ${isActive
                                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}
                          `}
                                    >
                                        <cat.icon className="w-4 h-4" />
                                        {cat.label}
                                    </button>
                                )
                            })}
                        </nav>

                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Rechercher un sujet..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-white border-slate-200 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* 4. Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {filteredContent.map((item) => (
                            <DiamondCard key={item.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100 overflow-hidden flex flex-col">
                                {/* Card Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm">
                                        {item.level}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                                            <ArrowRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <DiamondCardContent className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
                                        {item.type === 'tutorials' && <PlayCircle className="w-3 h-3" />}
                                        {item.type === 'webinars' && <Video className="w-3 h-3" />}
                                        {item.type === 'articles' && <FileText className="w-3 h-3" />}
                                        {item.type === 'tutorials' ? 'Tutoriel' : item.type === 'webinars' ? 'Webinaire' : 'Article'}
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                                        {item.description}
                                    </p>

                                    {/* Meta Footer */}
                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {item.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {item.date}
                                            </span>
                                        </div>
                                    </div>
                                </DiamondCardContent>
                            </DiamondCard>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredContent.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Aucun résultat trouvé</h3>
                            <p className="text-slate-500">Essayez d'ajuster vos termes de recherche.</p>
                        </div>
                    )}
                </>
            )}

        </div>
    )
}
