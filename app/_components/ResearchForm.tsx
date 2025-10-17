/**
 * Research Form Component - Modern with Framer Motion animations
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResearchRequest, US_STATES, USState, STATE_NAMES } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Loader2, Search, Sparkles } from 'lucide-react'

interface Props {
  onStartResearch: (request: ResearchRequest) => void
  isLoading: boolean
}

const ResearchForm = ({ onStartResearch, isLoading }: Props) => {
  const [selectedStates, setSelectedStates] = useState<USState[]>(US_STATES)
  const [includeCasinos, setIncludeCasinos] = useState(true)
  const [includeOffers, setIncludeOffers] = useState(true)

  const handleStateToggle = (state: USState) => {
    setSelectedStates((prev) =>
      prev.includes(state)
        ? prev.filter((s) => s !== state)
        : [...prev, state]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedStates.length === 0) {
      alert('Please select at least one state')
      return
    }

    const request: ResearchRequest = {
      states: selectedStates,
      include_casino_discovery: includeCasinos,
      include_offer_research: includeOffers,
    }

    onStartResearch(request)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Search className="h-6 w-6 text-purple-400" />
              Configure Research
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2">
              Select states and research options to discover casinos and promotional offers
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* State Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <Label className="text-white font-semibold text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Select States to Research
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {US_STATES.map((state, index) => (
                  <motion.div
                    key={state}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <label
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedStates.includes(state)
                          ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-500'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Checkbox
                        checked={selectedStates.includes(state)}
                        onCheckedChange={() => handleStateToggle(state)}
                        className="border-white/30"
                      />
                      <div>
                        <span className="text-white font-medium">{STATE_NAMES[state]}</span>
                        <span className="text-purple-300 text-sm ml-2">({state})</span>
                      </div>
                    </label>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Research Options */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <Label className="text-white font-semibold text-base">
                Research Options
              </Label>
              
              <motion.label
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <Checkbox
                  checked={includeCasinos}
                  onCheckedChange={(checked) => setIncludeCasinos(checked as boolean)}
                  className="border-white/30"
                />
                <div>
                  <div className="text-white font-medium">Discover Missing Casinos</div>
                  <div className="text-gray-400 text-sm">
                    Find licensed casinos not yet tracked in your database
                  </div>
                </div>
              </motion.label>

              <motion.label
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <Checkbox
                  checked={includeOffers}
                  onCheckedChange={(checked) => setIncludeOffers(checked as boolean)}
                  className="border-white/30"
                />
                <div>
                  <div className="text-white font-medium">Research Promotional Offers</div>
                  <div className="text-gray-400 text-sm">
                    Identify current casino promotions and compare with existing offers
                  </div>
                </div>
              </motion.label>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                type="submit"
                disabled={isLoading || selectedStates.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span>Researching...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ready"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Search className="h-5 w-5" />
                      <span>Start AI Research</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-gray-400 text-sm text-center mt-4"
              >
                Research typically takes 1-3 minutes depending on selected states
              </motion.p>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ResearchForm
