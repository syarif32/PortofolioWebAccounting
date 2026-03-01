'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Zap, Briefcase, FolderOpen, Award,
  Plus, ArrowRight, User, CheckCircle,
  TrendingUp, Clock
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SkillsManager }        from '@/components/admin/forms/SkillForm'
import { ExperienceManager }    from '@/components/admin/forms/ExperienceForm'
import { PortfolioManager }     from '@/components/admin/forms/PortfolioForm'
import { CertificatesManager }  from '@/components/admin/forms/CertificateForm'
import { useRouter } from 'next/navigation'

interface Props {
  counts: { skills: number; experience: number; portfolio: number; certificates: number }
  recent: { skills: any[]; experience: any[]; portfolio: any[]; certificates: any[] }
  profile: { name?: string; photo_url?: string; tagline?: string } | null
}

type QuickModal = 'skill' | 'experience' | 'portfolio' | 'certificate' | null

const statCards = [
  { key: 'skills',       label: 'Skills',       icon: Zap,        href: '/admin/skills',       color: 'bg-blue-50 text-blue-600'   },
  { key: 'experience',   label: 'Experience',   icon: Briefcase,  href: '/admin/experience',   color: 'bg-violet-50 text-violet-600' },
  { key: 'portfolio',    label: 'Portfolio',    icon: FolderOpen, href: '/admin/portfolio',    color: 'bg-emerald-50 text-emerald-600' },
  { key: 'certificates', label: 'Certificates', icon: Award,      href: '/admin/certificates', color: 'bg-amber-50 text-amber-600'  },
] as const

