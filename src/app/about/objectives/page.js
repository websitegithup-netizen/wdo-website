import { BookOpen, HeartPulse, Users, TreePine } from 'lucide-react'

export const metadata = {
  title: 'Our Objectives | WDO',
  description: 'Learn about the core objectives and focus areas of Waqal Development Organization.',
}

export default function Objectives() {
  return (
    <div className="animate-fade-in">
      <section className="section-light" style={{ padding: '40px 0', borderBottom: '1px solid #eeeeee', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>OUR OBJECTIVES</h1>
          <p style={{ color: '#64748b', marginTop: '10px', fontSize: '1rem' }}>The strategic focus areas guiding our daily operations.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-12" style={{ maxWidth: '700px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0056b3', marginBottom: '15px' }}>What We Do</h2>
            <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>
              WDO operates across four primary pillars designed to foster sustainable development, alleviate poverty, and build resilient communities throughout Somaliland.
            </p>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '20px' }}>
            {[
              { 
                title: 'Improving Education', 
                icon: <BookOpen size={30} />, 
                color: '#0056b3',
                bg: '#eff6ff',
                desc: 'Enhancing educational access for vulnerable households and climate-affected communities through innovative technologies and community resources.' 
              },
              { 
                title: 'Improving Healthcare', 
                icon: <HeartPulse size={30} />, 
                color: '#28a745',
                bg: '#f0fdf4',
                desc: 'Ensuring children and women receive safe, timely, and effective health services while conducting awareness initiatives on gender equality and protection.' 
              },
              { 
                title: 'Youth Development', 
                icon: <Users size={30} />, 
                color: '#f59e0b',
                bg: '#fffbeb',
                desc: "Improving access to equitable quality basic services, skills, and educational opportunities for Somaliland's youth." 
              },
              { 
                title: 'Environmental Improvement', 
                icon: <TreePine size={30} />, 
                color: '#059669',
                bg: '#ecfdf5',
                desc: 'Promoting initiatives for environmental sustainability, conservation, and climate resilience.' 
              }
            ].map((area) => (
              <div key={area.title} style={{ padding: '25px', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'inline-flex', padding: '15px', backgroundColor: area.bg, borderRadius: '16px', color: area.color, marginBottom: '20px' }}>
                  {area.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '10px' }}>{area.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.7' }}>{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .grid-cols-2 { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 12px !important;
          }
          .container { padding: 0 15px !important; }
          section { padding: 40px 0 !important; }
          .section-light { padding: 30px 0 !important; }
          h1 { font-size: 1.6rem !important; }
          h2 { font-size: 1.3rem !important; }
          .grid-cols-2 > div { padding: 15px !important; border-radius: 12px !important; }
          .grid-cols-2 h3 { font-size: 0.9rem !important; margin-bottom: 5px !important; }
          .grid-cols-2 p { font-size: 0.75rem !important; line-height: 1.4 !important; }
          .grid-cols-2 svg { width: 22px !important; height: 22px !important; }
          .grid-cols-2 > div > div { padding: 10px !important; border-radius: 10px !important; margin-bottom: 12px !important; }
        }
      `}} />
    </div>
  )
}
