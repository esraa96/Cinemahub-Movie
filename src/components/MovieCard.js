'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Heart, Star, Play, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { tmdbAPI } from '@/lib/tmdb'
import toast from 'react-hot-toast'

export function MovieCard({ movie, showFavorite = true, onFavoriteChange }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const posterUrl = movie.poster_path
    ? tmdbAPI.getImageURL(movie.poster_path, 'w500')
    : '/placeholder-movie.jpg'

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A'

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'

  useEffect(() => {
    // Check if movie is in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.some(fav => fav.id === movie.id))
  }, [movie.id])

  const handleFavoriteToggle = (e) => {
    e.stopPropagation()
    
    setIsLoading(true)
    
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      
      if (isFavorite) {
        // Remove from favorites
        const updated = favorites.filter(fav => fav.id !== movie.id)
        localStorage.setItem('favorites', JSON.stringify(updated))
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        // Add to favorites
        const movieData = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          vote_count: movie.vote_count || 0
        }
        favorites.push(movieData)
        localStorage.setItem('favorites', JSON.stringify(favorites))
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
      
      onFavoriteChange?.()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = () => {
    router.push(`/movie/${movie.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className="group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative bg-gray-900 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cinema-gold/20 transition-all duration-300">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="bg-cinema-gold/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <Play className="text-black" size={20} fill="currentColor" />
            </div>
          </motion.div>

          {/* Rating Badge */}
          {rating !== 'N/A' && (
            <motion.div 
              className="absolute top-3 right-3 bg-black/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 border border-cinema-gold/30"
              whileHover={{ scale: 1.1 }}
            >
              <Star className="text-cinema-gold" size={12} fill="currentColor" />
              <span className="text-white text-xs font-bold">{rating}</span>
            </motion.div>
          )}

          {/* Favorite Button */}
          {showFavorite && session && (
            <motion.button
              onClick={handleFavoriteToggle}
              disabled={isLoading}
              className="absolute top-3 left-3 bg-black/90 backdrop-blur-sm rounded-full p-2 hover:bg-red-600/90 transition-all duration-200 border border-white/20"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                size={14}
                className={`transition-all duration-200 ${
                  isFavorite ? 'text-red-400 fill-current' : 'text-white hover:text-red-400'
                }`}
              />
            </motion.button>
          )}

          {/* Quick Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
              <h4 className="text-white font-semibold text-sm line-clamp-1">{movie.title}</h4>
              <div className="flex items-center justify-between text-xs">
                <span className="text-cinema-gold">{releaseYear}</span>
                <div className="flex items-center space-x-1 text-gray-300">
                  <Star size={10} className="text-cinema-gold" fill="currentColor" />
                  <span>{rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900">
          <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-cinema-gold transition-colors duration-200">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{releaseYear}</span>
            </div>
            
            {movie.vote_count > 0 && (
              <span className="text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                {movie.vote_count > 1000 ? `${(movie.vote_count/1000).toFixed(1)}k` : movie.vote_count} votes
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}