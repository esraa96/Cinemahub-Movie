'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Animation */}
          <motion.div
            className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text mb-8"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            404
          </motion.div>

          {/* Movie Reel Animation */}
          <motion.div
            className="text-6xl mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            🎬
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Oops! This Page is Missing
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Looks like this page went to grab some popcorn and never came back. 
            Don&apos;t worry, there are plenty of great movies waiting for you!
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/search"
              className="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <Search size={20} />
              <span>Search Movies</span>
            </Link>
          </motion.div>

          {/* Popular Links */}
          <motion.div
            className="mt-12 pt-8 border-t border-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-gray-500 mb-4">Or explore these popular sections:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { href: '/', label: 'Trending Movies' },
                { href: '/favorites', label: 'My Favorites' },
                { href: '/search?q=action', label: 'Action Movies' },
                { href: '/search?q=comedy', label: 'Comedy Movies' }
              ].map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Fun Fact */}
          <motion.div
            className="mt-8 p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-gray-400 text-sm">
              <span className="text-yellow-500 font-semibold">Fun Fact:</span> The first 404 error was discovered at CERN in 1992. 
              Much like this page, it was also missing! 🎭
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}