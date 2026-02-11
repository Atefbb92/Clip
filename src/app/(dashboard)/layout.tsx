'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true)
        try {
          // Get user role from Firestore
          const medecinsRef = collection(db, 'medecins')
          const q = query(medecinsRef, where('email', '==', user.email))
          const querySnapshot = await getDocs(q)

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]
            setUserRole(userDoc.data().role)
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
        }
      } else {
        setIsAuthenticated(false)
        router.push('/signin')
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar userRole={userRole || undefined} />

        <SidebarInset className="flex-1 bg-gray-50">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2">
            {/* <SidebarTrigger className="hover:bg-accent/60 transition-colors duration-200 rounded-md" /> */}
            <div className="ml-auto flex items-center gap-2">
              <Select
                value={language}
                onValueChange={(val) => setLanguage(val as any)}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder={t('common.language')} />
                </SelectTrigger>

                <SelectContent className="bg-white w-[70px]">
                  {/* TODO voir le width */}
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} textValue={option.label}>
                      <div className="flex items-center gap-2">
                        <Image src={option.logo} alt={option.label} width={16} height={16} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </header>
          <main className="flex-1 px-6 py-10 min-h-screen bg-gray-50">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
