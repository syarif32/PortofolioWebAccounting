'use client'

import { motion } from 'framer-motion'
import { Download, ChevronDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import type { Profile } from '@/types'

export function Hero({ profile }: { profile: Profile | null }) {
  return (
    <section
      id="hero"
      /* Ini kuncinya: Kita buang bg-white dan ganti dengan gradasi Rose (Mawar) yang lembut */
      className="relative min-h-screen flex items-center bg-gradient-to-br from-rose-50 via-white to-rose-100/60 overflow-hidden px-6 md:px-12 pt-16"
    >
      {/* Background subtle grid dengan warna rose yang transparan */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,#ea089e 0,#ea089e 1px,transparent 1px,transparent 60px),' +
            'repeating-linear-gradient(90deg,#ea089e 0,#ea089e 1px,transparent 1px,transparent 60px)',
        }}
      />
      
      {/* Ornamen Bola Cahaya Mawar di belakang layar */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Kiri — Teks */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-rose-700 mb-6 border border-rose-200 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Profesional & Elegan
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              {profile?.name || 'Icha Febrianti Nur'}
            </h1>
            
            <p className="text-xl text-rose-600 font-semibold mb-6">
              {profile?.tagline || 'Accounting Professional · Financial Report'}
            </p>
            
            <p className="text-base text-gray-600 leading-relaxed mb-10 max-w-lg">
              {profile?.bio?.slice(0, 160) || 'Menggabungkan ketelitian akuntansi dengan sentuhan kreativitas. Berdedikasi menyajikan data keuangan yang akurat, kredibel, dan mudah dipahami.'}
            </p>
            
            <div className="flex flex-wrap gap-4">
              {profile?.cv_url ? (
                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 rounded-full" leftIcon={<Download className="w-4 h-4" />}>
                    Unduh CV
                  </Button>
                </a>
              ) : (
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 rounded-full" leftIcon={<Download className="w-4 h-4" />}>
                  Unduh CV
                </Button>
              )}
            </div>
            
          </motion.div>
          
          {/* Kanan — Foto (Dengan Frame Estetik) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            className="flex justify-center relative"
          >
            <div className="relative">
              {/* Frame Mawar Miring di belakang foto */}
              <div className="absolute -inset-4 rounded-[2rem] border-4 border-rose-200/60 bg-gradient-to-tr from-rose-100 to-white rotate-6 transition-transform hover:rotate-12 duration-500" />
              
              <div className="relative w-72 h-80 md:w-80 md:h-[26rem] rounded-3xl overflow-hidden bg-white shadow-2xl flex items-center justify-center border-4 border-white z-10">
                {profile?.photo_url ? (
                  <Image
                    src={profile.photo_url}
                    alt={profile.name || 'Profile Photo'}
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="text-rose-300 flex flex-col items-center">
                    <span className="text-8xl font-light mb-2 font-serif">{profile?.name?.[0] || 'I'}</span>
                    <span className="text-sm font-medium">Pasang Foto via Admin</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.a
        href="#about"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-rose-300 hover:text-rose-600 transition-colors bg-white/50 backdrop-blur-sm p-2 rounded-full shadow-sm"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.a>
    </section>
  )
}