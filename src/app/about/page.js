import Link from 'next/link'
import { Target, Eye, Heart, ShieldCheck, Award, Users, ChevronRight, TreePine, BookOpen, HeartPulse, Globe } from 'lucide-react'

export const metadata = {
  title: 'Who We Are | WDO',
  description: 'Learn about the mission, vision, and values of Waqal Development Organization.',
}

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Page Title Section */}
      <section className="section-light" style={{ padding: '40px 0', borderBottom: '1px solid #eeeeee' }}>
        <div className="container">
          <h1 className="text-3xl font-bold" style={{ margin: 0 }}>WHO WE ARE</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '60px', alignItems: 'flex-start' }}>
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ borderLeft: '4px solid var(--primary-color)', paddingLeft: '15px' }}>
                Waqal Development Organization
              </h2>
              <p className="text-lg text-muted mb-6" style={{ lineHeight: '1.8' }}>
                Waqal Development Organization (WDO) is an independent, nonprofit, and nongovernmental organization providing project development solutions in the thematic areas of education, healthcare, youth development, and the environment.
              </p>
              <p className="text-lg text-muted mb-8" style={{ lineHeight: '1.8' }}>
                Based in Gabiley, Somaliland, WDO was established by a group of multi-disciplinary youth activists committed to delivering insightful and objective analyses on a broad range of social issues, including conflict, education, health, youth engagement, and environmental sustainability.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <ShieldCheck size={20} className="text-primary" />
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>NGO REGISTERED</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Award size={20} className="text-primary" />
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>TRUSTED PARTNER</span>
                </div>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: '#f8fafc', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '60px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              height: '100%',
              minHeight: '400px'
            }}>
              <img 
                src="/logo.png" 
                alt="WDO Official Logo" 
                style={{ 
                  width: '100%', 
                  maxWidth: '280px', 
                  height: 'auto', 
                  filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' 
                }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Scansom Boxes */}
      <section className="section-light">
        <div className="container">
          <div className="grid grid-cols-2" style={{ gap: '30px' }}>
            <div className="card" style={{ padding: '40px', border: 'none', backgroundColor: '#f0f4f8' }}>
              <div style={{ backgroundColor: 'var(--primary-color)', width: '50px', height: '50px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '25px' }}>
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
                To empower the communities of Somaliland through education, access to healthcare, youth engagement, and sustainable environmental initiatives.
              </p>
            </div>
            
            <div className="card" style={{ padding: '40px', border: 'none', backgroundColor: '#edf7ed' }}>
              <div style={{ backgroundColor: 'var(--secondary-color)', width: '50px', height: '50px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '25px' }}>
                <Eye size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
                To create a future where every individual in Somaliland has access to quality education, healthcare, youth development opportunities, and sustainable environmental practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section" style={{ backgroundColor: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="text-3xl font-bold" style={{ color: '#1e293b', marginBottom: '10px' }}>Our Core Values</h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>The fundamental principles that guide our work and decisions.</p>
          </div>
          <div className="grid grid-cols-4" style={{ gap: '20px' }}>
            {[
              { title: 'Integrity', desc: 'Acting with honesty, transparency, and ethical standards in everything we do.', icon: <ShieldCheck /> },
              { title: 'Empowerment', desc: 'Providing the tools and support for communities to achieve self-reliance.', icon: <Award /> },
              { title: 'Inclusivity', desc: 'Ensuring all groups have equal access to opportunities and representation.', icon: <Users /> },
              { title: 'Sustainability', desc: 'Fostering long-term social and environmental health for future generations.', icon: <TreePine /> }
            ].map((value) => (
              <div key={value.title} className="card" style={{ padding: '25px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                <div style={{ color: 'var(--primary-color)', marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
                   {value.icon}
                </div>
                <h4 style={{ fontWeight: '800', marginBottom: '10px', fontSize: '1.1rem' }}>{value.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="text-2xl font-bold mb-10 text-center">Our Focus Areas</h2>
          <div className="grid grid-cols-2" style={{ gap: '40px' }}>
            {[
              { title: 'Improving Education', icon: <BookOpen />, desc: 'Enhancing educational access for vulnerable households through innovative technologies.' },
              { title: 'Improving Healthcare', icon: <HeartPulse />, desc: 'Ensuring children and women receive safe, timely, and effective health services.' },
              { title: 'Youth Development', icon: <Users />, desc: 'Improving access to quality basic services and skills for Somaliland’s youth.' },
              { title: 'Environmental Improvement', icon: <TreePine />, desc: 'Promoting initiatives for environmental sustainability and conservation.' },
              { title: 'Global Network & Events', icon: <Globe />, desc: 'Building strategic international partnerships and fostering global engagement.' }
            ].map((obj) => (
              <Link href={obj.title === 'Global Network & Events' ? '/network' : '#'} key={obj.title} style={{ display: 'flex', gap: '20px', backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ color: 'var(--primary-color)', flexShrink: 0 }}>
                  {obj.icon}
                </div>
                <div>
                  <h4 className="font-bold mb-2">{obj.title}</h4>
                  <p className="text-sm text-muted">{obj.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-6">Partner With Us</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 30px', opacity: 0.8 }}>
            Whether as a donor, partner, or volunteer, your involvement makes a difference in building the future of Somaliland.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link href="/contact" className="btn btn-secondary">CONTACT US</Link>
            <Link href="/donate" className="btn btn-outline" style={{ border: '1px solid white', color: 'white' }}>SUPPORT WDO</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
