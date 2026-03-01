'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Award, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import type { Certificate } from '@/types'

export function Certificates({ certificates }: { certificates: Certificate[] }) {
  // Fallback Data
  const data = certificates.length > 0 ? certificates : [
    { id: '1', name: 'Sertifikasi Web Developer', issuer: 'Dicoding', year: '2025' }
  ];

  return (
    <section id="certificates" className="section-padding bg-gray-50">
      <div className="container-max">
        <SectionHeader eyebrow="Certificates" title="Sertifikat & Pelatihan" subtitle="Berbagai sertifikasi profesional." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.map((cert, i) => (
            <motion.div key={cert.id} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
              <Card hover className="p-0 overflow-hidden h-full flex flex-col">
                <div className="relative h-36 bg-navy-50 overflow-hidden">
                  {cert.image_url ? (
                    <Image src={cert.image_url} alt={cert.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-10 h-10 text-navy-200" />
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">{cert.name}</p>
                  <p className="text-xs text-navy-800 font-medium mb-1">{cert.issuer}</p>
                  <p className="text-xs text-gray-400 mb-3">{cert.year}</p>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 text-xs text-navy-800 font-medium hover:underline">
                      <ExternalLink className="w-3 h-3" /> Lihat Sertifikat
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}