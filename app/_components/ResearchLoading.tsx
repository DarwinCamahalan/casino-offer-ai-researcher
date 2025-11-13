/**
 * Research Loading Component - Animated progress indicator
 */

'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Database, TrendingUp, CheckCircle2 } from 'lucide-react'

interface Props {
  estimatedTime?: number // in seconds
  includeCasinoDiscovery?: boolean
  includeOfferResearch?: boolean
}

const ResearchLoading = ({ 
  estimatedTime = 120, 
  includeCasinoDiscovery = true,
  includeOfferResearch = true 
}: Props) => {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [estimatedWaitSeconds, setEstimatedWaitSeconds] = useState(0)
  const [remainingWaitSeconds, setRemainingWaitSeconds] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const hasStartedRef = useRef(false)
  const initialProgressRef = useRef<number>(0)

  // Define all possible steps with more realistic durations
  const allSteps = [
    { 
      id: 'fetching',
      label: 'Fetching existing data', 
      icon: <Database className="h-5 w-5" />, 
      duration: 10,
      alwaysShow: true
    },
    { 
      id: 'discovering',
      label: 'Discovering casinos', 
      icon: <Sparkles className="h-5 w-5" />, 
      duration: 40, // Increased from 35
      showWhen: includeCasinoDiscovery
    },
    { 
      id: 'researching',
      label: 'Researching offers', 
      icon: <TrendingUp className="h-5 w-5" />, 
      duration: 70, // Increased from 50 to match real API time
      showWhen: includeOfferResearch
    },
    { 
      id: 'comparing',
      label: 'Comparing results', 
      icon: <CheckCircle2 className="h-5 w-5" />, 
      duration: 30, // Increased from 15
      showWhen: includeCasinoDiscovery || includeOfferResearch
    },
  ]

  // Filter steps based on selected options
  const steps = useMemo(() => {
    return allSteps.filter(step => step.alwaysShow || step.showWhen)
  }, [includeCasinoDiscovery, includeOfferResearch])

  // Calculate total duration from steps
  const totalDuration = useMemo(() => {
    return steps.reduce((acc, step) => acc + step.duration, 0)
  }, [steps])

  useEffect(() => {
    // Generate random initial progress between 30% and 100%
    const randomInitialProgress = Math.floor(Math.random() * (100 - 30 + 1)) + 30
    initialProgressRef.current = randomInitialProgress
    
    // Add a delay before starting the progress (1-3 seconds)
    const delay = Math.floor(Math.random() * 2000) + 1000 // 1-3 seconds in milliseconds
    
    // Generate random estimated wait time (8-30 seconds)
    const randomEstimatedSeconds = Math.floor(Math.random() * (30 - 8 + 1)) + 8
    setEstimatedWaitSeconds(randomEstimatedSeconds)
    setRemainingWaitSeconds(randomEstimatedSeconds)
    
    // Countdown timer for wait seconds
    let countdownInterval: NodeJS.Timeout | null = null
    
    const startCountdown = () => {
      countdownInterval = setInterval(() => {
        if (!hasStartedRef.current) {
          setRemainingWaitSeconds((prev) => {
            if (prev <= 1) {
              if (countdownInterval) clearInterval(countdownInterval)
              return 0
            }
            return prev - 1
          })
        } else {
          if (countdownInterval) clearInterval(countdownInterval)
        }
      }, 1000)
    }
    
    startCountdown()
    
    const delayTimeout = setTimeout(() => {
      hasStartedRef.current = true
      setHasStarted(true)
      if (countdownInterval) clearInterval(countdownInterval)
    }, delay)

    let elapsed = 0
    let progressElapsed = 0 // Track time since progress started
    
    // Progress animation interval - updates more frequently for smooth animation
    const progressInterval = setInterval(() => {
      if (!hasStartedRef.current) {
        return // Wait for delay to complete
      }

      progressElapsed += 0.1 // Update every 100ms for smooth animation
      
      // Calculate progress smoothly from 0% to initial progress, then to 100%
      let calculatedProgress: number
      
      // Time to reach initial progress (smooth transition over 2-3 seconds)
      const timeToInitialProgress = 2.5 // seconds
      
      if (progressElapsed < timeToInitialProgress) {
        // Smoothly animate from 0% to initial progress
        const progressRatio = progressElapsed / timeToInitialProgress
        // Use easing function for smooth animation
        const easedRatio = progressRatio < 0.5 
          ? 2 * progressRatio * progressRatio 
          : 1 - Math.pow(-2 * progressRatio + 2, 2) / 2
        calculatedProgress = easedRatio * initialProgressRef.current
      } else {
        // After reaching initial progress, continue to 100%
        const timeAfterInitial = progressElapsed - timeToInitialProgress
        const remainingProgress = 100 - initialProgressRef.current
        const progressRate = remainingProgress / (totalDuration - timeToInitialProgress)
        calculatedProgress = initialProgressRef.current + (timeAfterInitial * progressRate)
      }
      
      // If we've exceeded the estimated time, continue slowly
      if (progressElapsed > totalDuration) {
        // Continue incrementing slowly after estimated time
        // Each second after totalDuration only adds 0.1% progress
        const overtime = progressElapsed - totalDuration
        calculatedProgress = 95 + Math.min(overtime * 0.1, 3) // Cap at 98%
      } else if (calculatedProgress > 85) {
        // Apply stronger easing as we approach the end
        // This makes the last 15% take longer, matching real-world slowdown
        const excessProgress = calculatedProgress - 85
        calculatedProgress = 85 + (excessProgress * 0.6)
      }
      
      const newProgress = Math.min(calculatedProgress, 98)
      setProgress(newProgress)
    }, 100) // Update every 100ms for smooth animation
    
    // Main interval for elapsed time and step updates (updates every second)
    const interval = setInterval(() => {
      if (!hasStartedRef.current) {
        return // Wait for delay to complete
      }

      elapsed += 1
      setElapsedTime(elapsed)

      // Update current step more accurately
      // Adjust step calculation based on elapsed time
      let cumulativeDuration = 0
      for (let i = 0; i < steps.length; i++) {
        cumulativeDuration += steps[i].duration
        if (elapsed < cumulativeDuration) {
          setCurrentStep(i)
          break
        }
      }
      
      // Stay on the last step if we've exceeded total duration
      if (elapsed >= totalDuration * 0.9) {
        setCurrentStep(steps.length - 1)
      }

      // Don't clear interval - let it continue until component unmounts
      // This allows progress to continue slowly if API takes longer than expected
    }, 1000)

    return () => {
      clearTimeout(delayTimeout)
      clearInterval(interval)
      clearInterval(progressInterval)
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, [steps, totalDuration])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full"
    >
      <Card className="bg-card/95 backdrop-blur-xl border-border shadow-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Animated Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 absolute inset-0 blur-xl" />
              <Loader2 className="h-20 w-20 text-purple-400 relative" />
            </motion.div>

            {/* Title */}
            <div>
              <h3 className="text-foreground text-2xl font-bold mb-2">
                AI Research in Progress
              </h3>
              <p className="text-muted-foreground text-sm">
                {includeCasinoDiscovery && includeOfferResearch && 'Analyzing casinos and promotional offers...'}
                {includeCasinoDiscovery && !includeOfferResearch && 'Discovering licensed casinos...'}
                {!includeCasinoDiscovery && includeOfferResearch && 'Researching promotional offers...'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground text-sm">Progress</span>
                <span className="text-purple-400 text-sm font-semibold">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%]"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${progress}%`,
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ 
                    width: { duration: 0.5 },
                    backgroundPosition: { duration: 3, repeat: Infinity }
                  }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="w-full max-w-md space-y-3">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isCompleted
                        ? 'bg-green-600/20 border border-green-500/30'
                        : isCurrent
                        ? 'bg-purple-600/20 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                        : 'bg-muted/50 border border-border'
                    }`}
                  >
                    <div className={`${
                      isCompleted ? 'text-green-400' : isCurrent ? 'text-purple-400' : 'text-muted-foreground'
                    }`}>
                      {step.icon}
                    </div>
                    <span className={`flex-1 text-sm font-medium ${
                      isCompleted ? 'text-green-400' : isCurrent ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-400"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </motion.div>
                    )}
                    {isCurrent && (
                      <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-purple-400 text-purple-400 bg-purple-600/10">
                Using GPT-4
              </Badge>
              <Badge variant="outline" className="border-blue-400 text-blue-400 bg-blue-600/10">
                Official Sources
              </Badge>
              <Badge variant="outline" className="border-green-400 text-green-400 bg-green-600/10">
                Real-time Data
              </Badge>
            </div>

            {/* Estimated Time */}
            <p className="text-muted-foreground text-xs mt-2">
              {progress < 98 ? (
                <>
                  {!hasStarted ? (
                    <>Starting research in {Math.max(0, remainingWaitSeconds)}s...</>
                  ) : elapsedTime < totalDuration ? (
                    <>Estimated time remaining: {Math.max(1, totalDuration - elapsedTime)}s</>
                  ) : (
                    <>Processing large dataset, almost complete...</>
                  )}
                </>
              ) : (
                <>Finalizing results...</>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ResearchLoading
