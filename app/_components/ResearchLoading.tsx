/**
 * Research Loading Component - Animated progress indicator
 */

'use client'

import { useEffect, useState, useMemo } from 'react'
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

  // Define all possible steps
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
      duration: 35,
      showWhen: includeCasinoDiscovery
    },
    { 
      id: 'researching',
      label: 'Researching offers', 
      icon: <TrendingUp className="h-5 w-5" />, 
      duration: 50,
      showWhen: includeOfferResearch
    },
    { 
      id: 'comparing',
      label: 'Comparing results', 
      icon: <CheckCircle2 className="h-5 w-5" />, 
      duration: 15,
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
    let elapsed = 0
    
    const interval = setInterval(() => {
      elapsed += 1
      setElapsedTime(elapsed)
      
      // Calculate progress with a more accurate curve
      // Allow progress to reach 98% instead of stopping at 95%
      let calculatedProgress = (elapsed / totalDuration) * 100
      
      // Apply easing to make it feel more natural
      // Slow down as we approach completion
      if (calculatedProgress > 90) {
        calculatedProgress = 90 + (calculatedProgress - 90) * 0.5
      }
      
      const newProgress = Math.min(calculatedProgress, 98)
      setProgress(newProgress)

      // Update current step more accurately
      let cumulativeDuration = 0
      for (let i = 0; i < steps.length; i++) {
        cumulativeDuration += steps[i].duration
        if (elapsed < cumulativeDuration) {
          setCurrentStep(i)
          break
        }
      }
      
      // Ensure we're on the last step near completion
      if (elapsed >= totalDuration * 0.95) {
        setCurrentStep(steps.length - 1)
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
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
                  Estimated time remaining: {Math.max(1, totalDuration - elapsedTime)}s
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
