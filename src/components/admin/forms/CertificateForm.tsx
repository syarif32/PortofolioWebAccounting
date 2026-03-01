'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Input }       from '@/components/ui/Input'
import { Button }      from '@/components/ui/Button'
import { Modal }       from '@/components/ui/Modal'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { useToast }    from '@/hooks/useToast'
import { ToastContainer } from '@/components/shared/Toast'
import { Plus, Pencil, Trash2, Award } from 'lucide-react'
import Image from 'next/image'
import type { Certificate } from '@/types'

const schema = z.object({
  name:           z.string().min(1, 'Nama sertifikat wajib diisi'),
  issuer:         z.string().min(1, 'Penyelenggara wajib diisi'),
  image_url:      z.string().nullable().optional(),
  year:           z.coerce.number().min(2000).max(2099).nullable().optional(),
  credential_url: z.string().url('URL tidak valid').optional().or(z.literal('')),
  sort_order:     z.coerce.number().default(0),
})

type FormData = z.infer<typeof schema>

export function CertificatesManager({ initialData }: { initialData: Certificate[] }) {
  const [items, setItems]     = useState<Certificate[]>(initialData)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [modalOpen, setModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const supabase = createClient()
  const { toasts, toast, removeToast } = useToast()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) as any })

  const imageUrl = watch('image_url')

  const openAdd = () => {
    reset({ sort_order: 0, year: new Date().getFullYear() })
    setEditing(null)
    setModal(true)
  }

  const openEdit = (item: Certificate) => {
    reset(item as any)
    setEditing(item as any)
    setModal(true)
  }

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, year: data.year || null, credential_url: data.credential_url || null }
    try {
      if (editing) {
        const { data: updated, error } = await supabase
          .from('certificates').update(payload).eq('id', editing.id).select().single()
        if(error) throw error
        setItems((prev) => prev.map((x) => (x.id === editing.id ? updated! : x)))
        toast.success('Sertifikat diperbarui!')
      } else {
        const { data: created, error } = await supabase
          .from('certificates').insert(payload).select().single()
        if(error) throw error
        setItems((prev) => [...prev, created!])
        toast.success('Sertifikat ditambahkan!')
      }
      setModal(false)
    } catch {
      toast.error('Terjadi kesalahan. Pastikan tabel sudah dibuat.')
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const { error } = await supabase.from('certificates').delete().eq('id', id)
      if(error) throw error
      setItems((prev) => prev.filter((x) => x.id !== id))
      toast.success('Dihapus.')
    } catch {
      toast.error('Gagal menghapus.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-500">{items.length} sertifikat</p>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openAdd} size="sm">
            Tambah
          </Button>
        </div>
        {items.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">Belum ada sertifikat.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-28 bg-navy-50">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-8 h-8 text-navy-200" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-navy-800 font-medium">{item.issuer}</p>
                  <p className="text-xs text-gray-400 mb-3">{item.year}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="flex-1 text-xs py-1.5 rounded-lg bg-gray-50 hover:bg-navy-800 hover:text-white font-medium text-gray-600 transition-all flex items-center justify-center gap-1">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="flex-1 text-xs py-1.5 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 font-medium text-gray-600 transition-all flex items-center justify-center gap-1 disabled:opacity-50">
                      <Trash2 className="w-3 h-3" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Sertifikat' : 'Tambah Sertifikat'} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nama Sertifikat" required error={errors.name?.message} {...register('name')} />
          <Input label="Penyelenggara" required error={errors.issuer?.message} {...register('issuer')} />
          <Input label="Tahun" type="number" {...register('year')} />
          <Input label="Credential URL" placeholder="https://..." error={errors.credential_url?.message} {...register('credential_url')} />
          <ImageUpload label="Gambar Sertifikat" folder="certificates" value={imageUrl} onChange={(url) => setValue('image_url', url)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>Batal</Button>
            <Button type="submit" loading={isSubmitting}>{editing ? 'Simpan' : 'Tambah'}</Button>
          </div>
        </form>
      </Modal>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}