import { createClient } from '@/lib/supabase/server'
import { SkillsManager } from '@/components/admin/forms/SkillForm'

export default async function AdminSkillsPage() {
  const supabase = await createClient()
  
  let skills = [];
  try {
    const { data } = await supabase.from('skills').select('*').order('sort_order')
    skills = data || [];
  } catch (err) {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Skills</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola daftar keahlian Anda.</p>
      </div>
      <SkillsManager initialSkills={skills} />
    </div>
  )
}