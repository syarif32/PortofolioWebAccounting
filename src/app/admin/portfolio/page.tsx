import { createClient } from '@/lib/supabase/server'
import { PortfolioManager } from '@/components/admin/forms/PortfolioForm'

export default async function AdminPortfolioPage() {
  const supabase = await createClient()
  
  let data = [];
  try {
    const response = await supabase.from('portfolio').select('*').order('sort_order')
    data = response.data || [];
  } catch (err) {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Portfolio</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola karya & project Anda.</p>
      </div>
      <PortfolioManager initialData={data} />
    </div>
  )
}