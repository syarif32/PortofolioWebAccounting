import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/admin/forms/ProfileForm'

export default async function AdminProfilePage() {
  const supabase = await createClient()
  
  // Ambil data profile jika ada, hiraukan error jika tabel belum siap
  let profile = null;
  try {
    const { data } = await supabase.from('profile').select('*').single()
    profile = data;
  } catch (err) {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Profile Utama</h1>
        <p className="text-sm text-gray-500 mt-1">
          Informasi dasar yang akan tampil di halaman utama portofolio Anda.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <ProfileForm initialData={profile} />
      </div>
    </div>
  )
}