export function DashboardClient({ counts, recent, profile }: Props) {
  const [quickModal, setQuickModal] = useState<QuickModal>(null)
  const router = useRouter()

  const closeModal = () => {
    setQuickModal(null)
    router.refresh() // re-fetch server data setelah CRUD
  }

  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0)
  const profileComplete = !!(profile?.name && profile?.photo_url && profile?.tagline)

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola konten portfolio Anda dari sini.
          </p>
        </div>
        <Link href="/" target="_blank">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            View Site
          </Button>
        </Link>
      </div>

      {/* ── Profile completion alert ── */}
      {!profileComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-amber-50 border border-amber-200
                     rounded-2xl px-5 py-4"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center
                          justify-center shrink-0">
            <User className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">Profile belum lengkap</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Lengkapi nama, foto, dan tagline agar portfolio terlihat profesional.
            </p>
          </div>
          <Link href="/admin/profile">
            <Button size="sm" variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-100 shrink-0">
              Lengkapi
            </Button>
          </Link>
        </motion.div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={card.href}
                  className="block bg-white rounded-2xl p-5 border border-gray-100
                             shadow-sm hover:shadow-md hover:-translate-y-0.5
                             transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                 ${card.color} group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500
                                       group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-0.5">
                {counts[card.key]}
              </p>
              <p className="text-xs font-medium text-gray-400">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Main content grid ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Activity — 2/3 width */}
        <div className="lg:col-span-2 space-y-5">

          {/* Recent Skills */}
          <RecentSection
            title="Skills Terbaru"
            href="/admin/skills"
            onAdd={() => setQuickModal('skill')}
            empty={recent.skills.length === 0}
          >
            {recent.skills.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2.5
                                          border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.category}</p>
                </div>
                <Badge
                  variant={
                    s.level === 'Advanced' ? 'success' :
                    s.level === 'Intermediate' ? 'warning' : 'navy'
                  }
                  size="sm"
                >
                  {s.level}
                </Badge>
              </div>
            ))}
          </RecentSection>

          {/* Recent Experience */}
          <RecentSection
            title="Experience Terbaru"
            href="/admin/experience"
            onAdd={() => setQuickModal('experience')}
            empty={recent.experience.length === 0}
          >
            {recent.experience.map((e) => (
              <div key={e.id} className="flex items-start gap-3 py-2.5
                                          border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center
                                justify-center shrink-0 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{e.position}</p>
                  <p className="text-xs text-gray-400">{e.organization} · {e.year_start}
                    {e.year_end ? `–${e.year_end}` : '–Present'}
                  </p>
                </div>
                <Badge variant={
                  e.type === 'Internship' ? 'navy' :
                  e.type === 'Organization' ? 'success' : 'warning'
                } size="sm">
                  {e.type}
                </Badge>
              </div>
            ))}
          </RecentSection>

          {/* Recent Portfolio */}
          <RecentSection
            title="Portfolio Terbaru"
            href="/admin/portfolio"
            onAdd={() => setQuickModal('portfolio')}
            empty={recent.portfolio.length === 0}
          >
            {recent.portfolio.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2.5
                                          border-b border-gray-50 last:border-0">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden
                                bg-gray-100 shrink-0">
                  {p.image_url
                    ? <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                    : <FolderOpen className="w-4 h-4 text-gray-300 m-auto" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.category} · {p.year}</p>
                </div>
              </div>
            ))}
          </RecentSection>

        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-5">

          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden
                              bg-navy-50 shrink-0">
                {profile?.photo_url
                  ? <Image src={profile.photo_url} alt="Profile" fill className="object-cover" />
                  : <User className="w-6 h-6 text-navy-300 m-auto mt-3" />
                }
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profile?.name || 'Nama belum diisi'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {profile?.tagline || 'Tagline belum diisi'}
                </p>
              </div>
            </div>

            {/* Completeness */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">Kelengkapan Profile</span>
                <span className="text-xs font-semibold text-navy-800">
                  {profileComplete ? '100%' : '40%'}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-navy-800 transition-all duration-500
                                 ${profileComplete ? 'w-full' : 'w-2/5'}`} />
              </div>
            </div>

            <Link href="/admin/profile">
              <Button variant="outline" size="sm" className="w-full">
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-navy-800" />
              <h3 className="text-sm font-semibold text-gray-900">Ringkasan</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Total Konten',   value: totalItems,          icon: CheckCircle },
                { label: 'Skills',         value: counts.skills,       icon: Zap         },
                { label: 'Experience',     value: counts.experience,   icon: Briefcase   },
                { label: 'Portfolio',      value: counts.portfolio,    icon: FolderOpen  },
                { label: 'Certificates',   value: counts.certificates, icon: Award       },
              ].map((item) => (
                <div key={item.label}
                     className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                  <span className={`text-sm font-semibold
                    ${item.value === 0 ? 'text-gray-300' : 'text-gray-900'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-navy-800" />
              <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: '+ Tambah Skill',         action: () => setQuickModal('skill')       },
                { label: '+ Tambah Experience',     action: () => setQuickModal('experience')  },
                { label: '+ Upload Portfolio',      action: () => setQuickModal('portfolio')   },
                { label: '+ Tambah Certificate',    action: () => setQuickModal('certificate') },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={a.action}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm
                             font-medium text-gray-600 bg-gray-50
                             hover:bg-navy-800 hover:text-white
                             transition-all duration-200"
                >
                  {a.label}
                </button>
              ))}
              <Link href="/" target="_blank"
                    className="block text-left px-3 py-2.5 rounded-xl text-sm
                               font-medium text-gray-600 bg-gray-50
                               hover:bg-gray-100 transition-all duration-200">
                → View Public Site
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Quick Add Modals ── */}
      <Modal isOpen={quickModal === 'skill'} onClose={closeModal}
             title="Tambah Skill" size="sm">
        <SkillsManager initialSkills={[]} inlineMode onSuccess={closeModal} />
      </Modal>

      <Modal isOpen={quickModal === 'experience'} onClose={closeModal}
             title="Tambah Experience" size="lg">
        <ExperienceManager initialData={[]} inlineMode onSuccess={closeModal} />
      </Modal>

      <Modal isOpen={quickModal === 'portfolio'} onClose={closeModal}
             title="Upload Portfolio" size="lg">
        <PortfolioManager initialData={[]} inlineMode onSuccess={closeModal} />
      </Modal>

      <Modal isOpen={quickModal === 'certificate'} onClose={closeModal}
             title="Tambah Certificate" size="md">
        <CertificatesManager initialData={[]} inlineMode onSuccess={closeModal} />
      </Modal>

    </div>
  )
}

/* ── RecentSection helper component ── */
function RecentSection({
  title, href, onAdd, empty, children,
}: {
  title: string
  href: string
  onAdd: () => void
  empty: boolean
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4
                      border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <button onClick={onAdd}
                  className="w-7 h-7 rounded-lg bg-navy-800 text-white flex
                             items-center justify-center hover:bg-navy-900
                             transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <Link href={href}
                className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex
                           items-center justify-center hover:bg-gray-200
                           transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
      <div className="px-5">
        {empty ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-300 mb-3">Belum ada data</p>
            <button onClick={onAdd}
                    className="inline-flex items-center gap-1.5 text-xs font-medium
                               text-navy-800 hover:underline">
              <Plus className="w-3 h-3" /> Tambah sekarang
            </button>
          </div>
        ) : children}
      </div>
    </div>
  )
}