'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { tmdbAPI } from '@/lib/tmdb'
import { Star, Calendar, Clock, Play, Download, Heart, ArrowLeft, Users, Tv } from 'lucide-react'
import { motion } from 'framer-motion'
import { MovieCard } from '@/components/MovieCard'
import { ErrorMessage } from '@/components/ErrorBoundary'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function TVShowDetailsPage() {
  const params = useParams()
  const tvId = params.id
  const [tvShow, setTVShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (tvId) {
      fetchTVShowDetails()
      checkFavoriteStatus()
    }
  }, [tvId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTVShowDetails = async () => {
    try {
      setLoading(true)
      const data = await tmdbAPI.getTVShowDetails(parseInt(tvId))
      setTVShow(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.some(fav => fav.id === parseInt(tvId) && fav.type === 'tv'))
  }

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    const tvData = {
      id: tvShow.id,
      title: tvShow.name,
      poster_path: tvShow.poster_path,
      vote_average: tvShow.vote_average,
      release_date: tvShow.first_air_date,
      type: 'tv'
    }

    if (isFavorite) {
      const updated = favorites.filter(fav => !(fav.id === tvShow.id && fav.type === 'tv'))
      localStorage.setItem('favorites', JSON.stringify(updated))
      setIsFavorite(false)
      toast.success('Removed from favorites')
    } else {
      favorites.push(tvData)
      localStorage.setItem('favorites', JSON.stringify(favorites))
      setIsFavorite(true)
      toast.success('Added to favorites')
    }
  }

  const getStreamingUrl = (title, year) => {
    const searchQuery = encodeURIComponent(`${title} ${year}`)
    return `https://www.netflix.com/search?q=${searchQuery}`
  }

  const getDownloadUrl = (title, year) => {
    const searchQuery = encodeURIComponent(`${title} ${year} download`)
    return `https://www.imdb.com/find?q=${searchQuery}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-800" />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
                <div className="h-32 bg-gray-800 rounded" />
              </div>
              <div className="h-96 bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage error={error} retry={fetchTVShowDetails} />
  }

  if (!tvShow) return null

  const backdropUrl = tvShow.backdrop_path 
    ? tmdbAPI.getBackdropURL(tvShow.backdrop_path, 'w1280')
    : null

  const posterUrl = tvShow.poster_path
    ? tmdbAPI.getImageURL(tvShow.poster_path, 'w500')
    : '/placeholder-movie.jpg'

  const firstAirYear = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A'
  const lastAirYear = tvShow.last_air_date ? new Date(tvShow.last_air_date).getFullYear() : 'Present'
  const rating = tvShow.vote_average ? tvShow.vote_average.toFixed(1) : 'N/A'
  const seasons = tvShow.number_of_seasons || 'N/A'
  const episodes = tvShow.number_of_episodes || 'N/A'

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[70vh] overflow-hidden">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt={tvShow.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
        
        {/* Back Button */}
        <Link 
          href="/"
          className="absolute top-6 left-6 z-10 flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>

        {/* TV Show Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                {tvShow.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400" size={20} fill="currentColor" />
                  <span className="font-semibold">{rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={20} />
                  <span>{firstAirYear} - {lastAirYear}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tv size={20} />
                  <span>{seasons} Seasons, {episodes} Episodes</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {tvShow.genres?.map(genre => (
                  <span 
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-sm text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={getStreamingUrl(tvShow.name, firstAirYear)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Play size={20} fill="currentColor" />
                  <span>Watch Now</span>
                </a>
                
                <a
                  href={getDownloadUrl(tvShow.name, firstAirYear)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Download size={20} />
                  <span>Download</span>
                </a>

                <button
                  onClick={toggleFavorite}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isFavorite 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                  <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {tvShow.overview || 'No overview available.'}
              </p>
            </section>

            {/* Cast */}
            {tvShow.credits?.cast?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {tvShow.credits.cast.slice(0, 8).map(actor => (
                    <div key={actor.id} className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2 bg-gray-800 rounded-full overflow-hidden">
                        {actor.profile_path ? (
                          <Image
                            src={tmdbAPI.getImageURL(actor.profile_path, 'w185')}
                            alt={actor.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="text-gray-600" size={24} />
                          </div>
                        )}
                      </div>
                      <p className="text-white text-sm font-medium">{actor.name}</p>
                      <p className="text-gray-400 text-xs">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Poster */}
            <div className="sticky top-6">
              <div className="aspect-[2/3] relative rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={posterUrl}
                  alt={tvShow.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* TV Show Stats */}
              <div className="mt-6 space-y-4">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Show Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-white">{rating}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seasons:</span>
                      <span className="text-white">{seasons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Episodes:</span>
                      <span className="text-white">{episodes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">First Air:</span>
                      <span className="text-white">{firstAirYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white">{tvShow.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Votes:</span>
                      <span className="text-white">{tvShow.vote_count?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar TV Shows */}
        {tvShow.similar?.results?.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Similar TV Shows</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {tvShow.similar.results.slice(0, 12).map(similarShow => (
                <MovieCard 
                  key={similarShow.id} 
                  movie={similarShow} 
                  showFavorite={!!session}
                  type="tv"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}