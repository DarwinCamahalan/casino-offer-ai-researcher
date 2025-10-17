/**
 * Comparison Service - Analyzes and compares discovered data with existing data
 */

import {
  Casino,
  PromotionalOffer,
  OfferComparison,
  USState,
} from '@/types';

/**
 * Find casinos that are missing from the existing database
 */
export function findMissingCasinos(
  discoveredCasinos: Casino[],
  existingCasinos: Casino[]
): Casino[] {
  const existingNames = new Set(
    existingCasinos.map((c) => normalizeCasinoName(c.name, c.state))
  );

  return discoveredCasinos.filter((casino) => {
    const normalizedKey = normalizeCasinoName(casino.name, casino.state);
    return !existingNames.has(normalizedKey);
  });
}

/**
 * Group casinos by state
 */
export function groupCasinosByState(casinos: Casino[]): Record<USState, Casino[]> {
  const grouped: Record<string, Casino[]> = {
    NJ: [],
    MI: [],
    PA: [],
    WV: [],
  };

  casinos.forEach((casino) => {
    grouped[casino.state].push(casino);
  });

  return grouped as Record<USState, Casino[]>;
}

/**
 * Compare discovered offers with existing offers
 */
export function compareOffers(
  discoveredOffers: PromotionalOffer[],
  existingOffers: PromotionalOffer[]
): OfferComparison[] {
  const comparisons: OfferComparison[] = [];

  console.log(`\n=== OFFER COMPARISON DEBUG ===`);
  console.log(`Discovered offers: ${discoveredOffers.length}`);
  console.log(`Existing offers: ${existingOffers.length}`);

  // Create a map of existing offers by casino and state
  const existingOffersMap = new Map<string, PromotionalOffer>();
  existingOffers.forEach((offer) => {
    const key = normalizeCasinoName(offer.casino_name, offer.state);
    existingOffersMap.set(key, offer);
    console.log(`Existing: "${offer.casino_name}" (${offer.state}) -> key: "${key}"`);
  });

  console.log(`\nExisting offers map keys:`, Array.from(existingOffersMap.keys()));

  // Compare each discovered offer
  discoveredOffers.forEach((discovered) => {
    const key = normalizeCasinoName(discovered.casino_name, discovered.state);
    const existing = existingOffersMap.get(key);
    
    console.log(`\nDiscovered: "${discovered.casino_name}" (${discovered.state}) -> key: "${key}"`);
    console.log(`  Match found: ${existing ? 'YES' : 'NO'}`);
    if (existing) {
      console.log(`  Existing offer: ${formatOfferSummary(existing)}`);
    }

    if (!existing) {
      // This is a new offer for a casino
      comparisons.push({
        casino: discovered.casino_name,
        state: discovered.state,
        current_offer: null,
        discovered_offer: formatOfferSummary(discovered),
        is_better: false,
        is_new: true,
        difference_notes: 'New casino offer not in existing database',
        confidence_score: 85,
      });
    } else {
      // Compare the offers
      const comparison = analyzeOfferDifference(existing, discovered);
      if (comparison.is_better || comparison.is_different) {
        comparisons.push({
          casino: discovered.casino_name,
          state: discovered.state,
          current_offer: formatOfferSummary(existing),
          discovered_offer: formatOfferSummary(discovered),
          is_better: comparison.is_better,
          is_new: false,
          difference_notes: comparison.notes,
          confidence_score: comparison.confidence,
        });
      }
    }
  });

  console.log(`\nTotal comparisons generated: ${comparisons.length}`);
  console.log(`=== END COMPARISON DEBUG ===\n`);

  return comparisons;
}

/**
 * Analyze the difference between two offers
 */
