'use client'

import { useTranslation } from '@/hooks/useTranslation'
import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import StatCard from '../StatCard/StatCard'
import {
  FileText,
  Calendar,
  Clock,
  Cog,
  Activity,
  CheckCircle
} from 'lucide-react'
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  getCountFromServer,
} from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { auth, db } from '../../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const StatusCard = ({ selectedStatus, onStatusSelect }) => {
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [bannerUrl, setBannerUrl] = useState('')
  const [counts, setCounts] = useState({
    drafts: 0,
    enplanification: 0,
    attente: 0,
    entraitement: 0,
    enproduction: 0,
    termine: 0,
  })
  const { t } = useTranslation()

  const router = useRouter()
  const pathname = usePathname()

  // Cards data
  const cards = [
    {
      icon: <FileText className="w-6 h-6" />,
      number: counts.drafts,
      label: t('status.brouillon'),
      statusId: 0,
      color: 'gray'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      number: counts.enplanification,
      label: t('status.planning'),
      statusId: 1,
      color: 'blue'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      number: counts.attente,
      label: t('status.en-attente'),
      statusId: 2,
      color: 'yellow'
    },
    {
      icon: <Cog className="w-6 h-6" />,
      number: counts.enproduction,
      label: t('status.en-production'),
      statusId: 3,
      color: 'orange'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      number: counts.entraitement,
      label: t('status.en-traitement'),
      statusId: 4,
      color: 'purple'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      number: counts.termine,
      label: t('status.termine'),
      statusId: 5,
      color: 'green'
    },
  ]

  useEffect(() => {
    let isMounted = true
    let unsubscribeFunctions = []

    const setupCountsListener = (userId) => {
      const statusMap = {
        0: 'drafts',
        1: 'enplanification',
        2: 'attente',
        3: 'enproduction',
        4: 'entraitement',
        5: 'termine',
      }

      // Set up listeners for each status
      Object.keys(statusMap).forEach((status) => {
        const patientsRef = collection(db, 'patients')
        const q = query(
          patientsRef,
          where('userId', '==', userId),
          where('status', '==', parseInt(status))
        )

        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            if (isMounted) {
              // Filter out archived patients
              const nonArchivedCount = querySnapshot.docs.filter((doc) => {
                const data = doc.data()
                return data.archived !== 1
              }).length

              setCounts((prev) => ({
                ...prev,
                [statusMap[status]]: nonArchivedCount,
              }))
            }
          },
          (error) => {
            /*console.error(`Error listening to status ${status}:`, error);*/
          }
        )

        unsubscribeFunctions.push(unsubscribe)
      })
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clean up previous listeners
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe())
      unsubscribeFunctions = []

      if (user) {
        setupCountsListener(user.uid)
      } else {
        setCounts({
          drafts: 0,
          enplanification: 0,
          attente: 0,
          entraitement: 0,
          enproduction: 0,
          termine: 0,
        })
      }
    })

    return () => {
      isMounted = false
      unsubscribeAuth()
      // Clean up all listeners
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  const handleCardClick = (statusId) => {
    if (onStatusSelect) {
      // If clicking the already selected status, toggle it off (optional, or kept active)
      // For now, let's just select it. If logic requires toggle, we can check selectedStatus === statusId
      onStatusSelect(selectedStatus === statusId ? null : statusId)
    }
  }

  // Function to check if a card is selected
  const isCardSelected = (statusId) => {
    return selectedStatus === statusId
  }

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const user = auth.currentUser
        if (user) {
          const userData = user.displayName
          setUserName(userData || 'Utilisateur')
        } else {
          setUserName('Utilisateur')
        }
      } catch (error) {
        setUserName('Utilisateur')
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  useEffect(() => {
    const fetchBannerImage = async () => {
      try {
        const storage = getStorage()
        const bannerRef = ref(storage, 'pub/banner')
        const url = await getDownloadURL(bannerRef)
        setBannerUrl(url)
      } catch (error) {
        /*console.error('Error fetching banner image:', error);*/
      }
    }

    fetchBannerImage()
  }, [])

  return (
    <>
      <div className="flex flex-nowrap gap-4 mb-8 px-4 max-w-full overflow-x-auto pb-4 snap-x scrollbar-hide">
        {cards.map((card, index) => (
          <StatCard
            key={index}
            icon={card.icon}
            value={card.number}
            label={card.label}
            color={card.color}
            onClick={() => handleCardClick(card.statusId)}
            isSelected={isCardSelected(card.statusId)}
            className="min-w-[220px] flex-1 snap-center"
          />
        ))}
      </div>
    </>
  )
}

export default StatusCard
