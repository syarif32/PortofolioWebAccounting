'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { formatYear } from '@/lib/utils'
import type { Experience as ExperienceType } from '@/types'

const typeColor: Record<string, 'navy' | 'success' | 'warning' | 'default'> = {
  Magang:       'navy',
  Organisasi:   'success',
  Project:      'warning',
}

export function Experience({ experiences }: { experiences: ExperienceType[] }) {
  // Fallback data
  const data = experiences.length > 0 ? experiences : [
    { id: '1', type: 'Project', position: 'Lapak Siswa', organization: 'SMKN 10 Kota Semarang', year_start: 2025, year_end: null, description: 'Mengembangkan marketplace platform untuk produk buatan siswa.' },
    { id: '2', type: 'Magang', position: 'Kuliah Kerja Industri', organization: 'RITECS', year_start: 2025, year_end: 2025, description: 'Magang jarak jauh mengembangkan fitur-fitur website.' }
  ];

  return (
    <section id="experience" className="section-padding bg-gray-50">
      <div className="container-max">
        <SectionHeader
          eyebrow="Experience"
          title="Pengalaman & Organisasi"
          subtitle="Rekam jejak magang, kegiatan organisasi, dan project yang telah dilakukan."
        />
        
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2 hidden md:block" />
          
          <div className="space-y-8">
            {data.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative grid md:grid-cols-2 gap-6 md:gap-12 ${i % 2 === 0 ? '' : 'md:direction-rtl'}`}
              >
                {/* Timeline dot */}
                <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-navy-800 border-4 border-white shadow z-10" />
                
                {/* Content card */}
                <div className={`md:col-span-1 ${i % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}`}>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className={`flex items-start gap-3 mb-3 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <Badge variant={typeColor[exp.type] || 'default'}>{exp.type}</Badge>
                      <span className="text-xs text-gray-400 pt-0.5">
                        {formatYear(exp.year_start, exp.year_end)}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-0.5">
                      {exp.position}
                    </h3>
                    <p className="text-sm font-medium text-navy-800 mb-3">
                      {exp.organization}
                    </p>
                    {exp.description && (
                      <p className={`text-sm text-gray-500 leading-relaxed ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Empty column */}
                <div className="hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}