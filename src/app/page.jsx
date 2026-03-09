'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Users, Award } from 'lucide-react'
import CampaignHeader from '@/components/CampaignHeader'
import FundingProgress from '@/components/FundingProgress'
import MessageCard from '@/components/MessageCard'
import StatsCards from '@/components/StatsCards'
import DonationForm from '@/components/DonationForm'
import IntroductionSection from '@/components/IntroductionSection';
import DonorList from '@/components/DonorList'

export default function HomePage() {
  const [campaignData, setCampaignData] = useState({
    principalAmount: 1069879,
    raisedAmount: 0,
    donors: []
  })

  const [showAllDonors, setShowAllDonors] = useState(false)

  // Load donors from database - FIXED: Removed nested useEffect
  useEffect(() => {
    const loadDonors = async () => {
      try {
        const response = await fetch('/api/donors')
        const data = await response.json()

        console.log('API Response:', data) // Check what's coming back

        // Check if data is an array
        if (Array.isArray(data)) {
          const totalRaised = data.reduce((sum, d) => sum + d.amount, 0)
          setCampaignData(prev => ({
            ...prev,
            raisedAmount: totalRaised,
            donors: data,
          }))
        } else {
          console.error('API did not return an array:', data)
          // Set empty array as fallback
          setCampaignData(prev => ({
            ...prev,
            donors: []
          }))
        }
      } catch (error) {
        console.error('Failed to load donors:', error)
        setCampaignData(prev => ({
          ...prev,
          donors: []
        }))
      }
    }

    loadDonors()
  }, []) // Empty dependency array means run once on mount

  const handleDonationSubmitted = () => {
    // Refresh donors list
    fetch('/api/donors')
      .then(res => res.json())
      .then(data => {
        // Check if data is an array
        if (Array.isArray(data)) {
          const totalRaised = data.reduce((sum, d) => sum + d.amount, 0)
          setCampaignData(prev => ({
            ...prev,
            raisedAmount: totalRaised,
            donors: data,
          }))
        } else {
          console.error('API did not return an array:', data)
        }
      })
      .catch(error => console.error('Failed to refresh donors:', error))
  }

  const remainingAmount = campaignData.principalAmount - campaignData.raisedAmount
  const progressPercentage = (campaignData.raisedAmount / campaignData.principalAmount) * 100
  const fundedPercentage = Math.round(progressPercentage)

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-6 right-6 z-10">
        <p className="text-sm text-gray-400 font-light">
          Hello, <span className="text-gray-600">Mr Zero</span> this side
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none h-[800px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <CampaignHeader />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mt-16">

          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <FundingProgress
              raisedAmount={campaignData.raisedAmount}
              remainingAmount={remainingAmount}
              progressPercentage={progressPercentage}
            />
            <MessageCard />
            <StatsCards
              donorCount={campaignData.donors.length}
              fundedPercentage={fundedPercentage}
            />
          </motion.div>

          {/* Right Column - Donation Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DonationForm
              onDonationSubmitted={handleDonationSubmitted}
              upiId="shubhamvx@ybl"
              businessName="Help Fund"
            />
          </motion.div>
        </div>

        {/* Introduction Section - New */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-16"
        >
          <IntroductionSection />
        </motion.div>

        {/* Donor List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24"
        >
          <DonorList
            donors={campaignData.donors}
            showAllDonors={showAllDonors}
            setShowAllDonors={setShowAllDonors}
            setCampaignData={setCampaignData}
          />
        </motion.div>
      </div>
    </div>
  )
}