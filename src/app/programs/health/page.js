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
            <div className="related-projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {programs.map((program) => (
                <div key={program.id} className="card program-card" style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: '180px' }} className="card-img-height">
                    <img 
                      src={program.image_url || 'https://images.unsplash.com/photo-1505751172107-5739a00723a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt={program.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px' }} className="card-padding">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.75rem', marginBottom: '10px' }}>
                      <Calendar size={12} /> {new Date(program.created_at).toLocaleDateString()}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '10px' }} className="card-title">{program.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '15px', lineHeight: '1.5' }} className="card-desc">
                      {program.description?.substring(0, 100)}...
                    </p>
                    <Link href={`/programs/${program.id}`} style={{ color: '#dc2626', fontWeight: '800', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }} className="card-link">
                      View Details <ArrowRight size={14} />
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
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .related-projects-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 12px !important;
          }
          .card-img-height { height: 120px !important; }
          .card-padding { padding: 12px !important; }
          .card-title { font-size: 0.85rem !important; margin-bottom: 5px !important; }
          .card-desc { font-size: 0.7rem !important; line-height: 1.4 !important; margin-bottom: 10px !important; }
          .card-link { font-size: 0.75rem !important; }
        }
      `}} />
    </div>
  )
}
