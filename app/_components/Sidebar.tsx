/**
 * Dashboard Sidebar - Modern navigation with stats
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  Settings, 
  Database,
  Zap,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Research',
    href: '/research',
    icon: <Search className="h-5 w-5" />,
    badge: 'AI',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: 'Results',
    href: '/results',
    icon: <Database className="h-5 w-5" />,
  },
]

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg bg-gradient-to-br ${color}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-white/80">{icon}</div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-white/70">{label}</div>
        </div>
      </div>
    </motion.div>
  )
}

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 border-r border-white/10 flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Casino Offer AI</h1>
              <p className="text-purple-300 text-xs">Research Platform</p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                className={cn(
                  'flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer',
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge className="bg-yellow-500 text-black text-xs">
                    {item.badge}
                  </Badge>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 space-y-3 border-t border-white/10">
        <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          Quick Stats
        </h3>
        <StatCard
          label="States Covered"
          value="4"
          icon={<Database className="h-4 w-4" />}
          color="from-blue-600 to-cyan-600"
        />
        <StatCard
          label="AI-Powered"
          value="GPT-4"
          icon={<Zap className="h-4 w-4" />}
          color="from-purple-600 to-pink-600"
        />
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10">
        <p className="text-white/40 text-xs text-center">
          © 2025 Darwin Camahalan
        </p>
      </div>
    </motion.aside>
  )
}

export default Sidebar
