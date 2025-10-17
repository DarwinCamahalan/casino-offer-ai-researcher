/**
 * Research Page - AI Research Form
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ResearchForm from '../_components/ResearchForm'
import ResearchLoading from '../_components/ResearchLoading'
import { ResearchRequest, ApiResponse, ResearchResult } from '@/types'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const ResearchPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartResearch = async (request: ResearchRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const data: ApiResponse<ResearchResult> = await response.json()

      if (!data.success || !data.data) {
        throw new Error(data.error?.message || 'Research failed')
      }

      // Store results in localStorage
      localStorage.setItem('research_results', JSON.stringify(data.data))
      
      // Update research history
      const historyKey = 'research_history'
      const existingHistory = localStorage.getItem(historyKey)
      const history = existingHistory ? JSON.parse(existingHistory) : []
      
      const totalCasinos = Object.values(data.data.missing_casinos).reduce(
        (sum, casinos) => sum + casinos.length,
        0
      )
      
      history.push({
        timestamp: new Date().toISOString(),
        states: request.states,
        casinosFound: totalCasinos,
        offersFound: data.data.new_offers.length
      })
      
      localStorage.setItem(historyKey, JSON.stringify(history))
      
      // Also store in sessionStorage for backwards compatibility
      sessionStorage.setItem('research_results', JSON.stringify(data.data))
      
      // Trigger storage event for other components to update
      window.dispatchEvent(new Event('storage'))
      // Trigger custom event for immediate updates
      window.dispatchEvent(new CustomEvent('dataAvailabilityChanged', { detail: { hasData: true } }))
      
      router.push('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">AI Research</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Configure and start intelligent casino and offer discovery
        </p>
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="bg-destructive/10 border-destructive/50">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-foreground">
                <h3 className="text-destructive font-semibold mb-2">Error</h3>
                <p>{error}</p>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form or Loading */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <ResearchLoading key="loading" estimatedTime={120} />
        ) : (
          <ResearchForm key="form" onStartResearch={handleStartResearch} isLoading={isLoading} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResearchPage
