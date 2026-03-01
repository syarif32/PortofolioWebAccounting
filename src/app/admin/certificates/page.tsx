import { createClient } from '@/lib/supabase/server'
import { CertificatesManager } from '@/components/admin/forms/CertificateForm'

export default async function AdminCertificatesPage() {
  const supabase = await createClient()
  
  let data = [];
  try {
    const response = await supabase.from('certificates').select('*').order('year', { ascending: false })
    data = response.data || [];
  } catch (err) {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Certificates</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola sertifikat & pelatihan.</p>
      </div>
      <CertificatesManager initialData={data} />
    </div>
  )
}