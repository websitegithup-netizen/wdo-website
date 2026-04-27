import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, BookOpen, HeartPulse, TreePine, Users, ChevronRight, GraduationCap, Stethoscope, Briefcase, Leaf } from 'lucide-react'

export const metadata = {
  title: 'Our Programs | Education, Health & Sustainable Development in Somaliland',
  description: 'Explore WDO\'s core programs in Somaliland: Improving education access, healthcare services, youth skills development, and environmental sustainability.',
  openGraph: {
    title: 'WDO Programs & Initiatives',
    description: 'Empowering Somaliland communities through targeted social and environmental programs.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069'],
  },
}

export const dynamic = 'force-dynamic'

export default async function Programs() {
  const { data: programs, error } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <section className="section-light" style={{ padding: '60px 0', borderBottom: '1px solid #eeeeee', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>OUR PROGRAMS</h1>
          <p style={{ color: '#64748b', marginTop: '10px', fontSize: '1.1rem' }}>Impactful initiatives for a resilient Somaliland.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-12" style={{ maxWidth: '900px', margin: '0 auto 60px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0056b3', marginBottom: '20px' }}>Strategic Focus Areas</h2>
            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Waqal Development Organization (WDO) provides project development solutions focused on grassroots efforts aimed at alleviating poverty and human suffering while fostering social change through these four key pillars.
            </p>
          </div>

          {/* Program Categories Display */}
          <div className="grid grid-cols-2" style={{ gap: '30px', marginBottom: '80px' }}>
             {[
               { name: 'Improving Education', icon: <GraduationCap size={40} />, color: '#0056b3', desc: 'Enhancing educational access for vulnerable households and climate-affected communities through innovative technologies.' },
               { name: 'Improving Healthcare', icon: <Stethoscope size={40} />, color: '#28a745', desc: 'Ensuring children and women receive safe, timely, and effective health services and awareness.' },
               { name: 'Youth Development', icon: <Briefcase size={40} />, color: '#f59e0b', desc: "Improving access to quality basic services, skills, and educational opportunities for Somaliland's youth." },
               { name: 'Environmental Improvement', icon: <Leaf size={40} />, color: '#059669', desc: 'Promoting initiatives for environmental sustainability and conservation across the region.' }
             ].map((cat) => (
               <div key={cat.name} style={{ display: 'flex', gap: '25px', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                 <div style={{ color: cat.color, flexShrink: 0 }}>{cat.icon}</div>
                 <div>
                   <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '15px', color: '#1e293b' }}>{cat.name}</h3>
                   <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.95rem' }}>{cat.desc}</p>
                 </div>
               </div>
             ))}
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '60px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '40px', textAlign: 'center' }}>Ongoing Projects</h2>
            {error ? (
              <div className="card text-center" style={{ padding: '40px' }}>
                <p className="text-accent">Error loading specific projects. Please check back later.</p>
              </div>
            ) : programs && programs.length > 0 ? (
              <div className="grid grid-cols-3" style={{ gap: '30px' }}>
                {programs.map((program) => (
                  <div key={program.id} className="card" style={{ border: '1px solid #eee', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: '200px' }}>
                      <img 
                        src={program.image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                        alt={program.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '25px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '12px' }}>{program.title}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
                        {program.description?.substring(0, 100)}...
                      </p>
                      <Link href={`/programs/${program.id}`} style={{ color: '#0056b3', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Details <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#64748b' }}>Currently documenting our latest field projects. Please check back soon.</p>
            )}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .grid-cols-2 { grid-template-columns: 1fr !important; }
          .grid-cols-3 { grid-template-columns: 1fr !important; }
        }
      `}} />
    </div>
  )
}
