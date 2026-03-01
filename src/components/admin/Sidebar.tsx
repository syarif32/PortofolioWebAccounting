'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { LayoutDashboard, User, Zap, Briefcase, FolderOpen, Award, LogOut, Menu, X, ChevronRight } from 'lucide-react'

const navItems = [
  { label: 'Dashboard',    href: '/admin/dashboard',    icon: LayoutDashboard },
  { label: 'Profile',      href: '/admin/profile',      icon: User            },
  { label: 'Skills',       href: '/admin/skills',       icon: Zap             },
  { label: 'Experience',   href: '/admin/experience',   icon: Briefcase       },
  { label: 'Portfolio',    href: '/admin/portfolio',    icon: FolderOpen      },
  { label: 'Certificates', href: '/admin/certificates', icon: Award           },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen sticky top-0',
          'bg-navy-900 text-white transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
        style={{ backgroundColor: '#152840' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          {!collapsed && (
            <span className="text-sm font-semibold tracking-wide">Admin Panel</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-2 py-4 border-t border-white/10">
          {!collapsed && user && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-medium text-white truncate">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}