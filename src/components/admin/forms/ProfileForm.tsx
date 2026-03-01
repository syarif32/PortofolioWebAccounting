'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/shared/Toast'
import type { Profile } from '@/types'

const schema = z.object({
  name:      z.string().min(2, 'Nama minimal 2 karakter'),
  tagline:   z.string().max(255).optional(),
  bio:       z.string().optional(),
  photo_url: z.string().nullable().optional(),
  cv_url:    z.string().nullable().optional(),
  email:     z.string().email('Email tidak valid').optional().or(z.literal('')),
  linkedin:  z.string().url('URL tidak valid').optional().or(z.literal('')),
  whatsapp:  z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function ProfileForm({ initialData }: { initialData: Profile | null }) {
  const supabase = createClient()
  const { toasts, toast, removeToast } = useToast()

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:      initialData?.name      || '',
      tagline:   initialData?.tagline   || '',
      bio:       initialData?.bio       || '',
      photo_url: initialData?.photo_url || null,
      cv_url:    initialData?.cv_url    || null,
      email:     initialData?.email     || '',
      linkedin:  initialData?.linkedin  || '',
      whatsapp:  initialData?.whatsapp  || '',
    },
  })

  const photoUrl = watch('photo_url')
  const cvUrl    = watch('cv_url')

  const onSubmit = async (data: FormData) => {
    try {
      if (initialData?.id) {
        await supabase.from('profile').update(data).eq('id', initialData.id)
      } else {
        await supabase.from('profile').insert(data)
      }
      toast.success('Profile berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan profile. Pastikan tabel Supabase sudah dibuat.')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Nama Lengkap"
            required
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Tagline (Profesi/Fokus)"
            placeholder="Accounting Student | Tax & Audit Enthusiast"
            error={errors.tagline?.message}
            {...register('tagline')}
          />
        </div>

        <Textarea
          label="Bio & Tentang Saya"
          rows={5}
          placeholder="Ceritakan tentang latar belakang dan visi Anda..."
          {...register('bio')}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Email Profesional"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Nomor WhatsApp"
            placeholder="+62 812 xxxx xxxx"
            {...register('whatsapp')}
          />
        </div>

        <Input
          label="LinkedIn URL"
          placeholder="https://linkedin.com/in/username"
          error={errors.linkedin?.message}
          {...register('linkedin')}
        />

        <div className="grid md:grid-cols-2 gap-6 border-t border-gray-100 pt-6 mt-6">
          <ImageUpload
            label="Foto Profil"
            folder="photos"
            value={photoUrl}
            onChange={(url) => setValue('photo_url', url)}
          />
          <ImageUpload
            label="Upload CV (PDF)"
            folder="cv"
            value={cvUrl}
            onChange={(url) => setValue('cv_url', url)}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" loading={isSubmitting} size="lg">
            Simpan Perubahan Profile
          </Button>
        </div>
      </form>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}