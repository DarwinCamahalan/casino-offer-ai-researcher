/**
 * Dashboard Sidebar - Modern navigation with stats and responsive design
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  Database,
  Zap,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useDataAvailability } from '@/lib/hooks/useDataAvailability'

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
      className={`p-4 rounded-lg bg-gradient-to-br ${color} shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <div className="text-white/90">{icon}</div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-white/80">{label}</div>
        </div>
      </div>
    </motion.div>
  )
}

const Sidebar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { hasData } = useDataAvailability()
  const [stats, setStats] = useState({ states: 0, offers: 0, casinos: 0 })

  useEffect(() => {
    const loadStats = () => {
      try {
        const storedResults = localStorage.getItem('research_results')
        if (storedResults) {
          const results = JSON.parse(storedResults)
          const states = new Set<string>()
          let totalCasinos = 0
          
          if (results.missing_casinos) {
            Object.entries(results.missing_casinos).forEach(([state, casinos]: [string, any]) => {
              states.add(state)
              totalCasinos += Array.isArray(casinos) ? casinos.length : 0
            })
          }
          
          const totalOffers = results.new_offers ? results.new_offers.length : 0
          
          setStats({
            states: states.size,
            offers: totalOffers,
            casinos: totalCasinos
          })
        } else {
          setStats({ states: 0, offers: 0, casinos: 0 })
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
        setStats({ states: 0, offers: 0, casinos: 0 })
      }
    }

    loadStats()
    
    // Listen for storage changes
    window.addEventListener('storage', loadStats)
    return () => window.removeEventListener('storage', loadStats)
  }, [])

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-foreground font-bold text-lg leading-tight">Casino Offer AI</h1>
              <p className="text-primary text-xs">Research Platform</p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          const isDisabled = !hasData && item.href !== '/research'
          
          return (
            <div key={item.href}>
              {isDisabled ? (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg opacity-50 cursor-not-allowed text-muted-foreground"
                  title="Complete research first to access this page"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge className="bg-yellow-500 text-black text-xs font-bold">
                      {item.badge}
                    </Badge>
                  )}
                </motion.div>
              ) : (
                <Link href={item.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className={cn(
                      'flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer group',
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-primary/25'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge className="bg-yellow-500 text-black text-xs font-bold">
                        {item.badge}
                      </Badge>
                    )}
                  </motion.div>
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 space-y-3 border-t border-border">
        <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          Quick Stats
        </h3>
        {hasData ? (
          <>
            <StatCard
              label="States Covered"
              value={stats.states}
              icon={<Database className="h-4 w-4" />}
              color="from-blue-600 to-cyan-600"
            />
            <StatCard
              label="Active Offers"
              value={stats.offers}
              icon={<Zap className="h-4 w-4" />}
              color="from-pink-600 to-rose-600"
            />
            <StatCard
              label="Total Casinos"
              value={stats.casinos}
              icon={<Database className="h-4 w-4" />}
              color="from-purple-600 to-pink-600"
            />
          </>
        ) : (
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">
              No data yet. Start your first research!
            </p>
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border">
        <p className="text-muted-foreground text-xs text-center">
          © 2025 Darwin Camahalan
        </p>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="lg:hidden fixed top-4 left-4 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-card border-border shadow-lg"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </motion.div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-card border-r border-border flex-col shadow-xl z-30"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-card border-r border-border flex flex-col shadow-2xl z-40"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
