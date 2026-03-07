'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function DonorList({ donors, showAllDonors, setShowAllDonors, setCampaignData }) {
  const [showDropdown, setShowDropdown] = useState(false)

  // Function to get stars based on amount digits
  const getStars = (amount) => {
    const numDigits = amount.toString().length
    return '$'.repeat(numDigits)
  }

  // Shuffle functions
  const shuffleDonors = (type) => {
    let shuffled = [...donors]

    switch(type) {
      case 'random':
        // Random shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        break

      case 'oldest':
        // Sort by date - oldest first (earliest date on top)
        shuffled.sort((a, b) => new Date(a.date) - new Date(b.date))
        break

      case 'highest':
        // Sort by amount - highest first
        shuffled.sort((a, b) => b.amount - a.amount)
        break

      default:
        break
    }

    setCampaignData(prev => ({
      ...prev,
      donors: shuffled
    }))
    setShowDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const displayedDonors = showAllDonors ? donors : donors.slice(0, 4)

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium text-gray-900">Kind Hearts</h2>
          <p className="text-gray-500 mt-1">People who've contributed so far</p>
        </div>
        <div className="flex items-center">
          {/* Shuffle Button with Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="text-sm text-gray-600">Shuffle</span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <div className="py-1">
                  <button
                    onClick={() => shuffleDonors('random')}
                    className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Random
                  </button>
                  <button
                    onClick={() => shuffleDonors('oldest')}
                    className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    First donors
                  </button>
                  <button
                    onClick={() => shuffleDonors('highest')}
                    className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Top donors
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {displayedDonors.map((donor, index) => (
          <motion.div
            key={donor.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                  {donor.name}
                </h3>
                {/* Stars instead of amount */}
                <div className="flex items-center mt-1 text-yellow-500">
                  {getStars(donor.amount)}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(donor.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {donors.length > 4 && (
        <button
          onClick={() => setShowAllDonors(!showAllDonors)}
          className="flex items-center justify-center w-full mt-8 py-3 text-gray-500 hover:text-gray-700 transition-colors border-t border-gray-100"
        >
          <span className="text-sm font-medium">
            {showAllDonors ? 'Show less' : `View all ${donors.length} donors`}
          </span>
          <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAllDonors ? 'rotate-90' : ''}`} />
        </button>
      )}
    </div>
  )
}