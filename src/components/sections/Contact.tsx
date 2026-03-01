'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Mail, Linkedin, MessageCircle, MapPin } from 'lucide-react'
import type { Profile } from '@/types'

export function Contact({ profile }: { profile: Profile | null }) {
  const contacts = [
    { icon: Mail, label: 'Email', value: profile?.email || 'syarif@example.com', href: `mailto:${profile?.email || 'syarif@example.com'}`, color: 'bg-blue-50 text-blue-600' },
    { icon: Linkedin, label: 'LinkedIn', value: profile?.linkedin || 'linkedin.com/in/syarif', href: profile?.linkedin || '#', color: 'bg-sky-50 text-sky-600' },
    { icon: MessageCircle, label: 'WhatsApp', value: profile?.whatsapp || '+62 812 3456 7890', href: `https://wa.me/${profile?.whatsapp?.replace(/\D/g, '') || ''}`, color: 'bg-emerald-50 text-emerald-600' },
  ]

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-max">
        <SectionHeader eyebrow="Contact" title="Hubungi Saya" subtitle="Terbuka untuk peluang kolaborasi web & mobile development." />
        <div className="max-w-2xl mx-auto">
          <div className="grid gap-4 mb-12">
            {contacts.map((item, i) => (
              <motion.a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex items-center gap-5 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-navy-800 transition-colors">{item.value}</p>
                </div>
                <div className="ml-auto text-gray-300 group-hover:text-navy-800 transition-colors">→</div>
              </motion.a>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>Semarang, Indonesia · Available for Remote Work</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}