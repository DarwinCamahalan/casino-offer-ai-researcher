/**
 * Promotional Offer Types
 */

import { USState } from './states'

export interface PromotionalOffer {
  id?: string
  casino_name: string
  casino_id?: string
  state: USState
  offer_title: string
  offer_description: string
  bonus_amount?: string
  match_percentage?: string
  wagering_requirements?: string
  promo_code?: string
  expiration_date?: string
  terms_url?: string
  last_verified?: string
  source?: string
}

export interface OfferComparison {
  casino: string
  state: USState
  current_offer: string | null
  discovered_offer: string
  is_better: boolean
  is_new: boolean
  difference_notes: string
  confidence_score?: number
}
