
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ResearchResults from '@/app/_components/ResearchResults'
import { ResearchResult } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

const ResultsContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [results, setResults] = useState<ResearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Try to get results from localStorage first, then sessionStorage
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
    
    setLoading(false)
  }, [searchParams])

  const handleBackToDashboard = () => {
    router.push('/')
  }

  const handleNewResearch = () => {
    // Don't clear localStorage, just sessionStorage
    sessionStorage.removeItem('research_results')
    router.push('/research')
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
            onClick={handleBackToDashboard}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
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
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            🎰 Research Results
          </h1>
          <p className="text-gray-300">
            AI-powered casino and offer discovery results
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button
            onClick={handleNewResearch}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            🚀 New Research
          </Button>
        </div>
      </div>

      {/* Results Component */}
      <ResearchResults results={results} />

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
          <Button
            onClick={handleNewResearch}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            🚀 Start New Research
          </Button>
          
          <Button
            onClick={() => {
              const dataStr = JSON.stringify(results, null, 2)
              const dataBlob = new Blob([dataStr], { type: 'application/json' })
              const url = URL.createObjectURL(dataBlob)
              const link = document.createElement('a')
              link.href = url
              link.download = `research-results-${new Date().toISOString().split('T')[0]}.json`
              link.click()
              URL.revokeObjectURL(url)
            }}
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            💾 Download JSON
          </Button>
      </div>
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
