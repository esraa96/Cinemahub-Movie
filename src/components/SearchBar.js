'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { tmdbAPI } from '@/lib/tmdb'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const debounceRef = useRef(null)
  const inputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recent-searches') || '[]');
    setRecentSearches(recent);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length > 2) {
      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await tmdbAPI.searchMovies(query, 1);
          setSuggestions(results.results.slice(0, 5));
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setLoading(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    const recent = JSON.parse(localStorage.getItem('recent-searches') || '[]');
    const updated = [searchQuery, ...recent.filter(item => item !== searchQuery)].slice(0, 5);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
    setRecentSearches(updated);

    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setShowSuggestions(false);
    setQuery('');
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recent-searches');
    setRecentSearches([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
            showSuggestions ? 'text-yellow-500' : 'text-gray-400'
          }`} 
          size={18} 
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search movies, actors, directors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
          >
            {loading && (
              <div className="p-4 text-center">
                <div className="inline-flex items-center space-x-2 text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-yellow-500 rounded-full animate-spin" />
                  <span className="text-sm">Searching...</span>
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-gray-400 px-3 py-2 font-medium">Movies</div>
                {suggestions.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleSearch(movie.title)}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                      {movie.poster_path ? (
                        <Image
                          src={tmdbAPI.getImageURL(movie.poster_path, 'w92')}
                          alt={movie.title}
                          width={40}
                          height={56}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          🎬
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                      <p className="text-gray-400 text-xs">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        {movie.vote_average > 0 && (
                          <span className="ml-2">⭐ {movie.vote_average.toFixed(1)}</span>
                        )}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && suggestions.length === 0 && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs text-gray-400 font-medium flex items-center space-x-1">
                    <Clock size={12} />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-left"
                  >
                    <Clock size={14} className="text-gray-500" />
                    <span className="text-white text-sm">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {!loading && suggestions.length === 0 && query.length === 0 && (
              <div className="p-2">
                <div className="text-xs text-gray-400 px-3 py-2 font-medium flex items-center space-x-1">
                  <TrendingUp size={12} />
                  <span>Popular Searches</span>
                </div>
                {['Avengers', 'Batman', 'Spider-Man', 'Star Wars', 'Marvel'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-left"
                  >
                    <TrendingUp size={14} className="text-yellow-500" />
                    <span className="text-white text-sm">{term}</span>
                  </button>
                ))}
              </div>
            )}

            {!loading && suggestions.length === 0 && query.length > 2 && (
              <div className="p-4 text-center text-gray-400">
                <p className="text-sm">No movies found for &ldquo;{query}&rdquo;</p>
                <button
                  onClick={() => handleSearch()}
                  className="mt-2 text-yellow-500 hover:text-yellow-400 text-sm transition-colors"
                >
                  Search anyway
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showSuggestions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}