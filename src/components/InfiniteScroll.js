'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

export function InfiniteScroll({ 
  hasMore, 
  loadMore, 
  loading, 
  children,
  threshold = 100 
}) {
  const [isMounted, setIsMounted] = useState(false)
  const loadingRef = useRef(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadingRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasMore, loadMore, loading, isMounted])

  if (!isMounted) return null

  return (
    <>
      {children}
      {hasMore && (
        <div 
          ref={loadingRef}
          className="flex justify-center items-center py-8"
        >
          {loading ? (
            <div className="flex items-center space-x-2 text-cinema-gold">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-sm">Loading more movies...</span>
            </div>
          ) : (
            <div className="h-8" />
          )}
        </div>
      )}
    </>
  )
}