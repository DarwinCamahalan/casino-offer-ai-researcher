/**
 * Research Form Component - Modern redesigned with enhanced UX
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResearchRequest, US_STATES, USState, STATE_NAMES } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Loader2, Search, Sparkles, MapPin, Target, Info, AlertTriangle, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  onStartResearch: (request: ResearchRequest) => void
  isLoading: boolean
}

const ResearchForm = ({ onStartResearch, isLoading }: Props) => {
  const [selectedStates, setSelectedStates] = useState<USState[]>(US_STATES)
  const [includeCasinos, setIncludeCasinos] = useState(true)
  const [includeOffers, setIncludeOffers] = useState(true)
  const [researchedCount, setResearchedCount] = useState(0)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showMockDataModal, setShowMockDataModal] = useState(false)
  const [pendingRequest, setPendingRequest] = useState<ResearchRequest | null>(null)

  // Load researched casinos count on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('researched_casinos')
      if (stored) {
        const casinos = JSON.parse(stored)
        setResearchedCount(casinos.length)
      }
    }
  })

  const handleStateToggle = (state: USState) => {
    setSelectedStates((prev) =>
      prev.includes(state)
        ? prev.filter((s) => s !== state)
        : [...prev, state]
    )
  }

  const handleSelectAll = () => {
    setSelectedStates(US_STATES)
  }

  const handleClearAll = () => {
    setSelectedStates([])
  }

  const handleOpenResetModal = () => {
    setShowResetModal(true)
  }

  const handleConfirmReset = () => {
    // Clear all analytics and research data
    localStorage.removeItem('researched_casinos')
    localStorage.removeItem('research_history')
    localStorage.removeItem('research_results')
    localStorage.removeItem('latest_research_result')
    sessionStorage.removeItem('research_results')
    
    // Reset state
    setResearchedCount(0)
    setShowResetModal(false)
    
    // Trigger events to update dashboard and other components
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new CustomEvent('dataAvailabilityChanged', { detail: { hasData: false } }))
    
    console.log('✅ All research data and analytics cleared successfully')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedStates.length === 0) {
      alert('Please select at least one state')
      return
    }

    if (!includeCasinos && !includeOffers) {
      alert('Please select at least one research option')
      return
    }

    const request: ResearchRequest = {
      states: selectedStates,
      include_casino_discovery: includeCasinos,
      include_offer_research: includeOffers,
    }

    // Show mock data warning modal first
    setPendingRequest(request)
    setShowMockDataModal(true)
  }

  const handleProceedWithMockData = () => {
    setShowMockDataModal(false)
    if (pendingRequest) {
      onStartResearch(pendingRequest)
      setPendingRequest(null)
    }
  }

  const handleCancelMockData = () => {
    setShowMockDataModal(false)
    setPendingRequest(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl">
        <CardHeader className="space-y-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl md:text-3xl text-foreground flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  AI Research Configuration
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm md:text-base">
                  Configure your intelligent research parameters to discover casinos and promotional offers
                </CardDescription>
              </div>
              <Badge className="bg-yellow-500 text-black font-bold text-xs md:text-sm">
                GPT-4
              </Badge>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6 md:space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* State Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Label className="text-foreground font-bold text-base md:text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Select Target States
                  <Badge variant="outline" className="ml-2">
                    {selectedStates.length} of {US_STATES.length}
                  </Badge>
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-xs md:text-sm"
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-xs md:text-sm"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {US_STATES.map((state, index) => (
                  <motion.div
                    key={state}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <label
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                        selectedStates.includes(state)
                          ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-primary shadow-lg shadow-primary/25'
                          : 'bg-card/50 border-border hover:border-primary/50 hover:bg-accent'
                      }`}
                    >
                      <Checkbox
                        checked={selectedStates.includes(state)}
                        onCheckedChange={() => handleStateToggle(state)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex-1">
                        <span className="text-foreground font-semibold text-sm md:text-base">
                          {STATE_NAMES[state]}
                        </span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {state}
                        </Badge>
                      </div>
                      {selectedStates.includes(state) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-primary"
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                      )}
                    </label>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-muted-foreground">
                  Select one or more states for the AI to research. Each state will be analyzed for licensed casinos and promotional offers.
                </p>
              </div>
            </motion.div>

            {/* Research Options */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <Label className="text-foreground font-bold text-base md:text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Research Objectives
              </Label>
              
              <div className="space-y-3">
                <motion.label
                  whileHover={{ x: 4 }}
                  className={`flex items-start gap-4 p-4 md:p-5 rounded-xl border-2 transition-all cursor-pointer group ${
                    includeCasinos
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-primary shadow-lg shadow-primary/25'
                      : 'bg-card/50 border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <Checkbox
                    checked={includeCasinos}
                    onCheckedChange={(checked) => setIncludeCasinos(checked as boolean)}
                    className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold text-sm md:text-base">
                        Discover Missing Casinos
                      </span>
                      <Badge className="bg-purple-500 text-white text-xs">
                        Recommended
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Find licensed casino operators not yet tracked in your database. The AI will query official gaming commission websites and regulatory sources.
                    </p>
                  </div>
                </motion.label>

                <motion.label
                  whileHover={{ x: 4 }}
                  className={`flex items-start gap-4 p-4 md:p-5 rounded-xl border-2 transition-all cursor-pointer group ${
                    includeOffers
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-primary shadow-lg shadow-primary/25'
                      : 'bg-card/50 border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <Checkbox
                    checked={includeOffers}
                    onCheckedChange={(checked) => setIncludeOffers(checked as boolean)}
                    className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold text-sm md:text-base">
                        Research Promotional Offers
                      </span>
                      <Badge className="bg-pink-500 text-white text-xs">
                        High Value
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Identify current casino promotions, welcome bonuses, and special offers. Compare with existing offers to find better deals and new opportunities.
                    </p>
                  </div>
                </motion.label>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <Button
                type="submit"
                disabled={isLoading || selectedStates.length === 0 || (!includeCasinos && !includeOffers)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 md:py-6 text-base md:text-lg shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                size="lg"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>AI is Researching...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ready"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-5 w-5" />
                      <span>Start AI Research</span>
                      <Search className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-2 text-center"
              >
                <p className="text-muted-foreground text-xs md:text-sm">
                  ⏱️ Research typically takes 1-3 minutes depending on selected states
                </p>
                <p className="text-muted-foreground text-xs">
                  🔒 Powered by OpenAI GPT-4 • Secure & Reliable
                </p>
                
                {/* Researched Casinos Management */}
                {researchedCount > 0 && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">
                          🎯 <strong>{researchedCount}</strong> casino{researchedCount !== 1 ? 's' : ''} excluded from future searches
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          (Already discovered in previous research sessions)
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleOpenResetModal}
                        className="text-xs flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Reset All
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      {/* Mock Data Warning Modal */}
      <Dialog open={showMockDataModal} onOpenChange={setShowMockDataModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              OpenAI API Removed - Using Mock Data
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Important information about the research process
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    OpenAI API Key Has Been Removed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The OpenAI API integration has been removed from this application. 
                    When you proceed, the system will use <strong>mock data only</strong> to simulate the research process.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    What This Means:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Research results will be generated from pre-configured mock data</li>
                    <li>No actual API calls will be made to OpenAI</li>
                    <li>Data shown is for demonstration purposes only</li>
                    <li>All features will work as expected with simulated data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelMockData}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleProceedWithMockData}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Proceed with Mock Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Modal */}
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Reset All Research Data?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action will permanently delete:
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-destructive">•</span>
                <span>All <strong>{researchedCount} researched casinos</strong> (exclusion list)</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-destructive">•</span>
                <span>Complete <strong>research history</strong> (all sessions)</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-destructive">•</span>
                <span>All <strong>analytics and statistics</strong></span>
              </div>
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-destructive">•</span>
                <span>Dashboard <strong>charts and trends</strong></span>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>
                  This will allow the AI to rediscover all casinos in future research sessions. 
                  Your Xano database will not be affected.
                </span>
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowResetModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmReset}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Yes, Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default ResearchForm
