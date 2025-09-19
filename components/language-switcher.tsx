"use client"

import { useRouter, usePathname, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = params.locale as string

  const switchLanguage = (newLocale: string) => {
    // Replace the locale in the current pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '')
    const newPath = `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
  }

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'en' ? 'it' : 'en'
    switchLanguage(newLocale)
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 w-auto px-2 flex items-center gap-1"
      onClick={toggleLanguage}
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-medium">
        {currentLocale === 'en' ? '🇺🇸 EN' : '🇮🇹 IT'}
      </span>
    </Button>
  )
}
