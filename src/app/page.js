'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MovieCard } from '@/components/MovieCard'
import { MovieGridSkeleton, HeroSkeleton } from '@/components/LoadingSkeleton'
import { ErrorMessage, NetworkError } from '@/components/ErrorBoundary'
import { InfiniteScroll } from '@/components/InfiniteScroll'
import { InlineAIChat } from '@/components/InlineAIChat'
import { tmdbAPI } from '@/lib/tmdb'
import { Search, TrendingUp, Clock, Star, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const { data: popularMovies, error: popularError } = useSWR(
    'popular-movies',
    () => tmdbAPI.getPopularMovies(1)
  )

  const { data: nowPlayingData, error: nowPlayingError, mutate: mutateNowPlaying } = useSWR(
    ['now-playing', currentPage],
    () => tmdbAPI.getNowPlayingMovies(currentPage),
    {
      onSuccess: (data) => {
        if (currentPage === 1) {
          setNowPlayingMovies(data.results)
        } else {
          setNowPlayingMovies(prev => [...prev, ...data.results])
        }
        setLoadingMore(false)
      },
      onError: () => setLoadingMore(false)
    }
  )

  const { data: trendingMovies } = useSWR(
    'trending-movies',
    () => tmdbAPI.getTrendingMovies('day')
  )

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const loadMoreMovies = () => {
    if (!loadingMore && nowPlayingData && currentPage < Math.min(nowPlayingData.total_pages, 500)) {
      setLoadingMore(true)
      setCurrentPage(prev => prev + 1)
    }
  }

  const hasMoreMovies = nowPlayingData && currentPage < Math.min(nowPlayingData.total_pages, 500)

  const featuredMovie = trendingMovies?.results?.[0]

  if (nowPlayingError && !nowPlayingData) {
    return nowPlayingError.status === 0 ? 
      <NetworkError retry={() => mutateNowPlaying()} /> : 
      <ErrorMessage error={nowPlayingError} retry={() => mutateNowPlaying()} />
  }

  return (
    <>
      <Head>
        <title>CinemaHub - Discover Amazing Movies</title>
        <meta name="description" content="Discover trending, popular, and now playing movies. Create your watchlist and join the movie community." />
        <meta property="og:title" content="CinemaHub - Discover Amazing Movies" />
        <meta property="og:description" content="Discover trending, popular, and now playing movies. Create your watchlist and join the movie community." />
        <link rel="canonical" href="https://cinemahub.com" />
      </Head>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        {featuredMovie ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${tmdbAPI.getBackdropURL(featuredMovie.backdrop_path, 'w1280')})`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
            <div className="relative z-10 flex items-end h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl"
                >
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                    Welcome to <span className="text-gradient">CinemaHub</span>
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    Discover millions of movies, create your watchlist, and join the ultimate movie community.
                  </p>
                  
                  {/* Search Bar */}
                  <form onSubmit={handleSearch} className="flex max-w-md">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search for movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-black/50 backdrop-blur-sm border border-gray-700 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-4 bg-cinema-gold hover:bg-yellow-500 text-black font-semibold rounded-r-xl transition-colors duration-200"
                    >
                      Search
                    </button>
                  </form>
                </motion.div>
              </div>
            </div>
          </>
        ) : (
          <HeroSkeleton />
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Movies */}
        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <TrendingUp className="text-cinema-gold" size={28} />
            <h2 className="text-3xl font-bold text-white">Trending Today</h2>
          </div>
          
          {trendingMovies ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {trendingMovies.results.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} showFavorite={!!session} />
              ))}
            </div>
          ) : (
            <MovieGridSkeleton count={12} />
          )}
        </section>

        {/* Popular Movies */}
        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Star className="text-cinema-gold" size={28} />
            <h2 className="text-3xl font-bold text-white">Popular Movies</h2>
          </div>
          
          {popularMovies ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {popularMovies.results.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} showFavorite={!!session} />
              ))}
            </div>
          ) : (
            <MovieGridSkeleton count={12} />
          )}
        </section>

        {/* AI Chat Section */}
        <section className="mb-16">
          <InlineAIChat 
            title="Discover Movies with AI" 
            placeholder="Ask for movie recommendations, actor info, or anything about cinema..."
          />
        </section>

        {/* Now Playing with Infinite Scroll */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Clock className="text-cinema-gold" size={28} />
              <h2 className="text-3xl font-bold text-white">Now Playing</h2>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Filter size={16} />
              <span>Page {currentPage}</span>
            </div>
          </div>
          
          {nowPlayingError && nowPlayingData ? (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">Failed to load more movies. Please try again.</p>
            </div>
          ) : null}
          
          <InfiniteScroll
            hasMore={hasMoreMovies}
            loadMore={loadMoreMovies}
            loading={loadingMore}
          >
            {nowPlayingMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {nowPlayingMovies.map((movie, index) => (
                  <motion.div
                    key={`${movie.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MovieCard movie={movie} showFavorite={!!session} />
                  </motion.div>
                ))}
              </div>
            ) : nowPlayingData ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No movies found</p>
              </div>
            ) : (
              <MovieGridSkeleton count={20} />
            )}
          </InfiniteScroll>
        </section>
      </div>
    </div>
    </>
  )
}