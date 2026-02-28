import React from 'react'
import {
    DiamondCard as Card,
    DiamondCardContent as CardContent,
    DiamondCardDescription as CardDescription,
    DiamondCardHeader as CardHeader,
    DiamondCardTitle as CardTitle,
} from '@/components/ui/diamond-card'
import { Button } from '@/components/ui/button'
import { Download, Trash2, Database, AlertTriangle, FileJson } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export const DataTab: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Database className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-slate-900">{t('settings.data.export_title') || 'Exportation des données'}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                        {t('settings.data.export_desc') || 'Téléchargez une copie de vos données personnelles.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                <FileJson className="h-6 w-6 text-slate-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="font-semibold text-slate-900">Format JSON</div>
                                <div className="text-sm text-slate-500">Inclut votre profil, préférences et historique d'activité.</div>
                            </div>
                        </div>
                        <Button variant="outline" className="border-slate-300 hover:border-blue-300 hover:text-blue-700 bg-white">
                            <Download className="h-4 w-4 mr-2" />
                            {t('settings.data.download') || 'Télécharger'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="text-slate-900">{t('settings.data.delete_account_title') || 'Zone Rouge'}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                        {t('settings.data.delete_account_desc') || 'Les actions ici sont irréversibles.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-2 max-w-xl">
                            <h4 className="text-base font-semibold text-slate-900">{t('settings.data.delete_account') || 'Supprimer mon compte'}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {t('settings.data.delete_warning') || 'Une fois votre compte supprimé, toutes vos données (profils, dossiers patients, préférences) seront définitivement effacées. Cette action est irréversible et immédiate.'}
                            </p>
                        </div>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 whitespace-nowrap shadow-sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('settings.data.confirm_delete') || 'Supprimer définitivement'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
