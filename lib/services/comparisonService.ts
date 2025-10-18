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
 * Create a unique key for a comparison based on casino name and offer details
 */
function createComparisonKey(comparison: OfferComparison): string {
  const normalizedCasino = comparison.casino.toLowerCase().replace(/[^a-z0-9]/g, '');
  const offerDetails = comparison.discovered_offer_details;
  
  // Create a key based on casino name and all offer details
  if (!offerDetails) {
    return `${normalizedCasino}:no-details`;
  }
  
  const detailsKey = [
    offerDetails.bonus_amount,
    offerDetails.match_percentage,
    offerDetails.wagering_requirements,
    offerDetails.promo_code
  ].filter(Boolean).join('|');
  
  return `${normalizedCasino}:${detailsKey}`;
}

/**
 * Remove duplicate comparisons that have the same casino and offer details
 * Keep only one instance per unique offer, preferring comparisons with higher confidence
 */
function deduplicateComparisons(comparisons: OfferComparison[]): OfferComparison[] {
  const comparisonMap = new Map<string, OfferComparison>();
  
  comparisons.forEach((comparison) => {
    const key = createComparisonKey(comparison);
    const existing = comparisonMap.get(key);
    

    if (!existing) {
      comparisonMap.set(key, comparison);
    } else {
      const currentConfidence = comparison.confidence_score ?? 0;
      const existingConfidence = existing.confidence_score ?? 0;
      
      if (currentConfidence > existingConfidence) {
        comparisonMap.set(key, comparison);
      }
    }
  });
  
  return Array.from(comparisonMap.values());
}

/**
 * Compare discovered offers with existing offers from both Xano database and historical research
 */
