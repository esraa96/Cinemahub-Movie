'use client'

import { useState } from 'react'
import { Send, Bot, User, Loader2, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export function InlineAIChat({ title = "Ask AI about movies", placeholder = "Ask me anything about movies..." }) {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    const userMessage = message.trim()
    setLoading(true)
    setShowResponse(true)
    setResponse('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setResponse(data.response)
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to get AI response')
      setResponse('Sorry, I encountered an error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessage('')
    setResponse('')
    setShowResponse(false)
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <MessageCircle size={16} className="text-white sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Get instant movie recommendations and information</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="mb-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            <span>{loading ? 'Asking...' : 'Ask AI'}</span>
          </button>
        </div>
      </form>

      {/* Response */}
      <AnimatePresence>
        {showResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* User Message */}
            <div className="flex justify-end">
              <div className="flex items-start space-x-2 max-w-[90%] sm:max-w-[80%]">
                <div className="bg-yellow-500 text-black p-2 sm:p-3 rounded-2xl rounded-tr-sm">
                  <p className="text-xs sm:text-sm">{message}</p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={12} className="text-black sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[95%] sm:max-w-[90%]">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                </div>
                <div className="bg-gray-800 border border-gray-600 p-3 sm:p-4 rounded-2xl rounded-tl-sm">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 size={14} className="animate-spin text-purple-400 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm text-gray-300">AI is thinking...</span>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-white whitespace-pre-wrap leading-relaxed">{response}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Clear Button */}
            {!loading && response && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={clearChat}
                  className="text-gray-400 hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Clear conversation
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}