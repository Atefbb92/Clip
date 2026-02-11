'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Language = 'FR' | 'EN' | 'DE'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('FR')

    useEffect(() => {
        const saved = localStorage.getItem('lang') as Language
        if (saved && (saved === 'FR' || saved === 'EN' || saved === 'DE')) {
            setLanguageState(saved)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('lang', lang)

        // Update HTML lang attribute
        const map: Record<Language, string> = { FR: 'fr', EN: 'en', DE: 'de' }
        document.documentElement.lang = map[lang]
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
