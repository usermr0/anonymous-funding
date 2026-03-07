'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function CampaignHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-3xl mx-auto"
    >
      <div className="inline-flex items-center justify-center p-2 bg-gray-50 rounded-full mb-3">
        <Heart className="w-5 h-5 text-gray-600 mr-2" />
        <span className="text-sm font-medium text-gray-600">Anonymous Campaign</span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900 leading-tight">
        Help Me Make
        <span className="block text-gray-700 mt-1">This Possible</span>
      </h1>

      <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
        Too genuine to reveal my identity, yet deeply grateful for your contribution.
        I created this campaign because I need support during a difficult moment,
        and your kindness can help me rebuild.
      </p>
    </motion.div>
  )
}