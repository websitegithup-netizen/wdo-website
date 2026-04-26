import { Users } from 'lucide-react'

export const metadata = {
  title: 'Our Team | WDO',
  description: 'Meet the team behind Waqal Development Organization.',
}

export default function Team() {
  const teamMembers = [
    { name: 'Dr. Ahmed Ali', role: 'Executive Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Amina Jama', role: 'Head of Programs', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Hassan Omar', role: 'Education Coordinator', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Fatima Yusuf', role: 'Healthcare Lead', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
  ]

  return (
    <div className="animate-fade-in">
      <section className="section-light" style={{ padding: '40px 0', borderBottom: '1px solid #eeeeee', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>OUR TEAM</h1>
          <p style={{ color: '#64748b', marginTop: '10px', fontSize: '1rem' }}>The dedicated professionals driving our impact.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-12" style={{ maxWidth: '700px', margin: '0 auto 40px' }}>
            <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '50%', color: '#0056b3', marginBottom: '15px' }}>
              <Users size={24} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0056b3', marginBottom: '15px' }}>Meet Our Leadership</h2>
            <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>
              WDO was established by a group of multi-disciplinary youth activists committed to delivering insightful and objective analyses on a broad range of social issues. Our team is passionate about fostering sustainable development in Somaliland.
            </p>
          </div>

          <div className="grid grid-cols-4" style={{ gap: '20px' }}>
            {teamMembers.map((member) => (
              <div key={member.name} style={{ textAlign: 'center', backgroundColor: '#fff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 15px', border: '3px solid #f8fafc' }}
                />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#1e293b', marginBottom: '5px' }}>{member.name}</h3>
                <p style={{ color: '#0056b3', fontSize: '0.85rem', fontWeight: '700' }}>{member.role}</p>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '50px', padding: '30px', backgroundColor: '#0056b3', color: 'white', borderRadius: '20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '15px' }}>Join Our Team</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 20px', opacity: 0.9, fontSize: '0.95rem' }}>
              We are always looking for passionate individuals to join our mission in building a resilient society in Somaliland.
            </p>
            <a href="/contact" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: 'white', color: '#0056b3', fontWeight: '800', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none' }}>
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .grid-cols-4 { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
        }
        @media (max-width: 480px) {
          .grid-cols-4 { grid-template-columns: 1fr !important; }
        }
      `}} />
    </div>
  )
}
