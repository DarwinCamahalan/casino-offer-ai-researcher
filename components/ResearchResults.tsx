/**
 * Research Results Component - Display AI research findings
 */

'use client'

import { motion } from 'framer-motion'
import { ResearchResult } from '@/types'
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
  Sparkles
} from 'lucide-react'

interface Props {
  results: ResearchResult
}

const ResearchResults = ({ results }: Props) => {
  const totalMissingCasinos = Object.values(results.missing_casinos).reduce(
    (sum, casinos) => sum + casinos.length,
    0
  )

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-400" />
                Missing Casinos
              </CardTitle>
              <CardDescription className="text-gray-300">
                Licensed casinos not yet tracked in your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results.missing_casinos).map(([state, casinos]) => {
                  if (casinos.length === 0) return null
                  return (
                    <div key={state}>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-purple-600">{state}</Badge>
                        <span className="text-gray-400 text-sm">
                          {casinos.length} casino{casinos.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {casinos.map((casino, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ x: 4 }}
                          >
                            <Card className="bg-white/5 border-white/10">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <h4 className="text-white font-semibold">{casino.name}</h4>
                                    {casino.brand && (
                                      <p className="text-gray-400 text-sm mt-1">
                                        Brand: {casino.brand}
                                      </p>
                                    )}
                                    {casino.license_number && (
                                      <p className="text-gray-500 text-xs mt-1">
                                        License: {casino.license_number}
                                      </p>
                                    )}
                                  </div>
                                  {casino.website && (
                                    <a
                                      href={casino.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-purple-400 hover:text-purple-300"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                      {state !== Object.keys(results.missing_casinos).filter(s => results.missing_casinos[s as keyof typeof results.missing_casinos].length > 0).pop() && (
                        <Separator className="bg-white/10 mt-4" />
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gift className="h-5 w-5 text-pink-400" />
                New Promotional Offers
              </CardTitle>
              <CardDescription className="text-gray-300">
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
                    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 h-full">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-white font-semibold">{offer.offer_title}</h4>
                            <p className="text-purple-300 text-sm">{offer.casino_name}</p>
                          </div>
                          
                          {offer.offer_description && (
                            <p className="text-gray-300 text-sm line-clamp-2">
                              {offer.offer_description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {offer.bonus_amount && (
                              <Badge className="bg-green-600">
                                {offer.bonus_amount}
                              </Badge>
                            )}
                            {offer.match_percentage && (
                              <Badge className="bg-blue-600">
                                {offer.match_percentage}% Match
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-white/30 text-gray-300">
                              {offer.state}
                            </Badge>
                          </div>

                          {offer.promo_code && (
                            <div className="bg-black/30 rounded px-3 py-2 mt-2">
                              <p className="text-xs text-gray-400">Promo Code</p>
                              <p className="text-yellow-400 font-mono font-bold">
                                {offer.promo_code}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
                            {offer.last_verified && (
                              <span>Verified: {new Date(offer.last_verified).toLocaleDateString()}</span>
                            )}
                            {offer.source && (
                              <a
                                href={offer.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                              >
                                Source <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Offer Comparisons
              </CardTitle>
              <CardDescription className="text-gray-300">
                Better offers found compared to your existing database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.offer_comparisons.map((comparison, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-semibold">{comparison.casino}</h4>
                              <p className="text-gray-400 text-sm">{comparison.state}</p>
                            </div>
                            {comparison.is_better && (
                              <Badge className="bg-green-600 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Better Offer
                              </Badge>
                            )}
                            {comparison.is_new && (
                              <Badge className="bg-purple-600 flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                New
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-400 text-xs mb-2">Your Offer</p>
                              <p className="text-white font-semibold">
                                {comparison.current_offer || 'No existing offer'}
                              </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded p-3 border border-purple-500/30">
                              <p className="text-purple-300 text-xs mb-2">Discovered Offer</p>
                              <p className="text-white font-semibold">{comparison.discovered_offer}</p>
                            </div>
                          </div>

                          {comparison.difference_notes && (
                            <div className="bg-blue-600/10 border border-blue-500/30 rounded p-3">
                              <p className="text-blue-300 text-sm">
                                <Zap className="h-4 w-4 inline mr-1" />
                                {comparison.difference_notes}
                              </p>
                            </div>
                          )}

                          {comparison.confidence_score !== undefined && (
                            <div className="text-xs text-gray-400">
                              Confidence: {Math.round(comparison.confidence_score * 100)}%
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

      {/* Limitations */}
      {results.limitations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                Research Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.limitations.map((limitation, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
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
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-xs">Timestamp</p>
                <p className="text-white text-sm font-semibold mt-1">
                  {new Date(results.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Execution Time</p>
                <p className="text-white text-sm font-semibold mt-1">
                  {(results.execution_time_ms / 1000).toFixed(2)}s
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">API Calls</p>
                <p className="text-white text-sm font-semibold mt-1">
                  {results.api_calls_made}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Results</p>
                <p className="text-white text-sm font-semibold mt-1">
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
