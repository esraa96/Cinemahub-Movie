'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MovieCard } from '@/components/MovieCard'
import { MovieGridSkeleton, HeroSkeleton } from '@/components/LoadingSkeleton'
import { ErrorMessage, NetworkError } from '@/components/ErrorBoundary'
import { InlineAIChat } from '@/components/InlineAIChat'
import { tmdbAPI } from '@/lib/tmdb'
import { Search, TrendingUp, Clock, Star, Trophy, Calendar, Tv, Zap, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  const { data: popularMovies } = useSWR(
    'popular-movies',
    () => tmdbAPI.getPopularMovies(1)
  )

  const { data: nowPlayingMovies } = useSWR(
    'now-playing-movies',
    () => tmdbAPI.getNowPlayingMovies(1)
  )

  const { data: trendingMovies } = useSWR(
    'trending-movies',
    () => tmdbAPI.getTrendingMovies('day')
  )

  const { data: topRatedMovies } = useSWR(
    'top-rated-movies',
    () => tmdbAPI.getTopRatedMovies(1)
  )

  const { data: upcomingMovies } = useSWR(
    'upcoming-movies',
    () => tmdbAPI.getUpcomingMovies(1)
  )

  const { data: animeMovies } = useSWR(
    'anime-movies',
    () => tmdbAPI.getAnimeMovies(1)
  )

  const { data: tvShows } = useSWR(
    'popular-tv-shows',
    () => tmdbAPI.getPopularTVShows(1)
  )

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const featuredMovie = trendingMovies?.results?.[0]

  const categories = [
    {
      title: 'Trending Today',
      data: trendingMovies,
      icon: TrendingUp,
      route: '/category/trending',
      type: 'movie'
    },
    {
      title: 'Popular Movies',
      data: popularMovies,
      icon: Star,
      route: '/category/popular',
      type: 'movie'
    },
    {
      title: 'Now Playing',
      data: nowPlayingMovies,
      icon: Clock,
      route: '/category/now-playing',
      type: 'movie'
    },
    {
      title: 'Top Rated',
      data: topRatedMovies,
      icon: Trophy,
      route: '/category/top-rated',
      type: 'movie'
    },
    {
      title: 'Upcoming Movies',
      data: upcomingMovies,
      icon: Calendar,
      route: '/category/upcoming',
      type: 'movie'
    },
    {
      title: 'TV Shows',
      data: tvShows,
      icon: Tv,
      route: '/category/tv-shows',
      type: 'tv'
    },
    {
      title: 'Anime Movies',
      data: animeMovies,
      icon: Zap,
      route: '/category/anime',
      type: 'movie'
    }
  ]

  return (
    <>
      <Head>
        <title>CinemaHub - Discover Amazing Movies</title>
        <meta name="description" content="Discover trending, popular, and now playing movies. Create your watchlist and join the movie community." />
        <meta property="og:title" content="CinemaHub - Discover Amazing Movies" />
        <meta property="og:description" content="Discover trending, popular, and now playing movies. Create your watchlist and join the movie community." />
        <link rel="canonical" href="https://cinemahub.com" />
      </Head>
      <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[80vh] overflow-hidden">
        {featuredMovie ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${tmdbAPI.getBackdropURL(featuredMovie.backdrop_path, 'w1280')})`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-gray-950 dark:via-gray-950/50" />
            <div className="relative z-10 flex items-end h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-20">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl"
                >
                  <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-black dark:text-white mb-4 sm:mb-6">
                    Welcome to <span className="text-gradient">CinemaHub</span>
                  </h1>
                  <p className="text-base sm:text-xl text-gray-800 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                    Discover millions of movies, create your watchlist, and join the ultimate movie community.
                  </p>
                  
                  {/* Search Bar */}
                  <form onSubmit={handleSearch} className="flex max-w-md">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search for movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-black/50 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-l-xl text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-gold focus:border-transparent"
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

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-12">
        {/* Categories */}
        {categories.map((category, index) => (
          <section key={category.title} className="mb-8 sm:mb-16">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <category.icon className="text-cinema-gold" size={20} />
                <h2 className="text-xl sm:text-3xl font-bold text-black dark:text-white">{category.title}</h2>
              </div>
              <Link 
                href={category.route}
                className="flex items-center space-x-1 text-cinema-gold hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200 text-sm sm:text-base font-medium"
              >
                <span>See More</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            
            {category.data ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
                {category.data.results.slice(0, 10).map((item) => (
                  <MovieCard key={item.id} movie={item} showFavorite={!!session} type={category.type} />
                ))}
              </div>
            ) : (
              <MovieGridSkeleton count={10} />
            )}
          </section>
        ))}

        {/* AI Chat Section */}
        <section className="mb-16">
          <InlineAIChat 
            title="Discover Movies with AI" 
            placeholder="Ask for movie recommendations, actor info, or anything about cinema..."
          />
        </section>
      </div>
    </div>
    </>
  )
}