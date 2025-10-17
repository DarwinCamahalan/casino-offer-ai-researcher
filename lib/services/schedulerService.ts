/**
 * Scheduled Research Runner - Supports periodic execution via cron jobs
 */

import cron from 'node-cron';
import { US_STATES } from '@/types';
import {
  fetchExistingOffers,
  normalizeXanoOffers,
  extractCasinosFromOffers,
} from './xanoService';
import {
  discoverCasinosInState,
  batchResearchOffers,
} from './aiResearchService';
import {
  findMissingCasinos,
  compareOffers,
} from './comparisonService';

let scheduledTask: cron.ScheduledTask | null = null;

/**
 * Configuration for scheduled research
 */
export interface ScheduleConfig {
  enabled: boolean;
  cron_expression: string; // e.g., '0 9 * * *' for daily at 9 AM
  include_casino_discovery: boolean;
  include_offer_research: boolean;
  on_complete?: (result: any) => void;
}

/**
 * Start scheduled research based on configuration
 */
export function startScheduledResearch(config: ScheduleConfig): void {
  if (!config.enabled) {
    console.log('Scheduled research is disabled');
    return;
  }

  if (scheduledTask) {
    console.log('Stopping existing scheduled task...');
    scheduledTask.stop();
  }

  console.log(`Starting scheduled research with cron: ${config.cron_expression}`);

  scheduledTask = cron.schedule(config.cron_expression, async () => {
    console.log('=== Starting Scheduled Research ===');
    const startTime = Date.now();

    try {
      // Fetch existing data
      const xanoOffers = await fetchExistingOffers();
      const existingOffers = normalizeXanoOffers(xanoOffers);
      const existingCasinos = extractCasinosFromOffers(existingOffers);

      let discoveredCasinos: any[] = [];
      let discoveredOffers: any[] = [];

      // Discover casinos
      if (config.include_casino_discovery) {
        console.log('Discovering casinos...');
        for (const state of US_STATES) {
          const stateCasinos = await discoverCasinosInState(state);
          discoveredCasinos.push(...stateCasinos);
          await delay(1000);
        }
        console.log(`Discovered ${discoveredCasinos.length} casinos`);
      }

      // Research offers
      if (config.include_offer_research) {
        console.log('Researching offers...');
        const missingCasinos = findMissingCasinos(discoveredCasinos, existingCasinos);
        const casinosToResearch = [...existingCasinos, ...missingCasinos];
        discoveredOffers = await batchResearchOffers(casinosToResearch, 3);
        console.log(`Discovered ${discoveredOffers.length} offers`);
      }

      // Compare results
      const offerComparisons = compareOffers(discoveredOffers, existingOffers);
      const betterOffers = offerComparisons.filter((c) => c.is_better);

      const result = {
        timestamp: new Date().toISOString(),
        execution_time_ms: Date.now() - startTime,
        discovered_casinos: discoveredCasinos.length,
        discovered_offers: discoveredOffers.length,
        better_offers_count: betterOffers.length,
        comparisons: offerComparisons,
      };

      console.log('=== Research Completed ===');
      console.log(JSON.stringify(result, null, 2));

      if (config.on_complete) {
        config.on_complete(result);
      }
    } catch (error) {
      console.error('Error during scheduled research:', error);
    }
  });

  console.log('Scheduled research started successfully');
}

/**
 * Stop scheduled research
 */
export function stopScheduledResearch(): void {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('Scheduled research stopped');
  }
}

/**
 * Check if scheduled research is running
 */
export function isScheduledResearchRunning(): boolean {
  return scheduledTask !== null;
}

/**
 * Utility delay function
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
