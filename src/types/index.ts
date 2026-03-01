export interface Profile {
  id?: string
  name?: string
  tagline?: string
  bio?: string
  cv_url?: string
  photo_url?: string
  email?: string
  linkedin?: string
  whatsapp?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: string
  sort_order: number
  created_at: string
}

export interface Experience {
  id: string
  type: string
  year_start: number
  year_end: number | null
  position: string
  organization: string
  description?: string
}

export interface Portfolio {
  id: string
  title: string
  category?: string
  description?: string
  image_url?: string
  year?: string
  related_link?: string
  sort_order?: number
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  year: string
  image_url?: string
  credential_url?: string
}