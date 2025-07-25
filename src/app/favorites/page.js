'use client'

import { useState, useEffect } from 'react'
import { MovieCard } from '@/components/MovieCard'
import { Heart, Trash2, Filter, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Head from 'next/head'
import toast from 'react-hot-toast'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem('favorites')
      const favs = stored ? JSON.parse(stored) : []
      setFavorites(favs)
    } catch (error) {
      console.error('Error loading favorites:', error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteChange = () => {
    loadFavorites()
  }

  const clearAllFavorites = () => {
    if (confirm('Are you sure you want to remove all favorites?')) {
      localStorage.removeItem('favorites')
      setFavorites([])
      toast.success('All favorites cleared')
    }
  }

  const removeFavorite = (movieId) => {
    const updated = favorites.filter(fav => fav.id !== movieId)
    localStorage.setItem('favorites', JSON.stringify(updated))
    setFavorites(updated)
    toast.success('Removed from favorites')
  }

  // Filter and sort favorites
  const filteredFavorites = favorites.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id
      case 'oldest':
        return a.id - b.id
      case 'rating':
        return (b.vote_average || 0) - (a.vote_average || 0)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'year':
        const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 0
        const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 0
        return yearB - yearA
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>My Favorites | CinemaHub</title>
        <meta name="description" content="Your favorite movies collection on CinemaHub" />
      </Head>
      
      <div className="min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Heart className="text-red-500" size={40} fill="currentColor" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">My Favorites</h1>
              </div>
              <p className="text-xl text-gray-300">
                {favorites.length} movies in your collection
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-12">
          {favorites.length > 0 ? (
              <>
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search favorites..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm w-64"
                      />
                    </div>
                    
                    {/* Sort */}
                    <div className="flex items-center space-x-2">
                      <Filter size={16} className="text-gray-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="rating">Highest Rated</option>
                        <option value="title">A-Z</option>
                        <option value="year">Release Year</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={clearAllFavorites}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                    <span>Clear All ({favorites.length})</span>
                  </button>
                </div>

                {/* Results Info */}
                {searchQuery && (
                  <div className="mb-6 text-gray-400 text-sm">
                    {filteredFavorites.length === 0 ? (
                      <p>No favorites found matching &quot;{searchQuery}&quot;</p>
                    ) : (
                      <p>Showing {filteredFavorites.length} of {favorites.length} favorites</p>
                    )}
                  </div>
                )}

                {/* Movies Grid */}
                {sortedFavorites.length > 0 ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
                    {sortedFavorites.map((movie, index) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group"
                      >
                        <MovieCard 
                          movie={movie} 
                          showFavorite={true}
                          onFavoriteChange={handleFavoriteChange}
                        />
                        {/* Quick Remove Button */}
                        <button
                          onClick={() => removeFavorite(movie.id)}
                          className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                          title="Remove from favorites"
                        >
                          <Trash2 size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      No matches found
                    </h3>
                    <p className="text-gray-400 mb-6">
                      No favorites match &quot;{searchQuery}&quot;. Try a different search term.
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : null}
              </>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-6xl mb-6">💔</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  No Favorites Yet
                </h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Start building your movie collection by adding movies to your favorites. 
                  Click the heart icon on any movie card to add it here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                    Discover Movies
                  </Link>
                  <Link href="/search" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                    Search Movies
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}