/**
 * AI Research Service - Uses OpenAI GPT-4 for intelligent casino and offer discovery
 */

import OpenAI from 'openai';
import {
  Casino,
  PromotionalOffer,
  USState,
  STATE_NAMES,
  REGULATORY_SOURCES,
} from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Discover licensed casinos in a specific state using AI research
 * @param state - The US state to research
 * @param excludeCasinoWebsites - Array of casino websites to exclude from results (already researched)
 */
export async function discoverCasinosInState(
  state: USState,
  excludeCasinoWebsites: string[] = []
): Promise<Casino[]> {
  const regulatorySource = REGULATORY_SOURCES.find((s) => s.state === state);
  const stateName = STATE_NAMES[state];

  const excludeSection = excludeCasinoWebsites.length > 0
    ? `\n8. EXCLUDE these casinos (already researched):\n${excludeCasinoWebsites.map(w => `   - ${w}`).join('\n')}`
    : '';

  const prompt = `You are a research assistant specializing in US gaming regulations.

Task: Find ALL licensed and operational online casinos in ${stateName} (${state}).

Research Requirements:
1. Focus on CASINO gaming licenses only (NOT sports betting)
2. Use official sources: ${regulatorySource?.commission_name} (${regulatorySource?.website})
3. Include online casinos, mobile casinos, and casino apps
4. Verify each casino is currently operational
5. CRITICAL: Only include casinos with REAL, ACCESSIBLE websites that are currently live and operational
6. Verify website URLs are legitimate and functioning (not placeholder or test sites)
7. Exclude any casinos with unavailable, suspended, or non-functional websites${excludeSection}

For each casino found, provide:
- Exact casino name
- License status (active/operational)
- Official website URL (MUST be accessible and legitimate)
- Parent company or brand (if known)
- Actual license number (do NOT make up placeholder licenses)

Output Format: Return ONLY a valid JSON array of casinos with this exact structure:
[
  {
    "name": "Casino Name",
    "state": "${state}",
    "is_operational": true,
    "license_number": "actual-license-number (ONLY if you have the real license, otherwise omit this field)",
    "website": "https://casino-site.com (ONLY include if website is verified accessible)",
    "brand": "Parent Company (if known)"
  }
]

Important: 
- Return ONLY the JSON array, no additional text
- Include every licensed casino you can find
- If you don't have the REAL license number, DO NOT include the license_number field
- Only include websites you can verify are legitimate and operational
- Do NOT include placeholder data like "LIC-0001", "LIC-0002", etc.
- Do NOT include sports betting operators unless they also offer casino games`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert research assistant for US gaming regulations. You provide accurate, structured data in JSON format only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more factual responses
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const casinos = parseJSONResponse<Casino[]>(content);
    
    // Filter out any casinos that match excluded websites (additional safety check)
    const filteredCasinos = casinos.filter(casino => {
      if (!casino.website) return true;
      const normalizedWebsite = casino.website.toLowerCase().replace(/^https?:\/\//i, '').replace(/\/$/, '');
      return !excludeCasinoWebsites.some(excluded => {
        const normalizedExcluded = excluded.toLowerCase().replace(/^https?:\/\//i, '').replace(/\/$/, '');
        return normalizedWebsite === normalizedExcluded || normalizedWebsite.includes(normalizedExcluded);
      });
    });
    
    // Validate and normalize
    return filteredCasinos.map((casino) => ({
      ...casino,
      state,
      is_operational: casino.is_operational ?? true,
      source: 'AI Research - GPT-4',
    }));
  } catch (error) {
    console.error(`Error discovering casinos in ${state}:`, error);
    return [];
  }
}

/**
 * Research promotional offers for a specific casino using AI
 */
export async function researchCasinoOffers(
  casinoName: string,
  state: USState,
  website?: string
): Promise<PromotionalOffer[]> {
  const stateName = STATE_NAMES[state];
  const websiteContext = website ? `Official website: ${website}` : '';

  const prompt = `You are a research assistant specializing in online casino promotions.

Task: Find the CURRENT promotional offers for "${casinoName}" in ${stateName} (${state}).
${websiteContext}

Research Requirements:
1. Focus ONLY on CASINO promotions (no sports betting)
2. Find welcome bonuses, deposit bonuses, free spins, no-deposit bonuses
3. Look for current, active promotions (not expired offers)
4. Use the casino's official website and promotional pages
5. Include specific terms: bonus amounts, match percentages, wagering requirements

For each offer found, provide:
- Offer title/name
- Detailed description
- Bonus amount (e.g., "$100", "$50 free play")
- Match percentage (e.g., "100%", "200%")
- Wagering requirements (e.g., "1x", "20x")
- Promo code (if required)
- Terms URL (if available)

Output Format: Return ONLY a valid JSON array with this exact structure:
[
  {
    "casino_name": "${casinoName}",
    "state": "${state}",
    "offer_title": "Welcome Bonus",
    "offer_description": "Detailed description of the offer",
    "bonus_amount": "$100",
    "match_percentage": "100%",
    "wagering_requirements": "1x playthrough",
    "promo_code": "WELCOME (if applicable)",
    "terms_url": "https://... (if available)"
  }
]

Important:
- Return ONLY the JSON array, no additional text
- If no current promotions found, return an empty array []
- Include all active casino promotions you can find
- Be specific with amounts and requirements`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at researching online casino promotions. You provide accurate, up-to-date promotional information in JSON format only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    const offers = parseJSONResponse<PromotionalOffer[]>(content);
    
    return offers.map((offer) => ({
      ...offer,
      casino_name: casinoName,
      state,
      last_verified: new Date().toISOString(),
      source: website || offer.terms_url || undefined,
    }));
  } catch (error) {
    console.error(`Error researching offers for ${casinoName}:`, error);
    return [];
  }
}

/**
 * Batch research offers for multiple casinos
 */
export async function batchResearchOffers(
  casinos: Casino[],
  concurrency: number = 3
): Promise<PromotionalOffer[]> {
  const results: PromotionalOffer[] = [];
  
  // Process in batches to respect rate limits
  for (let i = 0; i < casinos.length; i += concurrency) {
    const batch = casinos.slice(i, i + concurrency);
    const batchPromises = batch.map((casino) =>
      researchCasinoOffers(casino.name, casino.state, casino.website)
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.flat());
    
    // Add delay between batches to avoid rate limiting
    if (i + concurrency < casinos.length) {
      await delay(1000); // 1 second delay
    }
  }
  
  return results;
}

/**
 * Parse JSON from AI response, handling markdown code blocks
 */
function parseJSONResponse<T>(content: string): T {
  try {
    // Remove markdown code blocks if present
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```json?\n?/g, '').replace(/```\n?$/g, '');
    }
    
    return JSON.parse(cleaned.trim());
  } catch (error) {
    console.error('Failed to parse AI response:', content);
    throw new Error('Invalid JSON response from AI');
  }
}

/**
 * Utility function for delays
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
