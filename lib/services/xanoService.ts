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
  return xanoOffers.map((offer) => {
    // Handle new API format (with Name and Offer_Name)
    const casinoName = offer.Name || offer.casino_name || 'Unknown Casino';
    const offerTitle = offer.Offer_Name || offer.offer_title || 'Untitled Offer';
    
    // Get state from nested state object or direct state field
    let stateValue: string | any = 'NJ'; // Default
    if (offer.state && typeof offer.state === 'object' && 'Abbreviation' in offer.state) {
      stateValue = offer.state.Abbreviation;
    } else if (offer.state) {
      stateValue = offer.state;
    }
    
    // Format bonus amounts
    const bonusAmount = offer.Expected_Bonus 
      ? `$${offer.Expected_Bonus.toLocaleString()}` 
      : offer.bonus_amount;
    
    const expectedDeposit = offer.Expected_Deposit 
      ? `$${offer.Expected_Deposit.toLocaleString()}` 
      : undefined;
    
    // Calculate match percentage if we have both deposit and bonus
    let matchPercentage = offer.match_percentage;
    if (!matchPercentage && offer.Expected_Deposit && offer.Expected_Bonus && offer.Expected_Deposit > 0) {
      const percentage = Math.round((offer.Expected_Bonus / offer.Expected_Deposit) * 100);
      matchPercentage = `${percentage}%`;
    }
    
    return {
      id: (offer.casinodb_id || offer.id)?.toString(),
      casino_name: casinoName,
      state: normalizeState(stateValue),
      offer_title: offerTitle,
      offer_description: offerTitle, // Use title as description if no separate description
      bonus_amount: bonusAmount,
      match_percentage: matchPercentage,
      wagering_requirements: offer.wagering_requirements,
      promo_code: offer.promo_code,
      source: 'Xano API',
    };
  });
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
