/**
 * Dashboard Stats Component - Real data from Xano API and localStorage
 */

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import { TrendingUp, DollarSign, Database, Zap } from 'lucide-react'
import { fetchExistingOffers, normalizeXanoOffers, extractCasinosFromOffers } from '@/lib/services/xanoService'
import { ResearchResult, PromotionalOffer, Casino, USState } from '@/types'
import { useTheme } from 'next-themes'

// Dynamically import ReactECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading chart...</div>
    </div>
  ),
})

interface DashboardData {
  totalCasinos: number
  totalOffers: number
  statesCount: number
  researchCount: number
  stateData: Array<{ name: string; casinos: number; offers: number }>
  offerTypeData: Array<{ name: string; value: number }>
  trendData: Array<{ month: string; discoveries: number }>
}

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  gradient: string
}

function StatCard({ title, value, change, icon, gradient }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <Card className={`bg-gradient-to-br ${gradient} border-0 shadow-lg h-full`}>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs md:text-sm font-medium">{title}</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-1 md:mt-2">{value}</h3>
              {change && (
                <p className="text-green-300 text-xs md:text-sm mt-1 md:mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                  {change}
                </p>
              )}
            </div>
            <div className="text-white/80">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const DashboardStats = () => {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const { theme, systemTheme } = useTheme()
  
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  useEffect(() => {
    setMounted(true)
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Try to get research results from localStorage first
      const storedResults = localStorage.getItem('research_results')
      const researchHistory = localStorage.getItem('research_history')
      
      let casinos: Casino[] = []
      let offers: PromotionalOffer[] = []
      let researchCount = 0

      // Load research history count
      if (researchHistory) {
        const history = JSON.parse(researchHistory)
        researchCount = Array.isArray(history) ? history.length : 0
      }

      // If we have stored research results, use them
      if (storedResults) {
        const results: ResearchResult = JSON.parse(storedResults)
        
        // Extract casinos from missing_casinos
        Object.values(results.missing_casinos).forEach((stateCasinos) => {
          casinos.push(...stateCasinos)
        })

        // Use new offers
        offers = results.new_offers || []
      }

      // Fallback to Xano API if no local data
      if (casinos.length === 0 && offers.length === 0) {
        try {
          const xanoOffers = await fetchExistingOffers()
          const normalizedOffers = normalizeXanoOffers(xanoOffers)
          offers = normalizedOffers
          casinos = extractCasinosFromOffers(normalizedOffers)
        } catch (error) {
          console.error('Failed to fetch from Xano:', error)
        }
      }

      // Process data for charts
      const stateMap = new Map<string, { casinos: number; offers: number }>()
      const offerTypeMap = new Map<string, number>()

      // Count by state
      casinos.forEach(casino => {
        const state = casino.state
        if (!stateMap.has(state)) {
          stateMap.set(state, { casinos: 0, offers: 0 })
        }
        stateMap.get(state)!.casinos++
      })

      offers.forEach(offer => {
        const state = offer.state
        if (!stateMap.has(state)) {
          stateMap.set(state, { casinos: 0, offers: 0 })
        }
        stateMap.get(state)!.offers++

        // Count offer types
        const title = offer.offer_title.toLowerCase()
        if (title.includes('welcome') || title.includes('signup')) {
          offerTypeMap.set('Welcome Bonus', (offerTypeMap.get('Welcome Bonus') || 0) + 1)
        } else if (title.includes('no deposit') || title.includes('free')) {
          offerTypeMap.set('No Deposit', (offerTypeMap.get('No Deposit') || 0) + 1)
        } else if (title.includes('spin')) {
          offerTypeMap.set('Free Spins', (offerTypeMap.get('Free Spins') || 0) + 1)
        } else if (title.includes('reload')) {
          offerTypeMap.set('Reload Bonus', (offerTypeMap.get('Reload Bonus') || 0) + 1)
        } else {
          offerTypeMap.set('Other', (offerTypeMap.get('Other') || 0) + 1)
        }
      })

      // Convert to chart data
      const stateData = Array.from(stateMap.entries()).map(([name, data]) => ({
        name,
        casinos: data.casinos,
        offers: data.offers
      }))

      const offerTypeData = Array.from(offerTypeMap.entries()).map(([name, value]) => ({
        name,
        value
      }))

      // Generate trend data from history
      const trendData = generateTrendData(researchHistory)

      setDashboardData({
        totalCasinos: casinos.length,
        totalOffers: offers.length,
        statesCount: stateMap.size,
        researchCount,
        stateData,
        offerTypeData,
        trendData
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateTrendData = (historyJson: string | null): Array<{ month: string; discoveries: number }> => {
    if (!historyJson) {
      return [
        { month: 'Day 1', discoveries: 0 }
      ]
    }

    try {
      const history = JSON.parse(historyJson)
      
      if (!Array.isArray(history) || history.length === 0) {
        return [{ month: 'Day 1', discoveries: 0 }]
      }

      // Sort history by timestamp
      const sortedHistory = history
        .filter((item: any) => item.timestamp)
        .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

      if (sortedHistory.length === 0) {
        return [{ month: 'Day 1', discoveries: 0 }]
      }

      // Get first research date
      const firstDate = new Date(sortedHistory[0].timestamp)
      const today = new Date()
      
      // Calculate days since first research
      const daysSinceFirst = Math.ceil((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Create array for each day from first research to today
      const trendData: Array<{ month: string; discoveries: number }> = []
      
      for (let i = 0; i <= Math.min(daysSinceFirst, 30); i++) {
        const currentDate = new Date(firstDate)
        currentDate.setDate(firstDate.getDate() + i)
        
        const dayLabel = i === 0 ? 'Start' : `Day ${i + 1}`
        
        // Count discoveries for this specific day
        const discoveriesOnDay = sortedHistory
          .filter((item: any) => {
            const itemDate = new Date(item.timestamp)
            return itemDate.toDateString() === currentDate.toDateString()
          })
          .reduce((sum: number, item: any) => sum + (item.casinosFound || 0), 0)
        
        trendData.push({
          month: dayLabel,
          discoveries: discoveriesOnDay
        })
      }

      // If no data points, return at least the first day
      return trendData.length > 0 ? trendData : [{ month: 'Day 1', discoveries: 0 }]
      
    } catch {
      return [{ month: 'Day 1', discoveries: 0 }]
    }
  }

  // Bar Chart Options
  const getBarChartOption = () => {
    if (!dashboardData) return {}
    
    const axisColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
    const labelColor = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
    const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: '#9333ea',
        textStyle: {
          color: isDark ? '#fff' : '#000'
        }
      },
      legend: {
        data: ['Casinos', 'Offers'],
        textStyle: {
          color: labelColor
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dashboardData.stateData.map(d => d.name),
        axisLine: {
          lineStyle: {
            color: axisColor
          }
        },
        axisLabel: {
          color: labelColor
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: axisColor
          }
        },
        axisLabel: {
          color: labelColor
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor
          }
        }
      },
      series: [
        {
          name: 'Casinos',
          type: 'bar',
          data: dashboardData.stateData.map(d => d.casinos),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#9333ea' },
                { offset: 1, color: '#6b21a8' }
              ]
            },
            borderRadius: [8, 8, 0, 0]
          }
        },
        {
          name: 'Offers',
          type: 'bar',
          data: dashboardData.stateData.map(d => d.offers),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#ec4899' },
                { offset: 1, color: '#be185d' }
              ]
            },
            borderRadius: [8, 8, 0, 0]
          }
        }
      ]
    }
  }

  // Pie Chart Options
  const getPieChartOption = () => {
    if (!dashboardData) return {}
    
    const tooltipBg = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)'
    const tooltipText = isDark ? '#fff' : '#000'
    
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: tooltipBg,
        borderColor: '#9333ea',
        textStyle: {
          color: tooltipText
        },
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
        }
      },
      series: [
        {
          name: 'Offer Types',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: isDark ? '#1a1a1a' : '#ffffff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: isDark ? '#ffffff' : '#000000'
            }
          },
          labelLine: {
            show: false
          },
          data: dashboardData.offerTypeData.map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: ['#9333ea', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][index % 5]
            }
          }))
        }
      ]
    }
  }

  // Line Chart Options
  const getLineChartOption = () => {
    if (!dashboardData) return {}
    
    const axisColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
    const labelColor = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
    const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: '#9333ea',
        textStyle: {
          color: isDark ? '#fff' : '#000'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dashboardData.trendData.map(d => d.month),
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: axisColor
          }
        },
        axisLabel: {
          color: labelColor
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: axisColor
          }
        },
        axisLabel: {
          color: labelColor
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor
          }
        }
      },
      series: [
        {
          name: 'Discoveries',
          type: 'line',
          data: dashboardData.trendData.map(d => d.discoveries),
          smooth: true,
          lineStyle: {
            color: '#9333ea',
            width: 3
          },
          itemStyle: {
            color: '#ec4899'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(147, 51, 234, 0.5)' },
                { offset: 1, color: 'rgba(147, 51, 234, 0.05)' }
              ]
            }
          }
        }
      ]
    }
  }

  if (!mounted || loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse bg-card h-[120px]">
              <CardContent className="p-6">
                <div className="h-full bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Total Casinos"
          value={dashboardData.totalCasinos}
          icon={<Database className="h-6 w-6 md:h-8 md:w-8" />}
          gradient="from-purple-600 to-purple-800"
        />
        <StatCard
          title="Active Offers"
          value={dashboardData.totalOffers}
          icon={<DollarSign className="h-6 w-6 md:h-8 md:w-8" />}
          gradient="from-pink-600 to-rose-800"
        />
        <StatCard
          title="States Covered"
          value={dashboardData.statesCount}
          icon={<Database className="h-6 w-6 md:h-8 md:w-8" />}
          gradient="from-blue-600 to-cyan-800"
        />
        <StatCard
          title="AI Researches"
          value={dashboardData.researchCount}
          icon={<Zap className="h-6 w-6 md:h-8 md:w-8" />}
          gradient="from-green-600 to-emerald-800"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <Card className="bg-card border-border shadow-lg h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-foreground text-base md:text-lg">Casinos & Offers by State</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Distribution across all covered states
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ReactECharts option={getBarChartOption()} style={{ height: '300px' }} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="h-full"
        >
          <Card className="bg-card border-border shadow-lg h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-foreground text-base md:text-lg">Offer Types Distribution</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Breakdown of promotional offer categories
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ReactECharts option={getPieChartOption()} style={{ height: '300px' }} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground text-base md:text-lg">Discovery Trend</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              New casino discoveries from your first research (up to 30 days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={getLineChartOption()} style={{ height: '300px' }} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default DashboardStats
