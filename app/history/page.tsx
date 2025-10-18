/**
 * Research History Page - View past research sessions
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  Gift, 
  Building2, 
  AlertCircle,
  History as HistoryIcon,
  ChevronRight,
  Trash2,
  Eye,
  AlertTriangle,
  Info
} from 'lucide-react'
import { ResearchResult, USState, STATE_NAMES } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface HistoryEntry {
  timestamp: string
  states: USState[]
  casinosFound: number
  offersFound: number
  comparisonsFound: number
  betterOffersFound: number
  casinos: any[]
  newOffers: any[]
  comparisons: any[]
  executionTime: number
  apiCallsMade: number
}

const HistoryPage = () => {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showClearAllModal, setShowClearAllModal] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadHistory()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadHistory()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('dataAvailabilityChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('dataAvailabilityChanged', handleStorageChange)
    }
  }, [])

  const loadHistory = () => {
    const historyKey = 'research_history'
    const storedHistory = localStorage.getItem(historyKey)
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory)
      // Sort by timestamp, newest first
      setHistory(parsedHistory.reverse())
    }
  }

  const handleViewDetails = (entry: HistoryEntry) => {
    // Reconstruct the ResearchResult format
    const result: ResearchResult = {
      missing_casinos: entry.casinos.reduce((acc, casino) => {
        const state = casino.state as USState
        if (!acc[state]) {
          acc[state] = []
        }
        acc[state].push(casino)
        return acc
      }, {} as Record<USState, any[]>),
      offer_comparisons: entry.comparisons,
      new_offers: entry.newOffers,
      limitations: [],
      timestamp: entry.timestamp,
      execution_time_ms: entry.executionTime,
      api_calls_made: entry.apiCallsMade
    }

    // Store in research_results temporarily for viewing
    // Don't update latest_research_result so the sidebar link still points to latest
    localStorage.setItem('research_results', JSON.stringify(result))
    
    // Navigate with a flag to indicate this is historical view
    router.push('/results?view=history')
  }

  const handleDeleteEntry = (index: number) => {
    setEntryToDelete(index)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (entryToDelete !== null) {
      const updatedHistory = history.filter((_, i) => i !== entryToDelete)
      // Reverse back to store in chronological order
      localStorage.setItem('research_history', JSON.stringify([...updatedHistory].reverse()))
      setHistory(updatedHistory)
      setShowDeleteModal(false)
      setEntryToDelete(null)
      
      // Trigger storage event
      window.dispatchEvent(new Event('storage'))
    }
  }

  const handleClearAll = () => {
    setShowClearAllModal(true)
  }

  const confirmClearAll = () => {
    // Clear all research data
    localStorage.removeItem('research_history')
    localStorage.removeItem('research_results')
    localStorage.removeItem('latest_research_result')
    localStorage.removeItem('researched_casinos')
    sessionStorage.removeItem('research_results')
    
    setHistory([])
    setShowClearAllModal(false)
    
    // Trigger events to update all components
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new CustomEvent('dataAvailabilityChanged', { detail: { hasData: false } }))
    
    // Redirect to research page
    router.push('/research')
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${seconds}s`
  }

  if (history.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <HistoryIcon className="h-8 w-8 text-primary" />
            Research History
          </h1>
          <p className="text-muted-foreground">
            View and manage your past research sessions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-muted-foreground">
              <h3 className="text-foreground font-semibold mb-2">No Research History</h3>
              <p className="mb-4">You haven't performed any research yet. Start your first research session to see results here.</p>
              <Button
                onClick={() => router.push('/research')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Start Research
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <HistoryIcon className="h-8 w-8 text-primary" />
            Research History
          </h1>
          <p className="text-muted-foreground">
            {history.length} research {history.length === 1 ? 'session' : 'sessions'} completed
          </p>
        </div>

        <Button
          onClick={handleClearAll}
          variant="destructive"
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear All History
        </Button>
      </motion.div>

      {/* History List */}
      <div className="space-y-4">
        <AnimatePresence>
          {history.map((entry, index) => (
            <motion.div
              key={entry.timestamp}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card/95 backdrop-blur-sm border-border hover:border-primary/50 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Left: Date & Time */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {formatDate(entry.timestamp)}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTime(entry.timestamp)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {entry.states.map((state) => (
                            <Badge key={state} variant="secondary" className="text-xs">
                              {STATE_NAMES[state]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Building2 className="h-3 w-3" />
                          <span>Casinos</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{entry.casinosFound}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Gift className="h-3 w-3" />
                          <span>Offers</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{entry.offersFound}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Clock className="h-3 w-3" />
                          <span>Duration</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">
                          {formatDuration(entry.executionTime)}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleViewDetails(entry)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteEntry(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Research Entry</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this research session? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={showClearAllModal} onOpenChange={setShowClearAllModal}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Clear All Research History?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action will permanently delete all research data:
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-destructive">•</span>
                <span>All <strong>{history.length} research sessions</strong></span>
              </div>
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-destructive">•</span>
                <span>Complete <strong>research history</strong> and timestamps</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-destructive">•</span>
                <span>All <strong>current results</strong> and analytics data</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-destructive">•</span>
                <span><strong>Exclusion list</strong> (researched casinos will be rediscovered)</span>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>
                  This will reset the entire application to its initial state. You'll be redirected to start new research.
                </span>
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowClearAllModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmClearAll}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Yes, Clear All History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HistoryPage
