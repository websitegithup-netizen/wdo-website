import React from 'react'
import { Shield, Lock, FileText, CheckCircle, Scale, Globe, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'NGO Policies | WDO',
  description: 'Waqal Development Organization operational policies including transparency, ethics, and data protection.',
}

export default function PolicyPage() {
  const policies = [
    {
      title: "Transparency & Accountability",
      icon: <Scale size={24} />,
      content: "WDO is committed to the highest standards of transparency in all our operations. We maintain rigorous financial reporting and ensure that all resources are utilized effectively for their intended impact in Somaliland communities.",
      points: ["Regular financial audits", "Impact reporting", "Open communication with donors"]
    },
    {
      title: "Ethical Conduct",
      icon: <Shield size={24} />,
      content: "Our team and partners adhere to a strict code of ethics. We prioritize integrity, honesty, and respect for local cultures while maintaining professional distance and neutrality in all social interventions.",
      points: ["Zero tolerance for corruption", "Respect for human rights", "Non-discriminatory practices"]
    },
    {
      title: "Data Protection & Privacy",
      icon: <Lock size={24} />,
      content: "We protect the privacy of our beneficiaries, donors, and partners. WDO handles all personal data with extreme care, ensuring compliance with both local regulations and international privacy standards.",
      points: ["Secure data storage", "Confidential beneficiary info", "Strict privacy controls"]
    },
    {
      title: "Sustainability & Environment",
      icon: <Globe size={24} />,
      content: "As part of our environmental pillar, WDO implements eco-friendly practices within our own offices and project sites, aiming to minimize our carbon footprint while promoting resilience.",
      points: ["Waste reduction", "Sustainable sourcing", "Climate-conscious projects"]
    }
  ]

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <section className="section-light" style={{ padding: '60px 0', borderBottom: '1px solid #eeeeee', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#002654', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '15px' }}>
            <FileText size={18} color="#ffc107" />
            GOVERNANCE
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#1e293b', marginBottom: '20px', letterSpacing: '-1px' }}>NGO POLICIES</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.6' }}>
            Operating with integrity, transparency, and a commitment to excellence. Our policies ensure that WDO remains a trusted and effective partner for development in Somaliland.
          </p>
        </div>
      </section>

      {/* Policies Grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {policies.map((policy, idx) => (
              <div key={idx} className="hover-scale" style={{ 
                padding: '40px', 
                backgroundColor: '#ffffff', 
                borderRadius: '24px', 
                border: '1px solid #f1f5f9',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  backgroundColor: '#002654', 
                  color: '#ffc107', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {policy.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' }}>{policy.title}</h3>
                <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '1rem' }}>{policy.content}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                  {policy.points.map((point, pIdx) => (
                    <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', fontWeight: '700', fontSize: '0.9rem' }}>
                      <CheckCircle size={16} color="#16a34a" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div style={{ 
            marginTop: '60px', 
            padding: '40px', 
            backgroundColor: '#002654', 
            borderRadius: '24px', 
            color: 'white',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '30px'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '10px' }}>Questions about our policies?</h4>
              <p style={{ opacity: 0.8 }}>For detailed information regarding our governance structure or to request specific policy documents, please contact our administration team.</p>
            </div>
            <a href="/contact" style={{ 
              padding: '15px 35px', 
              backgroundColor: '#ffc107', 
              color: '#002654', 
              fontWeight: '900', 
              borderRadius: '100px', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              Contact Us <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .section { padding: 40px 0 !important; }
          h1 { fontSize: 2.2rem !important; }
        }
      `}} />
    </div>
  )
}
