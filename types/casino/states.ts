/**
 * US State Types and Constants
 */

export type USState = 'NJ' | 'MI' | 'PA' | 'WV'

export const US_STATES: USState[] = ['NJ', 'MI', 'PA', 'WV']

export const STATE_NAMES: Record<USState, string> = {
  NJ: 'New Jersey',
  MI: 'Michigan',
  PA: 'Pennsylvania',
  WV: 'West Virginia',
}

export interface RegulatorySource {
  state: USState
  commission_name: string
  website: string
}

export const REGULATORY_SOURCES: RegulatorySource[] = [
  {
    state: 'NJ',
    commission_name: 'New Jersey Division of Gaming Enforcement',
    website: 'https://www.nj.gov/oag/ge/',
  },
  {
    state: 'MI',
    commission_name: 'Michigan Gaming Control Board',
    website: 'https://www.michigan.gov/mgcb',
  },
  {
    state: 'PA',
    commission_name: 'Pennsylvania Gaming Control Board',
    website: 'https://gamingcontrolboard.pa.gov/',
  },
  {
    state: 'WV',
    commission_name: 'West Virginia Lottery Commission',
    website: 'https://www.wvlottery.com/',
  },
]
