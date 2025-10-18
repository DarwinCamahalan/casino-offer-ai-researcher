
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import ResearchResults from '@/app/_components/ResearchResults'
import { ResearchResult } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, AlertCircle, Calendar, Clock, Database, Download, FileJson, FileSpreadsheet, Building2, Gift, TrendingUp } from 'lucide-react'

const ResultsContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [results, setResults] = useState<ResearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLatest, setIsLatest] = useState(false)

  useEffect(() => {
    // Reset loading state on every mount
    setLoading(true)
    setError(null)
    setIsLatest(false)
    
    // Check if viewing from history (has ?view=history parameter)
    const isHistoryView = searchParams.get('view') === 'history'
    
    console.log('Results page loaded:', { isHistoryView, pathname })
    
    if (isHistoryView) {
      // Load from research_results (set by history page)
      const storedResults = localStorage.getItem('research_results')
      
      if (storedResults) {
        try {
          const parsedResults = JSON.parse(storedResults)
          setResults(parsedResults)
        } catch (err) {
          setError('Failed to load historical results from storage')
        }
      } else {
        setError('No historical results found.')
      }
    } else {
      // ALWAYS load from latest_research_result when not viewing history
      // This ensures clicking "Results" in sidebar always shows latest
      const latestResult = localStorage.getItem('latest_research_result')
      
      if (latestResult) {
        try {
          const parsedResults = JSON.parse(latestResult)
          // IMPORTANT: Update research_results to match latest
          // This keeps research_results in sync with what we're displaying
          localStorage.setItem('research_results', latestResult)
          setResults(parsedResults)
          setIsLatest(true) // Mark as latest
        } catch (err) {
          setError('Failed to load latest results from storage')
        }
      } else {
        // Fallback only if no latest exists (backward compatibility)
        const storedResults = localStorage.getItem('research_results') || sessionStorage.getItem('research_results')
        
        if (storedResults) {
          try {
            const parsedResults = JSON.parse(storedResults)
            setResults(parsedResults)
          } catch (err) {
            setError('Failed to load results from storage')
          }
        } else {
          setError('No research results found. Please run a new research from the dashboard.')
        }
      }
    }
    
    setLoading(false)
  }, [searchParams, pathname])

  const handleBackToDashboard = () => {
    router.push('/')
  }

  const handleNewResearch = () => {
    // Don't clear localStorage, just sessionStorage
    sessionStorage.removeItem('research_results')
    router.push('/research')
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100 // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const convertToCSV = (data: any[], headers: string[]): string => {
    const csvRows = []
    
    // Add headers
    csvRows.push(headers.join(','))
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma
        const escaped = ('' + value).replace(/"/g, '""')
        return `"${escaped}"`
      })
      csvRows.push(values.join(','))
    }
    
    return csvRows.join('\n')
  }

  const handleDownloadCSV = () => {
    if (!results) return

    // Prepare data for CSV
    const csvData: any[] = []
    
    // Add missing casinos
    Object.entries(results.missing_casinos).forEach(([state, casinos]) => {
      casinos.forEach(casino => {
        csvData.push({
          Type: 'Missing Casino',
          State: state,
          Name: casino.name,
          Website: casino.website || 'N/A',
          Status: casino.is_operational ? 'Operational' : 'Not Operational',
          Source: casino.source || 'N/A',
        })
      })
    })
    
    // Add new offers
    results.new_offers.forEach(offer => {
      csvData.push({
        Type: 'New Offer',
        State: offer.state,
        Casino: offer.casino_name,
        Offer: offer.offer_title,
        Bonus: offer.bonus_amount || 'N/A',
        Match: offer.match_percentage || 'N/A',
        Wagering: offer.wagering_requirements || 'N/A',
        PromoCode: offer.promo_code || 'N/A',
      })
    })
    
    // Add offer comparisons
    results.offer_comparisons.forEach(comparison => {
      csvData.push({
        Type: comparison.is_new ? 'New Comparison' : comparison.is_better ? 'Better Offer' : 'Comparison',
        State: comparison.state,
        Casino: comparison.casino,
        CurrentOffer: comparison.current_offer || 'None',
        DiscoveredOffer: comparison.discovered_offer,
        Notes: comparison.difference_notes,
        Confidence: comparison.confidence_score ? `${comparison.confidence_score}%` : 'N/A',
      })
    })

    // Define headers based on all possible fields
    const allHeaders = new Set<string>()
    csvData.forEach(row => {
      Object.keys(row).forEach(key => allHeaders.add(key))
    })
    
    const headers = Array.from(allHeaders)
    const csv = convertToCSV(csvData, headers)
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `research-results-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadJSON = () => {
    if (!results) return
    
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `research-results-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
            <p className="text-white text-lg">Loading results...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Button
            onClick={() => router.push('/database')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Database className="h-4 w-4 mr-2" />
            View Database
          </Button>
        </div>

        <Alert className="bg-red-900/30 border-red-500/50">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-gray-300">
            <h3 className="text-red-300 font-semibold mb-2">No Results Found</h3>
            <p className="mb-4">{error || 'No research results available.'}</p>
            <Button
              onClick={handleBackToDashboard}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Go to Dashboard
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            Research Results
          </h1>
          <p className="text-muted-foreground mb-3">
            AI-powered casino and offer discovery results
          </p>
          {isLatest ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30">
              Latest
            </Badge>
          ) : results.timestamp && (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground bg-card border border-border rounded-lg px-3 py-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">{formatDate(results.timestamp)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground bg-card border border-border rounded-lg px-3 py-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">{formatTime(results.timestamp)}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => router.push('/database')}
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            <Database className="h-4 w-4 mr-2" />
            View Database
          </Button>
          
          <Button
            onClick={handleNewResearch}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            🚀 New Research
          </Button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="sticky top-4 z-10 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-purple-500/30 rounded-lg p-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('missing-casinos')}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" />
              Missing Casinos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('new-offers')}
              className="gap-2"
            >
              <Gift className="h-4 w-4" />
              New Offers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('offer-comparisons')}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Comparisons
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCSV}
              className="gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadJSON}
              className="gap-2"
            >
              <FileJson className="h-4 w-4" />
              JSON
            </Button>
          </div>
        </div>
      </div>

      {/* Results Component */}
      <ResearchResults results={results} />
    </div>
  )
}
const ResultsPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
            <p className="text-white text-lg">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}

export default ResultsPage
