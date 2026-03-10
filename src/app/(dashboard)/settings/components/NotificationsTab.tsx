import React, { useState } from 'react'
import {
    DiamondCard as Card,
    DiamondCardContent as CardContent,
    DiamondCardDescription as CardDescription,
    DiamondCardHeader as CardHeader,
    DiamondCardTitle as CardTitle,
} from '@/components/ui/diamond-card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Bell, Mail, MessageSquare, Calendar, Activity } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface NotificationItemProps {
    id: string
    label: string
    description?: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({ id, label, description, checked, onCheckedChange }) => (
    <div className="flex items-center justify-between py-3">
        <div className="space-y-0.5">
            <Label htmlFor={id} className="text-base font-medium text-slate-700 cursor-pointer">
                {label}
            </Label>
            {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
)

export const NotificationsTab: React.FC = () => {
    const { t } = useTranslation()
    const [isSaving, setIsSaving] = useState(false)
    const [notifications, setNotifications] = useState({
        communications: {
            email: true,
            push: true,
            sms: false
        },
        appointments: {
            reminders: true,
            changes: true
        },
        activity: {
            updates: false
        }
    })

    // Simulate save
    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            console.log('Notifications saved')
        }, 1000)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Bell className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-slate-900">{t('settings.notifications.title') || 'Préférences de Notification'}</span>
                    </CardTitle>
                    <CardDescription className="ml-10 text-slate-600">
                        {t('settings.notifications.desc') || 'Gérez comment vous recevez nos notifications et alertes.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    {/* Communications Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 text-lg">{t('settings.notifications.communications') || "Communications"}</h3>
                                <p className="text-sm text-slate-500">{t('settings.notifications.communications_desc') || "Recevez des nouvelles sur vos dossiers et activités."}</p>
                            </div>
                        </div>
                        <div className="pl-14 space-y-1">
                            <NotificationItem
                                id="comm-email"
                                label={t('settings.notifications.email') || "Notifications par email"}
                                checked={notifications.communications.email}
                                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, communications: { ...prev.communications, email: c } }))}
                            />
                            <Separator className="bg-slate-100" />
                            <NotificationItem
                                id="comm-push"
                                label={t('settings.notifications.push') || "Notifications push mobile"}
                                checked={notifications.communications.push}
                                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, communications: { ...prev.communications, push: c } }))}
                            />
                            <Separator className="bg-slate-100" />
                            <NotificationItem
                                id="comm-sms"
                                label={t('settings.notifications.sms') || "Notifications SMS"}
                                checked={notifications.communications.sms}
                                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, communications: { ...prev.communications, sms: c } }))}
                            />
                        </div>
                    </div>

                    {/* Appointments Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 text-lg">{t('settings.notifications.appointments') || "Rendez-vous & Agenda"}</h3>
                                <p className="text-sm text-slate-500">{t('settings.notifications.appointments_desc') || "Ne manquez jamais un rendez-vous important."}</p>
                            </div>
                        </div>
                        <div className="pl-14 space-y-1">
                            <NotificationItem
                                id="app-reminders"
                                label={t('settings.notifications.reminders') || "Rappels automatiques (24h avant)"}
                                checked={notifications.appointments.reminders}
                                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, appointments: { ...prev.appointments, reminders: c } }))}
                            />
                            <Separator className="bg-slate-100" />
                            <NotificationItem
                                id="app-changes"
                                label={t('settings.notifications.changes') || "Modifications de planning"}
                                checked={notifications.appointments.changes}
                                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, appointments: { ...prev.appointments, changes: c } }))}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-100">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
                        >
                            {isSaving ? (t('common.saving') || 'Enregistrement...') : (t('common.save') || 'Enregistrer les préférences')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
