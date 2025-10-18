/**
 * Research Results Component - Display AI research findings
 */

'use client'

import { motion } from 'framer-motion'
import { ResearchResult } from '@/types'
import { STATE_NAMES } from '@/types/casino/states'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Building2, 
  Gift, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Zap,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Props {
  results: ResearchResult
}

// Helper component for scrollable pills with carousel arrows
const PillCarousel = ({ children }: { children: React.ReactNode }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Scrollable Pills Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
      >
        {children}
      </div>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

const ResearchResults = ({ results }: Props) => {
  const router = useRouter()
  const totalMissingCasinos = Object.values(results.missing_casinos).reduce(
    (sum, casinos) => sum + casinos.length,
    0
  )

  const handleDatabaseRedirect = (casinoName: string) => {
    // Redirect to database page with casino filter
    router.push(`/database?casino=${encodeURIComponent(casinoName)}`)
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Missing Casinos</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{totalMissingCasinos}</h3>
                </div>
                <Building2 className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="bg-gradient-to-br from-pink-600 to-rose-800 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">New Offers</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{results.new_offers.length}</h3>
                </div>
                <Gift className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-800 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Comparisons</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{results.offer_comparisons.length}</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="bg-gradient-to-br from-green-600 to-emerald-800 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Execution Time</p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {(results.execution_time_ms / 1000).toFixed(1)}s
                  </h3>
                </div>
                <Clock className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Missing Casinos by State */}
      {totalMissingCasinos > 0 && (
        <motion.div
          id="missing-casinos"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card/95 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-400" />
                Missing Casinos
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Casinos not yet tracked in your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(results.missing_casinos).map(([state, casinos]) => {
                  if (casinos.length === 0) return null
                  return (
                    <div key={state}>
                      {/* State Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-sm px-3 py-1">
                          {STATE_NAMES[state as keyof typeof STATE_NAMES]}
                        </Badge>
                        <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
                        <span className="text-muted-foreground text-sm font-medium">
                          {casinos.length} {casinos.length !== 1 ? 'Casinos' : 'Casino'}
                        </span>
                      </div>

                      {/* Casino Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {casinos.map((casino, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                          >
                            <Card className="bg-card border-border hover:border-purple-500/50 transition-all group">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  {/* Icon */}
                                  <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all">
                                    <Building2 className="h-5 w-5 text-purple-400" />
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-foreground font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                                      {casino.name}
                                    </h4>
                                    
                                    {/* Casino Details */}
                                    <div className="space-y-1">
                                      {casino.brand && (
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="text-muted-foreground">Brand:</span>
                                          <span className="text-foreground font-medium">{casino.brand}</span>
                                        </div>
                                      )}
                                      {casino.license_number && !casino.license_number.match(/^LIC-\d{4}$/) && (
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="text-muted-foreground">License:</span>
                                          <span className="text-foreground font-mono">{casino.license_number}</span>
                                        </div>
                                      )}
                                      {casino.is_operational !== undefined && (
                                        <Badge 
                                          variant={casino.is_operational ? "default" : "secondary"}
                                          className={`text-xs mt-2 ${casino.is_operational ? 'bg-green-600' : 'bg-gray-600'}`}
                                        >
                                          {casino.is_operational ? 'Operational' : 'Not Operational'}
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Website Link */}
                                    {casino.website && (
                                      <a
                                        href={casino.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs mt-3 pt-3 border-t border-border group/link"
                                      >
                                        <span className="truncate font-medium">
                                          {casino.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                        </span>
                                        <ExternalLink className="h-3 w-3 flex-shrink-0 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>

                      {/* Separator between states */}
                      {state !== Object.keys(results.missing_casinos).filter(s => results.missing_casinos[s as keyof typeof results.missing_casinos].length > 0).pop() && (
                        <Separator className="bg-border mt-6" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* New Offers */}
      {results.new_offers.length > 0 && (
        <motion.div
          id="new-offers"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-card/95 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Gift className="h-5 w-5 text-pink-400" />
                New Promotional Offers
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Recently discovered offers from AI research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.new_offers.map((offer, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-card/70 border-border h-full">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-foreground font-semibold">{offer.offer_title}</h4>
                            <p className="text-purple-400 text-sm">{offer.casino_name}</p>
                          </div>
                          
                          {offer.offer_description && (
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {offer.offer_description}
                            </p>
                          )}

                          <PillCarousel>
                            {offer.bonus_amount && (
                              <Badge className="bg-green-600 flex-shrink-0">
                                {offer.bonus_amount}
                              </Badge>
                            )}
                            {offer.match_percentage && offer.match_percentage.toLowerCase() !== 'n/a' && !offer.match_percentage.toLowerCase().includes('n/a') && (
                              <Badge className="bg-blue-600 flex-shrink-0">
                                {offer.match_percentage.replace(/%/g, '')}% Match
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-border text-foreground flex-shrink-0">
                              {STATE_NAMES[offer.state as keyof typeof STATE_NAMES]}
                            </Badge>
                          </PillCarousel>

                          {offer.promo_code && (
                            <div className="bg-muted/50 rounded px-3 py-2 mt-2">
                              <p className="text-xs text-muted-foreground">Promo Code</p>
                              <p className="text-yellow-500 font-mono font-bold">
                                {offer.promo_code}
                              </p>
                            </div>
                          )}

                          {offer.source && offer.source.startsWith('http') && (
                            <a
                              href={offer.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs mt-2 group"
                            >
                              <span className="truncate">{offer.source.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                          )}

                          {offer.last_verified && (
                            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                              Verified: {new Date(offer.last_verified).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Offer Comparisons */}
      {results.offer_comparisons.length > 0 && (
        <motion.div
          id="offer-comparisons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-card/95 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Offer Comparisons
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Side-by-side comparison of current vs. discovered offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {results.offer_comparisons.map((comparison, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {/* Casino Header with Analysis */}
                    <div className="mb-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-foreground font-semibold text-lg">{comparison.casino}</h4>
                        <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                          {STATE_NAMES[comparison.state as keyof typeof STATE_NAMES]}
                        </Badge>
                      </div>
                      {comparison.difference_notes && (
                        <div className="flex items-center gap-2 bg-green-600/10 border border-green-500/30 rounded-lg px-3 py-2">
                          <Zap className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <p className="text-green-400 dark:text-green-300 text-sm">
                            {comparison.difference_notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Side-by-Side Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Your Offer Card */}
                      <Card className="bg-card border-border hover:border-primary/50 transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-lg">
                                <Gift className="h-5 w-5 text-orange-500" />
                              </div>
                              <CardTitle className="text-base">Your Offer</CardTitle>
                            </div>
                            <button
                              onClick={() => handleDatabaseRedirect(comparison.casino)}
                              className="text-orange-400 hover:text-orange-300 transition-colors"
                              title="View in database"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {comparison.current_offer ? (
                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-2">
                                      {comparison.current_offer.split('|')[0].trim()}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {comparison.current_offer}
                                    </p>
                                  </div>
                                </div>

                                {/* Extract bonus amount from current_offer if available */}
                                {comparison.current_offer.includes('$') && (
                                  <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="text-muted-foreground">Bonus:</span>
                                      <span className="font-semibold text-foreground">
                                        {comparison.current_offer.match(/\$[\d,]+/)?.[0] || 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                <div className="pt-2 border-t border-border">
                                  <span className="text-xs text-muted-foreground">
                                    Source: Xano API
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground text-sm">No existing offer</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Discovered Offer Card */}
                      <Card className="bg-card border-border hover:border-primary/50 transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg">
                                <Search className="h-5 w-5 text-purple-400" />
                              </div>
                              <CardTitle className="text-base">Discovered Offer</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              {comparison.is_better && (
                                <Badge className="bg-green-600 flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  Better
                                </Badge>
                              )}
                              {comparison.is_new && (
                                <Badge className="bg-purple-600 flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  New
                                </Badge>
                              )}
                              <button
                                onClick={() => handleDatabaseRedirect(comparison.casino)}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                                title="View in database"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="p-4 rounded-lg bg-muted/50 border border-border">
                            <div className="space-y-3">
                              <p className="text-foreground text-sm font-medium mb-2">
                                {comparison.discovered_offer}
                              </p>

                              <PillCarousel>
                                {comparison.discovered_offer_details?.bonus_amount && (
                                  <Badge className="bg-green-600 flex-shrink-0">
                                    {comparison.discovered_offer_details.bonus_amount}
                                  </Badge>
                                )}
                                {comparison.discovered_offer_details?.match_percentage && (
                                  <Badge className="bg-blue-600 flex-shrink-0">
                                    {comparison.discovered_offer_details.match_percentage}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="border-border text-foreground flex-shrink-0">
                                  {STATE_NAMES[comparison.state as keyof typeof STATE_NAMES]}
                                </Badge>
                              </PillCarousel>

                              {comparison.discovered_offer_details?.promo_code && (
                                <div className="bg-muted/50 rounded px-3 py-2">
                                  <p className="text-xs text-muted-foreground">Promo Code</p>
                                  <p className="text-yellow-500 font-mono font-bold">
                                    {comparison.discovered_offer_details.promo_code}
                                  </p>
                                </div>
                              )}

                              {comparison.discovered_casino_website && (
                                <div className="pt-2 border-t border-border">
                                  <a
                                    href={comparison.discovered_casino_website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs group"
                                  >
                                    <span className="truncate">{comparison.discovered_casino_website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                                    <ExternalLink className="h-3 w-3 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {idx < results.offer_comparisons.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Limitations */}
      {results.limitations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                Research Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.limitations.map((limitation, idx) => (
                  <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Metadata */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-card/95 backdrop-blur-xl border-border">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-muted-foreground text-xs">Timestamp</p>
                <p className="text-foreground text-sm font-semibold mt-1">
                  {new Date(results.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Execution Time</p>
                <p className="text-foreground text-sm font-semibold mt-1">
                  {(results.execution_time_ms / 1000).toFixed(2)}s
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">API Calls</p>
                <p className="text-foreground text-sm font-semibold mt-1">
                  {results.api_calls_made}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Results</p>
                <p className="text-foreground text-sm font-semibold mt-1">
                  {totalMissingCasinos + results.new_offers.length + results.offer_comparisons.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ResearchResults
