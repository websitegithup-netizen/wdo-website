import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, Leaf, Calendar } from 'lucide-react'

export const metadata = {
  title: 'Environmental Programs | WDO',
  description: 'WDO initiatives focused on environment conservation in Somaliland.',
}

export default async function EnvironmentPrograms() {
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('category', 'environment')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in">
      <section className="section-light" style={{ padding: '60px 0', borderBottom: '1px solid #eeeeee', backgroundColor: '#f0fdf4' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#16a34a', marginBottom: '15px' }}>
            <Leaf size={30} />
            <span style={{ fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Strategic Pillar</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>ENVIRONMENTAL IMPROVEMENT</h1>
          <p style={{ color: '#64748b', marginTop: '10px', fontSize: '1.1rem', maxWidth: '800px' }}>
            Promoting initiatives for environmental sustainability, tree planting, agricultural programs, and conservation to protect the local ecosystem.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '40px' }}>Related Projects</h2>
          
          {programs && programs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {programs.map((program) => (
                <div key={program.id} className="card" style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: '180px' }}>
                    <img 
                      src={program.image_url || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt={program.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.75rem', marginBottom: '10px' }}>
                      <Calendar size={12} /> {new Date(program.created_at).toLocaleDateString()}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '10px' }}>{program.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '15px', lineHeight: '1.5' }}>
                      {program.description?.substring(0, 100)}...
                    </p>
                    <Link href={`/programs/${program.id}`} style={{ color: '#16a34a', fontWeight: '800', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#f0fdf4', borderRadius: '24px' }}>
              <p style={{ color: '#64748b' }}>We are currently documenting our ongoing environmental projects. Please check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
