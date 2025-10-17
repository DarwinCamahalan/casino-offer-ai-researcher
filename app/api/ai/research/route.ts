/**
 * API Route: /api/ai/research
 * Main endpoint for AI-powered casino and offer research
 * Next.js 14 App Router format
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  ResearchResult,
  ResearchRequest,
  US_STATES,
  USState,
  Casino,
  PromotionalOffer,
} from '@/types'
import {
  fetchExistingOffers,
  normalizeXanoOffers,
  extractCasinosFromOffers,
} from '@/lib/services/xanoService'
import {
  discoverCasinosInState,
  batchResearchOffers,
} from '@/lib/services/aiResearchService'
import {
  findMissingCasinos,
  groupCasinosByState,
  compareOffers,
  findNewOffers,
} from '@/lib/services/comparisonService'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const limitations: string[] = []
  let apiCallsCount = 0

  try {
    // Parse request body
    const requestData: ResearchRequest = await request.json()
    const {
      states = US_STATES,
      include_offer_research = true,
      include_casino_discovery = true,
    } = requestData

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: {
            error: 'Configuration Error',
            message: 'OpenAI API key is not configured',
          },
        },
        { status: 500 }
      )
    }

    // Step 1: Fetch existing data from Xano
    console.log('Fetching existing offers from Xano...')
    const xanoOffers = await fetchExistingOffers()
    apiCallsCount++
    
    const existingOffers = normalizeXanoOffers(xanoOffers)
    const existingCasinos = extractCasinosFromOffers(existingOffers)

    console.log(`Found ${existingOffers.length} existing offers from ${existingCasinos.length} casinos`)

    // Step 2: Discover casinos (if enabled)
    let discoveredCasinos: Casino[] = []
    if (include_casino_discovery) {
      console.log(`Discovering casinos in: ${states.join(', ')}`)
      
      for (const state of states) {
        try {
          const stateCasinos = await discoverCasinosInState(state)
          discoveredCasinos.push(...stateCasinos)
          apiCallsCount++
          console.log(`Found ${stateCasinos.length} casinos in ${state}`)
          
          // Add delay to respect rate limits
          await delay(1000)
        } catch (error) {
          console.error(`Error discovering casinos in ${state}:`, error)
          limitations.push(`Could not complete casino discovery for ${state}`)
        }
      }
    } else {
      limitations.push('Casino discovery was disabled for this research run')
    }

    // Step 3: Find missing casinos
    const missingCasinos = include_casino_discovery
      ? findMissingCasinos(discoveredCasinos, existingCasinos)
      : []
    const missingCasinosByState = groupCasinosByState(missingCasinos)

    console.log(`Identified ${missingCasinos.length} missing casinos`)

    // Step 4: Research promotional offers (if enabled)
    let discoveredOffers: PromotionalOffer[] = []
    if (include_offer_research) {
      console.log('Researching promotional offers...')
      
      // Research offers for both existing and newly discovered casinos
      const casinosToResearch = [
        ...existingCasinos.filter((c) => states.includes(c.state)),
        ...missingCasinos,
      ]

      try {
        discoveredOffers = await batchResearchOffers(casinosToResearch, 3)
        apiCallsCount += casinosToResearch.length
        console.log(`Discovered ${discoveredOffers.length} promotional offers`)
      } catch (error) {
        console.error('Error researching offers:', error)
        limitations.push('Some promotional offer research could not be completed')
      }
    } else {
      limitations.push('Promotional offer research was disabled for this research run')
    }

    // Step 5: Compare offers
    const offerComparisons = include_offer_research
      ? compareOffers(discoveredOffers, existingOffers)
      : []

    const newOffers = include_offer_research
      ? findNewOffers(discoveredOffers, existingOffers)
      : []

    console.log(`Generated ${offerComparisons.length} offer comparisons`)

    // Step 6: Build result
    const executionTime = Date.now() - startTime

    // Add general limitations
    if (discoveredOffers.length === 0 && include_offer_research) {
      limitations.push('No promotional offers were discovered during this research run')
    }
    
    limitations.push('Promotional offers change frequently and should be verified regularly')
    limitations.push('AI research may not capture all available offers or casinos')
    limitations.push('Data accuracy depends on the availability of public information')

    const result: ResearchResult = {
      timestamp: new Date().toISOString(),
      missing_casinos: missingCasinosByState,
      offer_comparisons: offerComparisons,
      new_offers: newOffers,
      limitations,
      execution_time_ms: executionTime,
      api_calls_made: apiCallsCount,
    }

    console.log(`Research completed in ${executionTime}ms with ${apiCallsCount} API calls`)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error during research:', error)
    const executionTime = Date.now() - startTime

    return NextResponse.json(
      {
        success: false,
        error: {
          error: 'Research Error',
          message: error instanceof Error ? error.message : 'An unexpected error occurred during research',
          details: {
            execution_time_ms: executionTime,
            api_calls_made: apiCallsCount,
          },
        },
      },
      { status: 500 }
    )
  }
}

/**
 * Utility function for delays
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
