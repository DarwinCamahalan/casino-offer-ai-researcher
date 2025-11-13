/**
 * Mock Data Initializer
 * Initializes localStorage with mock data if it's empty
 * This ensures analytics and dashboard show data even without running research
 */

import { ResearchResult } from '@/types'
import mockData from '@/lib/data/mockResearchData.json'

/**
 * Transform mock data result to ResearchResult format
 */
function transformMockResultToResearchResult(mockResult: any): ResearchResult {
  // Transform offer comparisons to match expected format
  const transformedComparisons = (mockResult.offer_comparisons || []).map((comp: any) => {
    const currentOfferStr = comp.current_offer 
      ? `${comp.current_offer.offer_type} | ${comp.current_offer.bonus_amount} bonus | ${comp.current_offer.match_percentage} match | ${comp.current_offer.wagering_requirement} wagering`
      : null
    
    const discoveredOfferStr = `${comp.discovered_offer.offer_type} | ${comp.discovered_offer.bonus_amount} bonus | ${comp.discovered_offer.match_percentage} match | ${comp.discovered_offer.wagering_requirement} wagering`

    return {
      casino: comp.casino_name,
      state: comp.state,
      current_offer: currentOfferStr,
      discovered_offer: discoveredOfferStr,
      is_better: comp.is_better,
      is_new: false,
      difference_notes: comp.reason,
      confidence_score: comp.confidence_score,
      discovered_casino_website: comp.casino_website,
      discovered_offer_details: {
        bonus_amount: comp.discovered_offer.bonus_amount,
        match_percentage: comp.discovered_offer.match_percentage,
        wagering_requirements: comp.discovered_offer.wagering_requirement,
        promo_code: comp.discovered_offer.promo_code,
      }
    }
  })

  // Transform new_offers to match PromotionalOffer format
  // Map offer_type to offer_title with proper keywords for categorization
  // IMPORTANT: Order matters - check more specific patterns first
  const mapOfferTypeToTitle = (offerType: string): string => {
    const type = (offerType || '').toLowerCase()
    
    // Map to titles that will be properly categorized by DashboardStats
    // Check order matches DashboardStats categorization logic
    
    // 1. Free Spins (check first to avoid matching "free" in other contexts)
    if (type.includes('free spin') || type.includes('freespin') || (type.includes('spin') && !type.includes('deposit'))) {
      return 'Free Spins Bonus'
    }
    // 2. No Deposit (check before generic "free")
    else if (type.includes('no deposit') || type.includes('no-deposit')) {
      return 'No Deposit Bonus'
    }
    // 3. Reload Bonus
    else if (type.includes('reload') || type.includes('weekend')) {
      return 'Reload Bonus'
    }
    // 4. Welcome/Sign-up (catch-all for welcome-related offers)
    else if (type.includes('welcome') || type.includes('sign-up') || type.includes('signup') || 
             type.includes('first deposit') || type.includes('new player') || type.includes('new-player') ||
             type.includes('deposit match') || type.includes('deposit-match') || type.includes('vip')) {
      return 'Welcome Bonus'
    }
    // 5. Default to Welcome Bonus to avoid "Other" category
    else {
      return 'Welcome Bonus'
    }
  }

  const transformedNewOffers = (mockResult.new_offers || []).map((offer: any) => {
    const offerType = offer.offer_type || offer.offer_title || 'Promotional Offer'
    const mappedTitle = mapOfferTypeToTitle(offerType)
    
    return {
      casino_name: offer.casino || offer.casino_name || '',
      state: offer.state,
      offer_title: mappedTitle,
      offer_description: `${offerType} - ${offer.bonus_amount || 'Bonus available'}`,
      bonus_amount: offer.bonus_amount,
      match_percentage: offer.match_percentage,
      wagering_requirements: offer.wagering_requirements,
      promo_code: offer.promo_code,
      last_verified: offer.last_verified,
      source: offer.website || offer.source,
      terms_url: offer.website,
    }
  })

  return {
    timestamp: mockResult.timestamp || new Date().toISOString(),
    missing_casinos: mockResult.missing_casinos || {},
    offer_comparisons: transformedComparisons,
    new_offers: transformedNewOffers,
    limitations: mockResult.limitations || [],
    execution_time_ms: mockResult.execution_time_ms || 0,
    api_calls_made: mockResult.api_calls_made || 0,
  }
}

/**
 * Initialize localStorage with mock data if it's empty
 */
