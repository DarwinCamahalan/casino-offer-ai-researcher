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
  trendData: Array<{ month: string; discoveries: number; cumulative: number }>
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
      let comparisons: any[] = []
      let researchCount = 0

      // Load research history and accumulate ALL data from ALL sessions
      if (researchHistory) {
        const history = JSON.parse(researchHistory)
        researchCount = Array.isArray(history) ? history.length : 0
        
        console.log(`📊 Loading cumulative data from ${researchCount} research sessions`)
        
        // Accumulate all casinos, offers, and comparisons from history
        if (Array.isArray(history)) {
          // Use a Set to track unique casinos by website to avoid duplicates
          const uniqueCasinoWebsites = new Set<string>()
          
          history.forEach((session: any, index: number) => {
            // Accumulate casinos (avoid duplicates by website)
            if (session.casinos && Array.isArray(session.casinos)) {
              session.casinos.forEach((casino: Casino) => {
                if (casino.website && !uniqueCasinoWebsites.has(casino.website)) {
                  casinos.push(casino)
                  uniqueCasinoWebsites.add(casino.website)
                } else if (!casino.website) {
                  // If no website, add anyway (can't dedupe)
                  casinos.push(casino)
                }
              })
            }
            
            // Accumulate offers
            if (session.newOffers && Array.isArray(session.newOffers)) {
              offers.push(...session.newOffers)
            }
            
            // Accumulate comparisons
            if (session.comparisons && Array.isArray(session.comparisons)) {
              comparisons.push(...session.comparisons)
            }
          })
          
          console.log(`📈 Cumulative totals: ${casinos.length} unique casinos, ${offers.length} offers, ${comparisons.length} comparisons`)
        }
      }

      // Fallback to latest research results if no history
      if (casinos.length === 0 && offers.length === 0 && storedResults) {
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

  const generateTrendData = (historyJson: string | null): Array<{ month: string; discoveries: number; cumulative: number }> => {
    if (!historyJson) {
      return [
        { month: 'No Data', discoveries: 0, cumulative: 0 }
      ]
    }

    try {
      const history = JSON.parse(historyJson)
      
      if (!Array.isArray(history) || history.length === 0) {
        return [{ month: 'No Data', discoveries: 0, cumulative: 0 }]
      }

      // Sort history by timestamp
      const sortedHistory = history
        .filter((item: any) => item.timestamp)
        .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

      if (sortedHistory.length === 0) {
        return [{ month: 'No Data', discoveries: 0, cumulative: 0 }]
      }

      // Create cumulative data - track unique casinos across sessions
      let cumulativeCasinos = 0
      const uniqueCasinoWebsites = new Set<string>()
      
      const trendData: Array<{ month: string; discoveries: number; cumulative: number }> = sortedHistory.map((item: any, index: number) => {
        const timestamp = new Date(item.timestamp)
        const timeLabel = timestamp.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        
        // Count unique casinos for cumulative total
        const sessionCasinos = item.casinos || []
        sessionCasinos.forEach((casino: any) => {
          if (casino.website && !uniqueCasinoWebsites.has(casino.website)) {
            uniqueCasinoWebsites.add(casino.website)
            cumulativeCasinos++
          } else if (!casino.website) {
            // If no website, count anyway (can't dedupe)
            cumulativeCasinos++
          }
        })
        
        return {
          month: `#${index + 1}: ${timeLabel}`,
          discoveries: item.casinosFound || 0,
          cumulative: cumulativeCasinos
        }
      })

      return trendData.length > 0 ? trendData : [{ month: 'No Data', discoveries: 0, cumulative: 0 }]
      
    } catch {
      return [{ month: 'No Data', discoveries: 0, cumulative: 0 }]
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

  // Line Chart Options - Now shows both per-session and cumulative
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
      legend: {
        data: ['Per Session', 'Cumulative Total'],
        textStyle: {
          color: labelColor
        },
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
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
          color: labelColor,
          rotate: dashboardData.trendData.length > 5 ? 45 : 0,
          fontSize: 10
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
          name: 'Per Session',
          type: 'line',
          data: dashboardData.trendData.map(d => d.discoveries),
          smooth: true,
          lineStyle: {
            color: '#ec4899',
            width: 2
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
                { offset: 0, color: 'rgba(236, 72, 153, 0.3)' },
                { offset: 1, color: 'rgba(236, 72, 153, 0.05)' }
              ]
            }
          }
        },
        {
          name: 'Cumulative Total',
          type: 'line',
          data: dashboardData.trendData.map(d => d.cumulative || 0),
          smooth: true,
          lineStyle: {
            color: '#9333ea',
            width: 3
          },
          itemStyle: {
            color: '#9333ea'
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
      {/* Stats Grid - Cumulative across all research sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Total Unique Casinos"
          value={dashboardData.totalCasinos}
          change="Across all sessions"
          icon={<Database className="h-6 w-6 md:h-8 md:w-8" />}
          gradient="from-purple-600 to-purple-800"
        />
        <StatCard
          title="Total Offers Found"
          value={dashboardData.totalOffers}
          change="Cumulative total"
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
          title="Research Sessions"
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
            <CardTitle className="text-foreground text-base md:text-lg">Cumulative Discovery Growth</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Track your growing casino database across all research sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={getLineChartOption()} style={{ height: '350px' }} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default DashboardStats
