/**
 * Casino Entity Types
 */

import { USState } from './states'

export interface Casino {
  id?: string
  name: string
  state: USState
  license_number?: string
  brand?: string
  website?: string
  is_operational: boolean
  source?: string
}
