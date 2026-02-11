'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import fr from '@/locales/fr.json'
import en from '@/locales/en.json'
import de from '@/locales/de.json'

const translations: Record<string, any> = {
    FR: fr,
    EN: en,
    DE: de,
}

export function useTranslation() {
    const { language } = useLanguage()

    const t = (path: string, params?: Record<string, string>) => {
        const keys = path.split('.')
        let current = translations[language]

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key]
            } else {
                // Fallback to FR if key is missing
                let fallback = translations['FR']
                for (const fKey of keys) {
                    if (fallback && typeof fallback === 'object' && fKey in fallback) {
                        fallback = fallback[fKey]
                    } else {
                        return path // Return key if not found at all
                    }
                }
                current = fallback
                break // Found fallback, exit inner loop
            }
        }

        if (typeof current === 'string' && params) {
            Object.keys(params).forEach(key => {
                current = current.replace(`{{${key}}}`, params[key])
            })
        }

        return current
    }

    return { t, language }
}
