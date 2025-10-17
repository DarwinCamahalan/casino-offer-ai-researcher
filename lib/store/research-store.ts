/**
 * Zustand Store for Research State Management
 */

import { create } from 'zustand'
import { ResearchResult, ResearchRequest } from '@/types'

interface ResearchStore {
  // State
  isLoading: boolean
  results: ResearchResult | null
  error: string | null
  
  // Actions
  setLoading: (loading: boolean) => void
  setResults: (results: ResearchResult | null) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useResearchStore = create<ResearchStore>((set) => ({
  // Initial state
  isLoading: false,
  results: null,
  error: null,
  
  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setResults: (results) => set({ results, error: null }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ isLoading: false, results: null, error: null }),
}))
