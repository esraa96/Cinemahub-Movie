'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

export function ErrorMessage({ error, retry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-md text-center">
        <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
        <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-6">
          {error?.message || 'Failed to load content. Please try again.'}
        </p>
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  )
}

export function NetworkError({ retry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">📡</div>
        <h3 className="text-xl font-semibold text-white mb-2">Connection Error</h3>
        <p className="text-gray-400 mb-6">
          Please check your internet connection and try again.
        </p>
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center space-x-2 bg-cinema-gold hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            <RefreshCw size={16} />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  )
}