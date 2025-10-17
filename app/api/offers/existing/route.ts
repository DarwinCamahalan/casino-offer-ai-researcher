/**
 * API Route: /api/offers/existing
 * Fetches and returns existing offers from Xano API
 * Next.js 14 App Router format
 */

import { NextResponse } from 'next/server'
import { PromotionalOffer, Casino } from '@/types'
import {
  fetchExistingOffers,
  normalizeXanoOffers,
  extractCasinosFromOffers,
} from '@/lib/services/xanoService'

export async function GET() {
  try {
    const xanoOffers = await fetchExistingOffers()
    const offers = normalizeXanoOffers(xanoOffers)
    const casinos = extractCasinosFromOffers(offers)

    return NextResponse.json({
      success: true,
      data: {
        offers,
        casinos,
      },
    })
  } catch (error) {
    console.error('Error fetching existing offers:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Failed to fetch existing offers',
        },
      },
      { status: 500 }
    )
  }
}
