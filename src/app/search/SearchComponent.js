'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { MovieCard } from '@/components/MovieCard'
import { MovieGridSkeleton } from '@/components/LoadingSkeleton'
import { ErrorMessage } from '@/components/ErrorBoundary'
import { InfiniteScroll } from '@/components/InfiniteScroll'
import { tmdbAPI } from '@/lib/tmdb'
import { Search, Filter, X, TrendingUp, Film, Tv } from 'lucide-react'
import { motion } from 'framer-motion'
import useSWR from 'swr'

export default function SearchComponent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q')
  const [searchQuery, setSearchQuery] = useState(query || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [allResults, setAllResults] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchType, setSearchType] = useState('all') // 'all', 'movie', 'tv'
  const { data: session } = useSession()

  const searchFunction = async (query, page) => {
    if (searchType === 'movie') {
      return await tmdbAPI.searchMovies(query, page)
    } else if (searchType === 'tv') {
      return await tmdbAPI.searchTVShows(query, page)
    } else {
      // Search both movies and TV shows
      const [movieResults, tvResults] = await Promise.all([
        tmdbAPI.searchMovies(query, page),
        tmdbAPI.searchTVShows(query, page)
      ])
      
      // Combine and sort by popularity
      const combined = [
        ...movieResults.results.map(item => ({ ...item, media_type: 'movie' })),
        ...tvResults.results.map(item => ({ ...item, media_type: 'tv' }))
      ].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      
      return {
        results: combined,
        total_results: movieResults.total_results + tvResults.total_results,
        total_pages: Math.max(movieResults.total_pages, tvResults.total_pages)
      }
    }
  }

  const { data, error, mutate } = useSWR(
    query ? ['search', query, currentPage, searchType] : null,
    () => searchFunction(query, currentPage),
    {
      onSuccess: (data) => {
        if (currentPage === 1) {
          setAllResults(data.results)
        } else {
          setAllResults(prev => [...prev, ...data.results])
        }
        setLoadingMore(false)
      },
      onError: () => setLoadingMore(false)
    }
  )

  useEffect(() => {
    if (query) {
      setCurrentPage(1)
      setAllResults([])
    }
  }, [query, searchType])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    router.push('/search')
  }

  const loadMoreMovies = () => {
    if (!loadingMore && data && currentPage < Math.min(data.total_pages, 500)) {
      setLoadingMore(true)
      setCurrentPage(prev => prev + 1)
    }
  }

  const hasMoreMovies = data && currentPage < Math.min(data.total_pages, 500)

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {query ? `Search Results` : 'Search Movies & TV Shows'}
            </h1>
            {query && (
              <p className="text-xl text-gray-300">
                Found {data?.total_results || 0} results for &ldquo;{query}&rdquo;
              </p>
            )}
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search movies, TV shows, actors, directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-20 py-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:border-cinema-gold transition-all duration-200"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 bg-cinema-gold hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </div>
          </motion.form>

          {/* Search Type Filter */}
          {query && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-6"
            >
              <div className="flex bg-gray-800/50 rounded-lg p-1">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'movie', label: 'Movies' },
                  { value: 'tv', label: 'TV Shows' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setSearchType(type.value)
                      setCurrentPage(1)
                      setAllResults([])
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      searchType === type.value
                        ? 'bg-cinema-gold text-black'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Section */}
        {query ? (
          <section>
            {error ? (
              <ErrorMessage error={error} retry={() => mutate()} />
            ) : (
              <InfiniteScroll
                hasMore={hasMoreMovies}
                loadMore={loadMoreMovies}
                loading={loadingMore}
              >
                {allResults.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-white">
                        Search Results ({data?.total_results || 0})
                      </h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Filter size={16} />
                        <span>Page {currentPage}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
                      {allResults.map((item, index) => {
                        const itemType = item.media_type || (searchType === 'tv' ? 'tv' : 'movie')
                        return (
                          <motion.div
                            key={`${item.id}-${index}-${itemType}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <MovieCard movie={item} showFavorite={!!session} type={itemType} />
                          </motion.div>
                        )
                      })}
                    </div>
                  </>
                ) : data ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-400 mb-6">
                      We couldn&rsquo;t find any {searchType === 'all' ? 'content' : searchType === 'movie' ? 'movies' : 'TV shows'} matching &ldquo;{query}&rdquo;
                    </p>
                    <button
                      onClick={clearSearch}
                      className="btn-primary"
                    >
                      Try a different search
                    </button>
                  </div>
                ) : (
                  <MovieGridSkeleton count={20} />
                )}
              </InfiniteScroll>
            )}
          </section>
        ) : (
          /* Empty State */
          <section className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-6xl mb-6">🎬</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Discover Your Next Favorite Content
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Search through millions of movies and TV shows, find detailed information, and add them to your favorites.
              </p>
              
              {/* Popular Searches */}
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {['Avengers', 'Breaking Bad', 'The Dark Knight', 'Stranger Things', 'Game of Thrones'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term)
                      router.push(`/search?q=${encodeURIComponent(term)}`)
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full transition-colors duration-200 flex items-center space-x-2"
                  >
                    <TrendingUp size={14} />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  )
}
