'use client'

import React, { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import {
  HelpCircle,
  Book,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  Mail,
  Phone,
  Clock,
  Users,
  Settings,
  BarChart3,
  UserPlus,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react'
import {
  DiamondCard as Card,
  DiamondCardContent as CardContent,
  DiamondCardDescription as CardDescription,
  DiamondCardHeader as CardHeader,
  DiamondCardTitle as CardTitle,
} from '@/components/ui/diamond-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { HeadingTitle } from '@/components/HeadingTitle'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

interface DocumentationSection {
  id: string
  title: string
  description: string
  icon: React.ReactElement<{ className?: string }>
  subsections: {
    id: string
    title: string
    content: string
  }[]
}

const SupportPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('documentation')

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: t('support.faq.items.add_patient.question'),
      answer: t('support.faq.items.add_patient.answer'),
      category: 'patients',
    },
    {
      id: '2',
      question: t('support.faq.items.modify_status.question'),
      answer: t('support.faq.items.modify_status.answer'),
      category: 'patients',
    },
    {
      id: '3',
      question: t('support.faq.items.interpret_charts.question'),
      answer: t('support.faq.items.interpret_charts.answer'),
      category: 'dashboard',
    },
    {
      id: '4',
      question: t('support.faq.items.download_files.question'),
      answer: t('support.faq.items.download_files.answer'),
      category: 'files',
    },
    {
      id: '5',
      question: t('support.faq.items.forgot_password.question'),
      answer: t('support.faq.items.forgot_password.answer'),
      category: 'account',
    },
    {
      id: '6',
      question: t('support.faq.items.archive_patient.question'),
      answer: t('support.faq.items.archive_patient.answer'),
      category: 'patients',
    },
  ]

  const documentationSections: DocumentationSection[] = [
    {
      id: 'getting-started',
      title: t('support.documentation.getting_started.title'),
      description: t('support.documentation.getting_started.description'),
      icon: <Book className="w-5 h-5" />,
      subsections: [
        {
          id: 'login',
          title: t('support.documentation.getting_started.subsections.login.title'),
          content: t('support.documentation.getting_started.subsections.login.content'),
        },
        {
          id: 'interface',
          title: t('support.documentation.getting_started.subsections.interface.title'),
          content: t('support.documentation.getting_started.subsections.interface.content'),
        },
        {
          id: 'navigation',
          title: t('support.documentation.getting_started.subsections.navigation.title'),
          content: t('support.documentation.getting_started.subsections.navigation.content'),
        },
      ],
    },
    {
      id: 'patients',
      title: t('support.documentation.patients.title'),
      description: t('support.documentation.patients.description'),
      icon: <Users className="w-5 h-5" />,
      subsections: [
        {
          id: 'add-patient',
          title: t('support.documentation.patients.subsections.add_patient.title'),
          content: t('support.documentation.patients.subsections.add_patient.content'),
        },
        {
          id: 'patient-status',
          title: t('support.documentation.patients.subsections.patient_status.title'),
          content: t('support.documentation.patients.subsections.patient_status.content'),
        },
        {
          id: 'patient-files',
          title: t('support.documentation.patients.subsections.patient_files.title'),
          content: t('support.documentation.patients.subsections.patient_files.content'),
        },
      ],
    },
    {
      id: 'dashboard',
      title: t('support.documentation.dashboard.title'),
      description: t('support.documentation.dashboard.description'),
      icon: <BarChart3 className="w-5 h-5" />,
      subsections: [
        {
          id: 'metrics',
          title: t('support.documentation.dashboard.subsections.metrics.title'),
          content: t('support.documentation.dashboard.subsections.metrics.content'),
        },
        {
          id: 'charts',
          title: t('support.documentation.dashboard.subsections.charts.title'),
          content: t('support.documentation.dashboard.subsections.charts.content'),
        },
      ],
    },
    {
      id: 'settings',
      title: t('support.documentation.settings.title'),
      description: t('support.documentation.settings.description'),
      icon: <Settings className="w-5 h-5" />,
      subsections: [
        {
          id: 'profile',
          title: t('support.documentation.settings.subsections.profile.title'),
          content: t('support.documentation.settings.subsections.profile.content'),
        },
        {
          id: 'security',
          title: t('support.documentation.settings.subsections.security.title'),
          content: t('support.documentation.settings.subsections.security.content'),
        },
      ],
    },
  ]

  const categories = [
    { id: 'all', label: t('support.faq.categories.all'), count: faqData.length },
    {
      id: 'patients',
      label: t('support.faq.categories.patients'),
      count: faqData.filter((f) => f.category === 'patients').length,
    },
    {
      id: 'dashboard',
      label: t('support.faq.categories.dashboard'),
      count: faqData.filter((f) => f.category === 'dashboard').length,
    },
    { id: 'files', label: t('support.faq.categories.files'), count: faqData.filter((f) => f.category === 'files').length },
    {
      id: 'account',
      label: t('support.faq.categories.account'),
      count: faqData.filter((f) => f.category === 'account').length,
    },
  ]

  const filteredFAQ = faqData.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col gap-8 min-h-screen p-8">
      {/* En-tête avec HeadingTitle */}
      <div className="flex justify-between items-start">
        <HeadingTitle
          title={t('support.title')}
          subtitle={t('support.subtitle')}
          titleClassName="text-4xl font-bold text-slate-900"
          subtitleClassName="text-lg text-slate-600"
        />
        <div className="flex flex-col gap-3">
          <a
            href="https://calendly.com/contact-diamond-aligner/clinical-support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white px-5 py-2 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow  "
            aria-label={t('support.clinical_support')}
          >
            <div className="p-2 bg-blue-400 rounded-full">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold  text-slate-800 whitespace-nowrap">
              {t('support.clinical_support')}
            </span>
          </a>
        </div>
      </div>

      {/* Barre de recherche */}
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder={t('support.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-slate-200 focus:border-curious-blue-500 focus:ring-curious-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Onglets principaux */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('documentation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'documentation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Book className="w-4 h-4" />
              {t('support.tabs.documentation')}
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'faq'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <MessageSquare className="w-4 h-4" />
              {t('support.tabs.faq')}
            </button>
            <button
              onClick={() => setActiveTab('tutorials')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'tutorials'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Video className="w-4 h-4" />
              {t('support.tabs.tutorials')}
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'contact'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Mail className="w-4 h-4" />
              {t('support.tabs.contact')}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Documentation */}
          {activeTab === 'documentation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentationSections.map((section) => (
                  <Card
                    key={section.id}
                    className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-curious-blue-100 rounded-lg">
                          {React.cloneElement(section.icon, {
                            className: 'w-5 h-5 text-curious-blue-600',
                          })}
                        </div>
                        <span className="text-slate-900">{section.title}</span>
                      </CardTitle>
                      <CardDescription className="text-slate-600 ml-10">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.subsections.map((subsection) => (
                        <div
                          key={subsection.id}
                          className="relative pl-4 pb-3 border-l-2 border-slate-200"
                        >
                          <div className="absolute -left-1.5 top-0 w-3 h-3 bg-blue-600 rounded-full"></div>
                          <h4 className="font-semibold text-slate-900 mb-2">{subsection.title}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{subsection.content}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Filtres par catégorie */}
              <Card className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        size="default"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category.id
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                          }`}
                      >
                        {category.label}
                        <Badge
                          variant="secondary"
                          className={`ml-1 ${selectedCategory === category.id
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-700'
                            }`}
                        >
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Questions FAQ */}
              <div className="space-y-4">
                {filteredFAQ.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-0">
                      <button
                        className="w-full p-6 text-left hover:bg-slate-50 transition-colors flex items-center justify-between group"
                        onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.question}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 capitalize">
                            {item.category}
                          </Badge>
                          {expandedFAQ === item.id ? (
                            <ChevronDown className="w-5 h-5 text-blue-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          )}
                        </div>
                      </button>
                      {expandedFAQ === item.id && (
                        <div className="px-6 pb-6">
                          <Separator className="mb-4" />
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-slate-700 leading-relaxed">{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tutoriels */}
          {activeTab === 'tutorials' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Video className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-slate-900">{t('support.documentation.getting_started.title')}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                      Introduction à Diamond • 5 minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <Video className="w-8 h-8 text-curious-blue-600" />
                      </div>
                      <div className="absolute top-3 right-3 bg-curious-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        5 min
                      </div>
                    </div>
                    <Button className="w-full bg-curious-blue-500 hover:bg-curious-blue-600 text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Regarder maintenant
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <UserPlus className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-slate-900">{t('support.documentation.patients.title')}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                      Ajouter et gérer vos patients • 8 minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <Video className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        8 min
                      </div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Regarder maintenant
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 bg-curious-blue-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-curious-blue-600" />
                      </div>
                      <span className="text-slate-900">{t('support.documentation.dashboard.title')}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                      Comprendre vos statistiques • 6 minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <Video className="w-8 h-8 text-curious-blue-600" />
                      </div>
                      <div className="absolute top-3 right-3 bg-curious-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        6 min
                      </div>
                    </div>
                    <Button className="w-full bg-curious-blue-500 hover:bg-curious-blue-600 text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Regarder maintenant
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Contact */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations de contact */}
                <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-slate-900">{t('support.contact.title')}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                      {t('support.contact.subtitle')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="p-2 bg-blue-600 rounded-full">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{t('support.contact.email_support.title')}</p>
                        <p className="text-blue-600 font-medium">{t('support.contact.email_support.value')}</p>
                        <p className="text-xs text-slate-500 mt-1">{t('support.contact.email_support.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="p-2 bg-green-600 rounded-full">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{t('support.contact.whatsapp.title')}</p>
                        <p className="text-green-600 font-medium">{t('support.contact.whatsapp.value')}</p>
                        <p className="text-xs text-slate-500 mt-1">{t('support.contact.whatsapp.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="p-2 bg-slate-600 rounded-full">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{t('support.contact.hours.title')}</p>
                        <p className="text-slate-600 font-medium">{t('support.contact.hours.value')}</p>
                        <p className="text-xs text-slate-500 mt-1">{t('support.contact.hours.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 bg-white rounded-full ring-1 ring-blue-400 overflow-hidden flex items-center justify-center">
                        <img
                          src="/teamviewer.svg"
                          alt="TeamViewer"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{t('support.contact.teamviewer.title')}</p>
                        <p className="text-blue-700 font-medium">{t('support.contact.teamviewer.value')}</p>
                        <p className="text-xs text-slate-500 mt-1">{t('support.contact.teamviewer.desc')}</p>
                      </div>
                      <Button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.open(
                              'https://start.teamviewer.com/',
                              '_blank',
                              'noopener,noreferrer'
                            )
                          }
                        }}
                        aria-label={t('support.contact.teamviewer.button')}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      >
                        <span>{t('support.contact.teamviewer.button')}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Statut du système */}
                <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-slate-900">{t('support.contact.system_status.title')}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                      {t('support.contact.system_status.desc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">{t('support.contact.system_status.web_platform')}</span>
                          <p className="text-xs text-slate-500">Dernière vérification: il y a 2 min</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">{t('support.contact.system_status.operational')}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">{t('support.contact.system_status.database')}</span>
                          <p className="text-xs text-slate-500">Temps de réponse: 12ms</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">{t('support.contact.system_status.operational')}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">{t('support.contact.system_status.external_api')}</span>
                          <p className="text-xs text-slate-500">Maintenance programmée</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-600 text-white">{t('support.contact.system_status.maintenance')}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Formulaire de contact */}
              <Card className="bg-white shadow-sm border border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-curious-blue-100 rounded-lg">
                      <Mail className="w-5 h-5 text-curious-blue-600" />
                    </div>
                    {t('support.contact.form.title')}
                  </CardTitle>
                  <CardDescription className="ml-10 text-slate-600">
                    {t('support.contact.form.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-slate-700 font-medium">{t('support.contact.form.name')}</label>
                      <Input
                        placeholder={t('support.contact.form.name')}
                        className="border-slate-200 focus:border-curious-blue-500 focus:ring-curious-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-700 font-medium">{t('support.contact.form.email')}</label>
                      <Input
                        placeholder="votre.email@exemple.com"
                        type="email"
                        className="border-slate-200 focus:border-curious-blue-500 focus:ring-curious-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-700 font-medium">{t('support.contact.form.subject')}</label>
                    <Input
                      placeholder={t('support.contact.form.subject')}
                      className="border-slate-200 focus:border-curious-blue-500 focus:ring-curious-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-700 font-medium">{t('support.contact.form.message')}</label>
                    <textarea
                      className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:border-curious-blue-500 focus:ring-curious-blue-500 transition-colors"
                      rows={4}
                      placeholder={t('support.contact.form.message')}
                    />
                  </div>
                  <Button className="w-full bg-curious-blue-500 hover:bg-curious-blue-600 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    {t('support.contact.form.submit')}
                  </Button>
                  <p className="text-center text-slate-500 text-sm">
                    {t('support.contact.form.privacy')}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupportPage
