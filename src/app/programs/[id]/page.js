import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Calendar, Target, Globe, Users, ChevronRight } from 'lucide-react'

export async function generateMetadata({ params }) {
  const { id } = await params
  const { data: program } = await supabase
    .from('programs')
    .select('title')
    .eq('id', id)
    .single()

  return {
    title: `${program?.title || 'Program'} | WDO`,
  }
}

export default async function ProgramDetail({ params }) {
  const { id } = await params
  const { data: program, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !program) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 className="text-3xl font-bold mb-4">Program Not Found</h2>
        <Link href="/programs" className="btn btn-primary">BACK TO PROGRAMS</Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <section className="section-light" style={{ padding: '40px 0', borderBottom: '1px solid #eeeeee' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="text-3xl font-bold" style={{ margin: 0 }}>{program.title.toUpperCase()}</h1>
            <Link href="/programs" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              <ArrowLeft size={14} /> BACK TO PROGRAMS
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '60px', alignItems: 'flex-start' }}>
            {/* Content Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <span className="badge" style={{ backgroundColor: 'var(--secondary-color)' }}>{program.category}</span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '5px' }} />
                  Date: {new Date(program.created_at).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-6">Program Overview</h2>
              <div style={{ lineHeight: '1.8', color: 'var(--text-dark)', whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
                {program.description}
              </div>

              <div style={{ padding: '30px', backgroundColor: '#f9f9f9', borderLeft: '4px solid var(--primary-color)' }}>
                <h3 className="text-xl font-bold mb-4">Key Objectives</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {program.impact_metrics?.objectives ? (
                    program.impact_metrics.objectives.split('\n').filter(obj => obj.trim() !== '').map((obj, index) => (
                      <li key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <CheckCircle size={18} className="text-primary" />
                        <span>{obj.trim()}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <CheckCircle size={18} className="text-primary" />
                        <span>Community Participation and Empowerment</span>
                      </li>
                      <li style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <CheckCircle size={18} className="text-primary" />
                        <span>Sustainable Resource Management</span>
                      </li>
                      <li style={{ display: 'flex', gap: '10px' }}>
                        <CheckCircle size={18} className="text-primary" />
                        <span>Long-term Impact Monitoring</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="sidebar">
              <div style={{ border: '1px solid #eee', padding: '10px', backgroundColor: 'white', marginBottom: '30px' }}>
                <img 
                  src={program.image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
                  alt={program.title}
                  style={{ width: '100%', borderRadius: '2px' }}
                />
              </div>

              <div className="card" style={{ padding: '30px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'white' }}>Support This Initiative</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '25px' }}>
                  Your contribution helps us continue this vital work and expand our reach to more communities in need.
                </p>
                <Link href="/donate" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary-color)', width: '100%', fontWeight: '800' }}>
                  DONATE NOW
                </Link>
              </div>

              <div style={{ marginTop: '30px', padding: '25px', border: '1px solid #eee' }}>
                <h4 className="font-bold mb-4">Other Programs</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <Link href="/programs" className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ChevronRight size={14} /> Basic Social Services
                  </Link>
                  <Link href="/programs" className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ChevronRight size={14} /> Local Economy Development
                  </Link>
                  <Link href="/programs" className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ChevronRight size={14} /> Environment Conservation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
