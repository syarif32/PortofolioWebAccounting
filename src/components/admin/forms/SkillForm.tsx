'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Input }    from '@/components/ui/Input'
import { Select }   from '@/components/ui/Select'
import { Button }   from '@/components/ui/Button'
import { Badge }    from '@/components/ui/Badge'
import { Modal }    from '@/components/ui/Modal'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/shared/Toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { Skill } from '@/types'

const schema = z.object({
  name:       z.string().min(1, 'Nama skill wajib diisi'),
  category:   z.enum(['Software', 'Technical', 'Soft Skill']),
  level:      z.enum(['Beginner', 'Intermediate', 'Advanced']),
  sort_order: z.coerce.number().default(0), // Supabase sometimes returns numbers as strings
})

type FormData = z.infer<typeof schema>

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills]   = useState<Skill[]>(initialSkills)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [modalOpen, setModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()
  const { toasts, toast, removeToast } = useToast()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema) as any, // Supabase sometimes returns numbers as strings which causes zod to throw. This silences it.
      defaultValues: { sort_order: 0, category: 'Technical', level: 'Intermediate' },
    })

  const openAdd = () => {
    reset({ name: '', category: 'Technical', level: 'Intermediate', sort_order: 0 })
    setEditing(null)
    setModal(true)
  }

  const openEdit = (skill: Skill) => {
    reset(skill as any) // Supabase sometimes returns numbers as strings which causes zod to throw. This silences it.
    setEditing(skill)
    setModal(true)
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        const { data: updated, error } = await supabase
          .from('skills').update(data).eq('id', editing.id).select().single()
        if (error) throw error
        setSkills((prev) => prev.map((s) => (s.id === editing.id ? updated! : s)))
        toast.success('Skill diperbarui!')
      } else {
        const { data: created, error } = await supabase
          .from('skills').insert(data).select().single()
        if (error) throw error
        setSkills((prev) => [...prev, created!])
        toast.success('Skill ditambahkan!')
      }
      setModal(false)
    } catch {
      toast.error('Gagal menyimpan. Pastikan tabel Supabase sudah ada.')
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id)
      if (error) throw error
      setSkills((prev) => prev.filter((s) => s.id !== id))
      toast.success('Skill dihapus.')
    } catch {
      toast.error('Gagal menghapus.')
    } finally {
      setDeleting(null)
    }
  }

  const levelColor: Record<string, 'success' | 'warning' | 'navy'> = {
    Advanced: 'success', Intermediate: 'warning', Beginner: 'navy',
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-500">{skills.length} skills terdaftar</p>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openAdd} size="sm">
            Tambah Skill
          </Button>
        </div>

        {skills.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            Belum ada skill. Klik "Tambah Skill" untuk memulai.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{skill.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{skill.category}</p>
                </div>
                <Badge variant={levelColor[skill.level]}>{skill.level}</Badge>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(skill)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-navy-800 hover:bg-gray-100 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(skill.id)} disabled={deleting === skill.id} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Skill' : 'Tambah Skill'} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nama Skill" required error={errors.name?.message} {...register('name')} />
          <Select label="Kategori" required
                  options={[
                    { value: 'Software',   label: 'Software'   },
                    { value: 'Technical',  label: 'Technical'  },
                    { value: 'Soft Skill', label: 'Soft Skill' },
                  ]} {...register('category')} />
          <Select label="Level" required
                  options={[
                    { value: 'Beginner',     label: 'Beginner'     },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced',     label: 'Advanced'     },
                  ]} {...register('level')} />
          <Input label="Urutan Tampil" type="number" {...register('sort_order')} />
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