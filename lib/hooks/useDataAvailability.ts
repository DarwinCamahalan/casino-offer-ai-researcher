/**
 * Hook to check if research data is available
 */

'use client'

import { useState, useEffect } from 'react'

export function useDataAvailability() {
  const [hasData, setHasData] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    checkDataAvailability()
    
    // Listen for storage events to refresh data availability
    const handleStorageChange = () => {
      checkDataAvailability()
    }
    
    // Listen for custom data availability change event
    const handleDataChange = (event: any) => {
      if (event.detail?.hasData !== undefined) {
        setHasData(event.detail.hasData)
        setIsLoading(false)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('dataAvailabilityChanged', handleDataChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('dataAvailabilityChanged', handleDataChange)
    }
  }, [mounted])

  const checkDataAvailability = async () => {
    try {
      // Check localStorage first
      const storedResults = localStorage.getItem('research_results')
      
      if (storedResults) {
        try {
          const parsed = JSON.parse(storedResults)
          const hasCasinos = parsed.missing_casinos && Object.keys(parsed.missing_casinos).length > 0
          const hasOffers = parsed.new_offers && parsed.new_offers.length > 0
          
          if (hasCasinos || hasOffers) {
            setHasData(true)
            setIsLoading(false)
            return
          }
        } catch (e) {
          console.error('Failed to parse stored results:', e)
        }
      }

      // Check Xano API as fallback
      try {
        const response = await fetch('/api/offers/existing')
        const data = await response.json()
        
        if (data.success && data.data && data.data.length > 0) {
          setHasData(true)
        } else {
          setHasData(false)
        }
      } catch (error) {
        console.error('Failed to fetch from API:', error)
        setHasData(false)
      }
    } catch (error) {
      console.error('Error checking data availability:', error)
      setHasData(false)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshDataCheck = () => {
    setIsLoading(true)
    checkDataAvailability()
  }

  return { hasData, isLoading, refreshDataCheck }
}
