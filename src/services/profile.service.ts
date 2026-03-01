import { createClient } from '@/lib/supabase/server'
import type { Profile, Skill, Experience, Portfolio, Certificate } from '@/types'

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profile').select('*').single()
  return data
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('skills').select('*').order('sort_order', { ascending: true })
  return data || []
}

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('experience').select('*').order('year_start', { ascending: false })
  return data || []
}

export async function getPortfolios(): Promise<Portfolio[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('portfolio').select('*').order('sort_order', { ascending: true })
  return data || []
}

export async function getCertificates(): Promise<Certificate[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('certificates').select('*').order('year', { ascending: false })
  return data || []
}