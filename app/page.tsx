/**
 * Home Page - Modern Dashboard with Analytics
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardStats from './_components/DashboardStats'
import { Search, TrendingUp, Database, Sparkles, ArrowRight } from 'lucide-react'

const HomePage = () => {
  const router = useRouter()
  const [hasData, setHasData] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if there's any data available
    const checkForData = async () => {
      try {
        const storedResults = localStorage.getItem('research_results')
        
        if (storedResults) {
          const results = JSON.parse(storedResults)
          const hasCasinos = results.missing_casinos && Object.keys(results.missing_casinos).length > 0
          const hasOffers = results.new_offers && results.new_offers.length > 0
          
          if (hasCasinos || hasOffers) {
            setHasData(true)
            return
          }
        }
        
        // Try to fetch from Xano API
        try {
          const response = await fetch('/api/offers/existing')
          const data = await response.json()
          
          if (data.success && data.data && data.data.length > 0) {
            setHasData(true)
            return
          }
        } catch (error) {
          console.error('Error fetching from API:', error)
        }
        
        // No data available, redirect to research page
        router.push('/research')
      } catch (error) {
        console.error('Error checking for data:', error)
        router.push('/research')
      }
    }

    checkForData()
  }, [router])

  if (hasData === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 min-h-full">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2 md:gap-3">
              Casino Offer AI Dashboard
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Intelligent discovery powered by GPT-4
            </p>
          </div>
          
          <Link href="/research">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 w-full md:w-auto"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Start Research
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
      >
        <Link href="/research">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="cursor-pointer h-full"
          >
            <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0 shadow-lg h-full">
              <CardHeader className="p-4 md:p-6">
                <Search className="h-6 w-6 md:h-8 md:w-8 text-white mb-2" />
                <CardTitle className="text-white text-base md:text-lg">AI Research</CardTitle>
                <CardDescription className="text-purple-100 text-sm">
                  Discover missing casinos and better offers
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </Link>

        <Link href="/analytics">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="cursor-pointer h-full"
          >
            <Card className="bg-gradient-to-br from-blue-600 to-cyan-800 border-0 shadow-lg h-full">
              <CardHeader className="p-4 md:p-6">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-white mb-2" />
                <CardTitle className="text-white text-base md:text-lg">Analytics</CardTitle>
                <CardDescription className="text-blue-100 text-sm">
                  View trends and insights
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </Link>

        <Link href="/results">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="cursor-pointer h-full"
          >
            <Card className="bg-gradient-to-br from-green-600 to-emerald-800 border-0 shadow-lg h-full">
              <CardHeader className="p-4 md:p-6">
                <Database className="h-6 w-6 md:h-8 md:w-8 text-white mb-2" />
                <CardTitle className="text-white text-base md:text-lg">Latest Results</CardTitle>
                <CardDescription className="text-green-100 text-sm">
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
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
      >
        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base md:text-lg">
              <Database className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-sm md:text-base">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
              <p>Select states to research (NJ, MI, PA, WV)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
              <p>AI queries official gaming commissions and casino websites</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">3</div>
              <p>Compare discovered data against your database</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">4</div>
              <p>Identify gaps, missing casinos, and better offers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base md:text-lg">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-sm md:text-base">
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