function analyzeOfferDifference(
  existing: PromotionalOffer,
  discovered: PromotionalOffer
): {
  is_better: boolean;
  is_different: boolean;
  notes: string;
  confidence: number;
} {
  const differences: string[] = [];
  let isBetter = false;
  let isDifferent = false;
  let confidence = 90;

  // Compare bonus amounts
  const existingAmount = extractNumericValue(existing.bonus_amount);
  const discoveredAmount = extractNumericValue(discovered.bonus_amount);

  if (discoveredAmount && existingAmount) {
    if (discoveredAmount > existingAmount) {
      differences.push(
        `Higher bonus amount: $${discoveredAmount} vs $${existingAmount}`
      );
      isBetter = true;
    } else if (discoveredAmount < existingAmount) {
      differences.push(
        `Lower bonus amount: $${discoveredAmount} vs $${existingAmount}`
      );
      isDifferent = true;
    }
  } else if (discoveredAmount && !existingAmount) {
    differences.push(`New bonus amount specified: $${discoveredAmount}`);
    isDifferent = true;
  }

  // Compare match percentages
  const existingMatch = extractNumericValue(existing.match_percentage);
  const discoveredMatch = extractNumericValue(discovered.match_percentage);

  if (discoveredMatch && existingMatch) {
    if (discoveredMatch > existingMatch) {
      differences.push(
        `Higher match percentage: ${discoveredMatch}% vs ${existingMatch}%`
      );
      isBetter = true;
    } else if (discoveredMatch < existingMatch) {
      differences.push(
        `Lower match percentage: ${discoveredMatch}% vs ${existingMatch}%`
      );
      isDifferent = true;
    }
  }

  // Compare wagering requirements (lower is better)
  const existingWager = extractNumericValue(existing.wagering_requirements);
  const discoveredWager = extractNumericValue(discovered.wagering_requirements);

  if (discoveredWager && existingWager) {
    if (discoveredWager < existingWager) {
      differences.push(
        `Better wagering requirements: ${discoveredWager}x vs ${existingWager}x`
      );
      isBetter = true;
    } else if (discoveredWager > existingWager) {
      differences.push(
        `Worse wagering requirements: ${discoveredWager}x vs ${existingWager}x`
      );
      isDifferent = true;
    }
  }

  // Compare offer titles/descriptions for significant changes
  if (
    existing.offer_title !== discovered.offer_title &&
    discovered.offer_title !== 'Untitled Offer'
  ) {
    differences.push('Offer details have changed');
    isDifferent = true;
    confidence = 75; // Lower confidence when details differ
  }

  const notes =
    differences.length > 0
      ? differences.join('; ')
      : 'Offer appears similar to existing';

  return {
    is_better: isBetter,
    is_different: isDifferent || isBetter,
    notes,
    confidence,
  };
}

/**
 * Format an offer into a human-readable summary
 */
function formatOfferSummary(offer: PromotionalOffer): string {
  const parts: string[] = [];

  if (offer.offer_title && offer.offer_title !== 'Untitled Offer') {
    parts.push(offer.offer_title);
  }

  if (offer.bonus_amount) {
    parts.push(offer.bonus_amount);
  }

  if (offer.match_percentage) {
    parts.push(`${offer.match_percentage} match`);
  }

  if (offer.wagering_requirements) {
    parts.push(`${offer.wagering_requirements} wagering`);
  }

  return parts.length > 0 ? parts.join(' | ') : offer.offer_description || 'No details available';
}

/**
 * Extract numeric value from a string (handles $ signs, %, x, etc.)
 */
function extractNumericValue(value?: string): number | null {
  if (!value) return null;

  const cleaned = value.replace(/[$,%x]/gi, '').trim();
  const match = cleaned.match(/[\d.]+/);

  if (match) {
    const num = parseFloat(match[0]);
    return isNaN(num) ? null : num;
  }

  return null;
}

/**
 * Normalize casino name for comparison
 */
function normalizeCasinoName(name: string, state: USState): string {
  return `${name.toLowerCase().trim().replace(/[^a-z0-9]/g, '')}-${state}`;
}

/**
 * Filter new offers (not in existing database)
 */
export function findNewOffers(
  discoveredOffers: PromotionalOffer[],
  existingOffers: PromotionalOffer[]
): PromotionalOffer[] {
  const existingKeys = new Set(
    existingOffers.map((offer) =>
      normalizeCasinoName(offer.casino_name, offer.state)
    )
  );

  return discoveredOffers.filter((offer) => {
    const key = normalizeCasinoName(offer.casino_name, offer.state);
    return !existingKeys.has(key);
  });
}
