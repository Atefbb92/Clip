'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import DashboardSidebar from '@/components/dashboard-sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'

import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'

const languageOptions = [
  {
    value: 'FR',
    label: 'FR',
    logo: '/flags/FR.svg',
  },
  {
    value: 'EN',
    label: 'EN',
    logo: '/flags/EN.svg',
  },
  {
    value: 'DE',
    label: 'DE',
    logo: '/flags/DE.svg',
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()

  const router = useRouter()
  const pathname = usePathname()
  const isNewPatientPage = pathname === '/patients/new'

  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/signin')
      } else {
        setUserRole(session.user.role || null)
      }
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar userRole={userRole || undefined} />

        <SidebarInset className="flex-1 bg-gray-50 relative">
          <main className="flex-1 min-h-screen bg-gray-50">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
