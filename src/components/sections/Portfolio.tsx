'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ExternalLink, FileSpreadsheet } from 'lucide-react'
import Image from 'next/image'
import type { Portfolio as PortfolioType } from '@/types'

// Data Dummy jika DB kosong
const fallbackPortfolios: PortfolioType[] = [
  { id: '1', title: 'Aplikasi Kasir Mie Kopyok', category: 'Web App', year: '2025', description: 'Sistem pencatatan transaksi menggunakan Laravel & Flutter.', image_url: '' },
  { id: '2', title: 'Lapak Siswa', category: 'Web App', year: '2025', description: 'Marketplace platform untuk produk buatan siswa SMKN 10 Semarang.', image_url: '' },
  { id: '3', title: 'RITECS Website', category: 'Web App', year: '2025', description: 'Platform Research, Innovation, and Technology.', image_url: '' },
]

export function Portfolio({ portfolios }: { portfolios: PortfolioType[] }) {
  const data = portfolios.length > 0 ? portfolios : fallbackPortfolios
  const categories = ['All', ...new Set(data.map((p) => p.category || 'Other'))]
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' 
    ? data 
    : data.filter((p) => p.category === activeCategory)

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container-max">
        <SectionHeader eyebrow="Portfolio" title="Karya & Project" subtitle="Kumpulan project web development, mobile app, dan sistem kasir." />
        
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat ? 'bg-navy-800 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <Card hover className="overflow-hidden p-0 h-full flex flex-col">
                <div className="relative h-48 bg-gray-50 overflow-hidden">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.title} fill className="object-cover transition-transform duration-500 hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-navy-50">
                      <FileSpreadsheet className="w-12 h-12 text-navy-200" />
                    </div>
                  )}
                  {item.year && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-navy-800 px-2 py-0.5 rounded-full border border-gray-100">
                      {item.year}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</h3>
                    {item.related_link && (
                      <a href={item.related_link} target="_blank" rel="noopener noreferrer" className="shrink-0 text-gray-400 hover:text-navy-800 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {item.category && <Badge variant="outline" size="sm" className="w-fit mb-3">{item.category}</Badge>}
                  {item.description && <p className="text-xs text-gray-500 leading-relaxed flex-1">{item.description}</p>}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}