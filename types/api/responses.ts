/**
 * API Response Types
 */

import { USState } from '../casino/states'
import { Casino } from '../casino/casino'
import { PromotionalOffer, OfferComparison } from '../casino/offer'

export interface XanoOffer {
  casinodb_id: number
  Name?: string  // Casino name from API
  Offer_Name?: string  // Offer title from API
  offer_type?: string
  Expected_Deposit?: number
  Expected_Bonus?: number
  states_id?: number
  state?: {
    Name: string
    Abbreviation: string
  }
  // Legacy fields for backward compatibility
  id?: number
  casino_name?: string
  offer_title?: string
  offer_description?: string
  bonus_amount?: string
  match_percentage?: string
  wagering_requirements?: string
  promo_code?: string
  [key: string]: any
}

export interface ResearchResult {
  missing_casinos: Record<USState, Casino[]>
  offer_comparisons: OfferComparison[]
  new_offers: PromotionalOffer[]
  limitations: string[]
  timestamp: string
  execution_time_ms: number
  api_calls_made: number
}

export interface ResearchRequest {
  states: USState[]
  include_casino_discovery?: boolean
  include_offer_research?: boolean
  force_refresh?: boolean
  exclude_casino_websites?: string[] // Previously researched casino websites to exclude
  historical_offers?: PromotionalOffer[] // Historical offers from previous research for comparison
}

export interface ErrorResponse {
  error: string
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ErrorResponse
}
