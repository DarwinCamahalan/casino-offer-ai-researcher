/**
 * Home Page - Modern Dashboard with Analytics
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardStats from './_components/DashboardStats'
import { Search, TrendingUp, Database, Sparkles, ArrowRight } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="space-y-8 min-h-full">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              Casino Offer AI Researcher
            </h1>
            <p className="text-gray-300 text-lg">
              Intelligent discovery powered by GPT-4
            </p>
          </div>
          
          <Link href="/research">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50"
            >
              <Search className="h-5 w-5 mr-2" />
              Start Research
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Link href="/research">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-white/10 h-full">
              <CardHeader>
                <Search className="h-8 w-8 text-white mb-2" />
                <CardTitle className="text-white">AI Research</CardTitle>
                <CardDescription className="text-purple-100">
                  Discover missing casinos and better offers
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </Link>

        <Link href="/analytics">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-blue-600 to-cyan-800 border-white/10 h-full">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-white mb-2" />
                <CardTitle className="text-white">Analytics</CardTitle>
                <CardDescription className="text-blue-100">
                  View trends and insights
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </Link>

        <Link href="/results">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-green-600 to-emerald-800 border-white/10 h-full">
              <CardHeader>
                <Database className="h-8 w-8 text-white mb-2" />
                <CardTitle className="text-white">Latest Results</CardTitle>
                <CardDescription className="text-green-100">
                  Browse research findings
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </Link>
      </motion.div>

      {/* Dashboard Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DashboardStats />
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-400" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
              <p>Select states to research (NJ, MI, PA, WV)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
              <p>AI queries official gaming commissions and casino websites</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">3</div>
              <p>Compare discovered data against your database</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">4</div>
              <p>Identify gaps, missing casinos, and better offers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <p>AI-powered research (no web scraping)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <p>Official regulatory source prioritization</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <p>Casino-only focus (excludes sports betting)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <p>Real-time promotional offer discovery</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <p>Confidence scoring for results</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <p>Structured JSON output for integration</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default HomePage
