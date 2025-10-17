/**
 * Enhanced Footer Component - More visible and modern design
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Phone, Linkedin, Github, Heart, ExternalLink, Zap } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const contactLinks = [
    {
      icon: <Mail className="h-4 w-4" />,
      label: 'camahalandarwin@gmail.com',
      href: 'mailto:camahalandarwin@gmail.com',
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: '+63 9754270609',
      href: 'tel:+639754270609',
    },
    {
      icon: <Linkedin className="h-4 w-4" />,
      label: 'LinkedIn Profile',
      href: 'https://www.linkedin.com/in/darwincamahalan/',
    },
    {
      icon: <Github className="h-4 w-4" />,
      label: 'GitHub Profile',
      href: 'https://github.com/DarwinCamahalan',
    },
  ]

  return (
    <footer className="mt-auto border-t-2 border-purple-500/20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Casino Offer AI</h3>
                <p className="text-purple-300 text-sm">Research Platform</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              An intelligent AI research assistant powered by GPT-4 that identifies missing casinos 
              and better promotional offers across multiple states.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/research" 
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Research
                </Link>
              </li>
              <li>
                <Link 
                  href="https://github.com/DarwinCamahalan/casino-offer-ai-researcher" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Documentation
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Developer Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Developer Contact</h3>
            <div className="space-y-3">
              <p className="text-white font-semibold">Darwin Camahalan</p>
              {contactLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ x: 4 }}
                  className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  {link.icon}
                  <span className="text-sm">{link.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <Separator className="bg-white/10 mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-400 text-sm"
          >
            <span>© {currentYear} Darwin Camahalan. All rights reserved.</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-400 text-sm"
          >
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>using Next.js & OpenAI GPT-4</span>
          </motion.div>
        </div>

        {/* Tech Stack Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'OpenAI GPT-4', 'Framer Motion', 'Recharts'].map((tech, index) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-xs text-purple-300 font-medium backdrop-blur-sm"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
