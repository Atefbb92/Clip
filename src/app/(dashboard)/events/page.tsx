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
import {
    Calendar,
    MapPin,
    Clock,
    Search,
    ArrowRight,
    Users,
    Video,
    Mic2,
    Presentation,
    Star,
    Plus,
} from 'lucide-react'

// Mock Data for Events
const categories = [
    { id: 'all', label: 'Tous', icon: Star },
    { id: 'congress', label: 'Congrès', icon: Mic2 },
    { id: 'workshop', label: 'Workshops', icon: Presentation },
    { id: 'webinar', label: 'Webinaires', icon: Video },
]

const events = [
    {
        id: '1',
        type: 'congress',
        title: 'Congrès National d\'Orthodontie 2026',
        description: 'Le rendez-vous annuel incontournable pour découvrir les dernières innovations en orthodontie numérique et échanger avec vos pairs.',
        date: '15-17 Mai 2026',
        time: '09:00 - 18:00',
        location: 'Paris, Palais des Congrès',
        image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800&q=80',
        status: 'Inscriptions ouvertes',
        featured: true,
    },
    {
        id: '2',
        type: 'workshop',
        title: 'Workshop : Perfectionnement Diamond Aligners',
        description: 'Une journée intensive de TP pour maîtriser les cas complexes de finitions et les protocoles de distalisation.',
        date: '22 Mars 2026',
        time: '10:00 - 17:00',
        location: 'Lyon, Centre de Formation Diamond',
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80',
        status: 'Bientôt complet',
        featured: false,
    },
    {
        id: '3',
        type: 'webinar',
        title: 'Webinaire : Optimisation du Workflow Numérique',
        description: 'Comment intégrer efficacement le scan intra-oral et le flux Diamond dans votre pratique quotidienne.',
        date: '12 Mars 2026',
        time: '19:30 - 20:30',
        location: 'En ligne (Zoom)',
        image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80',
        status: 'Gratuit',
        featured: false,
    },
    {
        id: '4',
        type: 'congress',
        title: 'European Orthodontic Society (EOS) 2026',
        description: 'Rejoignez la délégation Diamond pour le plus grand événement européen de l\'année.',
        date: '10-14 Juin 2026',
        time: 'Toute la journée',
        location: 'Madrid, Espagne',
        image: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=800&q=80',
        status: 'Bientôt disponible',
        featured: false,
    },
    {
        id: '5',
        type: 'workshop',
        title: 'Mastering IPR & Attachments',
        description: 'Formation pratique sur les techniques de réduction interproximale et le positionnement des taquets.',
        date: '05 Avril 2026',
        time: '14:00 - 18:00',
        location: 'Marseille, Hotel Intercontinental',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
        status: 'Inscriptions ouvertes',
        featured: false,
    },
]

export default function EventsPage() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    const filteredEvents = events.filter(
        (event) =>
            (activeTab === 'all' || event.type === activeTab) &&
            (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const featuredEvent = events.find((e) => e.featured)

    return (
        <div className="min-h-screen space-y-8 animate-in fade-in duration-500 p-8">
            {/* 1. Header Section */}
            <HeadingTitle
                title={t('events.title')}
                subtitle={t('events.subtitle')}
            >
                <div className="flex gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 gap-2">
                        <Plus className="w-4 h-4" /> {t('events.propose_event')}
                    </Button>
                </div>
            </HeadingTitle>

            {/* 2. Hero Section - Featured Event */}
            {!searchTerm && activeTab === 'all' && featuredEvent && (
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-2xl group cursor-pointer h-[400px]">
                    <div className="absolute inset-0">
                        <img
                            src={featuredEvent.image}
                            alt={featuredEvent.title}
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center max-w-2xl gap-4">
                        <Badge className="bg-amber-500 text-white border-none w-fit px-3 py-1 text-sm font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> {t('events.hero_badge')}
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            {featuredEvent.title}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-slate-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                <span>{featuredEvent.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span>{featuredEvent.location}</span>
                            </div>
                        </div>
                        <p className="text-slate-400 line-clamp-2">
                            {featuredEvent.description}
                        </p>
                        <div className="mt-4">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold">
                                {t('events.learn_more')} <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Navigation & Search */}
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
                        placeholder={t('events.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-white border-slate-200 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* 4. Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                {filteredEvents.map((event) => (
                    <DiamondCard key={event.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100 overflow-hidden flex flex-col">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-3 right-3">
                                <Badge className={`${event.status === 'Gratuit' ? 'bg-green-500' : event.status === 'Bientôt complet' ? 'bg-amber-500' : 'bg-blue-600'} text-white border-none`}>
                                    {event.status}
                                </Badge>
                            </div>
                        </div>

                        <DiamondCardContent className="p-5 flex-1 flex flex-col gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                    {event.type === 'congress' && <Mic2 className="w-3 h-3" />}
                                    {event.type === 'workshop' && <Presentation className="w-3 h-3" />}
                                    {event.type === 'webinar' && <Video className="w-3 h-3" />}
                                    {categories.find(c => c.id === event.type)?.label}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                                    {event.title}
                                </h3>
                            </div>

                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 italic">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="line-clamp-1">{event.location}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <Button variant="outline" className="w-full gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
                                    S'inscrire <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </DiamondCardContent>
                    </DiamondCard>
                ))}
            </div>

            {/* 5. Empty State */}
            {filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 shadow-inner">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                        <Calendar className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{t('events.empty_title')}</h3>
                    <p className="text-slate-500">{t('events.empty_subtitle')}</p>
                </div>
            )}

            {/* 6. Contact Section */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 opacity-10 rounded-full -ml-24 -mb-24"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl text-center md:text-left space-y-4">
                        <h2 className="text-3xl font-bold">{t('events.contact_title')}</h2>
                        <p className="text-blue-100 text-lg">
                            {t('events.contact_subtitle')}
                        </p>
                    </div>
                    <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 h-14">
                        {t('events.contact_button')}
                    </Button>
                </div>
            </div>
        </div>
    )
}
