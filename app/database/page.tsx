/**
 * Database Page - View existing offers from Xano API
 */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Database as DatabaseIcon, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  Building2, 
  Gift, 
  MapPin,
  Search,
  Filter,
  Tag,
  TrendingUp,
  DollarSign,
  Percent
} from 'lucide-react'
import { PromotionalOffer, Casino, STATE_NAMES, USState } from '@/types'
import { Input } from '@/components/ui/input'


const DatabasePage = () => {
  const searchParams = useSearchParams()
  const [offers, setOffers] = useState<PromotionalOffer[]>([])
  const [casinos, setCasinos] = useState<Casino[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState<USState | 'ALL'>('ALL')
  const [selectedCasino, setSelectedCasino] = useState<string>('ALL')

  // Debounce search query to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/offers/existing')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch data')
      }

      setOffers(data.data.offers || [])
      setCasinos(data.data.casinos || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle URL parameters for filtering
  useEffect(() => {
    const casinoParam = searchParams.get('casino')
    if (casinoParam) {
      setSelectedCasino(casinoParam)
    }
  }, [searchParams])

  // Get unique states and casinos for filters
  const uniqueStates = Array.from(new Set(offers.map(o => o.state))).sort()
  const uniqueCasinos = Array.from(new Set(offers.map(o => o.casino_name))).sort()

  // Filter offers based on search and filters
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.casino_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      offer.offer_title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      offer.offer_description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (offer.promo_code && offer.promo_code.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

    const matchesState = selectedState === 'ALL' || offer.state === selectedState
    const matchesCasino = selectedCasino === 'ALL' || offer.casino_name === selectedCasino

    return matchesSearch && matchesState && matchesCasino
  })

  // Group offers by casino
  const offersByCasino = filteredOffers.reduce((acc, offer) => {
    const key = `${offer.casino_name}-${offer.state}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(offer)
    return acc
  }, {} as Record<string, PromotionalOffer[]>)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <DatabaseIcon className="h-8 w-8 text-primary" />
            Offer Database
          </h1>
          <p className="text-muted-foreground">
            Existing offers from Xano database
          </p>
        </div>

        <Button
          onClick={fetchData}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Offers</p>
                <p className="text-3xl font-bold text-foreground">{offers.length}</p>
              </div>
              <Gift className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Casinos</p>
                <p className="text-3xl font-bold text-foreground">{casinos.length}</p>
              </div>
              <Building2 className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">States</p>
                <p className="text-3xl font-bold text-foreground">{uniqueStates.length}</p>
              </div>
              <MapPin className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/10 to-orange-800/10 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Filtered</p>
                <p className="text-3xl font-bold text-foreground">{filteredOffers.length}</p>
              </div>
              <Filter className="h-10 w-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search offers, casinos, promo codes..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* State Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value as USState | 'ALL')}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="ALL">All States</option>
                  {uniqueStates.map((state) => (
                    <option key={state} value={state}>
                      {STATE_NAMES[state]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Casino Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Casino</label>
                <select
                  value={selectedCasino}
                  onChange={(e) => setSelectedCasino(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="ALL">All Casinos</option>
                  {uniqueCasinos.map((casino) => (
                    <option key={casino} value={casino}>
                      {casino}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedState !== 'ALL' || selectedCasino !== 'ALL') && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-destructive">×</button>
                  </Badge>
                )}
                {selectedState !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    {STATE_NAMES[selectedState]}
                    <button onClick={() => setSelectedState('ALL')} className="ml-1 hover:text-destructive">×</button>
                  </Badge>
                )}
                {selectedCasino !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCasino}
                    <button onClick={() => setSelectedCasino('ALL')} className="ml-1 hover:text-destructive">×</button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <Card className="bg-card border-border">
            <CardContent className="p-8 flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Loading offers from database...</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className="bg-destructive/10 border-destructive/50">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-foreground">
              <h3 className="text-destructive font-semibold mb-2">Error Loading Data</h3>
              <p className="mb-4">{error}</p>
              <Button onClick={fetchData} variant="outline" size="sm">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Offers List */}
      {!loading && !error && (
        <div className="space-y-6">
          {filteredOffers.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Offers Found</h3>
                <p className="text-muted-foreground mb-4">
                  {offers.length === 0 
                    ? 'No offers available in the database.'
                    : 'Try adjusting your filters or search query.'}
                </p>
                {(searchQuery || selectedState !== 'ALL' || selectedCasino !== 'ALL') && (
                  <Button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedState('ALL')
                      setSelectedCasino('ALL')
                    }}
                    variant="outline"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {Object.entries(offersByCasino).map(([key, casinoOffers]) => {
                  const firstOffer = casinoOffers[0]
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="bg-card border-border hover:border-primary/50 transition-all">
                        <CardHeader>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg">
                                <Building2 className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-xl mb-1">{firstOffer.casino_name}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {STATE_NAMES[firstOffer.state]}
                                  </Badge>
                                  <Badge variant="outline">
                                    {casinoOffers.length} {casinoOffers.length === 1 ? 'Offer' : 'Offers'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {casinoOffers.map((offer, offerIndex) => (
                            <div
                              key={offer.id || offerIndex}
                              className={`p-4 rounded-lg bg-muted/50 border border-border ${
                                offerIndex !== casinoOffers.length - 1 ? 'mb-3' : ''
                              }`}
                            >
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                      <Gift className="h-4 w-4 text-primary" />
                                      {offer.offer_title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {offer.offer_description}
                                    </p>
                                  </div>
                                  {offer.promo_code && (
                                    <Badge className="bg-green-600 hover:bg-green-700 text-white">
                                      <Tag className="h-3 w-3 mr-1" />
                                      {offer.promo_code}
                                    </Badge>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {offer.bonus_amount && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="text-muted-foreground">Bonus:</span>
                                      <span className="font-semibold text-foreground">{offer.bonus_amount}</span>
                                    </div>
                                  )}
                                  {offer.wagering_requirements && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <TrendingUp className="h-4 w-4 text-orange-500" />
                                      <span className="text-muted-foreground">Wagering:</span>
                                      <span className="font-semibold text-foreground">{offer.wagering_requirements}</span>
                                    </div>
                                  )}
                                </div>

                                {offer.source && (
                                  <div className="pt-2 border-t border-border">
                                    <span className="text-xs text-muted-foreground">
                                      Source: {offer.source}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DatabasePage
