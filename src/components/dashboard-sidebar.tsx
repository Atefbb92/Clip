'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from './ui/sidebar'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  HelpCircle,
  Settings,
  User,
  PuzzleIcon,
  GraduationCapIcon,
  StoreIcon,
  ShoppingBagIcon,
  CreditCard,
  ShoppingCartIcon,
  CalendarIcon,
} from 'lucide-react'
import { auth } from '../firebase/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import logo from '../assets/img/CliP blanc- logo.png'
import logoPro from '../assets/img/CliP pro blanc- logo.png'
import Image from 'next/image'
import styles from './dashboard-sidebar.module.css'
import { useTranslation } from '@/hooks/useTranslation'

interface DashboardSidebarProps {
  userRole?: string
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ userRole }) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const { t } = useTranslation()

  const menuItems = [
    {
      title: t('navigation.dashboard'),
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      title: t('navigation.patients'),
      icon: Users,
      href: '/patients',
    },
    {
      title: t('navigation.statistics'),
      icon: BarChart3,
      href: '/statistiques',
    },
    {
      title: t('navigation.billing'),
      icon: CreditCard,
      href: '/billing',
    },
  ]

  const bottomMenuItems = [
    {
      title: t('navigation.support'),
      icon: HelpCircle,
      href: '/support',
    },
    {
      title: t('navigation.settings'),
      icon: Settings,
      href: '/settings',
    },
    {
      title: t('navigation.clinical_preferences'), // Assuming this for clinical prefs too or add key
      icon: User,
      href: '/profileMedecin',
    },
  ]

  return (
    <Sidebar
      variant="inset"
      className={`bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 overflow-x-hidden ${styles.dashboardSidebar}`}
    >
      <SidebarHeader className="border-b border-green-500/30 bg-slate-800/50">
        <div className={`flex items-center gap-2 px-4 py-3 ${styles.logoContainer}`}>
          <Image
            src={userRole === 'orthodontiste' ? logoPro : logo}
            alt={userRole === 'orthodontiste' ? 'Diamond Pro Logo' : 'Diamond Logo'}
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-transparent overflow-y-auto overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300 font-medium px-4 py-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`${styles.sidebarMenuButton} ${isActive ? styles.active : ''}`}
                    >
                      <Link href={item.href}>
                        <Icon className={`h-4 w-4 ${styles.sidebarIcon}`} />
                        <span className={styles.sidebarText}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-green-500/30 my-2" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300 font-medium px-4 py-2">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col h-full">
            <SidebarMenu>
              {bottomMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`${styles.sidebarMenuButton} ${isActive ? styles.active : ''}`}
                    >
                      <Link href={item.href}>
                        <Icon className={`h-4 w-4 ${styles.sidebarIcon}`} />
                        <span className={styles.sidebarText}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="bg-green-500/30 my-2" />
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col h-full">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/demo'}
                  className={`${styles.sidebarMenuButton} ${pathname === '/demo' ? styles.active : ''
                    }`}
                >
                  <Link href="/demo">
                    <PuzzleIcon className={`h-4 w-4 ${styles.sidebarIcon}`} />
                    <span className={styles.sidebarText}>Demo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/diamond-academy'}
                  className={`${styles.sidebarMenuButton} ${pathname === '/diamond-academy' ? styles.active : ''
                    }`}
                >
                  <Link href="/diamond-academy">
                    <GraduationCapIcon className={`h-4 w-4 ${styles.sidebarIcon}`} />
                    <span className={styles.sidebarText}>{t('navigation.academy')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/events'}
                  className={`${styles.sidebarMenuButton} ${pathname === '/events' ? styles.active : ''
                    }`}
                >
                  <Link href="/events">
                    <CalendarIcon className={`h-4 w-4 ${styles.sidebarIcon}`} />
                    <span className={styles.sidebarText}>{t('navigation.events')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/store'}
                  className={`${styles.sidebarMenuButton} ${pathname === '/store' ? styles.active : ''
                    }`}
                >
                  <Link href="/store">
                    <ShoppingCartIcon className={`h-4 w-4 ${styles.sidebarIcon}`} />
                    <span className={styles.sidebarText}>{t('navigation.store')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-slate-800/50 mt-auto">
        {/* Badge aligné en bas de la section System */}
        <div className="mt-auto pt-4 pb-0 px-4 flex justify-center">
          <Link href="/diamond-purity" className="inline-block relative top-2">
            <Image
              src="/badges/badge7.svg"
              alt="Badge"
              width={686}
              height={880}
              className="w-[45%] mx-auto h-auto transition-opacity duration-200 hover:opacity-70 cursor-pointer"
            />
          </Link>
        </div>
        <SidebarMenu className="mt-2 border-t border-green-500/30 pt-4">
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className={styles.sidebarMenuButton}>
              <User className={`h-4 w-4 ${styles.sidebarIcon}`} />
              <span className={styles.sidebarText}>{t('navigation.logout')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default DashboardSidebar
