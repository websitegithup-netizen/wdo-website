import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, Stethoscope, Calendar } from 'lucide-react'

export const metadata = {
  title: 'Healthcare Programs | WDO',
  description: 'WDO initiatives focused on improving healthcare in Somaliland.',
}

export default async function HealthPrograms() {
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('category', 'health')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in">
      <section className="section-light" style={{ padding: '60px 0', borderBottom: '1px solid #eeeeee', backgroundColor: '#fdf2f2' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#dc2626', marginBottom: '15px' }}>
            <Stethoscope size={30} />
            <span style={{ fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Strategic Pillar</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>IMPROVING HEALTHCARE</h1>
          <p style={{ color: '#64748b', marginTop: '10px', fontSize: '1.1rem', maxWidth: '800px' }}>
            Ensuring children and women receive safe, timely, and effective services while conducting awareness initiatives on gender equality, first aid trainings, and protection.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '40px' }}>Related Projects</h2>
          
          {programs && programs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
              {programs.map((program) => (
                <div key={program.id} className="card" style={{ border: '1px solid #eee', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <img 
                      src={program.image_url || 'https://images.unsplash.com/photo-1505751172107-5739a00723a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt={program.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.75rem', marginBottom: '10px' }}>
                      <Calendar size={14} /> {new Date(program.created_at).toLocaleDateString()}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '12px' }}>{program.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
                      {program.description?.substring(0, 120)}...
                    </p>
                    <Link href={`/programs/${program.id}`} style={{ color: '#dc2626', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      View Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fef2f2', borderRadius: '24px' }}>
              <p style={{ color: '#64748b' }}>We are currently documenting our ongoing healthcare projects. Please check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