export function compareOffers(
  discoveredOffers: PromotionalOffer[],
  existingOffers: PromotionalOffer[],
  historicalOffers?: PromotionalOffer[]
): OfferComparison[] {
  const comparisons: OfferComparison[] = [];

  console.log(`\n=== OFFER COMPARISON DEBUG ===`);
  console.log(`Discovered offers: ${discoveredOffers.length}`);
  console.log(`Existing offers (Xano): ${existingOffers.length}`);
  console.log(`Historical offers: ${historicalOffers?.length || 0}`);

  // Combine existing offers from Xano and historical research
  const allExistingOffers = [...existingOffers];
  if (historicalOffers && historicalOffers.length > 0) {
    allExistingOffers.push(...historicalOffers);
  }

  // Create a map of existing offers by casino and state
  // Keep the best offer if there are duplicates
  const existingOffersMap = new Map<string, PromotionalOffer>();
  allExistingOffers.forEach((offer) => {
    const key = normalizeCasinoName(offer.casino_name, offer.state);
    const existing = existingOffersMap.get(key);
    
    // If we already have an offer, keep the one with higher value
    if (existing) {
      const existingValue = extractNumericValue(existing.bonus_amount) || 0;
      const newValue = extractNumericValue(offer.bonus_amount) || 0;
      
      if (newValue > existingValue) {
        existingOffersMap.set(key, offer);
        console.log(`Updated best offer for "${offer.casino_name}" (${offer.state}) -> $${newValue} > $${existingValue}`);
      }
    } else {
      existingOffersMap.set(key, offer);
      console.log(`Added: "${offer.casino_name}" (${offer.state}) [${offer.source || 'Unknown'}] -> key: "${key}"`);
    }
  });

  console.log(`\nTotal unique offers in database: ${existingOffersMap.size}`);

  // Compare each discovered offer
  discoveredOffers.forEach((discovered) => {
    const key = normalizeCasinoName(discovered.casino_name, discovered.state);
    const existing = existingOffersMap.get(key);
    
    console.log(`\nDiscovered: "${discovered.casino_name}" (${discovered.state}) -> key: "${key}"`);
    console.log(`  Match found: ${existing ? 'YES' : 'NO'}`);
    if (existing) {
      console.log(`  Existing offer: ${formatOfferSummary(existing)} [${existing.source || 'Unknown'}]`);
    }

    if (!existing) {
      // This is a new offer for a casino (not in Xano DB or historical research)
      const totalSources = existingOffersMap.size;
      comparisons.push({
        casino: discovered.casino_name,
        state: discovered.state,
        current_offer: null,
        discovered_offer: formatOfferSummary(discovered),
        is_better: false,
        is_new: true,
        difference_notes: `New casino offer not found in ${totalSources} existing offers (Xano database + research history)`,
        confidence_score: 85,
        discovered_casino_website: discovered.source,
        discovered_offer_details: {
          bonus_amount: discovered.bonus_amount,
          match_percentage: discovered.match_percentage,
          wagering_requirements: discovered.wagering_requirements,
          promo_code: discovered.promo_code,
        },
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
          discovered_casino_website: discovered.source,
          discovered_offer_details: {
            bonus_amount: discovered.bonus_amount,
            match_percentage: discovered.match_percentage,
            wagering_requirements: discovered.wagering_requirements,
            promo_code: discovered.promo_code,
          },
        });
      }
    }
  });

  console.log(`\nTotal comparisons generated: ${comparisons.length}`);
  console.log(`  - New offers: ${comparisons.filter(c => c.is_new).length}`);
  console.log(`  - Better offers: ${comparisons.filter(c => c.is_better).length}`);

  // Deduplicate comparisons - remove duplicate comparisons that have the same offer details
  const uniqueComparisons = deduplicateComparisons(comparisons);
  console.log(`\nAfter deduplication: ${uniqueComparisons.length} unique comparisons`);
  console.log(`=== END COMPARISON DEBUG ===\n`);

  return uniqueComparisons;
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
  let confidence = 95; // Start with high confidence
  let fieldsCompared = 0;
  let fieldsMatched = 0;

  // Compare bonus amounts
  const existingAmount = extractNumericValue(existing.bonus_amount);
  const discoveredAmount = extractNumericValue(discovered.bonus_amount);

  if (discoveredAmount && existingAmount) {
    fieldsCompared++;
    if (discoveredAmount > existingAmount) {
      differences.push(
        `+$${discoveredAmount - existingAmount} bonus`
      );
      isBetter = true;
    } else if (discoveredAmount < existingAmount) {
      differences.push(
        `-$${existingAmount - discoveredAmount} bonus`
      );
      isDifferent = true;
    } else {
      fieldsMatched++;
    }
  } else if (discoveredAmount && !existingAmount) {
    differences.push(`$${discoveredAmount} bonus added`);
    isDifferent = true;
    confidence -= 5; // Slight reduction for missing data
  } else if (!discoveredAmount && existingAmount) {
    confidence -= 5; // Slight reduction for missing data
  }

  // Compare match percentages
  const existingMatch = extractNumericValue(existing.match_percentage);
  const discoveredMatch = extractNumericValue(discovered.match_percentage);

  if (discoveredMatch && existingMatch) {
    fieldsCompared++;
    if (discoveredMatch > existingMatch) {
      differences.push(
        `+${discoveredMatch - existingMatch}% match`
      );
      isBetter = true;
    } else if (discoveredMatch < existingMatch) {
      differences.push(
        `-${existingMatch - discoveredMatch}% match`
      );
      isDifferent = true;
    } else {
      fieldsMatched++;
    }
  } else if (!discoveredMatch && existingMatch) {
    confidence -= 5;
  } else if (discoveredMatch && !existingMatch) {
    confidence -= 5;
  }

  // Compare wagering requirements (lower is better)
  const existingWager = extractNumericValue(existing.wagering_requirements);
  const discoveredWager = extractNumericValue(discovered.wagering_requirements);

  if (discoveredWager && existingWager) {
    fieldsCompared++;
    if (discoveredWager < existingWager) {
      differences.push(
        `${existingWager - discoveredWager}x lower wagering`
      );
      isBetter = true;
    } else if (discoveredWager > existingWager) {
      differences.push(
        `${discoveredWager - existingWager}x higher wagering`
      );
      isDifferent = true;
    } else {
      fieldsMatched++;
    }
  } else if (!discoveredWager && existingWager) {
    confidence -= 5;
  } else if (discoveredWager && !existingWager) {
    confidence -= 5;
  }

  // Compare promo codes
  if (existing.promo_code && discovered.promo_code) {
    fieldsCompared++;
    if (existing.promo_code !== discovered.promo_code) {
      differences.push(`New code: ${discovered.promo_code}`);
      isDifferent = true;
      confidence -= 3;
    } else {
      fieldsMatched++;
    }
  }

  // Compare offer titles/descriptions for significant changes
  if (
    existing.offer_title !== discovered.offer_title &&
    discovered.offer_title !== 'Untitled Offer'
  ) {
    differences.push('Offer updated');
    isDifferent = true;
    confidence -= 10; // Reduce confidence when titles differ
  }

  // Adjust confidence based on field comparison ratio
  if (fieldsCompared > 0) {
    const matchRatio = fieldsMatched / fieldsCompared;
    if (matchRatio === 1 && differences.length === 0) {
      // Perfect match on all comparable fields
      confidence = 98;
    } else if (matchRatio >= 0.5) {
      // Good amount of matching data
      confidence = Math.max(confidence, 85);
    } else if (fieldsCompared < 2) {
      // Not enough data to compare
      confidence = Math.max(confidence - 15, 70);
    }
  } else {
    // No numeric fields to compare, rely on text comparison only
    confidence = 75;
  }

  // Ensure confidence stays in valid range
  confidence = Math.max(60, Math.min(98, confidence));

  // Create concise summary - show max 2 most important differences
  let notes = 'Similar offer';
  if (differences.length > 0) {
    // Prioritize: bonus > match > wagering > promo code > offer changes
    const topDifferences = differences.slice(0, 2);
    notes = topDifferences.join(' • ');
    if (differences.length > 2) {
      notes += ` +${differences.length - 2} more`;
    }
  }

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
 * Handles variations like "BetMGM" vs "BetMGM Online Casino"
 */
function normalizeCasinoName(name: string, state: USState): string {
  let normalized = name.toLowerCase().trim();
  
  // Remove common suffixes and words
  const removeWords = [
    'online casino',
    'casino',
    'online',
    'sportsbook',
    'gaming',
    'hotel',
    'resort',
    'bet',
    'the',
    'and',
    '&',
  ];
  
  // Remove these words from the name
  removeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    normalized = normalized.replace(regex, '');
  });
  
  // Remove all non-alphanumeric characters and extra spaces
  normalized = normalized.replace(/[^a-z0-9]/g, '').trim();
  
  return `${normalized}-${state}`;
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
