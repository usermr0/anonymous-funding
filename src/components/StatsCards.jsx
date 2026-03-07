'use client'

import { Users, Award } from 'lucide-react'

export default function StatsCards({ donorCount, fundedPercentage }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <Users className="w-6 h-6 text-gray-700 mb-3" />
        <div className="text-2xl font-semibold text-gray-900">{donorCount}</div>
        <div className="text-sm text-gray-500">Total Donors</div>
      </div>
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <Award className="w-6 h-6 text-gray-700 mb-3" />
        <div className="text-2xl font-semibold text-gray-900">{fundedPercentage}%</div>
        <div className="text-sm text-gray-500">Funded</div>
      </div>
    </div>
  )
}