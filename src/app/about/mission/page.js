import { Target, Eye, ShieldCheck, HeartPulse } from 'lucide-react'

export const metadata = {
  title: 'Mission & Vision | WDO',
  description: 'Learn about the mission and vision of Waqal Development Organization.',
}

export default function MissionVision() {
  return (
    <div className="animate-fade-in">
      <section className="section-light" style={{ padding: '60px 0', borderBottom: '1px solid #eeeeee', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>MISSION & VISION</h1>
          <p style={{ color: '#64748b', marginTop: '10px', fontSize: '1.1rem' }}>The guiding principles of Waqal Development Organization.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '40px', marginTop: '40px' }}>
            <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'inline-flex', padding: '15px', backgroundColor: '#eff6ff', borderRadius: '16px', color: '#0056b3', marginBottom: '25px' }}>
                <Eye size={32} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', marginBottom: '20px' }}>Our Vision</h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.8' }}>
                To create a future where every individual in Somaliland has access to quality education, healthcare, youth development opportunities, and sustainable environmental practices.
              </p>
            </div>

            <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'inline-flex', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '16px', color: '#16a34a', marginBottom: '25px' }}>
                <Target size={32} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', marginBottom: '20px' }}>Our Mission</h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.8' }}>
                To empower the communities of Somaliland through education, access to healthcare, youth engagement, and sustainable environmental initiatives.
              </p>
            </div>
          </div>
          
          <div style={{ marginTop: '60px', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '24px', textAlign: 'center' }}>
            <ShieldCheck size={40} color="#0056b3" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', marginBottom: '20px' }}>Our Core Values</h2>
            <div className="grid grid-cols-4" style={{ gap: '20px', marginTop: '30px' }}>
               {[
                 { name: 'Integrity', desc: 'Operating with honesty and transparency.' },
                 { name: 'Empowerment', desc: 'Lifting communities to be self-reliant.' },
                 { name: 'Inclusivity', desc: 'Serving all without discrimination.' },
                 { name: 'Sustainability', desc: 'Building long-lasting solutions.' }
               ].map(value => (
                 <div key={value.name} style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                   <h4 style={{ fontWeight: '800', color: '#0056b3', marginBottom: '10px' }}>{value.name}</h4>
                   <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{value.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .grid-cols-2 { grid-template-columns: 1fr !important; }
          .grid-cols-4 { grid-template-columns: 1fr !important; }
        }
      `}} />
    </div>
  )
}

