import React, { useState } from 'react'
import {
    DiamondCard as Card,
    DiamondCardContent as CardContent,
    DiamondCardDescription as CardDescription,
    DiamondCardHeader as CardHeader,
    DiamondCardTitle as CardTitle,
} from '@/components/ui/diamond-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Shield, Key, Smartphone, LogOut, Lock } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { Badge } from '@/components/ui/badge'

export const SecurityTab: React.FC = () => {
    const { t } = useTranslation()
    const [twoFactor, setTwoFactor] = useState(false)

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Password Section */}
            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Lock className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-slate-900">{t('settings.security.password_title') || 'Mot de passe'}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                        {t('settings.security.password_desc') || 'Changez votre mot de passe pour sécuriser votre compte.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">{t('settings.security.current_password') || 'Mot de passe actuel'}</Label>
                            <Input id="current-password" type="password" className="bg-slate-50" />
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">{t('settings.security.new_password') || 'Nouveau mot de passe'}</Label>
                            <Input id="new-password" type="password" className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">{t('settings.security.confirm_password') || 'Confirmer le mot de passe'}</Label>
                            <Input id="confirm-password" type="password" className="bg-slate-50" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800">
                            {t('settings.security.update_password') || 'Mettre à jour le mot de passe'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 2FA Section */}
            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-slate-900">{t('settings.security.2fa_title') || 'Authentification à deux facteurs'}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                        {t('settings.security.2fa_desc') || 'Ajoutez une couche de sécurité supplémentaire à votre compte.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="space-y-1">
                            <div className="font-medium text-slate-900">{t('settings.security.2fa_enable') || 'Activer l\'authentification à deux facteurs'}</div>
                            <div className="text-sm text-slate-500">{t('settings.security.2fa_help') || 'Nous vous demanderons un code de sécurité lors de la connexion.'}</div>
                        </div>
                        <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                    </div>
                </CardContent>
            </Card>

            {/* Sessions Section */}
            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Key className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-slate-900">{t('settings.security.sessions_title') || 'Sessions actives'}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                        {t('settings.security.sessions_desc') || 'Gérez les appareils connectés à votre compte.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    {/* Mock Session */}
                    <div className="flex items-center justify-between p-4 border rounded-lg border-slate-200 bg-white hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-slate-600">M</span>
                            </div>
                            <div>
                                <div className="font-medium text-slate-900">MacBook Pro updates</div>
                                <div className="text-sm text-slate-500">Paris, France • Il y a 2 minutes</div>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1">Actuelle</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg border-slate-200 bg-white hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-slate-600">i</span>
                            </div>
                            <div>
                                <div className="font-medium text-slate-900">iPhone 13</div>
                                <div className="text-sm text-slate-500">Paris, France • Il y a 2 jours</div>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <LogOut className="h-4 w-4 mr-2" />
                            {t('common.logout') || 'Déconnexion'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
