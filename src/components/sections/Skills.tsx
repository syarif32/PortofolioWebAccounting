'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Sparkles, Code, Calculator, Star } from 'lucide-react'
import type { Skill } from '@/types'

const levelColor: Record<string, 'success' | 'warning' | 'default'> = {
  Advanced:     'success',
  Intermediate: 'warning',
  Beginner:     'default', // Kita ganti 'rose' jadi 'default' karena Badge mengenali 'default'
}

const levelBar: Record<string, string> = {
  Advanced:     'w-full',
  Intermediate: 'w-2/3',
  Beginner:     'w-1/3',
}

const getCategoryIcon = (category: string) => {
  if (category.toLowerCase().includes('software')) return <Code className="w-5 h-5" />
  if (category.toLowerCase().includes('technical')) return <Calculator className="w-5 h-5" />
  return <Sparkles className="w-5 h-5" />
}

export function Skills({ skills }: { skills: Skill[] }) {
  // Fallback data
  const data = skills.length > 0 ? skills : [
    { id: '1', name: 'Microsoft Excel',    category: 'Software',   level: 'Advanced',     sort_order: 1, created_at: '' },
    { id: '2', name: 'Tax Calculation',    category: 'Technical',  level: 'Intermediate', sort_order: 5, created_at: '' },
    { id: '3', name: 'Analytical Thinking',category: 'Soft Skill', level: 'Advanced',     sort_order: 9, created_at: '' },
  ]

  const grouped = data.reduce<Record<string, Skill[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] || []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <section className="section-padding min-h-[80vh] flex items-center relative z-10">
      <div className="container-max">
        <SectionHeader eyebrow="Keahlian" title="Kemampuan & Talenta" subtitle="Kombinasi keahlian teknis dan sentuhan kreativitas yang memukau." />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {Object.entries(grouped).map(([category, items], catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: catIdx * 0.1, type: 'spring', bounce: 0.4 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(255,219,251,0.6)] hover:-translate-y-2 transition-all duration-500 w-full group"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  {getCategoryIcon(category)}
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-wide">
                  {category}
                </h3>
              </div>
              
              <div className="space-y-6">
                {items.map((skill, i) => (
                  <div key={skill.id} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-rose-400 fill-rose-100" />
                        {skill.name}
                      </span>
                     <Badge variant={levelColor[skill.level] || 'default'} size="sm" className="shadow-sm border border-rose-100/50 text-rose-600 bg-rose-50">
                        {skill.level}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: undefined }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full ${levelBar[skill.level] || 'w-1/2'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}