'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Input }    from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select }   from '@/components/ui/Select'
import { Button }   from '@/components/ui/Button'
import { Badge }    from '@/components/ui/Badge'
import { Modal }    from '@/components/ui/Modal'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/shared/Toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { formatYear } from '@/lib/utils'
import type { Experience } from '@/types'

const schema = z.object({
  position:     z.string().min(1, 'Posisi wajib diisi'),
  organization: z.string().min(1, 'Organisasi wajib diisi'),
  type:         z.enum(['Internship', 'Organization', 'Project']),
  description:  z.string().optional(),
  year_start:   z.coerce.number().min(2000).max(2099),
  year_end:     z.coerce.number().min(2000).max(2099).nullable().optional(),
  sort_order:   z.coerce.number().default(0),
})

type FormData = z.infer<typeof schema>

export function ExperienceManager({ initialData }: { initialData: Experience[] }) {
  const [items, setItems]     = useState<Experience[]>(initialData)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [modalOpen, setModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()
  const { toasts, toast, removeToast } = useToast()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  const openAdd = () => {
    reset({ type: 'Internship', year_start: new Date().getFullYear(), sort_order: 0 })
    setEditing(null)
    setModal(true)
  }

  const openEdit = (item: Experience) => {
    reset(item)
    setEditing(item)
    setModal(true)
  }

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, year_end: data.year_end || null }
    try {
      if (editing) {
        const { data: updated, error } = await supabase
          .from('experience').update(payload).eq('id', editing.id).select().single()
        if(error) throw error
        setItems((prev) => prev.map((x) => (x.id === editing.id ? updated! : x)))
        toast.success('Pengalaman diperbarui!')
      } else {
        const { data: created, error } = await supabase
          .from('experience').insert(payload).select().single()
        if(error) throw error
        setItems((prev) => [...prev, created!])
        toast.success('Pengalaman ditambahkan!')
      }
      setModal(false)
    } catch {
      toast.error('Gagal menyimpan. Pastikan tabel Supabase sudah ada.')
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const { error } = await supabase.from('experience').delete().eq('id', id)
      if(error) throw error
      setItems((prev) => prev.filter((x) => x.id !== id))
      toast.success('Dihapus.')
    } catch {
      toast.error('Gagal menghapus.')
    } finally {
      setDeleting(null)
    }
  }

  const typeColor: Record<string, 'navy' | 'success' | 'warning'> = {
    Internship: 'navy', Organization: 'success', Project: 'warning',
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-500">{items.length} pengalaman</p>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openAdd} size="sm">Tambah</Button>
        </div>
        {items.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">Belum ada pengalaman.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{item.position}</p>
                    <Badge variant={typeColor[item.type]} size="sm">{item.type}</Badge>
                  </div>
                  <p className="text-xs text-navy-800 font-medium">{item.organization}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatYear(item.year_start, item.year_end)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-navy-800 hover:bg-gray-100 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Pengalaman' : 'Tambah Pengalaman'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Posisi / Jabatan" required error={errors.position?.message} {...register('position')} className="col-span-2" />
            <Input label="Perusahaan / Organisasi" required error={errors.organization?.message} {...register('organization')} />
            <Select label="Tipe" required
                    options={[
                      { value: 'Internship',   label: 'Magang'      },
                      { value: 'Job',          label: 'Pekerjaan'   },
                      { value: 'Organization', label: 'Organisasi'  },
                      { value: 'Project',      label: 'Project'     },
                    ]} {...register('type')} />
            <Input label="Tahun Mulai" type="number" required error={errors.year_start?.message} {...register('year_start')} />
            <Input label="Tahun Selesai" type="number" placeholder="Kosongkan jika masih aktif" hint="Kosongkan = Present" {...register('year_end')} />
          </div>
          <Textarea label="Deskripsi" rows={4} {...register('description')} />
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