export function initializeMockDataIfNeeded(): void {
  if (typeof window === 'undefined') {
    return // Server-side, skip
  }

  try {
    // Check if research_results exists
    const existingResults = localStorage.getItem('research_results')
    const existingHistory = localStorage.getItem('research_history')

    // If both exist, no need to initialize
    if (existingResults && existingHistory) {
      return
    }

    // Initialize research_results with the first mock result
    if (!existingResults && mockData.results.length > 0) {
      const firstResult = transformMockResultToResearchResult(mockData.results[0])
      localStorage.setItem('research_results', JSON.stringify(firstResult))
      localStorage.setItem('latest_research_result', JSON.stringify(firstResult))
      console.log('✅ Initialized research_results with mock data')
    }

    // Initialize research_history with all mock results
    if (!existingHistory && mockData.results.length > 0) {
      const history = mockData.results.map((result: any) => {
        const totalCasinos = Object.values(result.missing_casinos || {}).reduce(
          (sum: number, casinos: any) => sum + (Array.isArray(casinos) ? casinos.length : 0),
          0
        )

        // Transform offer comparisons for history
        const transformedComparisons = (result.offer_comparisons || []).map((comp: any) => {
          const currentOfferStr = comp.current_offer 
            ? `${comp.current_offer.offer_type} | ${comp.current_offer.bonus_amount} bonus | ${comp.current_offer.match_percentage} match | ${comp.current_offer.wagering_requirement} wagering`
            : null
          
          const discoveredOfferStr = `${comp.discovered_offer.offer_type} | ${comp.discovered_offer.bonus_amount} bonus | ${comp.discovered_offer.match_percentage} match | ${comp.discovered_offer.wagering_requirement} wagering`

          return {
            casino: comp.casino_name,
            state: comp.state,
            current_offer: currentOfferStr,
            discovered_offer: discoveredOfferStr,
            is_better: comp.is_better,
            is_new: false,
            difference_notes: comp.reason,
            confidence_score: comp.confidence_score,
            discovered_casino_website: comp.casino_website,
            discovered_offer_details: {
              bonus_amount: comp.discovered_offer.bonus_amount,
              match_percentage: comp.discovered_offer.match_percentage,
              wagering_requirements: comp.discovered_offer.wagering_requirement,
              promo_code: comp.discovered_offer.promo_code,
            }
          }
        })

        // Transform new_offers for history
        // Map offer_type to offer_title with proper keywords for categorization
        // IMPORTANT: Order matters - check more specific patterns first
        const mapOfferTypeToTitle = (offerType: string): string => {
          const type = (offerType || '').toLowerCase()
          
          // Map to titles that will be properly categorized by DashboardStats
          // Check order matches DashboardStats categorization logic
          
          // 1. Free Spins (check first to avoid matching "free" in other contexts)
          if (type.includes('free spin') || type.includes('freespin') || (type.includes('spin') && !type.includes('deposit'))) {
            return 'Free Spins Bonus'
          }
          // 2. No Deposit (check before generic "free")
          else if (type.includes('no deposit') || type.includes('no-deposit')) {
            return 'No Deposit Bonus'
          }
          // 3. Reload Bonus
          else if (type.includes('reload') || type.includes('weekend')) {
            return 'Reload Bonus'
          }
          // 4. Welcome/Sign-up (catch-all for welcome-related offers)
          else if (type.includes('welcome') || type.includes('sign-up') || type.includes('signup') || 
                   type.includes('first deposit') || type.includes('new player') || type.includes('new-player') ||
                   type.includes('deposit match') || type.includes('deposit-match') || type.includes('vip')) {
            return 'Welcome Bonus'
          }
          // 5. Default to Welcome Bonus to avoid "Other" category
          else {
            return 'Welcome Bonus'
          }
        }

        const transformedNewOffers = (result.new_offers || []).map((offer: any) => {
          const offerType = offer.offer_type || offer.offer_title || 'Promotional Offer'
          const mappedTitle = mapOfferTypeToTitle(offerType)
          
          return {
            casino_name: offer.casino || offer.casino_name || '',
            state: offer.state,
            offer_title: mappedTitle,
            offer_description: `${offerType} - ${offer.bonus_amount || 'Bonus available'}`,
            bonus_amount: offer.bonus_amount,
            match_percentage: offer.match_percentage,
            wagering_requirements: offer.wagering_requirements,
            promo_code: offer.promo_code,
            last_verified: offer.last_verified,
            source: offer.website || offer.source,
            terms_url: offer.website,
          }
        })

        return {
          timestamp: result.timestamp || new Date().toISOString(),
          states: result.states || [],
          casinosFound: totalCasinos,
          offersFound: transformedNewOffers.length,
          comparisonsFound: transformedComparisons.length,
          betterOffersFound: transformedComparisons.filter((c: any) => c.is_better).length,
          casinos: Object.values(result.missing_casinos || {}).flat(),
          newOffers: transformedNewOffers,
          comparisons: transformedComparisons,
          executionTime: result.execution_time_ms || 0,
          apiCallsMade: result.api_calls_made || 0,
        }
      })

      localStorage.setItem('research_history', JSON.stringify(history))
      console.log(`✅ Initialized research_history with ${history.length} mock research sessions`)
    }

    // Also initialize researched_casinos if needed
    const existingResearchedCasinos = localStorage.getItem('researched_casinos')
    if (!existingResearchedCasinos && mockData.results.length > 0) {
      const firstResult = mockData.results[0]
      const casinoWebsites = Object.values(firstResult.missing_casinos || {})
        .flat()
        .map((casino: any) => casino.website)
        .filter((website): website is string => !!website)
      
      if (casinoWebsites.length > 0) {
        localStorage.setItem('researched_casinos', JSON.stringify(casinoWebsites))
        console.log(`✅ Initialized researched_casinos with ${casinoWebsites.length} casinos`)
      }
    }
  } catch (error) {
    console.error('Error initializing mock data:', error)
  }
}

