'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { BookOpen, Target, Award, TrendingUp } from 'lucide-react'
import type { Profile } from '@/types'

const highlights = [
  { icon: BookOpen,   label: 'Financial Accounting', desc: 'Laporan keuangan akurat & sesuai standar PSAK' },
  { icon: Target,     label: 'Tax & Audit',           desc: 'Pemahaman mendalam perpajakan & audit internal' },
  { icon: TrendingUp, label: 'Data Analysis',         desc: 'Ms. Excel, pivot table, dan visualisasi data' },
  { icon: Award,      label: 'Certified',             desc: 'Berbagai sertifikasi akuntansi & keuangan' },
]

export function About({ profile }: { profile: Profile | null }) {
  return (
    <section id="about" className="section-padding bg-gray-50">
      <div className="container-max">
        <SectionHeader
          eyebrow="About Me"
          title="Profil Profesional"
          subtitle="Mahasiswa akuntansi dengan dedikasi tinggi dalam analisis laporan keuangan dan kepatuhan perpajakan."
        />
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-600 leading-relaxed text-base mb-6">
              {profile?.bio || `Saya adalah mahasiswa Akuntansi tingkat akhir yang terbiasa menghadapi data kompleks dan mengubahnya menjadi informasi keuangan yang mudah dipahami. Fokus utama saya meliputi penyusunan Financial Statement, perhitungan pajak, serta dasar-dasar audit.`}
            </p>
            <p className="text-gray-600 leading-relaxed text-base">
              Saya percaya bahwa akuntansi bukan sekadar angka, melainkan cerita tentang kesehatan sebuah entitas bisnis.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: 'Universitas', value: 'Universitas Dian Nuswantoro' },
                { label: 'Program',     value: 'D3 Akuntansi' },
                { label: 'Asal Sekolah',value: 'SMKN 10 Semarang' },
                { label: 'Status',      value: 'Mahasiswa / Fresh Grad' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Highlights grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-navy-800" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{item.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}