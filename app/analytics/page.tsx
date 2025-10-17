/**
 * Analytics Page - Detailed charts and insights
 */

'use client'

import { motion } from 'framer-motion'
import DashboardStats from '../_components/DashboardStats'

const AnalyticsPage = () => {
  return (
    <div className="space-y-8 min-h-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-300">
          Comprehensive insights and trends for casino offer research
        </p>
      </motion.div>

      <DashboardStats />
    </div>
  )
}

export default AnalyticsPage
