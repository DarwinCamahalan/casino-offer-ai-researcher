/**
 * Dashboard Stats Component - Charts and visualizations
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, DollarSign, Database, Zap } from 'lucide-react'

const stateData = [
  { name: 'NJ', casinos: 12, offers: 45 },
  { name: 'MI', casinos: 10, offers: 38 },
  { name: 'PA', casinos: 10, offers: 42 },
  { name: 'WV', casinos: 5, offers: 20 },
]

const offerTypeData = [
  { name: 'Welcome Bonus', value: 45, color: '#9333ea' },
  { name: 'No Deposit', value: 30, color: '#ec4899' },
  { name: 'Free Spins', value: 25, color: '#06b6d4' },
  { name: 'Reload Bonus', value: 20, color: '#10b981' },
]

const trendData = [
  { month: 'Jan', discoveries: 5 },
  { month: 'Feb', discoveries: 8 },
  { month: 'Mar', discoveries: 12 },
  { month: 'Apr', discoveries: 15 },
  { month: 'May', discoveries: 18 },
  { month: 'Jun', discoveries: 22 },
]

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
    >
      <Card className={`bg-gradient-to-br ${gradient} border-white/10`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">{title}</p>
              <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
              {change && (
                <p className="text-green-300 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
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
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Casinos"
          value="37"
          change="+5 this month"
          icon={<Database className="h-8 w-8" />}
          gradient="from-purple-600 to-purple-800"
        />
        <StatCard
          title="Active Offers"
          value="145"
          change="+12 this week"
          icon={<DollarSign className="h-8 w-8" />}
          gradient="from-pink-600 to-rose-800"
        />
        <StatCard
          title="States Covered"
          value="4"
          icon={<Database className="h-8 w-8" />}
          gradient="from-blue-600 to-cyan-800"
        />
        <StatCard
          title="AI Researches"
          value="156"
          change="+23 this month"
          icon={<Zap className="h-8 w-8" />}
          gradient="from-green-600 to-emerald-800"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 [&>*]:overflow-visible">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Casinos & Offers by State</CardTitle>
              <CardDescription className="text-gray-400">
                Distribution across all covered states
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-visible">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.95)',
                      border: '1px solid rgba(147,51,234,0.5)',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                      zIndex: 9999,
                    }}
                    cursor={{ fill: 'rgba(147,51,234,0.1)' }}
                    wrapperStyle={{ zIndex: 9999 }}
                  />
                  <Bar dataKey="casinos" fill="#9333ea" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="offers" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Offer Types Distribution</CardTitle>
              <CardDescription className="text-gray-400">
                Breakdown of promotional offer categories
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-visible">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={offerTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {offerTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.95)',
                      border: '1px solid rgba(147,51,234,0.5)',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                      zIndex: 9999,
                    }}
                    wrapperStyle={{ zIndex: 9999 }}
                  />
                </PieChart>
              </ResponsiveContainer>
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
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Discovery Trend</CardTitle>
            <CardDescription className="text-gray-400">
              New casino discoveries over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-visible">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.95)',
                    border: '1px solid rgba(147,51,234,0.5)',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                    zIndex: 9999,
                  }}
                  cursor={{ stroke: '#9333ea', strokeWidth: 2 }}
                  wrapperStyle={{ zIndex: 9999 }}
                />
                <Line
                  type="monotone"
                  dataKey="discoveries"
                  stroke="#9333ea"
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default DashboardStats
