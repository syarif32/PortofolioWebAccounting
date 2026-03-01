import { createClient } from '@/lib/supabase/server'
import { ExperienceManager } from '@/components/admin/forms/ExperienceForm'

export default async function AdminExperiencePage() {
  const supabase = await createClient()
  
  let data = [];
  try {
    const response = await supabase.from('experience').select('*').order('year_start', { ascending: false })
    data = response.data || [];
  } catch (err) {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Experience</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola magang, organisasi & project.</p>
      </div>
      <ExperienceManager initialData={data} />
    </div>
  )
}