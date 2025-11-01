/**
 * API Route: /api/ai/research
 * Main endpoint for AI-powered casino and offer research
 * Uses mock data to simulate the research process
 * Next.js 14 App Router format
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  ResearchRequest,
  ResearchResult,
  USState,
  US_STATES,
} from '@/types'
import mockData from '@/lib/data/mockResearchData.json'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Parse request body
    const requestData: ResearchRequest = await request.json()
    const {
      states = US_STATES,
    } = requestData

    // Simulate processing time for realistic feel (2-3 seconds)
    await delay(2000 + Math.random() * 1000)

    // Find all matching results for the requested states
    const matchingResults = mockData.results.filter(result => {
      // Check if result contains any of the requested states
      return result.states.some(state => states.includes(state as USState))
    })

    // If we have matching results, randomly select one
    let selectedResult
    if (matchingResults.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchingResults.length)
      selectedResult = matchingResults[randomIndex]
    } else {
      // Fallback to first result if no matches
      selectedResult = mockData.results[0]
    }

    // Filter the result to only include requested states
    const filteredMissingCasinos: Record<string, any[]> = {}
    for (const state of states) {
      const stateCasinos = (selectedResult.missing_casinos as any)[state]
      if (stateCasinos) {
        filteredMissingCasinos[state] = stateCasinos
      }
    }

    // Transform offer comparisons to match expected format
    const transformedComparisons = selectedResult.offer_comparisons.map((comp: any) => {
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

    const executionTime = Date.now() - startTime

    const result: ResearchResult = {
      timestamp: new Date().toISOString(), // Always use current timestamp
      missing_casinos: filteredMissingCasinos,
      offer_comparisons: transformedComparisons,
      new_offers: selectedResult.new_offers as any,
      limitations: selectedResult.limitations,
      execution_time_ms: executionTime,
      api_calls_made: selectedResult.api_calls_made,
    }

    console.log(`Research completed in ${executionTime}ms using mock data`)

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
