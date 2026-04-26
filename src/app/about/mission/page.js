import React from 'react'
import { Target, Eye, ShieldCheck, Award, Zap, ArrowRight, Heart } from 'lucide-react'

export const metadata = {
  title: 'Mission & Vision | Premium NGO Design',
  description: 'High-impact mission and vision section for Waqal Development Organization.',
}

export default function MissionVision() {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#ffffff', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background Blobs for Depth */}
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(22, 163, 74, 0.08) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0, 38, 84, 0.05) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }}></div>

      {/* MISSION SECTION - Hero Style */}
      <section style={{ padding: '60px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
            
            {/* Image Block (Left) */}
            <div style={{ position: 'relative' }}>
              {/* Decorative Negative Margin Element */}
              <div style={{ 
                position: 'absolute', top: '-20px', left: '-20px', width: '100%', height: '100%', 
                backgroundColor: '#f0fdf4', borderRadius: '24px', zIndex: -1,
                transform: 'rotate(-2deg)'
              }}></div>
              
              <div className="hover-scale" style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 35px -12px rgba(0, 0, 0, 0.2)', transition: 'all 0.5s ease' }}>
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80" 
                  alt="Mission" 
                  className="mission-image-hover"
                  style={{ width: '100%', height: '350px', objectFit: 'cover', transition: 'all 0.7s ease' }}
                />
                
                {/* Glassmorphism Badge */}
                <div style={{ 
                  position: 'absolute', bottom: '20px', right: '20px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 20px', borderRadius: '100px', color: 'white',
                  display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: '0.7rem'
                }}>
                  <Award size={16} color="#ffc107" />
                  <span>SINCE 2024</span>
                </div>
              </div>
            </div>

            {/* Content Block (Right) */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '15px' }}>
                <div style={{ width: '25px', height: '2px', backgroundColor: '#16a34a' }}></div>
                OUR PURPOSE
              </div>
              
              <h1 style={{ 
                fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', 
                fontWeight: '900', 
                lineHeight: '1', 
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1.5px'
              }}>
                Mission <br/>For Change.
              </h1>
              
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#475569', marginBottom: '30px', fontWeight: '400' }}>
                We are dedicated to providing quality basic services, skills, and educational opportunities for vulnerable households through innovative technologies and sustainable community-led development.
              </p>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                  <Target size={24} />
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>Driven by Impact.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VISION SECTION - Reverse Layout */}
      <section style={{ padding: '60px 0', backgroundColor: '#f8fafc', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap', gap: '50px', alignItems: 'center' }}>
            
            {/* Image Block (Right) */}
            <div style={{ flex: '1 1 350px', position: 'relative' }}>
               <div className="hover-scale" style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 35px -12px rgba(0, 0, 0, 0.12)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80" 
                  alt="Vision" 
                  className="vision-image-hover"
                  style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                />
                
                {/* Visual Accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(0,38,84,0.3))' }}></div>
              </div>
              
              {/* Floating Stat Badge */}
              <div style={{ 
                position: 'absolute', top: '-15px', right: '15px', 
                backgroundColor: 'white', padding: '15px 25px', borderRadius: '16px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '2px'
              }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#16a34a' }}>10K+</span>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Impacted</span>
              </div>
            </div>

            {/* Content Block (Left) */}
            <div style={{ flex: '1 1 350px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#002654', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '15px' }}>
                <div style={{ width: '25px', height: '2px', backgroundColor: '#002654' }}></div>
                OUR VISION
              </div>
              
              <h1 style={{ 
                fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', 
                fontWeight: '900', 
                lineHeight: '1', 
                marginBottom: '20px',
                color: '#1e293b',
                letterSpacing: '-1.5px'
              }}>
                Future <br/>Revealed.
              </h1>
              
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#475569', marginBottom: '30px' }}>
                A resilient and socially responsible society in Somaliland, where every community has the resources, knowledge, and agency to build a sustainable and prosperous future.
              </p>

              <button className="hover-scale" style={{ 
                backgroundColor: '#002654', color: 'white', border: 'none', 
                padding: '14px 30px', borderRadius: '100px', fontWeight: '900',
                display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(0,38,84,0.2)', fontSize: '0.9rem'
              }}>
                EXPLORE GOALS <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* CORE VALUES - Minimal SaaS Grid */}
      <section style={{ padding: '60px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', marginBottom: '40px' }}>
             <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '15px', letterSpacing: '-1px' }}>Built on Values.</h2>
             <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.6' }}>Our organizational culture is defined by a commitment to excellence and deep respect for the people we serve.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            {[
              { title: 'Integrity', icon: <ShieldCheck size={28} />, color: '#16a34a' },
              { title: 'Innovation', icon: <Zap size={28} />, color: '#ffc107' },
              { title: 'Compassion', icon: <Heart size={28} />, color: '#ef4444' },
              { title: 'Excellence', icon: <Award size={28} />, color: '#3b82f6' }
            ].map((v) => (
              <div key={v.title} className="hover-scale" style={{ borderLeft: `4px solid ${v.color}`, padding: '25px', backgroundColor: '#f8fafc', borderRadius: '0 12px 12px 0' }}>
                <div style={{ color: v.color, marginBottom: '15px' }}>{v.icon}</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '10px', color: '#1e293b' }}>{v.title}</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>We uphold the highest standards in every project we undertake.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-scale { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: default; }
        .hover-scale:hover { transform: translateY(-8px) scale(1.01); }
        .mission-image-hover { filter: grayscale(0.5); }
        .mission-image-hover:hover { filter: grayscale(0); }
        .vision-image-hover { filter: brightness(1); transition: filter 0.5s ease; }
        .vision-image-hover:hover { filter: brightness(1.1); }
        @media (max-width: 768px) {
          section { padding: 40px 0 !important; }
          h1 { font-size: 2.8rem !important; }
        }
      `}} />

    </div>
  )
}
