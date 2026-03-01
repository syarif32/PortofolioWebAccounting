import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { getProfile, getSkills, getExperiences, getPortfolios, getCertificates } from '@/services/profile.service'
import { Hero }         from '@/components/sections/Hero'
import { About }        from '@/components/sections/About'
import { Skills }       from '@/components/sections/Skills'
import { Experience }   from '@/components/sections/Experience'
import { Portfolio }    from '@/components/sections/Portfolio'
import { Certificates } from '@/components/sections/Certificates'

// IMPORT TYPE SUPAYA TYPESCRIPT TIDAK MARAH
import type { Profile, Skill, Experience as ExperienceType, Portfolio as PortfolioType, Certificate } from '@/types'

export const revalidate = 3600 

export default async function HomePage() {
  // DEKLARASI DENGAN TIPE DATA YANG JELAS
  let profile: Profile | null = null;
  let skills: Skill[] = [];
  let experiences: ExperienceType[] = [];
  let portfolios: PortfolioType[] = [];
  let certificates: Certificate[] = [];

  try {
    const data = await Promise.all([
      getProfile().catch(() => null),
      getSkills().catch(() => []),
      getExperiences().catch(() => []),
      getPortfolios().catch(() => []),
      getCertificates().catch(() => []),
    ])
    
    profile = data[0];
    skills = data[1] || [];
    experiences = data[2] || [];
    portfolios = data[3] || [];
    certificates = data[4] || [];
  } catch (error) {
    console.error("Belum ada tabel di Supabase, menggunakan fallback UI.");
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col animate-fade-in">
        <Hero         profile={profile} />
        <About        profile={profile} />
        <Skills       skills={skills} />
        <Experience   experiences={experiences} />
        <Portfolio    portfolios={portfolios} />
        <Certificates certificates={certificates} />
      </main>
      <Footer />
    </>
  )
}