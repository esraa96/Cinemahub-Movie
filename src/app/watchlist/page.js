'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Watchlist() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to favorites page since we're using favorites instead of watchlist
    router.replace('/favorites')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-950 light:bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Redirecting to favorites...</p>
      </div>
    </div>
  )
}
