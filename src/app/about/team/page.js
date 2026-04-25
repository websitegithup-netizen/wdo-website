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
      <section className="section-light" style={{ padding: '60px 0', borderBottom: '1px solid #eeeeee', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>OUR TEAM</h1>
          <p style={{ color: '#64748b', marginTop: '10px', fontSize: '1.1rem' }}>The dedicated professionals driving our impact.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-12" style={{ maxWidth: '800px', margin: '0 auto 60px' }}>
            <div style={{ display: 'inline-flex', padding: '15px', backgroundColor: '#eff6ff', borderRadius: '50%', color: '#0056b3', marginBottom: '20px' }}>
              <Users size={32} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0056b3', marginBottom: '20px' }}>Meet Our Leadership</h2>
            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              WDO was established by a group of multi-disciplinary youth activists committed to delivering insightful and objective analyses on a broad range of social issues. Our team is passionate about fostering sustainable development in Somaliland.
            </p>
          </div>

          <div className="grid grid-cols-4" style={{ gap: '30px' }}>
            {teamMembers.map((member) => (
              <div key={member.name} style={{ textAlign: 'center', backgroundColor: '#fff', borderRadius: '24px', padding: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px', border: '4px solid #f8fafc' }}
                />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '5px' }}>{member.name}</h3>
                <p style={{ color: '#0056b3', fontSize: '0.9rem', fontWeight: '700' }}>{member.role}</p>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '60px', padding: '40px', backgroundColor: '#0056b3', color: 'white', borderRadius: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '15px' }}>Join Our Team</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 30px', opacity: 0.9 }}>
              We are always looking for passionate individuals to join our mission in building a resilient society in Somaliland.
            </p>
            <a href="/contact" style={{ display: 'inline-block', padding: '15px 30px', backgroundColor: 'white', color: '#0056b3', fontWeight: '800', borderRadius: '8px', textDecoration: 'none' }}>
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
