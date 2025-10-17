/**
 * Service for fetching and processing existing offers from Xano API
 */

import axios from 'axios';
import { XanoOffer, PromotionalOffer, Casino, USState } from '@/types';

const XANO_API_URL = process.env.XANO_API_URL || 'https://xhks-nxia-vlqr.n7c.xano.io/api:1ZwRS-f0/activeSUB';

/**
 * Fetch existing offers from Xano API
 */
export async function fetchExistingOffers(): Promise<XanoOffer[]> {
  try {
    const response = await axios.get(XANO_API_URL, {
      timeout: 30000, // 30 second timeout
    });

    if (!response.data) {
      throw new Error('No data returned from Xano API');
    }

    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch from Xano API: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Transform Xano offers to standardized format
 */
export function normalizeXanoOffers(xanoOffers: XanoOffer[]): PromotionalOffer[] {
  return xanoOffers.map((offer) => ({
    id: offer.id?.toString(),
    casino_name: offer.casino_name || 'Unknown Casino',
    state: normalizeState(offer.state),
    offer_title: offer.offer_title || 'Untitled Offer',
    offer_description: offer.offer_description || offer.offer_title || '',
    bonus_amount: offer.bonus_amount,
    match_percentage: offer.match_percentage,
    wagering_requirements: offer.wagering_requirements,
    promo_code: offer.promo_code,
    source: 'Xano API',
  }));
}

/**
 * Extract unique casinos from offers
 */
export function extractCasinosFromOffers(offers: PromotionalOffer[]): Casino[] {
  const casinoMap = new Map<string, Casino>();

  offers.forEach((offer) => {
    const key = `${offer.casino_name}-${offer.state}`;
    if (!casinoMap.has(key)) {
      casinoMap.set(key, {
        name: offer.casino_name,
        state: offer.state,
        is_operational: true,
        source: 'Existing Database',
      });
    }
  });

  return Array.from(casinoMap.values());
}

/**
 * Normalize state abbreviation
 */
function normalizeState(state?: string | any): USState {
  if (!state) return 'NJ'; // Default fallback
  
  // Ensure state is a string
  const stateStr = String(state);
  const normalized = stateStr.toUpperCase().trim();
  
  // Handle full state names
  const stateMap: Record<string, USState> = {
    'NEW JERSEY': 'NJ',
    'MICHIGAN': 'MI',
    'PENNSYLVANIA': 'PA',
    'WEST VIRGINIA': 'WV',
  };

  if (stateMap[normalized]) {
    return stateMap[normalized];
  }

  // Assume it's already an abbreviation
  if (['NJ', 'MI', 'PA', 'WV'].includes(normalized)) {
    return normalized as USState;
  }

  return 'NJ'; // Default fallback
}

/**
 * Get offers by state
 */
export function filterOffersByState(offers: PromotionalOffer[], state: USState): PromotionalOffer[] {
  return offers.filter((offer) => offer.state === state);
}

/**
 * Get casinos by state
 */
export function filterCasinosByState(casinos: Casino[], state: USState): Casino[] {
  return casinos.filter((casino) => casino.state === state);
}
