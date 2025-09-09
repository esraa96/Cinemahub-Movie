'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MovieCard } from '@/components/MovieCard'
import { MovieGridSkeleton } from '@/components/LoadingSkeleton'
import { InfiniteScroll } from '@/components/InfiniteScroll'
import { tmdbAPI } from '@/lib/tmdb'
import { Search, TrendingUp, Clock, Star, Trophy, Calendar, Tv, Zap, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { useParams } from 'next/navigation'

const categoryConfig = {
  'trending': {
    title: 'Trending Movies',
    icon: TrendingUp,
    fetchFunction: (page) => tmdbAPI.getTrendingMovies('day'),
    searchFunction: (query, page) => tmdbAPI.searchMovies(query, page),
    type: 'movie'
  },
  'popular': {
    title: 'Popular Movies',
    icon: Star,
    fetchFunction: (page) => tmdbAPI.getPopularMovies(page),
    searchFunction: (query, page) => tmdbAPI.searchMovies(query, page),
    type: 'movie'
  },
  'now-playing': {
    title: 'Now Playing',
    icon: Clock,
    fetchFunction: (page) => tmdbAPI.getNowPlayingMovies(page),
    searchFunction: (query, page) => tmdbAPI.searchMovies(query, page),
    type: 'movie'
  },
  'top-rated': {
    title: 'Top Rated Movies',
    icon: Trophy,
    fetchFunction: (page) => tmdbAPI.getTopRatedMovies(page),
    searchFunction: (query, page) => tmdbAPI.searchMovies(query, page),
    type: 'movie'
  },
  'upcoming': {
    title: 'Upcoming Movies',
    icon: Calendar,
    fetchFunction: (page) => tmdbAPI.getUpcomingMovies(page),
    searchFunction: (query, page) => tmdbAPI.searchMovies(query, page),
    type: 'movie'
  },
  'tv-shows': {
    title: 'TV Shows',
    icon: Tv,
    fetchFunction: (page) => tmdbAPI.getPopularTVShows(page),
    searchFunction: (query, page) => tmdbAPI.searchTVShows(query, page),
    type: 'tv'
  },
  'anime': {
    title: 'Anime Movies',
    icon: Zap,
    fetchFunction: (page) => tmdbAPI.getAnimeMovies(page),
    searchFunction: (query, page) => tmdbAPI.searchMovies(query, page),
    type: 'movie'
  }
}

export default function CategoryPage() {
  const params = useParams()
  const { slug } = params
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [items, setItems] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const { data: session } = useSession()

  const config = categoryConfig[slug]

  // Always call hooks before any early returns
  const { data, error, mutate } = useSWR(
    config ? [slug, currentPage, 'category'] : null,
    () => config?.fetchFunction(currentPage),
    {
      revalidateOnFocus: false
    }
  )

  const { data: searchData, error: searchError } = useSWR(
    config && searchQuery ? ['search', slug, searchQuery, currentPage] : null,
    () => config?.searchFunction(searchQuery, currentPage),
    {
      revalidateOnFocus: false
    }
  )

  useEffect(() => {
    if (!config) return
    const currentData = isSearching ? searchData : data
    if (currentData && !isSearching && data) {
      if (currentPage === 1) {
        setItems(data.results)
      } else {
        setItems(prev => [...prev, ...data.results])
      }
      setLoadingMore(false)
    } else if (currentData && isSearching && searchData && searchQuery) {
      if (currentPage === 1) {
        setItems(searchData.results)
      } else {
        setItems(prev => [...prev, ...searchData.results])
      }
      setLoadingMore(false)
    }
  }, [data, searchData, currentPage, isSearching, searchQuery, config])

  // Early return after all hooks
  if (!config) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The requested category does not exist.</p>
        </div>
      </div>
    )
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      setCurrentPage(1)
      setItems([])
    } else {
      setIsSearching(false)
      setCurrentPage(1)
      setItems([])
      mutate()
    }
  }

  const loadMore = () => {
    if (!loadingMore) {
      setLoadingMore(true)
      setCurrentPage(prev => prev + 1)
    }
  }

  const currentData = isSearching ? searchData : data
  const hasMore = currentData && currentPage < Math.min(currentData.total_pages, 500)

  const IconComponent = config.icon

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <IconComponent className="text-cinema-gold" size={32} />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{config.title}</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${config.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:border-transparent shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-cinema-gold hover:bg-yellow-500 text-black font-semibold rounded-r-xl transition-colors duration-200 shadow-sm"
            >
              Search
            </button>
          </form>

          {isSearching && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? `Search results for "${searchQuery}"` : 'All results'}
              </p>
              <button
                onClick={() => {
                  setIsSearching(false)
                  setSearchQuery('')
                  setCurrentPage(1)
                  setItems([])
                  mutate()
                }}
                className="text-cinema-gold hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200 font-medium"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <InfiniteScroll
          hasMore={hasMore}
          loadMore={loadMore}
          loading={loadingMore}
        >
          {items.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovieCard movie={item} showFavorite={!!session} type={config.type} />
                </motion.div>
              ))}
            </div>
          ) : currentData && !loadingMore ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                {isSearching ? 'No results found for your search.' : 'No items found.'}
              </p>
            </div>
          ) : (
            <MovieGridSkeleton count={20} />
          )}
        </InfiniteScroll>

        {/* Page Info */}
        {currentData && (
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Filter size={16} />
              <span>Page {currentPage} of {Math.min(currentData.total_pages, 500)}</span>
              <span>•</span>
              <span>{currentData.total_results} total results</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}