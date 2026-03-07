'use client'

import { motion } from 'framer-motion'

export default function FundingProgress({ raisedAmount, remainingAmount, progressPercentage }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Progress</p>
          <p className="text-4xl font-light text-gray-900 mt-2">
            ₹{raisedAmount.toLocaleString('en-IN')}
            <span className="text-lg font-normal text-gray-400 ml-2">raised</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Required</p>
          <p className="text-2xl font-light text-gray-700">₹{remainingAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full bg-gray-900 rounded-full"
        />
      </div>
    </div>
  )
}