'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  bucket?: string
  folder?: string
  label?: string
}

export function ImageUpload({
  value,
  onChange,
  bucket = 'portfolio-assets',
  folder = 'general',
  label = 'Upload Image',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Hanya menerima format gambar atau PDF.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { upsert: true })
      
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filename)
        
      onChange(publicUrl)
    } catch (err) {
      console.error(err)
      alert('Upload gagal. Silakan coba lagi.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {value ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
          {value.endsWith('.pdf') ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-sm text-gray-500 font-medium">Dokumen PDF Terunggah ✓</p>
            </div>
          ) : (
            <Image src={value} alt="Preview" fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange(null)}
              className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-red-50"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            'w-full h-40 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 transition-all duration-200',
            dragOver ? 'border-navy-800 bg-navy-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
          )}
        >
          {uploading ? (
            <Spinner size="md" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-navy-800">Klik untuk unggah</span> atau drag & drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, PDF — maksimal 5MB</p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) uploadFile(file)
        }}
      />
    </div>
  )
}