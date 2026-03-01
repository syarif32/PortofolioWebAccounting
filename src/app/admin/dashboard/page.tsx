import { createClient } from '@/lib/supabase/server'
import { User, Zap, Briefcase, FolderOpen, Award } from 'lucide-react'
import Link from 'next/link'

const statCards = [
  { label: 'Skills',       href: '/admin/skills',       icon: Zap,        table: 'skills'       },
  { label: 'Experience',   href: '/admin/experience',   icon: Briefcase,  table: 'experience'   },
  { label: 'Portfolio',    href: '/admin/portfolio',    icon: FolderOpen, table: 'portfolio'    },
  { label: 'Certificates', href: '/admin/certificates', icon: Award,      table: 'certificates' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Karena tabel belum dibuat, kita pasang try-catch agar halaman tidak error
  const counts = await Promise.all(
    statCards.map(async (card) => {
      try {
        const { count } = await supabase.from(card.table).select('*', { count: 'exact', head: true })
        return { ...card, count: count || 0 }
      } catch (error) {
        return { ...card, count: 0 }
      }
    })
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola konten portfolio Anda dari sini.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {counts.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center group-hover:bg-navy-800 transition-colors">
                <card.icon className="w-4 h-4 text-navy-800 group-hover:text-white transition-colors" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{card.count}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Edit Profile',      href: '/admin/profile'      },
            { label: 'Add Skill',         href: '/admin/skills'       },
            { label: 'Add Experience',    href: '/admin/experience'   },
            { label: 'Upload Portfolio',  href: '/admin/portfolio'    },
            { label: 'Add Certificate',   href: '/admin/certificates' },
            { label: 'View Public Site',  href: '/'                   },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-50 hover:bg-navy-800 hover:text-white transition-all duration-200 text-center"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}